import uuid
from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.api.deps import get_db_session, get_current_user
from app.schemas.member import JoinRequestCreate, JoinRequestResponse, JoinRequestVoteReq
from app.services.join_request_service import JoinRequestService

router = APIRouter()

@router.post("/pools/{pool_id}/join-request", response_model=JoinRequestResponse)
def create_join_request(
    pool_id: uuid.UUID,
    req_in: JoinRequestCreate,
    current_user_id: uuid.UUID = Depends(get_current_user),
    session: Session = Depends(get_db_session)
):
    service = JoinRequestService(session)
    request = service.create_request(pool_id=pool_id, user_id=current_user_id, req_in=req_in)
    return service.get_request_resolution(request.id)

@router.get("/pools/{pool_id}/join-requests", response_model=List[JoinRequestResponse])
def get_pool_join_requests(
    pool_id: uuid.UUID,
    session: Session = Depends(get_db_session)
):
    service = JoinRequestService(session)
    requests = service.get_pool_requests(pool_id)
    return [service.get_request_resolution(req.id) for req in requests]

@router.get("/join-requests/{request_id}", response_model=JoinRequestResponse)
def get_join_request(request_id: uuid.UUID, session: Session = Depends(get_db_session)):
    service = JoinRequestService(session)
    return service.get_request_resolution(request_id)

@router.post("/join-requests/{request_id}/vote", response_model=JoinRequestResponse)
def cast_vote(
    request_id: uuid.UUID,
    vote_in: JoinRequestVoteReq,
    current_user_id: uuid.UUID = Depends(get_current_user),
    session: Session = Depends(get_db_session)
):
    service = JoinRequestService(session)
    return service.cast_vote(request_id=request_id, voter_id=current_user_id, vote_in=vote_in)
