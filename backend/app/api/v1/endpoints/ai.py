from typing import Dict, Any, List
from fastapi import APIRouter
from app.schemas.ai import AIChatRequest, AIChatResponse, AISearchRequest, AIRecommendationRequest
from app.services.ai_service import AIService
from app.services.catalog_service import CatalogService

router = APIRouter(prefix="/ai", tags=["AI Shopping Assistant"])


@router.post("/chat", response_model=Dict[str, Any])
async def ai_shopping_chat(req: AIChatRequest):
    """
    Conversational AI Shopping Assistant grounded strictly in MongoDB catalog.
    Handles budget discovery, comparisons, and smart suggestions.
    """
    history = [{"role": m.role, "content": m.content} for m in req.conversation_history]
    res = await AIService.chat(message=req.message, conversation_history=history)
    return {"success": True, "data": res.model_dump()}


@router.post("/search", response_model=Dict[str, Any])
async def ai_natural_search(req: AISearchRequest):
    """Natural-language semantic product discovery."""
    items = await AIService.natural_search(req.query)
    serialized = [CatalogService._serialize_product(p) for p in items]
    return {"success": True, "data": serialized}


@router.post("/recommendations", response_model=Dict[str, Any])
async def ai_product_recommendations(req: AIRecommendationRequest):
    """Contextual product recommendations."""
    items = await AIService.recommend(product_id=req.product_id, category_slug=req.category_slug, limit=req.limit)
    serialized = [CatalogService._serialize_product(p) for p in items]
    return {"success": True, "data": serialized}
