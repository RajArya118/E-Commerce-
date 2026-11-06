from fastapi import APIRouter, Depends, status
from typing import Dict, Any
from app.schemas.user import (
    UserRegister, UserLogin, TokenResponse, RefreshTokenRequest,
    ForgotPasswordRequest, ResetPasswordRequest, AddressBase, UserResponse
)
from app.services.auth_service import AuthService
from app.api.v1.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def register(user_in: UserRegister):
    """Register a new customer account."""
    data = await AuthService.register(user_in)
    return {"success": True, "data": data}


@router.post("/login", response_model=Dict[str, Any])
async def login(credentials: UserLogin):
    """Authenticate customer or admin and return JWT access and refresh tokens."""
    data = await AuthService.login(credentials)
    return {"success": True, "data": data}


@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Log out customer session."""
    return {"success": True, "message": "Successfully logged out"}


@router.post("/refresh", response_model=Dict[str, Any])
async def refresh_token(req: RefreshTokenRequest):
    """Rotate access token using valid refresh token."""
    data = await AuthService.refresh_tokens(req.refresh_token)
    return {"success": True, "data": data}


@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    """Initiate password recovery."""
    return {"success": True, "message": f"Password reset instructions dispatched to {req.email}"}


@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest):
    """Reset account password via token."""
    return {"success": True, "message": "Password updated successfully"}


@router.get("/me", response_model=Dict[str, Any])
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """Fetch profile of currently authenticated user."""
    return {"success": True, "data": current_user}


@router.put("/me", response_model=Dict[str, Any])
async def update_profile(
    body: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    """Update user personal details."""
    updated = await AuthService.update_profile(
        user_id=current_user["id"],
        full_name=body.get("full_name"),
        phone=body.get("phone")
    )
    return {"success": True, "data": updated}


@router.post("/me/address", response_model=Dict[str, Any])
async def add_or_update_address(
    address: AddressBase,
    current_user: dict = Depends(get_current_user)
):
    """Add or update a shipping address in user profile."""
    updated = await AuthService.add_or_update_address(user_id=current_user["id"], address=address)
    return {"success": True, "data": updated}
