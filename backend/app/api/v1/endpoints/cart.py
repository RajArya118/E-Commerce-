from typing import Optional, Dict, Any
from fastapi import APIRouter, Header, Depends, status
from app.schemas.cart import CartItemAdd, CartItemUpdate
from app.schemas.coupon import CouponApply
from app.services.cart_service import CartService
from app.api.v1.deps import get_optional_user

router = APIRouter(prefix="/cart", tags=["Shopping Cart"])


@router.get("", response_model=Dict[str, Any])
async def get_cart(
    x_session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Retrieve active shopping cart with recalculations."""
    user_id = current_user["id"] if current_user else None
    cart = await CartService.get_or_create_cart(user_id=user_id, session_id=x_session_id)
    return {"success": True, "data": cart}


@router.post("/items", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def add_item_to_cart(
    item_in: CartItemAdd,
    x_session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Add product to shopping cart."""
    user_id = current_user["id"] if current_user else None
    cart = await CartService.add_item(
        product_id=item_in.product_id,
        quantity=item_in.quantity,
        variant=item_in.variant,
        user_id=user_id,
        session_id=x_session_id
    )
    return {"success": True, "data": cart}


@router.put("/items/{item_id}", response_model=Dict[str, Any])
async def update_cart_item(
    item_id: str,
    item_update: CartItemUpdate,
    x_session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Update item quantity in shopping cart."""
    user_id = current_user["id"] if current_user else None
    cart = await CartService.update_item_quantity(
        item_id=item_id,
        quantity=item_update.quantity,
        user_id=user_id,
        session_id=x_session_id
    )
    return {"success": True, "data": cart}


@router.delete("/items/{item_id}", response_model=Dict[str, Any])
async def remove_cart_item(
    item_id: str,
    x_session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Remove item from shopping cart."""
    user_id = current_user["id"] if current_user else None
    cart = await CartService.remove_item(
        item_id=item_id,
        user_id=user_id,
        session_id=x_session_id
    )
    return {"success": True, "data": cart}


@router.post("/apply-coupon", response_model=Dict[str, Any])
async def apply_coupon(
    coupon_in: CouponApply,
    x_session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Validate and apply promotional discount code."""
    user_id = current_user["id"] if current_user else None
    cart = await CartService.apply_coupon(
        coupon_code=coupon_in.code,
        user_id=user_id,
        session_id=x_session_id
    )
    return {"success": True, "data": cart}
