from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from modules.auth.service import verify_token

security = HTTPBearer()


##################################
# Dependency to get current user ID from token
# Raises 401 if token is invalid
##################################
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> int:
    try:
        return verify_token(credentials.credentials)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
