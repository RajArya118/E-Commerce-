from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime


class ProductVariant(BaseModel):
    name: str
    options: List[str] = []


class ProductBase(BaseModel):
    name: str
    slug: str
    description: str
    short_description: Optional[str] = None
    category_id: Optional[str] = None
    category_slug: Optional[str] = None
    brand: str = "NOVA"
    price: float = Field(..., ge=0)
    discount_price: Optional[float] = None
    SKU: str
    stock_quantity: int = Field(default=0, ge=0)
    images: List[str] = []
    variants: List[ProductVariant] = []
    specifications: Dict[str, Any] = {}
    average_rating: float = 5.0
    review_count: int = 0
    featured: bool = False
    trending: bool = False
    active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    category_id: Optional[str] = None
    category_slug: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[float] = None
    discount_price: Optional[float] = None
    SKU: Optional[str] = None
    stock_quantity: Optional[int] = None
    images: Optional[List[str]] = None
    variants: Optional[List[ProductVariant]] = None
    specifications: Optional[Dict[str, Any]] = None
    average_rating: Optional[float] = None
    review_count: Optional[int] = None
    featured: Optional[bool] = None
    trending: Optional[bool] = None
    active: Optional[bool] = None


class ProductResponse(ProductBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ProductListResponse(BaseModel):
    products: List[ProductResponse]
    total: int
    page: int
    limit: int
    total_pages: int
