import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlmodel import SQLModel, Field

class TimeStampModel(SQLModel):
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserRole(str, Enum):
    buyer = "buyer"
    seller = "seller"
    admin = "admin"

class PoolStatus(str, Enum):
    DRAFT = "Draft"
    ACTIVE = "Active"
    FILLING_FAST = "Filling Fast"
    LOCKED = "Locked"
    COMPLETED = "Completed"
    EXPIRED = "Expired"
    CANCELLED = "Cancelled"

class JoinRequestStatus(str, Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"

class VoteType(str, Enum):
    APPROVE = "Approve"
    REJECT = "Reject"

class TransactionStatus(str, Enum):
    PROCESSING = "Processing"
    COMPLETED = "Completed"
    FAILED = "Failed"
    DISPUTED = "Disputed"

class DeliveryStatus(str, Enum):
    PENDING = "Pending"
    IN_TRANSIT = "In Transit"
    DELIVERED = "Delivered"
    FAILED = "Failed"

class OTPEventType(str, Enum):
    PICKUP = "Pickup"
    DELIVERY = "Delivery"

class OTPStatus(str, Enum):
    GENERATED = "Generated"
    VERIFIED = "Verified"
    EXPIRED = "Expired"

class TrustEventType(str, Enum):
    SUCCESSFUL_POOL = "Successful Pool"
    EARLY_PAYMENT = "Early Payment"
    DEFAULT_PAYMENT = "Default Payment"
    FAILED_COMMITMENT = "Failed Commitment"
    DISPUTE_RAISED = "Dispute Raised"
    DISPUTE_LOST = "Dispute Lost"

class NotificationType(str, Enum):
    INFO = "Info"
    WARNING = "Warning"
    ALERT = "Alert"
    SUCCESS = "Success"
