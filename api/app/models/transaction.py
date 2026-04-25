import uuid
from typing import Optional

from sqlmodel import Field
from sqlalchemy import Column, String

from .base import TimeStampModel, TransactionStatus

class TransactionBase(TimeStampModel):
    pool_id: uuid.UUID = Field(foreign_key="pools.id", index=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    amount: float
    units: int
    status: TransactionStatus = Field(default=TransactionStatus.PROCESSING, sa_column=Column(String))
    paymentMethod: str
    savings: float = Field(default=0.0)
    invoice: Optional[str] = None

class Transaction(TransactionBase, table=True):
    __tablename__ = "transactions"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
