from datetime import datetime, timezone
from bson import ObjectId
from typing import Optional, Dict, Any, List
from app.database.connection import get_database
from app.core.exceptions import NotFoundException, NovaException


class CartService:
    @classmethod
    async def get_or_create_cart(cls, user_id: Optional[str] = None, session_id: Optional[str] = None) -> Dict[str, Any]:
        db = get_database()
        cart = None
        if user_id:
            cart = await db.carts.find_one({"user_id": user_id})
        elif session_id:
            cart = await db.carts.find_one({"session_id": session_id})

        if not cart:
            now = datetime.now(timezone.utc)
            cart = {
                "user_id": user_id,
                "session_id": session_id,
                "items": [],
                "applied_coupon": None,
                "created_at": now,
                "updated_at": now
            }
            res = await db.carts.insert_one(cart)
            cart["_id"] = res.inserted_id

        return await cls._calculate_cart_totals(cart)

    @classmethod
    async def add_item(
        cls,
        product_id: str,
        quantity: int = 1,
        variant: Optional[Dict[str, Any]] = None,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        db = get_database()
        
        # Verify product & stock
        prod = None
        if ObjectId.is_valid(product_id):
            prod = await db.products.find_one({"_id": ObjectId(product_id)})
        if not prod:
            prod = await db.products.find_one({"slug": product_id})
        if not prod:
            raise NotFoundException("Product not found")

        available_stock = int(prod.get("stock_quantity", prod.get("stock", 0)))
        if available_stock < 1:
            raise NovaException(f"'{prod.get('name', 'Product')}' is currently out of stock", status_code=400)

        cart = await cls.get_or_create_cart(user_id=user_id, session_id=session_id)
        cart_doc = await db.carts.find_one({"_id": ObjectId(cart["id"])})

        items = cart_doc.get("items", [])
        prod_id_str = str(prod["_id"])

        # Check existing item with matching variant
        item_found = False
        for item in items:
            if item.get("product_id") == prod_id_str and item.get("variant") == variant:
                new_qty = item.get("quantity", 1) + quantity
                if new_qty > available_stock:
                    raise NovaException(f"Only {available_stock} units available in stock", status_code=400)
                item["quantity"] = new_qty
                item_found = True
                break

        if not item_found:
            if quantity > available_stock:
                raise NovaException(f"Only {available_stock} units available in stock", status_code=400)
            items.append({
                "id": f"item_{ObjectId()}",
                "product_id": prod_id_str,
                "quantity": quantity,
                "variant": variant
            })

        await db.carts.update_one(
            {"_id": cart_doc["_id"]},
            {"$set": {"items": items, "updated_at": datetime.now(timezone.utc)}}
        )
        cart_doc["items"] = items
        return await cls._calculate_cart_totals(cart_doc)

    @classmethod
    async def update_item_quantity(
        cls,
        item_id: str,
        quantity: int,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        db = get_database()
        cart = await cls.get_or_create_cart(user_id=user_id, session_id=session_id)
        cart_doc = await db.carts.find_one({"_id": ObjectId(cart["id"])})

        items = cart_doc.get("items", [])
        if quantity <= 0:
            items = [it for it in items if it.get("id") != item_id]
        else:
            for it in items:
                if it.get("id") == item_id:
                    # Validate product stock
                    prod = await db.products.find_one({"_id": ObjectId(it["product_id"])})
                    if prod:
                        avail = int(prod.get("stock_quantity", prod.get("stock", 0)))
                        if quantity > avail:
                            raise NovaException(f"Requested quantity exceeds available stock ({avail})", status_code=400)
                    it["quantity"] = quantity
                    break

        await db.carts.update_one(
            {"_id": cart_doc["_id"]},
            {"$set": {"items": items, "updated_at": datetime.now(timezone.utc)}}
        )
        cart_doc["items"] = items
        return await cls._calculate_cart_totals(cart_doc)

    @classmethod
    async def remove_item(
        cls,
        item_id: str,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        return await cls.update_item_quantity(item_id=item_id, quantity=0, user_id=user_id, session_id=session_id)

    @classmethod
    async def apply_coupon(
        cls,
        coupon_code: str,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        db = get_database()
        coupon = await db.coupons.find_one({"code": coupon_code.upper(), "is_active": True})
        if not coupon:
            raise NovaException("Invalid or inactive promo coupon code", status_code=400)

        cart = await cls.get_or_create_cart(user_id=user_id, session_id=session_id)
        cart_doc = await db.carts.find_one({"_id": ObjectId(cart["id"])})
        
        await db.carts.update_one(
            {"_id": cart_doc["_id"]},
            {"$set": {"applied_coupon": coupon["code"], "updated_at": datetime.now(timezone.utc)}}
        )
        cart_doc["applied_coupon"] = coupon["code"]
        return await cls._calculate_cart_totals(cart_doc)

    @classmethod
    async def _calculate_cart_totals(cls, cart_doc: Dict[str, Any]) -> Dict[str, Any]:
        db = get_database()
        items = cart_doc.get("items", [])
        calculated_items = []
        subtotal = 0.0
        total_items = 0

        for it in items:
            prod_id = it.get("product_id")
            if not ObjectId.is_valid(prod_id):
                continue
            prod = await db.products.find_one({"_id": ObjectId(prod_id)})
            if not prod:
                continue

            price = float(prod.get("price", 0.0))
            disc_price = float(prod["discount_price"]) if prod.get("discount_price") is not None else None
            effective_price = disc_price if disc_price is not None else price
            qty = int(it.get("quantity", 1))
            line_subtotal = effective_price * qty
            subtotal += line_subtotal
            total_items += qty

            images = prod.get("images", [])
            img = images[0] if images else prod.get("featured_image", "")

            calculated_items.append({
                "id": it.get("id", str(ObjectId())),
                "product_id": prod_id,
                "name": prod.get("name", prod.get("title", "")),
                "slug": prod.get("slug", ""),
                "price": price,
                "discount_price": disc_price,
                "image": img,
                "variant": it.get("variant"),
                "quantity": qty,
                "subtotal": round(line_subtotal, 2),
                "stock_available": int(prod.get("stock_quantity", prod.get("stock", 0)))
            })

        # Apply coupon if exists
        discount_amount = 0.0
        applied_code = cart_doc.get("applied_coupon")
        if applied_code:
            coupon = await db.coupons.find_one({"code": applied_code, "is_active": True})
            if coupon and subtotal >= float(coupon.get("min_order_amount", 0.0)):
                if coupon.get("discount_type") == "PERCENTAGE":
                    discount_amount = (subtotal * float(coupon.get("discount_value", 0.0))) / 100.0
                    cap = coupon.get("max_discount_cap")
                    if cap and discount_amount > float(cap):
                        discount_amount = float(cap)
                else:
                    discount_amount = float(coupon.get("discount_value", 0.0))

        discount_amount = min(discount_amount, subtotal)
        
        # Free shipping over 2000 INR, else 150 INR
        shipping_fee = 0.0 if (subtotal - discount_amount >= 2000 or subtotal == 0) else 150.0
        tax_amount = round((subtotal - discount_amount) * 0.05, 2)  # 5% luxury tax
        total = round(subtotal - discount_amount + shipping_fee + tax_amount, 2)

        return {
            "id": str(cart_doc["_id"]),
            "user_id": cart_doc.get("user_id"),
            "session_id": cart_doc.get("session_id"),
            "items": calculated_items,
            "subtotal": round(subtotal, 2),
            "discount_amount": round(discount_amount, 2),
            "coupon_code": applied_code,
            "shipping_fee": shipping_fee,
            "tax_amount": tax_amount,
            "total": total,
            "total_items": total_items
        }
