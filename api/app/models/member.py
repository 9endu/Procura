import uuid
from typing import Optional
from sqlmodel import Field, SQLModel
from sqlalchemy import Column, String, UniqueConstraint

from .base import TimeStampModel, JoinRequestStatus, VoteType

class PoolMemberBase(TimeStampModel):
    pool_id: uuid.UUID = Field(foreign_key="pools.id", index=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    is_leader: bool = Field(default=False)
    units_committed: int = Field(default=1)

class PoolMember(PoolMemberBase, table=True):
    __tablename__ = "pool_members"
    __table_args__ = (
        UniqueConstraint("pool_id", "user_id", name="uq_pool_member_pool_user"),
    )
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class JoinRequestBase(TimeStampModel):
    pool_id: uuid.UUID = Field(foreign_key="pools.id", index=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    requested_units: int = Field(default=1)
    status: JoinRequestStatus = Field(default=JoinRequestStatus.PENDING, sa_column=Column(String))
    notes: Optional[str] = None

class JoinRequest(JoinRequestBase, table=True):
    __tablename__ = "join_requests"
    __table_args__ = (
        UniqueConstraint("pool_id", "user_id", name="uq_join_request_pool_user"),
    )
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class JoinRequestVoteBase(TimeStampModel):
    request_id: uuid.UUID = Field(foreign_key="join_requests.id", index=True)
    voter_id: uuid.UUID = Field(foreign_key="users.id")
    vote: VoteType = Field(sa_column=Column(String))

class JoinRequestVote(JoinRequestVoteBase, table=True):
    __tablename__ = "join_request_votes"
    __table_args__ = (
        UniqueConstraint("request_id", "voter_id", name="uq_join_request_vote_request_voter"),
    )
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
