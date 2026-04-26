import uuid
from typing import List, Optional
from sqlmodel import Session, select
from fastapi import HTTPException

from app.models.offer import Offer
from app.schemas.offer import OfferCreate


class OfferService:
    def __init__(self, session: Session):
        self.session = session

    def get_offers(self, category: Optional[str] = None) -> List[Offer]:
        """Return all offers, optionally filtered by category."""
        statement = select(Offer).order_by(Offer.created_at.desc())
        if category:
            statement = statement.where(Offer.category == category)
        return list(self.session.exec(statement).all())

    def get_offer(self, offer_id: uuid.UUID) -> Offer:
        """Return a single offer by ID, or raise 404."""
        offer = self.session.get(Offer, offer_id)
        if not offer:
            raise HTTPException(status_code=404, detail="Offer not found")
        return offer

    def create_offer(self, seller_id: uuid.UUID, offer_in: OfferCreate) -> Offer:
        """Create a new offer linked to the authenticated seller."""
        from app.models.product import NormalizedProduct

        # Auto-create a NormalizedProduct if none exists for this category/title combo.
        # In production this would be a proper product matching step.
        product = self.session.exec(
            select(NormalizedProduct).where(NormalizedProduct.category == offer_in.category)
        ).first()

        if not product:
            product = NormalizedProduct(
                name=offer_in.title,
                description=offer_in.description,
                category=offer_in.category,
            )
            self.session.add(product)
            self.session.flush()

        offer = Offer(
            normalized_product_id=product.id,
            title=offer_in.title,
            seller_id=seller_id,
            seller_name=offer_in.seller_name,
            category=offer_in.category,
            unitPrice=offer_in.unitPrice,
            bulkPrice=offer_in.bulkPrice,
            moq=offer_in.moq,
            unit=offer_in.unit,
            discount=offer_in.discount if offer_in.discount else round(
                ((offer_in.unitPrice - offer_in.bulkPrice) / offer_in.unitPrice) * 100, 1
            ),
            description=offer_in.description,
            stock=offer_in.stock,
            deliveryDays=offer_in.deliveryDays,
            badge=offer_in.badge,
            badgeColor=offer_in.badgeColor,
            tags=offer_in.tags,
            verified=offer_in.verified,
        )
        self.session.add(offer)
        self.session.commit()
        self.session.refresh(offer)
        return offer
