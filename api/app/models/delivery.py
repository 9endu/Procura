import uuid
from typing import Optional
from datetime import datetime

from sqlmodel import Field, SQLModel
from sqlalchemy import Column, String

from .base import TimeStampModel, DeliveryStatus, OTPEventType, OTPStatus

class DeliveryConfirmationBase(TimeStampModel):
    transaction_id: uuid.UUID = Field(foreign_key="transactions.id", unique=True)
    pool_id: uuid.UUID = Field(foreign_key="pools.id", index=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    status: DeliveryStatus = Field(default=DeliveryStatus.PENDING, sa_column=Column(String))
    tracking_number: Optional[str] = None
    carrier: Optional[str] = None
    expected_delivery: Optional[datetime] = None
    actual_delivery: Optional[datetime] = None
    signature_url: Optional[str] = None
    photo_url: Optional[str] = None
    notes: Optional[str] = None

class DeliveryConfirmation(DeliveryConfirmationBase, table=True):
    __tablename__ = "delivery_confirmations"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class OTPEventBase(TimeStampModel):
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    reference_id: uuid.UUID = Field(index=True) # Could be transaction_id or pool_id
    event_type: OTPEventType = Field(sa_column=Column(String))
    otp_hash: str # Securely hashed OTP
    expires_at: datetime
    status: OTPStatus = Field(default=OTPStatus.GENERATED, sa_column=Column(String))

class OTPEvent(OTPEventBase, table=True):
    __tablename__ = "otp_events"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
