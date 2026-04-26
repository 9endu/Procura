"""
Procura — Offers + User seeding script
======================================
Run from the /api directory:
    python seed_offers.py

Creates:
  • 1 seed Seller user  (id fixed so re-runs are idempotent)
  • 1 seed NormalizedProduct per offer category
  • 6 Offers matching mockData.ts
"""

import sys
import uuid
from pathlib import Path

# Make sure the app package is importable when run from /api
sys.path.insert(0, str(Path(__file__).parent))

from sqlmodel import Session, select, SQLModel
from app.core.db import engine
from app.models import (
    User, NormalizedProduct, Offer
)
from app.models.base import UserRole

# ─── Fixed seed IDs (idempotent re-runs) ────────────────────────────────────

SEED_SELLER_ID = uuid.UUID("aaaaaaaa-0000-0000-0000-000000000001")

OFFERS_SEED = [
    {
        "title": "Wholesale Premium Basmati Rice",
        "seller_name": "AgriCorp India",
        "category": "Grains & Staples",
        "unitPrice": 85.0,
        "bulkPrice": 52.0,
        "moq": 100,
        "unit": "kg",
        "discount": 39.0,
        "rating": 4.7,
        "reviews": 142,
        "badge": "Top Deal",
        "badgeColor": "indigo",
        "description": "Long grain, aged 2 years, premium export quality basmati. Minimum 100kg order.",
        "tags": ["Export Quality", "Organic", "Premium"],
        "stock": 2000,
        "deliveryDays": 3,
        "verified": True,
    },
    {
        "title": "Amul Butter — Commercial Pack",
        "seller_name": "Amul Direct",
        "category": "Dairy & Eggs",
        "unitPrice": 60.0,
        "bulkPrice": 44.0,
        "moq": 50,
        "unit": "pack",
        "discount": 27.0,
        "rating": 4.9,
        "reviews": 318,
        "badge": "Verified",
        "badgeColor": "emerald",
        "description": "500g commercial packs, cold chain delivery, best for bakery and restaurant use.",
        "tags": ["Cold Chain", "Bakery Grade", "Verified Seller"],
        "stock": 800,
        "deliveryDays": 2,
        "verified": True,
    },
    {
        "title": "Cold-Pressed Coconut Oil",
        "seller_name": "Kerala Naturals",
        "category": "Oils & Fats",
        "unitPrice": 280.0,
        "bulkPrice": 198.0,
        "moq": 20,
        "unit": "liter",
        "discount": 29.0,
        "rating": 4.6,
        "reviews": 94,
        "badge": "Organic",
        "badgeColor": "green",
        "description": "Virgin cold-pressed, chemical-free, direct from Kerala farms. FSSAI certified.",
        "tags": ["Organic", "FSSAI Certified", "Direct Farm"],
        "stock": 500,
        "deliveryDays": 4,
        "verified": True,
    },
    {
        "title": "Sunrise Special Chai Masala",
        "seller_name": "Spice Route Co",
        "category": "Spices & Condiments",
        "unitPrice": 120.0,
        "bulkPrice": 78.0,
        "moq": 30,
        "unit": "250g pack",
        "discount": 35.0,
        "rating": 4.5,
        "reviews": 207,
        "badge": "Hot Deal",
        "badgeColor": "orange",
        "description": "Premium chai masala blend, restaurant and café grade. Sourced from Rajasthan.",
        "tags": ["Restaurant Grade", "Bulk", "Popular"],
        "stock": 1200,
        "deliveryDays": 3,
        "verified": False,
    },
    {
        "title": "Haldiram's Bhujia — Bulk Box",
        "seller_name": "Haldiram Snacks Pvt",
        "category": "Snacks",
        "unitPrice": 40.0,
        "bulkPrice": 26.0,
        "moq": 200,
        "unit": "packet",
        "discount": 35.0,
        "rating": 4.8,
        "reviews": 421,
        "badge": "Brand Direct",
        "badgeColor": "purple",
        "description": "200-packet bulk case. Most popular Indian snack brand, direct supply.",
        "tags": ["Brand Direct", "Best Seller", "High Volume"],
        "stock": 5000,
        "deliveryDays": 2,
        "verified": True,
    },
    {
        "title": "Tata Salt — 1kg Bulk Pack",
        "seller_name": "Tata Consumer",
        "category": "Grains & Staples",
        "unitPrice": 22.0,
        "bulkPrice": 14.0,
        "moq": 500,
        "unit": "kg",
        "discount": 36.0,
        "rating": 4.9,
        "reviews": 892,
        "badge": "Essentials",
        "badgeColor": "blue",
        "description": "Iodized salt, vacuum-evaporated, consistent quality. India's most trusted salt brand.",
        "tags": ["Essential", "Brand Direct", "High Volume"],
        "stock": 10000,
        "deliveryDays": 2,
        "verified": True,
    },
]


def seed():
    # Ensure all tables exist
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        # ── 1. Seed Seller User ──────────────────────────────────────────────
        existing_seller = session.get(User, SEED_SELLER_ID)
        if not existing_seller:
            seller = User(
                id=SEED_SELLER_ID,
                name="Procura Seed Seller",
                email="seed-seller@procura.dev",
                role=UserRole.seller,
            )
            session.add(seller)
            session.flush()
            print(f"[seed] Created seed seller: {SEED_SELLER_ID}")
        else:
            print(f"[seed] Seed seller already exists, skipping.")

        # ── 2. Clear existing offers to avoid duplicates on re-run ───────────
        existing_offers = session.exec(select(Offer)).all()
        if existing_offers:
            for o in existing_offers:
                session.delete(o)
            session.flush()
            print(f"[seed] Cleared {len(existing_offers)} existing offer(s).")

        # ── 3. Seed Offers ───────────────────────────────────────────────────
        product_cache: dict[str, uuid.UUID] = {}

        for data in OFFERS_SEED:
            category = data["category"]

            # Re-use or create a NormalizedProduct per category
            if category not in product_cache:
                existing_product = session.exec(
                    select(NormalizedProduct).where(NormalizedProduct.category == category)
                ).first()
                if existing_product:
                    product_cache[category] = existing_product.id
                else:
                    product = NormalizedProduct(
                        name=f"Generic {category} Product",
                        description=f"Seed product for category: {category}",
                        category=category,
                    )
                    session.add(product)
                    session.flush()
                    product_cache[category] = product.id
                    print(f"[seed] Created NormalizedProduct for category '{category}'")

            offer = Offer(
                normalized_product_id=product_cache[category],
                title=data["title"],
                seller_name=data["seller_name"],
                seller_id=SEED_SELLER_ID,
                category=data["category"],
                unitPrice=data["unitPrice"],
                bulkPrice=data["bulkPrice"],
                moq=data["moq"],
                unit=data["unit"],
                discount=data["discount"],
                rating=data["rating"],
                reviews=data["reviews"],
                badge=data.get("badge"),
                badgeColor=data.get("badgeColor"),
                description=data["description"],
                tags=data["tags"],
                stock=data["stock"],
                deliveryDays=data["deliveryDays"],
                verified=data["verified"],
            )
            session.add(offer)
            print(f"[seed] Queued offer: {data['title']}")

        session.commit()
        print("\nDone! Seeding complete. Offers are ready.")


if __name__ == "__main__":
    seed()
