import pymongo
from app.database.connection import get_database
from app.core.logging import logger


async def create_indexes():
    """Ensures all essential database indexes are configured."""
    try:
        db = get_database()
        
        # Users
        await db.users.create_index([("email", pymongo.ASCENDING)], unique=True)
        await db.users.create_index([("role", pymongo.ASCENDING)])
        
        # Categories
        await db.categories.create_index([("slug", pymongo.ASCENDING)], unique=True)
        
        # Products
        await db.products.create_index([("slug", pymongo.ASCENDING)], unique=True)
        await db.products.create_index([("category_slug", pymongo.ASCENDING)])
        await db.products.create_index([("price", pymongo.ASCENDING)])
        await db.products.create_index([("ratings_average", pymongo.DESCENDING)])
        await db.products.create_index([
            ("title", pymongo.TEXT),
            ("description", pymongo.TEXT),
            ("tags", pymongo.TEXT)
        ])
        
        # Carts
        await db.carts.create_index([("user_id", pymongo.ASCENDING)], unique=True, sparse=True)
        await db.carts.create_index([("session_id", pymongo.ASCENDING)])
        
        # Wishlists
        await db.wishlists.create_index([("user_id", pymongo.ASCENDING)], unique=True)
        
        # Orders
        await db.orders.create_index([("order_number", pymongo.ASCENDING)], unique=True)
        await db.orders.create_index([("user_id", pymongo.ASCENDING)])
        await db.orders.create_index([("order_status", pymongo.ASCENDING)])
        await db.orders.create_index([("razorpay_order_id", pymongo.ASCENDING)])
        
        # Coupons
        await db.coupons.create_index([("code", pymongo.ASCENDING)], unique=True)

        logger.info("Successfully verified and configured MongoDB indexes.")
    except Exception as e:
        logger.warning(f"Index creation note (mock or unindexed): {e}")

