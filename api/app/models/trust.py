import uuid
from typing import Optional
from sqlmodel import Field, SQLModel
from sqlalchemy import Column, String, UniqueConstraint

from .base import TimeStampModel, TrustEventType

class TrustScoreBase(TimeStampModel):
    user_id: uuid.UUID = Field(foreign_key="users.id", unique=True, index=True)
    score: int = Field(default=100)
    tier: str = Field(default="Bronze")
    completed_pools: int = Field(default=0)
    dispute_rate: float = Field(default=0.0)
    on_time_payment_rate: float = Field(default=100.0)

class TrustScore(TrustScoreBase, table=True):
    __tablename__ = "trust_scores"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class TrustEventBase(TimeStampModel):
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    event_type: TrustEventType = Field(sa_column=Column(String))
    points_impact: int
    description: str
    related_pool_id: Optional[uuid.UUID] = Field(default=None, foreign_key="pools.id")
    related_transaction_id: Optional[uuid.UUID] = Field(default=None, foreign_key="transactions.id")

class TrustEvent(TrustEventBase, table=True):
    __tablename__ = "trust_events"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class RatingBase(TimeStampModel):
    reviewer_id: uuid.UUID = Field(foreign_key="users.id")
    reviewee_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    pool_id: Optional[uuid.UUID] = Field(default=None, foreign_key="pools.id")
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None

class Rating(RatingBase, table=True):
    __tablename__ = "ratings"
    __table_args__ = (
        UniqueConstraint("reviewer_id", "reviewee_id", "pool_id", name="uq_rating_reviewer_reviewee_pool"),
    )
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class ComplaintBase(TimeStampModel):
    complainant_id: uuid.UUID = Field(foreign_key="users.id")
    target_user_id: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id")
    pool_id: Optional[uuid.UUID] = Field(default=None, foreign_key="pools.id")
    reason: str
    description: str
    status: str = Field(default="Open")

class Complaint(ComplaintBase, table=True):
    __tablename__ = "complaints"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
