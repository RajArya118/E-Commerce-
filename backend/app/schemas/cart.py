from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime


class CartItemAdd(BaseModel):
    product_id: str
    quantity: int = Field(default=1, ge=1)
    variant: Optional[Dict[str, Any]] = None


class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=0)


class CartItemResponse(BaseModel):
    id: str
    product_id: str
    name: str
    slug: str
    price: float
    discount_price: Optional[float] = None
    image: Optional[str] = None
    variant: Optional[Dict[str, Any]] = None
    quantity: int
    subtotal: float
    stock_available: int


class CartResponse(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    items: List[CartItemResponse] = []
    subtotal: float = 0.0
    discount_amount: float = 0.0
    coupon_code: Optional[str] = None
    shipping_fee: float = 0.0
    tax_amount: float = 0.0
    total: float = 0.0
    total_items: int = 0
