import json
import os
from json import JSONDecodeError

from pydantic import ValidationError

from modules.ai.schemas import ProgramResponse, ProgramDay, Exercise
from modules.ai.prompts import SYSTEM_PROMPT, PROGRAM_RESPONSE_JSON_SCHEMA


# Detect mock mode automatically
AI_MODE = os.getenv("AI_MODE", "").lower()
OPENAI_KEY = os.getenv("OPENAI_API_KEY")


############################################
# 1) MOCK MODE — Used when AI_MODE=mock or no API key
############################################


def mock_program() -> ProgramResponse:
    """Return a fake workout program for testing front-end."""
    return ProgramResponse(
        days=[
            ProgramDay(
                day=1,
                focus="Full Body",
                duration_min=45,
                estimated_calories=320,
                equipment=["bodyweight", "mat"],
                warmup="5 minutes light cardio",
                cooldown="Stretch 5 minutes",
                exercises=[
                    Exercise(name="Squats", sets=3, reps=12, rest_sec=60),
                    Exercise(name="Push-ups", sets=3, reps=10, rest_sec=60),
                    Exercise(name="Plank", sets=3, reps=40, rest_sec=45),
                ],
            ),
            ProgramDay(
                day=2,
                focus="Cardio",
                duration_min=30,
                estimated_calories=270,
                equipment=["none"],
                warmup="2 min brisk walk",
                cooldown="Deep breathing 3 min",
                exercises=[
                    Exercise(name="Jumping jacks", sets=3, reps=30, rest_sec=45),
                    Exercise(name="High knees", sets=3, reps=30, rest_sec=45),
                ],
            ),
        ]
    )


############################################
# 2) REAL OPENAI MODE — only if OPENAI_API_KEY exists
############################################

if AI_MODE != "mock" and OPENAI_KEY:
    from openai import OpenAI

    client = OpenAI(api_key=OPENAI_KEY)

    def generate_program_from_text(
        user_text: str, max_retries: int = 3
    ) -> ProgramResponse:
        last_error = None

        for _ in range(max_retries):
            full_input = (
                f"Generate a workout program in JSON format based on: {user_text}"
            )

            response = client.responses.create(
                model="gpt-5-mini",
                instructions=SYSTEM_PROMPT,
                input=full_input,
                text={
                    "format": {
                        "type": "json_schema",
                        "json_schema": PROGRAM_RESPONSE_JSON_SCHEMA,
                    }
                },
                max_output_tokens=1200,
            )

            raw_text = response.output[0].content[0].text

            try:
                data = json.loads(raw_text)
                return ProgramResponse(**data)
            except (JSONDecodeError, ValidationError) as e:
                last_error = e

        raise ValueError("Failed to generate valid JSON after retries") from last_error

else:
    ############################################
    # 3) IF MOCK MODE — override the real function
    ############################################
    def generate_program_from_text(
        user_text: str, max_retries: int = 3
    ) -> ProgramResponse:
        print("⚠️ AI_MODE=mock → Returning mock workout program")
        return mock_program()
