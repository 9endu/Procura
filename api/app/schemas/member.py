from typing import Optional
import uuid
from pydantic import BaseModel

from app.models.base import JoinRequestStatus, VoteType

class JoinRequestCreate(BaseModel):
    requested_units: int
    notes: Optional[str] = None

class JoinRequestResponse(BaseModel):
    id: uuid.UUID
    pool_id: uuid.UUID
    user_id: uuid.UUID
    requested_units: int
    status: JoinRequestStatus
    notes: Optional[str]
    total_eligible_voters: int
    approvals: int
    rejections: int
    approval_percentage: float
    threshold_met: bool

    class Config:
        from_attributes = True

class JoinRequestVoteReq(BaseModel):
    vote: VoteType

class PoolMemberResponse(BaseModel):
    id: uuid.UUID
    pool_id: uuid.UUID
    user_id: uuid.UUID
    is_leader: bool
    units_committed: int

    class Config:
        from_attributes = True
