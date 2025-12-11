import os
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from jose import jwt
from argon2 import PasswordHasher

load_dotenv()
pass_hasher = PasswordHasher()

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXP_MINUTES = int(os.getenv("JWT_EXPIRATION_MINUTES", "30"))


############################################
# Password Hashing and JWT Token Management
############################################
def hash_password(password: str) -> str:
    return pass_hasher.hash(password)


############################################
# Password Verification
############################################
def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        pass_hasher.verify(hashed_password, plain_password)
        return True
    except Exception:
        return False


#############################################
# JWT Token Creation and Verification
#############################################
def create_access_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=JWT_EXP_MINUTES),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


##############################################
# JWT Token Verification
##############################################
def verify_token(token: str) -> int:
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return int(data["sub"])
    except Exception:
        raise ValueError("Invalid token")
