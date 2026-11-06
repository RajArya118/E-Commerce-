from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime


class CouponCreate(BaseModel):
    code: str
    discount_type: str = "PERCENTAGE"  # "PERCENTAGE" | "FIXED"
    discount_value: float = Field(..., ge=0)
    min_order_amount: float = 0.0
    max_discount_cap: Optional[float] = None
    usage_limit: int = 1000
    is_active: bool = True
    valid_until: Optional[datetime] = None


class CouponApply(BaseModel):
    code: str


class CouponResponse(BaseModel):
    id: str
    code: str
    discount_type: str
    discount_value: float
    min_order_amount: float
    max_discount_cap: Optional[float] = None
    is_active: bool
