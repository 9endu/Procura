import uuid
from sqlmodel import Field, SQLModel
from sqlalchemy import Column, String

from .base import TimeStampModel, NotificationType

class NotificationBase(TimeStampModel):
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    type: NotificationType = Field(default=NotificationType.INFO, sa_column=Column(String))
    title: str
    message: str
    is_read: bool = Field(default=False)

class Notification(NotificationBase, table=True):
    __tablename__ = "notifications"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
