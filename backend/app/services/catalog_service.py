from datetime import datetime, timezone
from bson import ObjectId
from typing import Optional, List, Dict, Any
from app.database.connection import get_database
from app.core.exceptions import NotFoundException, NovaException
from app.schemas.product import ProductCreate, ProductUpdate
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.schemas.review import ReviewCreate


class CatalogService:
    @staticmethod
    def _serialize_product(p: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "id": str(p["_id"]),
            "name": p.get("name", p.get("title", "")),
            "slug": p.get("slug", ""),
            "description": p.get("description", ""),
            "short_description": p.get("short_description", p.get("subtitle", "")),
            "category_id": str(p.get("category_id")) if p.get("category_id") else None,
            "category_slug": p.get("category_slug", ""),
            "brand": p.get("brand", "NOVA"),
            "price": float(p.get("price", 0.0)),
            "discount_price": float(p["discount_price"]) if p.get("discount_price") is not None else (float(p["compare_at_price"]) if p.get("compare_at_price") is not None else None),
            "SKU": p.get("SKU", p.get("sku", "")),
            "stock_quantity": int(p.get("stock_quantity", p.get("stock", 0))),
            "images": p.get("images", [p.get("featured_image")] if p.get("featured_image") else []),
            "variants": p.get("variants", []),
            "specifications": p.get("specifications", p.get("attributes", {})),
            "average_rating": float(p.get("average_rating", p.get("ratings_average", 5.0))),
            "review_count": int(p.get("review_count", p.get("reviews_count", 0))),
            "featured": bool(p.get("featured", p.get("is_featured", False))),
            "trending": bool(p.get("trending", p.get("is_trending", False))),
            "active": bool(p.get("active", True)),
            "created_at": p.get("created_at"),
            "updated_at": p.get("updated_at")
        }

    @staticmethod
    def _serialize_category(c: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "id": str(c["_id"]),
            "name": c.get("name", ""),
            "slug": c.get("slug", ""),
            "description": c.get("description", ""),
            "image_url": c.get("image_url", ""),
            "is_featured": c.get("is_featured", False),
            "sort_order": c.get("sort_order", 0),
            "created_at": c.get("created_at")
        }

    @classmethod
    async def get_products(
        cls,
        page: int = 1,
        limit: int = 12,
        category: Optional[str] = None,
        search: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        sort_by: Optional[str] = "popular",
        featured_only: bool = False,
        trending_only: bool = False,
    ) -> Dict[str, Any]:
        db = get_database()
        query: Dict[str, Any] = {"active": {"$ne": False}}

        if category:
            query["category_slug"] = category

        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"brand": {"$regex": search, "$options": "i"}},
                {"tags": {"$in": [search.lower()]}}
            ]

        if min_price is not None or max_price is not None:
            price_filter = {}
            if min_price is not None:
                price_filter["$gte"] = float(min_price)
            if max_price is not None:
                price_filter["$lte"] = float(max_price)
            query["price"] = price_filter

        if featured_only:
            query["$or"] = [{"featured": True}, {"is_featured": True}]

        if trending_only:
            query["$or"] = [{"trending": True}, {"is_trending": True}]

        # Sorting
        sort_field = [("created_at", -1)]
        if sort_by == "price_asc":
            sort_field = [("price", 1)]
        elif sort_by == "price_desc":
            sort_field = [("price", -1)]
        elif sort_by == "rating":
            sort_field = [("average_rating", -1), ("ratings_average", -1)]
        elif sort_by == "newest":
            sort_field = [("created_at", -1)]
        elif sort_by == "popular":
            sort_field = [("review_count", -1), ("reviews_count", -1)]

        skip = (page - 1) * limit
        total = await db.products.count_documents(query)
        cursor = db.products.find(query).sort(sort_field).skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)

        total_pages = (total + limit - 1) // limit if limit > 0 else 1

        return {
            "products": [cls._serialize_product(p) for p in items],
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages
        }

    @classmethod
    async def get_product_by_id_or_slug(cls, id_or_slug: str) -> Dict[str, Any]:
        db = get_database()
        p = None
        if ObjectId.is_valid(id_or_slug):
            p = await db.products.find_one({"_id": ObjectId(id_or_slug)})
        if not p:
            p = await db.products.find_one({"slug": id_or_slug})
        if not p:
            raise NotFoundException("Product not found")
        return cls._serialize_product(p)

    @classmethod
    async def create_product(cls, product_in: ProductCreate) -> Dict[str, Any]:
        db = get_database()
        existing = await db.products.find_one({"slug": product_in.slug})
        if existing:
            raise NovaException(f"Product with slug '{product_in.slug}' already exists", status_code=409)
        
        now = datetime.now(timezone.utc)
        doc = product_in.model_dump()
        doc["created_at"] = now
        doc["updated_at"] = now
        if doc.get("category_id") and ObjectId.is_valid(doc["category_id"]):
            doc["category_id"] = ObjectId(doc["category_id"])

        res = await db.products.insert_one(doc)
        doc["_id"] = res.inserted_id
        return cls._serialize_product(doc)

    @classmethod
    async def update_product(cls, id_str: str, update_in: ProductUpdate) -> Dict[str, Any]:
        db = get_database()
        if not ObjectId.is_valid(id_str):
            raise NotFoundException("Invalid product ID")

        update_data = {k: v for k, v in update_in.model_dump().items() if v is not None}
        if not update_data:
            return await cls.get_product_by_id_or_slug(id_str)

        update_data["updated_at"] = datetime.now(timezone.utc)
        if update_data.get("category_id") and ObjectId.is_valid(update_data["category_id"]):
            update_data["category_id"] = ObjectId(update_data["category_id"])

        res = await db.products.update_one({"_id": ObjectId(id_str)}, {"$set": update_data})
        if res.matched_count == 0:
            raise NotFoundException("Product not found")

        return await cls.get_product_by_id_or_slug(id_str)

    @classmethod
    async def delete_product(cls, id_str: str) -> bool:
        db = get_database()
        if not ObjectId.is_valid(id_str):
            raise NotFoundException("Invalid product ID")
        res = await db.products.delete_one({"_id": ObjectId(id_str)})
        if res.deleted_count == 0:
            raise NotFoundException("Product not found")
        return True

    # Categories
    @classmethod
    async def get_categories(cls) -> List[Dict[str, Any]]:
        db = get_database()
        cursor = db.categories.find({}).sort("sort_order", 1)
        cats = await cursor.to_list(length=100)
        return [cls._serialize_category(c) for c in cats]

    @classmethod
    async def create_category(cls, cat_in: CategoryCreate) -> Dict[str, Any]:
        db = get_database()
        existing = await db.categories.find_one({"slug": cat_in.slug})
        if existing:
            raise NovaException(f"Category with slug '{cat_in.slug}' already exists", status_code=409)
        now = datetime.now(timezone.utc)
        doc = cat_in.model_dump()
        doc["created_at"] = now
        res = await db.categories.insert_one(doc)
        doc["_id"] = res.inserted_id
        return cls._serialize_category(doc)

    @classmethod
    async def update_category(cls, id_str: str, update_in: CategoryUpdate) -> Dict[str, Any]:
        db = get_database()
        if not ObjectId.is_valid(id_str):
            raise NotFoundException("Invalid category ID")
        data = {k: v for k, v in update_in.model_dump().items() if v is not None}
        res = await db.categories.update_one({"_id": ObjectId(id_str)}, {"$set": data})
        if res.matched_count == 0:
            raise NotFoundException("Category not found")
        cat = await db.categories.find_one({"_id": ObjectId(id_str)})
        return cls._serialize_category(cat)

    @classmethod
    async def delete_category(cls, id_str: str) -> bool:
        db = get_database()
        if not ObjectId.is_valid(id_str):
            raise NotFoundException("Invalid category ID")
        res = await db.categories.delete_one({"_id": ObjectId(id_str)})
        if res.deleted_count == 0:
            raise NotFoundException("Category not found")
        return True

    # Reviews
    @classmethod
    async def get_product_reviews(cls, product_id: str) -> List[Dict[str, Any]]:
        db = get_database()
        cursor = db.reviews.find({"product_id": product_id}).sort("created_at", -1)
        reviews = await cursor.to_list(length=100)
        return [{
            "id": str(r["_id"]),
            "product_id": r["product_id"],
            "user_id": str(r.get("user_id", "")),
            "user_name": r.get("user_name", "Verified Customer"),
            "rating": r.get("rating", 5),
            "title": r.get("title", ""),
            "comment": r.get("comment", ""),
            "is_verified_buyer": r.get("is_verified_buyer", True),
            "created_at": r.get("created_at", datetime.now(timezone.utc))
        } for r in reviews]

    @classmethod
    async def add_review(cls, product_id: str, review_in: ReviewCreate, user_id: str, user_name: str) -> Dict[str, Any]:
        db = get_database()
        # Verify product exists
        product = await db.products.find_one({"$or": [{"_id": ObjectId(product_id) if ObjectId.is_valid(product_id) else None}, {"slug": product_id}]})
        if not product:
            raise NotFoundException("Product not found")

        prod_id_str = str(product["_id"])
        now = datetime.now(timezone.utc)
        doc = {
            "product_id": prod_id_str,
            "user_id": user_id,
            "user_name": user_name,
            "rating": review_in.rating,
            "title": review_in.title,
            "comment": review_in.comment,
            "is_verified_buyer": True,
            "created_at": now
        }
        res = await db.reviews.insert_one(doc)
        
        # Recalculate average rating
        pipeline = [
            {"$match": {"product_id": prod_id_str}},
            {"$group": {"_id": "$product_id", "avg_rating": {"$avg": "$rating"}, "count": {"$sum": 1}}}
        ]
        agg = await db.reviews.aggregate(pipeline).to_list(1)
        if agg:
            new_avg = round(agg[0]["avg_rating"], 1)
            new_count = agg[0]["count"]
            await db.products.update_one(
                {"_id": product["_id"]},
                {"$set": {"average_rating": new_avg, "ratings_average": new_avg, "review_count": new_count, "reviews_count": new_count}}
            )

        doc["id"] = str(res.inserted_id)
        return doc
