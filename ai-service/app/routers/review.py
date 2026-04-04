"""
Review router — handles code analysis requests.
Validates JWT from Next.js backend, checks Redis cache, calls Groq AI.
"""

import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.models import ReviewRequest, ReviewResponse
from app.services.ai_service import generate_code_review
from app.services.cache_service import get_cached_review, set_cached_review
from app.database import get_db
from app.auth import verify_internal_token

logger = logging.getLogger(__name__)
limiter = Limiter(key_func=get_remote_address)
router = APIRouter()


@router.post("/analyze", response_model=ReviewResponse)
@limiter.limit("10/minute")
async def analyze_code(
    request: Request,
    body: ReviewRequest,
    _: str = Depends(verify_internal_token),
):
    """Analyze code and return structured AI review."""

    # 1. Check Redis cache
    cached = await get_cached_review(body.code, body.language)
    if cached:
        cached["cached"] = True
        review = ReviewResponse(**cached)
        await _persist_review(body, review)
        return review

    # 2. Generate fresh review
    try:
        review, duration_ms = await generate_code_review(body.code, body.language)
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=str(exc))

    # 3. Cache result
    await set_cached_review(body.code, body.language, review.model_dump())

    # 4. Persist to MongoDB
    await _persist_review(body, review)

    return review


@router.get("/history/{user_id}")
async def get_history(
    user_id: str,
    _: str = Depends(verify_internal_token),
    limit: int = 50,
):
    """Fetch review history for a user."""
    db = get_db()
    cursor = db["reviews"].find(
        {"user_id": user_id},
        sort=[("created_at", -1)],
        limit=limit,
    )
    items = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        items.append(doc)
    return items


@router.delete("/history/{review_id}")
async def delete_review(
    review_id: str,
    user_id: str,
    _: str = Depends(verify_internal_token),
):
    """Delete a specific review owned by the user."""
    from bson import ObjectId

    db = get_db()
    result = await db["reviews"].delete_one(
        {"_id": ObjectId(review_id), "user_id": user_id}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found or unauthorized")
    return {"message": "Review deleted successfully"}


async def _persist_review(body: ReviewRequest, review: ReviewResponse):
    """Save review to MongoDB asynchronously."""
    try:
        db = get_db()
        await db["reviews"].insert_one({
            "user_id": body.user_id,
            "language": body.language,
            "original_code": body.code,
            "ai_response": review.model_dump(),
            "created_at": datetime.utcnow(),
        })
    except Exception as exc:
        logger.error("Failed to persist review: %s", exc)
