from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query, Depends, status
from app.schemas.product import ProductResponse, ProductCreate, ProductUpdate, ProductListResponse
from app.services.catalog_service import CatalogService
from app.api.v1.deps import get_current_admin

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=Dict[str, Any])
async def list_products(
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = "popular",
    featured: bool = False,
    trending: bool = False
):
    """Retrieve catalog products with rich filtering, search, and pagination."""
    res = await CatalogService.get_products(
        page=page,
        limit=limit,
        category=category,
        search=search,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by,
        featured_only=featured,
        trending_only=trending
    )
    return {"success": True, "data": res}


@router.get("/featured", response_model=Dict[str, Any])
async def get_featured_products(limit: int = 8):
    """Retrieve curated featured collection products."""
    res = await CatalogService.get_products(page=1, limit=limit, featured_only=True)
    return {"success": True, "data": res["products"]}


@router.get("/trending", response_model=Dict[str, Any])
async def get_trending_products(limit: int = 8):
    """Retrieve trending products."""
    res = await CatalogService.get_products(page=1, limit=limit, trending_only=True)
    return {"success": True, "data": res["products"]}


@router.get("/{id_or_slug}", response_model=Dict[str, Any])
async def get_product_details(id_or_slug: str):
    """Retrieve detailed product specifications by ID or slug."""
    product = await CatalogService.get_product_by_id_or_slug(id_or_slug)
    return {"success": True, "data": product}


@router.post("", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_product(
    product_in: ProductCreate,
    admin: dict = Depends(get_current_admin)
):
    """Create new product (Admin authorization required)."""
    product = await CatalogService.create_product(product_in)
    return {"success": True, "data": product}


@router.put("/{id_str}", response_model=Dict[str, Any])
async def update_product(
    id_str: str,
    update_in: ProductUpdate,
    admin: dict = Depends(get_current_admin)
):
    """Update product details and stock (Admin authorization required)."""
    product = await CatalogService.update_product(id_str, update_in)
    return {"success": True, "data": product}


@router.delete("/{id_str}")
async def delete_product(
    id_str: str,
    admin: dict = Depends(get_current_admin)
):
    """Remove product from catalog (Admin authorization required)."""
    await CatalogService.delete_product(id_str)
    return {"success": True, "message": "Product removed successfully"}
