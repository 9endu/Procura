import uuid
from typing import Generator
from fastapi import Header, HTTPException, status
from sqlmodel import Session

from app.core.db import engine

def get_db_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

def get_current_user(x_user_id: str = Header(...)) -> uuid.UUID:
    """
    Stub authentication method reading X-User-ID header.
    """
    try:
        return uuid.UUID(x_user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid X-User-ID header format. Must be a UUID.",
        )
