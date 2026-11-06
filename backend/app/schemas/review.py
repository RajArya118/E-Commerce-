from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime


class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    title: str = Field(..., min_length=2)
    comment: str = Field(..., min_length=5)


class ReviewResponse(BaseModel):
    id: str
    product_id: str
    user_id: Optional[str] = None
    user_name: str
    rating: int
    title: str
    comment: str
    is_verified_buyer: bool = True
    created_at: datetime
