from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, Query
from app.services.admin_service import AdminService
from app.api.v1.deps import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin Operations"])


@router.get("/analytics", response_model=Dict[str, Any])
async def get_analytics(admin: dict = Depends(get_current_admin)):
    """Executive e-commerce analytics, sales charts, and category performance."""
    data = await AdminService.get_analytics_overview()
    return {"success": True, "data": data}


@router.get("/orders", response_model=Dict[str, Any])
async def get_all_orders(
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    admin: dict = Depends(get_current_admin)
):
    """Retrieve all orders across the platform with status filtering."""
    data = await AdminService.get_all_orders(status=status, page=page, limit=limit)
    return {"success": True, "data": data}


@router.get("/customers", response_model=Dict[str, Any])
async def get_all_customers(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    admin: dict = Depends(get_current_admin)
):
    """List registered customer accounts."""
    data = await AdminService.get_all_customers(page=page, limit=limit)
    return {"success": True, "data": data}


@router.get("/inventory", response_model=Dict[str, Any])
async def get_inventory_status(admin: dict = Depends(get_current_admin)):
    """Monitor product inventory levels, low-stock alerts, and restocking indicators."""
    data = await AdminService.get_inventory_status()
    return {"success": True, "data": data}
