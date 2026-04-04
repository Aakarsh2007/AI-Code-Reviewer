"""Application configuration using pydantic-settings."""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App
    DEBUG: bool = False
    APP_ENV: str = "production"

    # Groq AI
    GROQ_API_KEY: str

    # Redis
    REDIS_URI: str = "redis://localhost:6379"
    CACHE_TTL_SECONDS: int = 86400  # 24 hours

    # MongoDB
    MONGO_URI: str
    MONGO_DB_NAME: str = "code_reviewer"

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "https://localhost:3000"]

    # JWT (for internal service-to-service validation)
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"

    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 5

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
