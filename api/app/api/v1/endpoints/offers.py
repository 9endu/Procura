import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.api.deps import get_db_session, get_current_user
from app.schemas.offer import OfferCreate, OfferRead
from app.services.offer_service import OfferService

router = APIRouter()


def _to_read(offer) -> OfferRead:
    """Map the ORM Offer to the OfferRead schema the frontend expects."""
    return OfferRead(
        id=offer.id,
        title=offer.title,
        seller=offer.seller_name,   # Frontend calls this 'seller'
        category=offer.category,
        unitPrice=offer.unitPrice,
        bulkPrice=offer.bulkPrice,
        moq=offer.moq,
        unit=offer.unit,
        discount=offer.discount,
        rating=offer.rating,
        reviews=offer.reviews,
        badge=offer.badge,
        badgeColor=offer.badgeColor,
        description=offer.description,
        tags=offer.tags,
        stock=offer.stock,
        deliveryDays=offer.deliveryDays,
        verified=offer.verified,
    )


@router.get("/", response_model=List[OfferRead])
def list_offers(
    category: Optional[str] = None,
    session: Session = Depends(get_db_session),
):
    """Return all marketplace offers, with optional category filter."""
    service = OfferService(session)
    offers = service.get_offers(category=category)
    return [_to_read(o) for o in offers]


@router.get("/{offer_id}", response_model=OfferRead)
def get_offer(
    offer_id: uuid.UUID,
    session: Session = Depends(get_db_session),
):
    """Return a single offer by its UUID."""
    service = OfferService(session)
    offer = service.get_offer(offer_id)
    return _to_read(offer)


@router.post("/", response_model=OfferRead, status_code=201)
def create_offer(
    offer_in: OfferCreate,
    current_user_id: uuid.UUID = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    """Create a new offer (authenticated sellers only)."""
    service = OfferService(session)
    offer = service.create_offer(seller_id=current_user_id, offer_in=offer_in)
    return _to_read(offer)
