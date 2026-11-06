from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class AddressBase(BaseModel):
    id: Optional[str] = None
    label: Optional[str] = "Primary"
    full_name: str
    phone: str
    street: str
    city: str
    state: str
    postal_code: str
    country: str = "India"
    is_default: bool = False


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str = "customer"
    phone: Optional[str] = None
    is_active: bool = True
    addresses: List[AddressBase] = []
    created_at: Optional[datetime] = None


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    refresh_token: str
