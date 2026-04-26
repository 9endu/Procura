from typing import List, Optional
import uuid
from pydantic import BaseModel


class OfferCreate(BaseModel):
    """Payload for creating a new offer (seller-submitted)."""
    title: str
    seller_name: str          # Human-readable name stored alongside the offer
    category: str
    unitPrice: float
    bulkPrice: float
    moq: int
    unit: str
    discount: float = 0.0
    description: str
    stock: int
    deliveryDays: int
    badge: Optional[str] = None
    badgeColor: Optional[str] = None
    tags: List[str] = []
    verified: bool = False


class OfferRead(BaseModel):
    """Full offer payload returned to the frontend."""
    id: uuid.UUID
    title: str
    seller: str               # Mapped from seller_name on the DB model
    category: str
    unitPrice: float
    bulkPrice: float
    moq: int
    unit: str
    discount: float
    rating: float
    reviews: int
    badge: Optional[str]
    badgeColor: Optional[str]
    description: str
    tags: List[str]
    stock: int
    deliveryDays: int
    verified: bool

    class Config:
        from_attributes = True
