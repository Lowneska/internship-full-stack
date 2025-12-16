import os
import time
from openai import OpenAI
from pydantic import ValidationError

from modules.ai.schemas import ProgramResponse
from modules.ai.prompts import SYSTEM_PROMPT, PROGRAM_RESPONSE_JSON_SCHEMA
import hashlib
from typing import Dict, Tuple

##############################################
# Simple in-memory cache to avoid redundant requests
##############################################

_PROMPT_CACHE: Dict[str, Tuple[float, ProgramResponse]] = {}
CACHE_TTL_SECONDS = 10 * 60  # 10 minutes


################################################
# Helper functions
###############################################
def _normalize_prompt(text: str) -> str:
    return " ".join(text.lower().strip().split())


def _prompt_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


OPENAI_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_KEY:
    raise RuntimeError(
        "OPENAI_API_KEY is not set. Please configure a valid OpenAI API key to use the AI program generator."
    )


client = OpenAI(api_key=OPENAI_KEY)


def generate_program_from_text(user_text: str, max_retries: int = 2) -> ProgramResponse:
    """
    Generate a workout program based on user input text using OpenAI API.
    Implements caching to avoid redundant requests for the same prompt within a TTL.
    """
    normalized = _normalize_prompt(user_text)
    key = _prompt_hash(normalized)
    now = time.time()

    cached = _PROMPT_CACHE.get(key)
    if cached:
        ts, value = cached
        if now - ts < CACHE_TTL_SECONDS:
            return value
        else:
            del _PROMPT_CACHE[key]

    last_error: Exception | None = None

    for attempt in range(1, max_retries + 1):
        try:
            response = client.responses.create(
                model="gpt-5-mini",
                instructions=SYSTEM_PROMPT,
                input=user_text,
                text={
                    "format": {
                        "type": "json_schema",
                        "name": PROGRAM_RESPONSE_JSON_SCHEMA["name"],
                        "schema": PROGRAM_RESPONSE_JSON_SCHEMA["schema"],
                        "strict": PROGRAM_RESPONSE_JSON_SCHEMA["strict"],
                    }
                },
                max_output_tokens=2600,
                reasoning={"effort": "low"},
            )

            raw = (response.output_text or "").strip()

            if not raw:
                raise ValueError("Empty output_text")
            if not raw.endswith("}"):
                raise ValueError("Likely truncated JSON (does not end with '}')")

            parsed = ProgramResponse.model_validate_json(raw)
            _PROMPT_CACHE[key] = (now, parsed)

            return parsed

        except (ValidationError, ValueError) as e:
            last_error = e
            if attempt < max_retries:
                time.sleep(0.25 * (2 ** (attempt - 1)))
                continue

    raise ValueError("Failed to generate valid JSON") from last_error
