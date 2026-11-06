from typing import Dict, Any, List
from fastapi import APIRouter, Depends, status
from bson import ObjectId
from app.database.connection import get_database
from app.api.v1.deps import get_current_user
from app.services.catalog_service import CatalogService

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("", response_model=Dict[str, Any])
async def get_wishlist(current_user: dict = Depends(get_current_user)):
    """Retrieve all products in customer's wishlist."""
    db = get_database()
    wl = await db.wishlists.find_one({"user_id": current_user["id"]})
    if not wl:
        return {"success": True, "data": []}

    prod_ids = [ObjectId(pid) for pid in wl.get("product_ids", []) if ObjectId.is_valid(pid)]
    cursor = db.products.find({"_id": {"$in": prod_ids}})
    prods = await cursor.to_list(length=100)
    return {"success": True, "data": [CatalogService._serialize_product(p) for p in prods]}


@router.post("", response_model=Dict[str, Any])
async def add_to_wishlist(body: Dict[str, str], current_user: dict = Depends(get_current_user)):
    """Add product to customer wishlist."""
    product_id = body.get("product_id")
    if not product_id:
        return {"success": False, "message": "product_id required"}

    db = get_database()
    await db.wishlists.update_one(
        {"user_id": current_user["id"]},
        {"$addToSet": {"product_ids": product_id}},
        upsert=True
    )
    return {"success": True, "message": "Product added to wishlist"}


@router.delete("/{product_id}", response_model=Dict[str, Any])
async def remove_from_wishlist(product_id: str, current_user: dict = Depends(get_current_user)):
    """Remove product from customer wishlist."""
    db = get_database()
    await db.wishlists.update_one(
        {"user_id": current_user["id"]},
        {"$pull": {"product_ids": product_id}}
    )
    return {"success": True, "message": "Product removed from wishlist"}


@router.post("/toggle/{product_id}", response_model=Dict[str, Any])
async def toggle_wishlist_item(product_id: str, current_user: dict = Depends(get_current_user)):
    """Toggle wishlist membership for product."""
    db = get_database()
    wl = await db.wishlists.find_one({"user_id": current_user["id"]})
    items = wl.get("product_ids", []) if wl else []

    if product_id in items:
        await db.wishlists.update_one(
            {"user_id": current_user["id"]},
            {"$pull": {"product_ids": product_id}}
        )
        saved = False
    else:
        await db.wishlists.update_one(
            {"user_id": current_user["id"]},
            {"$addToSet": {"product_ids": product_id}},
            upsert=True
        )
        saved = True

    return {"success": True, "data": {"saved": saved, "product_id": product_id}}
