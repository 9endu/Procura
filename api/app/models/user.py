import uuid
from typing import Optional
from sqlmodel import Field, SQLModel
from sqlalchemy import Column, String

from .base import TimeStampModel, UserRole

class UserBase(TimeStampModel):
    name: str
    email: str = Field(unique=True, index=True)
    phone: Optional[str] = None
    role: UserRole = Field(default=UserRole.buyer, sa_column=Column(String))

class User(UserBase, table=True):
    __tablename__ = "users"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class UserProfileBase(TimeStampModel):
    user_id: uuid.UUID = Field(foreign_key="users.id", unique=True, index=True)
    company_name: Optional[str] = None
    gstin: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None

class UserProfile(UserProfileBase, table=True):
    __tablename__ = "user_profiles"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
