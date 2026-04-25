from datetime import datetime
from typing import Optional, List
import uuid
from pydantic import BaseModel

from app.models.base import PoolStatus

class PoolCreate(BaseModel):
    normalized_product_id: uuid.UUID
    name: str
    description: str
    category: str
    mrp: float
    poolPrice: float
    targetUnits: int
    expiresAt: datetime
    minOrder: int = 1
    tags: List[str] = []
    image: Optional[str] = None
    creator_desired_quantity: int = 1

class PoolResponse(BaseModel):
    id: uuid.UUID
    normalized_product_id: uuid.UUID
    name: str
    description: str
    category: str
    mrp: float
    poolPrice: float
    discount: float
    targetUnits: int
    filledUnits: int
    expiresAt: datetime
    status: PoolStatus
    minOrder: int
    creator_id: uuid.UUID
    tags: List[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
