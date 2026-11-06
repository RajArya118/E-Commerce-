from typing import Dict, Any, List
from fastapi import APIRouter, Depends, status
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.services.catalog_service import CatalogService
from app.api.v1.deps import get_current_admin

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=Dict[str, Any])
async def list_categories():
    """Retrieve all navigation and catalog categories."""
    cats = await CatalogService.get_categories()
    return {"success": True, "data": cats}


@router.post("", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_category(
    cat_in: CategoryCreate,
    admin: dict = Depends(get_current_admin)
):
    """Create a new product category (Admin required)."""
    cat = await CatalogService.create_category(cat_in)
    return {"success": True, "data": cat}


@router.put("/{id_str}", response_model=Dict[str, Any])
async def update_category(
    id_str: str,
    update_in: CategoryUpdate,
    admin: dict = Depends(get_current_admin)
):
    """Update category properties (Admin required)."""
    cat = await CatalogService.update_category(id_str, update_in)
    return {"success": True, "data": cat}


@router.delete("/{id_str}")
async def delete_category(
    id_str: str,
    admin: dict = Depends(get_current_admin)
):
    """Delete a category (Admin required)."""
    await CatalogService.delete_category(id_str)
    return {"success": True, "message": "Category deleted successfully"}
