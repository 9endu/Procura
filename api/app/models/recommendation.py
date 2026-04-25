import uuid
from typing import Optional, List
from sqlmodel import Field, SQLModel
from sqlalchemy import Column, JSON

from .base import TimeStampModel

class RecommendationLogBase(TimeStampModel):
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    recommended_pool_id: Optional[uuid.UUID] = Field(default=None, foreign_key="pools.id")
    recommended_offer_id: Optional[uuid.UUID] = Field(default=None, foreign_key="offers.id")
    match_score: float
    reasons: List[str] = Field(default=[], sa_column=Column(JSON))
    clicked: bool = Field(default=False)

class RecommendationLog(RecommendationLogBase, table=True):
    __tablename__ = "recommendation_logs"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
