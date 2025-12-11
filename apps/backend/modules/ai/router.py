from fastapi import APIRouter, Depends, HTTPException, status

from modules.ai.schemas import ProgramRequest, ProgramResponse
from modules.ai.service import generate_program_from_text
from routes.dependencies import get_current_user


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
    try:
        program = generate_program_from_text(body.text)
        return program
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate workout program: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}",
        )
