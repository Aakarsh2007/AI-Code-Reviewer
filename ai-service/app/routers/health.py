"""Health check endpoints."""

from fastapi import APIRouter
from datetime import datetime

router = APIRouter()


@router.get("/")
async def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat(), "service": "ai-code-review"}


@router.get("/ready")
async def ready():
    return {"ready": True}
