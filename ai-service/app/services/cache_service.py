"""Redis caching layer for code reviews."""

import hashlib
import json
import logging
from app.database import get_redis
from app.config import settings

logger = logging.getLogger(__name__)


def _make_cache_key(code: str, language: str) -> str:
    code_hash = hashlib.sha256(code.encode()).hexdigest()
    return f"code_review:v2:{language}:{code_hash}"


async def get_cached_review(code: str, language: str) -> dict | None:
    redis = await get_redis()
    key = _make_cache_key(code, language)
    cached = await redis.get(key)
    if cached:
        logger.info("⚡ Cache HIT for key %s", key[:40])
        return json.loads(cached)
    return None


async def set_cached_review(code: str, language: str, review: dict) -> None:
    redis = await get_redis()
    key = _make_cache_key(code, language)
    await redis.setex(key, settings.CACHE_TTL_SECONDS, json.dumps(review))
    logger.info("⚡ Cached review for key %s (TTL=%ds)", key[:40], settings.CACHE_TTL_SECONDS)
