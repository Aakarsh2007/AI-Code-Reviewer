"""
Groq AI service — generates structured code reviews.
Uses llama-3.3-70b-versatile with strict JSON output.
"""

import json
import logging
import time
from groq import AsyncGroq
from app.config import settings
from app.models import ReviewResponse

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are an Elite Senior Software Engineer and Code Reviewer with deep expertise in
Data Structures, Algorithms, System Design, Security, and Backend Performance.

Analyze the provided code and return ONLY a valid JSON object — no markdown, no prose.

JSON schema:
{
  "code_quality_score": <float 1-10>,
  "time_complexity": "<Big-O string>",
  "space_complexity": "<Big-O string>",
  "issues": [
    {
      "type": "<bug|performance|style|security>",
      "line": "<line number or range>",
      "description": "<concise explanation>",
      "severity": "<low|medium|high|critical>"
    }
  ],
  "suggestions": ["<actionable improvement>"],
  "test_cases": [
    {
      "input": "<example input>",
      "expected_output": "<expected result>",
      "explanation": "<why this case matters>"
    }
  ],
  "refactored_code": "<fully optimized refactored version>"
}
"""

_groq_client: AsyncGroq | None = None


def _get_client() -> AsyncGroq:
    global _groq_client
    if _groq_client is None:
        _groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    return _groq_client


async def generate_code_review(code: str, language: str) -> tuple[ReviewResponse, float]:
    """
    Returns (ReviewResponse, duration_ms).
    Raises ValueError on parse failure.
    """
    client = _get_client()
    prompt = f"Review the following {language} code:\n\n```{language}\n{code}\n```"

    start = time.perf_counter()
    completion = await client.chat.completions.create(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.15,
        max_tokens=4096,
        response_format={"type": "json_object"},
    )
    duration_ms = (time.perf_counter() - start) * 1000

    raw = completion.choices[0].message.content
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        logger.error("Failed to parse Groq response: %s", exc)
        raise ValueError("AI returned malformed JSON") from exc

    # Normalise field names (snake_case already matches our model)
    data["language"] = language
    data["cached"] = False
    data["analysis_duration_ms"] = round(duration_ms, 2)

    logger.info("✅ Groq review generated for %s in %.0fms", language, duration_ms)
    return ReviewResponse(**data), duration_ms
