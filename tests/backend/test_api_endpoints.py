import pytest
from httpx import AsyncClient, ASGITransport
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))

from app.main import app
from app.database.connection import db_manager
from seed_data import seed_collections


@pytest.mark.asyncio
async def test_full_api_suite():
    # Initialize DB for tests
    await db_manager.connect()
    if db_manager.db is not None:
        await seed_collections(db_manager.db)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health check
        res = await client.get("/api/v1/health")
        assert res.status_code == 200
        assert res.json()["status"] == "healthy"

        # 2. Get categories
        res = await client.get("/api/v1/categories")
        assert res.status_code == 200
        cats = res.json()["data"]
        assert len(cats) >= 5

        # 3. Get products catalog
        res = await client.get("/api/v1/products")
        assert res.status_code == 200
        products = res.json()["data"]["products"]
        assert len(products) >= 5
        sample_slug = products[0]["slug"]

        # 4. Get single product details
        res = await client.get(f"/api/v1/products/{sample_slug}")
        assert res.status_code == 200
        assert res.json()["data"]["slug"] == sample_slug

        # 5. Customer Login
        res = await client.post("/api/v1/auth/login", json={
            "email": "customer@novastore.com",
            "password": "CustomerPass2026!"
        })
        assert res.status_code == 200
        auth_data = res.json()["data"]
        token = auth_data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 6. Verify User Profile
        res = await client.get("/api/v1/auth/me", headers=headers)
        assert res.status_code == 200
        assert res.json()["data"]["email"] == "customer@novastore.com"

        # 7. Add to Cart
        prod_id = products[0]["id"]
        res = await client.post("/api/v1/cart/items", json={
            "product_id": prod_id,
            "quantity": 1
        }, headers=headers)
        assert res.status_code in [200, 201]
        cart = res.json()["data"]
        assert len(cart["items"]) >= 1

        # 8. Apply coupon
        res = await client.post("/api/v1/cart/apply-coupon", json={"code": "NOVALUXURY"}, headers=headers)
        assert res.status_code == 200

        # 9. Wishlist toggle
        res = await client.post(f"/api/v1/wishlist/toggle/{prod_id}", headers=headers)
        assert res.status_code == 200
        assert res.json()["data"]["saved"] is True

        # 10. AI Chat grounded query
        res = await client.post("/api/v1/ai/chat", json={
            "message": "Find me the best spatial headphones under 40000"
        })
        assert res.status_code == 200
        ai_data = res.json()["data"]
        assert len(ai_data["suggested_products"]) >= 1
        assert "Eclipse" in ai_data["suggested_products"][0]["name"]

        # 11. Admin Login & Analytics
        admin_res = await client.post("/api/v1/auth/login", json={
            "email": "admin@novastore.com",
            "password": "NovaAdminSecure2026!"
        })
        assert admin_res.status_code == 200
        admin_token = admin_res.json()["data"]["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}

        res = await client.get("/api/v1/admin/analytics", headers=admin_headers)
        assert res.status_code == 200
        analytics = res.json()["data"]
        assert "summary" in analytics
        assert analytics["summary"]["total_products"] >= 5

        # 12. Newsletter subscribe
        res = await client.post("/api/v1/newsletter/subscribe", json={
            "email": "newsletter_test@novastore.com",
            "source": "homepage_footer"
        })
        assert res.status_code == 200
        assert res.json()["success"] is True

        print("\nAll 12 Core Full-Stack Endpoints Tested & Verified Successfully!")
