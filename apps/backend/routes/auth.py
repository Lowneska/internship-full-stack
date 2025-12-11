# apps/backend/routes/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db.database import get_session
from db.models import User
from db.schemas import (
    User as UserRequest,
    UserLoginResponse,
    UserSignUpResponse,
)
from services.authService import (
    hash_password,
    verify_password,
    create_access_token,
)
from routes.dependencies import get_current_user

router = APIRouter()


@router.get("/")
def root():
    return {"message": "Authentication API is running"}


# -------------------------------------------
# Authentication Routes
# -------------------------------------------


@router.post(
    "/api/auth/signup",
    response_model=UserSignUpResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_409_CONFLICT: {"description": "Email already exists"},
        400: {"description": "Validation Error"},
    },
)
def signup(user_data: UserRequest, db: Session = Depends(get_session)):
    """
    Create a new user :
      - email must be unique
      - password is stored hashed
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already exists"
        )

    # Hash password and create user
    hashed_password = hash_password(user_data.password)
    new_user = User(email=user_data.email, hashed_password=hashed_password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post(
    "/api/auth/login",
    response_model=UserLoginResponse,
    responses={
        status.HTTP_401_UNAUTHORIZED: {"description": "Unauthorized"},
    },
)
def login(credentials: UserRequest, db: Session = Depends(get_session)):
    """Login and get JWT token :
    - email must be unique
    - password is stored hashed"""
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(user.id)

    return {"access_token": access_token, "token_type": "bearer"}


@router.get(
    "/api/auth/me",
    response_model=UserSignUpResponse,
)
def me(user_id: int = Depends(get_current_user), db: Session = Depends(get_session)):
    """Get current user info :
    - requires Authorization: Bearer <jwt>
    """
    user = db.query(User).filter(User.id == user_id).first()
    return user
