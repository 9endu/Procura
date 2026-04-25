import uuid
from typing import List, Optional
from datetime import datetime

from sqlmodel import Field, SQLModel
from sqlalchemy import Column, JSON, String

from .base import TimeStampModel, PoolStatus

class PoolBase(TimeStampModel):
    normalized_product_id: uuid.UUID = Field(foreign_key="normalized_products.id", index=True)
    name: str = Field(index=True)
    description: str
    category: str
    image: Optional[str] = None
    mrp: float
    poolPrice: float
    discount: float = Field(default=0.0)
    targetUnits: int
    filledUnits: int = Field(default=0)
    expiresAt: datetime
    status: PoolStatus = Field(default=PoolStatus.DRAFT, sa_column=Column(String))
    aiMatchScore: int = Field(default=0)
    minOrder: int = Field(default=1)
    creator_id: uuid.UUID = Field(foreign_key="users.id")
    seller_id: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id")
    sellerRating: float = Field(default=0.0)
    tags: List[str] = Field(default=[], sa_column=Column(JSON))

class Pool(PoolBase, table=True):
    __tablename__ = "pools"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class PoolStatusHistoryBase(TimeStampModel):
    pool_id: uuid.UUID = Field(foreign_key="pools.id", index=True)
    old_status: Optional[PoolStatus] = Field(default=None, sa_column=Column(String, nullable=True))
    new_status: PoolStatus = Field(sa_column=Column(String))
    changed_by: uuid.UUID = Field(foreign_key="users.id")
    notes: Optional[str] = None

class PoolStatusHistory(PoolStatusHistoryBase, table=True):
    __tablename__ = "pool_status_history"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
