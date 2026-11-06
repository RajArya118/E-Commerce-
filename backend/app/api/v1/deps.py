from typing import Optional
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_token
from app.services.auth_service import AuthService
from app.core.exceptions import UnauthorizedException, ForbiddenException

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(token: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme)):
    if not token or not token.credentials:
        raise UnauthorizedException("Authentication token required")
    
    payload = decode_token(token.credentials)
    if not payload or payload.get("type") != "access":
        raise UnauthorizedException("Invalid or expired access token")
    
    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Malformed token claims")
        
    user = await AuthService.get_user_by_id(user_id)
    if not user.get("is_active", True):
        raise UnauthorizedException("Account is disabled")
    return user


async def get_current_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise ForbiddenException("Administrative privileges required")
    return user


async def get_optional_user(token: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme)) -> Optional[dict]:
    if not token or not token.credentials:
        return None
    try:
        payload = decode_token(token.credentials)
        if not payload or payload.get("type") != "access":
            return None
        user_id = payload.get("sub")
        if not user_id:
            return None
        return await AuthService.get_user_by_id(user_id)
    except Exception:
        return None
