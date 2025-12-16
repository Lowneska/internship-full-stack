from fastapi import APIRouter, Depends, HTTPException, status

from modules.ai.schemas import ProgramRequest, ProgramResponse
from modules.ai.service import generate_program_from_text
from dependencies.dependencies import get_current_user


router = APIRouter()


@router.post(
    "/api/ai/program",
    response_model=ProgramResponse,
    status_code=status.HTTP_200_OK,
)
def generate_program(
    body: ProgramRequest,
    _: int = Depends(get_current_user),
):
    """
    Generate a workout program based on user input text
    """
    result = generate_program_from_text(body.text)
    if not result.success:
        raise HTTPException(
            status_code=422, detail=result.error_message or "Invalid request"
        )
    return result
