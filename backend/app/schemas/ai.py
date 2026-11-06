from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class AIChatMessage(BaseModel):
    role: str
    content: str


class AIChatRequest(BaseModel):
    message: str
    conversation_history: List[AIChatMessage] = []


class AISuggestedProduct(BaseModel):
    id: str
    name: str
    price: float
    discount_price: Optional[float] = None
    slug: str
    image: Optional[str] = None
    reason: Optional[str] = None


class AIChatResponse(BaseModel):
    reply: str
    suggested_products: List[AISuggestedProduct] = []
    quick_actions: List[str] = []


class AISearchRequest(BaseModel):
    query: str


class AIRecommendationRequest(BaseModel):
    product_id: Optional[str] = None
    category_slug: Optional[str] = None
    limit: int = 4
