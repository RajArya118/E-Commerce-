import os
import secrets
from typing import List
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "NOVA STORE"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    
    # CORS
    FRONTEND_URL: str = "http://localhost:5173"
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    # Database
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = "nova_store_db"
    USE_MOCK_DB_IF_UNAVAILABLE: bool = True

    # Security & JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY") or secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Razorpay (Sandbox)
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "rzp_test_placeholderKeyId")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "placeholderKeySecret")
    RAZORPAY_CURRENCY: str = "INR"

    # AI Shopping Assistant (Gemini)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    AI_MODEL_NAME: str = "gemini-1.5-flash"

    # Admin Defaults
    ADMIN_DEFAULT_EMAIL: str = "admin@novastore.com"
    ADMIN_DEFAULT_PASSWORD: str = ""
    CUSTOMER_DEFAULT_PASSWORD: str = ""

    @field_validator("SECRET_KEY", mode="before")
    @classmethod
    def use_generated_secret_when_unset(cls, value: str) -> str:
        return value or secrets.token_urlsafe(32)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
