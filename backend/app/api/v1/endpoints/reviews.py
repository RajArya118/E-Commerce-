from typing import Dict, Any, List
from fastapi import APIRouter, Depends, status
from app.schemas.review import ReviewCreate, ReviewResponse
from app.services.catalog_service import CatalogService
from app.api.v1.deps import get_current_user

router = APIRouter(tags=["Reviews"])


@router.get("/products/{product_id}/reviews", response_model=Dict[str, Any])
async def list_product_reviews(product_id: str):
    """List customer reviews for a specific product."""
    reviews = await CatalogService.get_product_reviews(product_id)
    return {"success": True, "data": reviews}


@router.post("/products/{product_id}/reviews", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def submit_product_review(
    product_id: str,
    review_in: ReviewCreate,
    current_user: dict = Depends(get_current_user)
):
    """Submit a verified buyer review and update product average rating."""
    rev = await CatalogService.add_review(
        product_id=product_id,
        review_in=review_in,
        user_id=current_user["id"],
        user_name=current_user["full_name"]
    )
    return {"success": True, "data": rev}
