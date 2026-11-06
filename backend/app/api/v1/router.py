from fastapi import APIRouter
from app.core.config import settings
from app.database.connection import db_manager
from app.api.v1.endpoints import (
    auth, products, categories, cart, wishlist, orders, payments, reviews, ai, admin, newsletter
)

api_router = APIRouter()


@api_router.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint indicating system & database status."""
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "database": "mock_in_memory" if db_manager.is_mock else "connected_mongodb"
    }


# Include all domain routers
api_router.include_router(auth.router)
api_router.include_router(products.router)
api_router.include_router(categories.router)
api_router.include_router(cart.router)
api_router.include_router(wishlist.router)
api_router.include_router(orders.router)
api_router.include_router(payments.router)
api_router.include_router(reviews.router)
api_router.include_router(ai.router)
api_router.include_router(admin.router)
api_router.include_router(newsletter.router)
