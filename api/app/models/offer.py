import uuid
from typing import List, Optional

from sqlmodel import Field
from sqlalchemy import Column, JSON

from .base import TimeStampModel

class OfferBase(TimeStampModel):
    normalized_product_id: uuid.UUID = Field(foreign_key="normalized_products.id", index=True)
    title: str = Field(index=True)
    seller_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    category: str
    unitPrice: float
    bulkPrice: float
    moq: int
    unit: str
    discount: float = Field(default=0.0)
    rating: float = Field(default=0.0)
    reviews: int = Field(default=0)
    badge: Optional[str] = None
    badgeColor: Optional[str] = None
    description: str
    stock: int
    deliveryDays: int
    verified: bool = Field(default=False)
    tags: List[str] = Field(default=[], sa_column=Column(JSON))

class Offer(OfferBase, table=True):
    __tablename__ = "offers"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
