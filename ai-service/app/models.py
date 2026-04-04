"""Pydantic models for request/response validation."""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime


class ReviewRequest(BaseModel):
    code: str = Field(..., min_length=1, max_length=50000, description="Source code to review")
    language: Literal["javascript", "typescript", "python", "java", "cpp", "c", "go", "rust", "csharp"] = "javascript"
    user_id: str = Field(..., description="Authenticated user ID")


class CodeIssue(BaseModel):
    type: Literal["bug", "performance", "style", "security"]
    line: str
    description: str
    severity: Literal["low", "medium", "high", "critical"] = "medium"


class TestCase(BaseModel):
    input: str
    expected_output: str
    explanation: str


class ReviewResponse(BaseModel):
    code_quality_score: float = Field(..., ge=1, le=10)
    time_complexity: str
    space_complexity: str
    issues: List[CodeIssue] = []
    suggestions: List[str] = []
    test_cases: List[TestCase] = []
    refactored_code: str
    language: str
    cached: bool = False
    analysis_duration_ms: Optional[float] = None


class HistoryItem(BaseModel):
    id: str
    language: str
    original_code: str
    ai_response: ReviewResponse
    created_at: datetime
