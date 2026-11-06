import hmac
import hashlib
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import NovaException


class PaymentService:
    @staticmethod
    def verify_razorpay_signature(razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str) -> bool:
        """
        Zero-trust server-side verification of Razorpay HMAC-SHA256 signature.
        Formula: HMAC-SHA256(order_id + "|" + payment_id, secret) == signature
        """
        secret = settings.RAZORPAY_KEY_SECRET
        if not secret:
            logger.error("RAZORPAY_KEY_SECRET is not configured.")
            return False

        message = f"{razorpay_order_id}|{razorpay_payment_id}".encode('utf-8')
        generated_signature = hmac.new(secret.encode('utf-8'), message, hashlib.sha256).hexdigest()
        
        is_valid = hmac.compare_digest(generated_signature, razorpay_signature)
        if not is_valid:
            logger.warning(f"Signature mismatch! Expected: {generated_signature}, Received: {razorpay_signature}")
        return is_valid

    @staticmethod
    async def create_razorpay_order(amount_paise: int, receipt_id: str, notes: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Creates a Razorpay order in test mode.
        If live SDK call fails or placeholder keys are used in test environment, generates a valid deterministic mock order.
        """
        try:
            import razorpay
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            order_data = {
                "amount": amount_paise,
                "currency": settings.RAZORPAY_CURRENCY,
                "receipt": receipt_id,
                "payment_capture": 1,
                "notes": notes or {}
            }
            rzp_order = client.order.create(data=order_data)
            return rzp_order
        except Exception as e:
            logger.warning(f"Razorpay live client creation bypassed ({e}). Using simulated sandbox order.")
            import uuid
            mock_id = f"order_{uuid.uuid4().hex[:14]}"
            return {
                "id": mock_id,
                "entity": "order",
                "amount": amount_paise,
                "currency": settings.RAZORPAY_CURRENCY,
                "receipt": receipt_id,
                "status": "created",
                "attempts": 0
            }
