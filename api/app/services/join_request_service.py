import uuid
import math
from typing import List
from sqlmodel import Session, select
from fastapi import HTTPException, status

from app.models.pool import Pool
from app.models.member import PoolMember, JoinRequest, JoinRequestVote
from app.models.base import JoinRequestStatus, VoteType, PoolStatus
from app.schemas.member import JoinRequestCreate, JoinRequestResponse, JoinRequestVoteReq

class JoinRequestService:
    def __init__(self, session: Session):
        self.session = session

    def create_request(self, pool_id: uuid.UUID, user_id: uuid.UUID, req_in: JoinRequestCreate) -> JoinRequest:
        pool = self.session.get(Pool, pool_id)
        if not pool:
            raise HTTPException(status_code=404, detail="Pool not found")
        if pool.status in [PoolStatus.LOCKED, PoolStatus.COMPLETED, PoolStatus.CANCELLED]:
            raise HTTPException(status_code=400, detail=f"Cannot join pool because it is {pool.status.value}")

        existing_member = self.session.exec(
            select(PoolMember).where(PoolMember.pool_id == pool_id, PoolMember.user_id == user_id)
        ).first()
        if existing_member:
            raise HTTPException(status_code=400, detail="User is already an active member of this pool")

        existing_request = self.session.exec(
            select(JoinRequest).where(
                JoinRequest.pool_id == pool_id,
                JoinRequest.user_id == user_id,
                JoinRequest.status == JoinRequestStatus.PENDING
            )
        ).first()
        if existing_request:
            raise HTTPException(status_code=400, detail="Duplicate pending join request exists for this pool")

        new_request = JoinRequest(
            pool_id=pool_id,
            user_id=user_id,
            requested_units=req_in.requested_units,
            notes=req_in.notes
        )
        self.session.add(new_request)
        self.session.commit()
        self.session.refresh(new_request)
        return new_request

    def get_pool_requests(self, pool_id: uuid.UUID) -> List[JoinRequest]:
        statement = select(JoinRequest).where(JoinRequest.pool_id == pool_id).order_by(JoinRequest.created_at.desc())
        return list(self.session.exec(statement).all())

    def get_request_resolution(self, request_id: uuid.UUID) -> JoinRequestResponse:
        request = self.session.get(JoinRequest, request_id)
        if not request:
            raise HTTPException(status_code=404, detail="Join Request not found")
        
        # 75% Algorithm Details
        # Eligible voters N = current active pool members excluding requester
        eligible_members = self.session.exec(
            select(PoolMember).where(PoolMember.pool_id == request.pool_id, PoolMember.user_id != request.user_id)
        ).all()
        N = len(eligible_members)

        # Count votes cast by eligible voters
        votes = self.session.exec(
            select(JoinRequestVote).where(JoinRequestVote.request_id == request_id)
        ).all()
        approvals = sum(1 for v in votes if v.vote == VoteType.APPROVE)
        rejections = sum(1 for v in votes if v.vote == VoteType.REJECT)

        # Required approvals R = ceil(N * 0.75)
        # If there is only 1 eligible voter (creator only), 1 approval is enough
        required_approvals = math.ceil(N * 0.75) if N > 0 else 1
        percentage = (approvals / N) * 100 if N > 0 else 0.0

        return JoinRequestResponse(
            id=request.id,
            pool_id=request.pool_id,
            user_id=request.user_id,
            requested_units=request.requested_units,
            status=request.status,
            notes=request.notes,
            total_eligible_voters=N,
            approvals=approvals,
            rejections=rejections,
            approval_percentage=percentage,
            threshold_met=(approvals >= required_approvals)
        )

    def cast_vote(self, request_id: uuid.UUID, voter_id: uuid.UUID, vote_in: JoinRequestVoteReq) -> JoinRequestResponse:
        request = self.session.get(JoinRequest, request_id)
        if not request:
            raise HTTPException(status_code=404, detail="Join Request not found")

        if request.status != JoinRequestStatus.PENDING:
            raise HTTPException(status_code=400, detail="Cannot vote on a resolved request")

        voter_membership = self.session.exec(
            select(PoolMember).where(PoolMember.pool_id == request.pool_id, PoolMember.user_id == voter_id)
        ).first()

        if not voter_membership:
            raise HTTPException(status_code=403, detail="Only existing pool members can vote")
        
        if voter_id == request.user_id:
            raise HTTPException(status_code=403, detail="Cannot vote on your own join request")

        existing_vote = self.session.exec(
            select(JoinRequestVote).where(JoinRequestVote.request_id == request_id, JoinRequestVote.voter_id == voter_id)
        ).first()

        if existing_vote:
            raise HTTPException(status_code=400, detail="User has already voted on this request")

        new_vote = JoinRequestVote(
            request_id=request_id,
            voter_id=voter_id,
            vote=vote_in.vote
        )
        self.session.add(new_vote)
        self.session.commit()

        # Check resolution thresholds
        return self._resolve_request(request.id)

    def _resolve_request(self, request_id: uuid.UUID) -> JoinRequestResponse:
        res = self.get_request_resolution(request_id)
        db_req = self.session.get(JoinRequest, request_id)

        # Approve if approvals >= R
        required_approvals = math.ceil(res.total_eligible_voters * 0.75) if res.total_eligible_voters > 0 else 1

        if res.approvals >= required_approvals and db_req.status == JoinRequestStatus.PENDING:
            self._approve_request(db_req)
            db_req.status = JoinRequestStatus.APPROVED
            self.session.add(db_req)
            self.session.commit()
            return self.get_request_resolution(request_id)
        
        # Auto-reject early if rejections > (N - R)
        impossible_to_pass = (res.rejections > (res.total_eligible_voters - required_approvals))
        if impossible_to_pass and db_req.status == JoinRequestStatus.PENDING:
            db_req.status = JoinRequestStatus.REJECTED
            self.session.add(db_req)
            self.session.commit()
            return self.get_request_resolution(request_id)

        return res

    def _approve_request(self, request: JoinRequest):
        new_member = PoolMember(
            pool_id=request.pool_id,
            user_id=request.user_id,
            units_committed=request.requested_units
        )
        self.session.add(new_member)

        # Update MOQ limit
        pool = self.session.get(Pool, request.pool_id)
        pool.filledUnits += request.requested_units
        if pool.filledUnits >= pool.targetUnits:
            pool.status = PoolStatus.LOCKED
        self.session.add(pool)
