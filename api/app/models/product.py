import uuid
from typing import Optional, List
from sqlmodel import Field, SQLModel
from sqlalchemy import Column, JSON

from .base import TimeStampModel

class NormalizedProductBase(TimeStampModel):
    name: str = Field(index=True)
    description: str
    category: str = Field(index=True)
    tags: List[str] = Field(default=[], sa_column=Column(JSON))
    image: Optional[str] = None
    brand: Optional[str] = None
    model_number: Optional[str] = None

class NormalizedProduct(NormalizedProductBase, table=True):
    __tablename__ = "normalized_products"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class OfferSourceBase(TimeStampModel):
    normalized_product_id: uuid.UUID = Field(foreign_key="normalized_products.id")
    source_name: str
    source_url: Optional[str] = None
    external_id: Optional[str] = None

class OfferSource(OfferSourceBase, table=True):
    __tablename__ = "offer_sources"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class PriceHistoryBase(TimeStampModel):
    normalized_product_id: uuid.UUID = Field(foreign_key="normalized_products.id", index=True)
    recorded_price: float
    currency: str = Field(default="USD")
    source: Optional[str] = None

class PriceHistory(PriceHistoryBase, table=True):
    __tablename__ = "price_history"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
