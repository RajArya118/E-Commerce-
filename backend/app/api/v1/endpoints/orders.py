from typing import Dict, Any, List
from fastapi import APIRouter, Depends, status
from app.schemas.order import OrderCreate, OrderStatusUpdate
from app.services.order_service import OrderService
from app.api.v1.deps import get_current_user, get_current_admin

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_order(
    order_in: OrderCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create pending order from active cart and return Razorpay checkout details."""
    res = await OrderService.create_order(
        order_in=order_in,
        user_id=current_user["id"],
        user_email=current_user["email"],
        user_name=current_user["full_name"]
    )
    return {"success": True, "data": res}


@router.get("", response_model=Dict[str, Any])
@router.get("/my-orders", response_model=Dict[str, Any])
async def get_my_orders(current_user: dict = Depends(get_current_user)):
    """Retrieve all historical orders for authenticated customer."""
    orders = await OrderService.get_user_orders(user_id=current_user["id"])
    return {"success": True, "data": orders}


@router.get("/{id_or_number}", response_model=Dict[str, Any])
async def get_order_by_identifier(
    id_or_number: str,
    current_user: dict = Depends(get_current_user)
):
    """Retrieve detailed order snapshot and tracking timeline."""
    is_admin = current_user.get("role") == "admin"
    order = await OrderService.get_order_by_id_or_number(
        id_or_number=id_or_number,
        user_id=current_user["id"],
        is_admin=is_admin
    )
    return {"success": True, "data": order}


@router.put("/{id_or_number}/status", response_model=Dict[str, Any])
async def update_order_fulfillment(
    id_or_number: str,
    status_in: OrderStatusUpdate,
    admin: dict = Depends(get_current_admin)
):
    """Transition order fulfillment status (Admin required)."""
    updated = await OrderService.update_order_status(id_or_number=id_or_number, status_in=status_in)
    return {"success": True, "data": updated}
