from pydantic import BaseModel, EmailStr


class User(BaseModel):
    email: EmailStr
    password: str


class UserSignUpResponse(BaseModel):
    id: int
    email: EmailStr
    model_config = {"from_attributes": True}


class UserLoginResponse(BaseModel):
    access_token: str
    token_type: str
