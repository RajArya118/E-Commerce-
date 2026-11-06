from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from app.schemas.user import AddressBase


class OrderItemSnapshot(BaseModel):
    product_id: str
    name: str
    slug: str
    price: float
    quantity: int
    variant: Optional[Dict[str, Any]] = None
    subtotal: float
    image: Optional[str] = None


class OrderTimelineEntry(BaseModel):
    status: str
    timestamp: datetime
    note: Optional[str] = None


class OrderCreate(BaseModel):
    shipping_address: AddressBase
    coupon_code: Optional[str] = None
    payment_method: str = "razorpay"


class OrderResponse(BaseModel):
    id: str
    order_number: str
    user_id: Optional[str] = None
    customer_email: str
    customer_name: str
    shipping_address: AddressBase
    items: List[OrderItemSnapshot]
    subtotal: float
    discount_amount: float = 0.0
    shipping_fee: float = 0.0
    tax_amount: float = 0.0
    total_amount: float
    currency: str = "INR"
    payment_status: str = "PENDING"
    order_status: str = "PENDING"
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    timeline: List[OrderTimelineEntry] = []
    created_at: datetime
    updated_at: datetime


class OrderStatusUpdate(BaseModel):
    order_status: str
    note: Optional[str] = None
