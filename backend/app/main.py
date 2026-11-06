from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import (
    NovaException,
    nova_exception_handler,
    validation_exception_handler,
    general_exception_handler,
)
from app.database.connection import db_manager
from app.database.indexes import create_indexes
from app.api.v1.router import api_router

# Rate limiter setup
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup and shutdown procedures."""
    logger.info("Initializing NOVA STORE Backend Service...")
    # Connect to MongoDB
    await db_manager.connect()
    # Ensure indexes
    await create_indexes()

    # Auto-seed initial catalog if empty
    db = db_manager.db
    if db is not None:
        try:
            prod_count = await db.products.count_documents({})
            if prod_count == 0:
                logger.info("Database is empty. Populating initial luxury catalog & admin seeds...")
                from seed_data import seed_collections
                await seed_collections(db)
        except Exception as e:
            logger.warning(f"Auto-seed check note: {e}")

    yield
    # Shutdown
    logger.info("Shutting down NOVA STORE Backend Service...")
    await db_manager.close()


def create_application() -> FastAPI:
    """FastAPI application factory."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="NOVA STORE — Premium Immersive AI E-Commerce Platform API",
        lifespan=lifespan,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
    )

    # Attach rate limiter to app state
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # Register custom exception handlers
    app.add_exception_handler(NovaException, nova_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)

    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include v1 API router
    app.include_router(api_router, prefix="/api/v1")

    @app.get("/", tags=["Root"])
    async def root():
        return {
            "name": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": "operational",
            "docs": "/api/docs",
        }

    return app


app = create_application()

