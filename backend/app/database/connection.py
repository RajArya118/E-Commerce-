from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
from app.core.logging import logger

try:
    import mongomock_motor
    HAS_MONGOMOCK = True
except ImportError:
    HAS_MONGOMOCK = False


class DatabaseManager:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    is_mock: bool = False

    async def connect(self):
        """Initializes database connection to real MongoDB or fallback mock."""
        logger.info(f"Connecting to MongoDB at {settings.MONGODB_URL}...")
        try:
            # Short timeout to quickly detect if local server exists
            client = AsyncIOMotorClient(
                settings.MONGODB_URL,
                serverSelectionTimeoutMS=2000,
                connectTimeoutMS=2000
            )
            # Test ping
            await client.admin.command("ping")
            self.client = client
            self.db = self.client[settings.MONGODB_DB_NAME]
            self.is_mock = False
            logger.info(f"Successfully connected to real MongoDB: {settings.MONGODB_DB_NAME}")
        except Exception as e:
            if settings.USE_MOCK_DB_IF_UNAVAILABLE and HAS_MONGOMOCK:
                logger.warning(f"Could not connect to live MongoDB ({e}). Falling back to in-memory AsyncMongoMockClient.")
                mock_client = mongomock_motor.AsyncMongoMockClient()
                self.client = mock_client
                self.db = mock_client[settings.MONGODB_DB_NAME]
                self.is_mock = True
                logger.info(f"Initialized in-memory MongoMock database: {settings.MONGODB_DB_NAME}")
            else:
                logger.error(f"Failed to connect to MongoDB and mock fallback unavailable: {e}")
                raise e

    async def close(self):
        """Closes the database connection client."""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed.")


db_manager = DatabaseManager()


def get_database() -> AsyncIOMotorDatabase:
    """Dependency / accessor for active database instance."""
    if db_manager.db is None:
        raise RuntimeError("Database is not connected. Call db_manager.connect() first.")
    return db_manager.db

