"""MongoDB async connection via Motor + Redis client."""

import logging
import redis.asyncio as aioredis
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

logger = logging.getLogger(__name__)

# ── MongoDB ───────────────────────────────────────────────────────────────────
_mongo_client: AsyncIOMotorClient | None = None


async def connect_db():
    global _mongo_client
    _mongo_client = AsyncIOMotorClient(settings.MONGO_URI)
    logger.info("📦 MongoDB connected")


async def disconnect_db():
    global _mongo_client
    if _mongo_client:
        _mongo_client.close()
        logger.info("📦 MongoDB disconnected")


def get_db():
    return _mongo_client[settings.MONGO_DB_NAME]


# ── Redis ─────────────────────────────────────────────────────────────────────
_redis_client: aioredis.Redis | None = None


async def get_redis() -> aioredis.Redis:
    global _redis_client
    if _redis_client is None:
        _redis_client = aioredis.from_url(
            settings.REDIS_URI,
            encoding="utf-8",
            decode_responses=True,
        )
    return _redis_client
