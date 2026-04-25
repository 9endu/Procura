import uuid
from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.api.deps import get_db_session, get_current_user
from app.schemas.pool import PoolCreate, PoolResponse
from app.schemas.member import PoolMemberResponse
from app.services.pool_service import PoolService

router = APIRouter()

@router.post("/", response_model=PoolResponse)
def create_pool(
    pool_in: PoolCreate,
    current_user_id: uuid.UUID = Depends(get_current_user),
    session: Session = Depends(get_db_session)
):
    service = PoolService(session)
    return service.create_pool(user_id=current_user_id, pool_in=pool_in)

@router.get("/", response_model=List[PoolResponse])
def get_pools(session: Session = Depends(get_db_session)):
    service = PoolService(session)
    return service.get_pools()

@router.get("/{pool_id}", response_model=PoolResponse)
def get_pool(pool_id: uuid.UUID, session: Session = Depends(get_db_session)):
    service = PoolService(session)
    return service.get_pool(pool_id)

@router.get("/{pool_id}/members", response_model=List[PoolMemberResponse])
def get_pool_members(pool_id: uuid.UUID, session: Session = Depends(get_db_session)):
    service = PoolService(session)
    return service.get_pool_members(pool_id)
