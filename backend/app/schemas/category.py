from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: bool = False
    sort_order: int = 0


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None
    sort_order: Optional[int] = None


class CategoryResponse(CategoryBase):
    id: str
    created_at: Optional[datetime] = None
