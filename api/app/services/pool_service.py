import uuid
from typing import List, Optional
from sqlmodel import Session, select
from fastapi import HTTPException, status

from app.models.pool import Pool
from app.models.member import PoolMember
from app.models.base import PoolStatus
from app.schemas.pool import PoolCreate

class PoolService:
    def __init__(self, session: Session):
        self.session = session
        
    def create_pool(self, user_id: uuid.UUID, pool_in: PoolCreate) -> Pool:
        discount_calc = ((pool_in.mrp - pool_in.poolPrice) / pool_in.mrp) * 100 if pool_in.mrp > 0 else 0.0
        
        # If creator met MOQ instantly, lock it.
        initial_status = PoolStatus.ACTIVE
        if pool_in.creator_desired_quantity >= pool_in.targetUnits:
            initial_status = PoolStatus.LOCKED
            
        pool = Pool(
            normalized_product_id=pool_in.normalized_product_id,
            name=pool_in.name,
            description=pool_in.description,
            category=pool_in.category,
            mrp=pool_in.mrp,
            poolPrice=pool_in.poolPrice,
            discount=discount_calc,
            targetUnits=pool_in.targetUnits,
            filledUnits=pool_in.creator_desired_quantity,
            expiresAt=pool_in.expiresAt,
            minOrder=pool_in.minOrder,
            tags=pool_in.tags,
            image=pool_in.image,
            creator_id=user_id,
            status=initial_status
        )
        
        self.session.add(pool)
        self.session.flush() # Flush to get pool.id before commit
        
        # The creator becomes the first active leader member
        creator_member = PoolMember(
            pool_id=pool.id,
            user_id=user_id,
            is_leader=True,
            units_committed=pool_in.creator_desired_quantity
        )
        self.session.add(creator_member)
        self.session.commit()
        self.session.refresh(pool)
        
        return pool

    def get_pools(self) -> List[Pool]:
        statement = select(Pool).order_by(Pool.created_at.desc())
        return list(self.session.exec(statement).all())
        
    def get_pool(self, pool_id: uuid.UUID) -> Optional[Pool]:
        pool = self.session.get(Pool, pool_id)
        if not pool:
            raise HTTPException(status_code=404, detail="Pool not found")
        return pool

    def get_pool_members(self, pool_id: uuid.UUID) -> List[PoolMember]:
        self.get_pool(pool_id) # Validates pool exists
        statement = select(PoolMember).where(PoolMember.pool_id == pool_id)
        return list(self.session.exec(statement).all())
