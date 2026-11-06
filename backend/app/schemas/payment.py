from typing import Optional, Dict, Any
from pydantic import BaseModel


class PaymentCreateOrderRequest(BaseModel):
    order_id: str


class PaymentCreateOrderResponse(BaseModel):
    razorpay_order_id: str
    amount: int  # in paise
    currency: str = "INR"
    key_id: str
    order_number: str


class PaymentVerifyRequest(BaseModel):
    order_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class PaymentVerifyResponse(BaseModel):
    verified: bool
    order_number: str
    status: str
    message: str


class PaymentWebhookRequest(BaseModel):
    event: str
    payload: Dict[str, Any]
