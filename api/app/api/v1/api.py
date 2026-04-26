from fastapi import APIRouter
from app.api.v1.endpoints import pools, join_requests, offers

api_router = APIRouter()
api_router.include_router(pools.router, prefix="/pools", tags=["pools"])
api_router.include_router(join_requests.router, tags=["join-requests"])
api_router.include_router(offers.router, prefix="/offers", tags=["offers"])
