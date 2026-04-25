import uuid
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel
from app.main import app
from app.core.db import engine

# Ensure latest metadata bounds are established
SQLModel.metadata.create_all(engine)

from app.models.user import User
from app.models.product import NormalizedProduct

client = TestClient(app)

creator_id = str(uuid.uuid4())
user_a = str(uuid.uuid4())
user_b = str(uuid.uuid4())
dummy_product = str(uuid.uuid4())

# Seed the tests
with Session(engine) as session:
    # clear if exist somehow
    pass
    user_cred = User(id=uuid.UUID(creator_id), name="Creator", email=f"{creator_id}@example.com")
    session.add(user_cred)
    user_a_db = User(id=uuid.UUID(user_a), name="A", email=f"{user_a}@example.com")
    session.add(user_a_db)
    user_b_db = User(id=uuid.UUID(user_b), name="B", email=f"{user_b}@example.com")
    session.add(user_b_db)
    
    prod = NormalizedProduct(id=uuid.UUID(dummy_product), name="Test Prod", description="test", category="test")
    session.add(prod)
    session.commit()

print("\n--- PHASE 1 SIMULATION START ---\n")

pool_data = {
    "normalized_product_id": dummy_product,
    "name": "Test Pool",
    "description": "Test Desc",
    "category": "Test Cat",
    "mrp": 100.0,
    "poolPrice": 80.0,
    "targetUnits": 10,
    "expiresAt": "2026-12-31T00:00:00Z",
    "creator_desired_quantity": 2
}

res = client.post("/api/v1/pools/", json=pool_data, headers={"X-User-ID": creator_id})
print("Create Pool:", res.status_code)
pool_id = res.json()["id"]
print(f"Pool created. Status: {res.json()['status']}, Committed: {res.json()['filledUnits']}")

# User A Join
res = client.post(f"/api/v1/pools/{pool_id}/join-request", json={"requested_units": 3}, headers={"X-User-ID": user_a})
req_id = res.json()["id"]
print(f"User A Join Request Status: {res.json()['status']}")

# Creator approves User A
res = client.post(f"/api/v1/join-requests/{req_id}/vote", json={"vote": "Approve"}, headers={"X-User-ID": creator_id})
print(f"Creator Approves A. Threshold Met: {res.json()['threshold_met']}, Join Status: {res.json()['status']}")

# User B Join (Needs 2 approvals now since Creator and A are in pool. N=2. 75% of 2 is 2)
res = client.post(f"/api/v1/pools/{pool_id}/join-request", json={"requested_units": 5}, headers={"X-User-ID": user_b})
req_b_id = res.json()["id"]

# Creator approves B (1 of 2 votes)
res = client.post(f"/api/v1/join-requests/{req_b_id}/vote", json={"vote": "Approve"}, headers={"X-User-ID": creator_id})
print(f"Creator Approves B. Res: {res.json()['approvals']}/{res.json()['total_eligible_voters']} votes -> Status: {res.json()['status']}")

# User A approves B (2 of 2 votes)
res = client.post(f"/api/v1/join-requests/{req_b_id}/vote", json={"vote": "Approve"}, headers={"X-User-ID": user_a})
print(f"User A Approves B. Res: {res.json()['approvals']}/{res.json()['total_eligible_voters']} votes -> Status: {res.json()['status']}")

# Check Pool Status to see if locked
pool_res = client.get(f"/api/v1/pools/{pool_id}")
print(f"Final Pool Status: {pool_res.json()['status']} with {pool_res.json()['filledUnits']}/{pool_res.json()['targetUnits']} units!")
print("\n--- PHASE 1 SIMULATION END ---\n")
