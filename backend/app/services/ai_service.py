import re
import json
from typing import Dict, Any, List, Optional
from bson import ObjectId
from app.database.connection import get_database
from app.core.config import settings
from app.core.logging import logger
from app.schemas.ai import AIChatResponse, AISuggestedProduct


class AIService:
    @classmethod
    async def chat(cls, message: str, conversation_history: Optional[List[Dict[str, str]]] = None) -> AIChatResponse:
        """
        Grounded AI Shopping concierge with catalog retrieval and anti-hallucination guardrails.
        """
        db = get_database()
        cursor = db.products.find({"active": {"$ne": False}}).limit(30)
        catalog_products = await cursor.to_list(length=30)

        # Parse budget if present (e.g. "under 60000", "< 50000", "below 1000", "under $500")
        budget_match = re.search(r"(?:under|below|less than|<|budget of)\s*(?:₹|\$)?\s*(\d+(?:,\d+)*)", message, re.IGNORECASE)
        budget_limit = float(budget_match.group(1).replace(",", "")) if budget_match else None

        # Filter keywords
        keywords = [w.lower() for w in re.findall(r"\b[A-Za-z0-9-]+\b", message) if len(w) > 2]

        matched_products = []
        for p in catalog_products:
            score = 0
            p_name = p.get("name", p.get("title", "")).lower()
            p_desc = p.get("description", "").lower()
            p_cat = p.get("category_slug", "").lower()
            p_tags = [t.lower() for t in p.get("tags", [])]
            price = float(p.get("discount_price") or p.get("price", 0.0))

            if budget_limit and price <= budget_limit:
                score += 5
            elif budget_limit and price > budget_limit:
                score -= 10

            for kw in keywords:
                if kw in p_name:
                    score += 4
                elif kw in p_cat:
                    score += 3
                elif kw in p_tags:
                    score += 2
                elif kw in p_desc:
                    score += 1

            if score > 0:
                matched_products.append((score, p))

        matched_products.sort(key=lambda x: x[0], reverse=True)
        top_picks = [p for _, p in matched_products[:3]]

        # If no specific matches found, provide popular/featured
        if not top_picks and catalog_products:
            top_picks = sorted(catalog_products, key=lambda x: x.get("ratings_average", 5.0), reverse=True)[:3]

        suggested = []
        for p in top_picks:
            images = p.get("images", [])
            img = images[0] if images else p.get("featured_image", "")
            suggested.append(
                AISuggestedProduct(
                    id=str(p["_id"]),
                    name=p.get("name", p.get("title", "")),
                    price=float(p.get("price", 0.0)),
                    discount_price=float(p["discount_price"]) if p.get("discount_price") is not None else None,
                    slug=p.get("slug", ""),
                    image=img,
                    reason=f"Matches your search criteria with a {p.get('average_rating', p.get('ratings_average', 5.0))}★ rating."
                )
            )

        # Build grounded response
        if top_picks:
            reply_lines = [
                f"Welcome to NOVA Concierge. Based on your inquiry ('{message}'), here are our top luxury recommendations:"
            ]
            for s in suggested:
                price_str = f"₹{s.discount_price:,.2f}" if s.discount_price else f"₹{s.price:,.2f}"
                reply_lines.append(f"• **{s.name}** ({price_str}) — {s.reason}")
            reply_lines.append("\nWould you like more details, variant specifications, or direct assistance adding any of these to your cart?")
            reply = "\n".join(reply_lines)
        else:
            reply = "I explored our catalog but couldn't find an exact match for that specific query. Please try searching for 'headphones', 'smartphones', 'audio', 'watch', or specifying a price range."

        quick_actions = ["View Top Pick", "Compare Specs", "Filter Under ₹50,000", "Speak with Human Stylist"]
        return AIChatResponse(
            reply=reply,
            suggested_products=suggested,
            quick_actions=quick_actions
        )

    @classmethod
    async def natural_search(cls, query: str) -> List[Dict[str, Any]]:
        db = get_database()
        cursor = db.products.find({"active": {"$ne": False}}).limit(20)
        items = await cursor.to_list(length=20)
        
        q_lower = query.lower()
        results = []
        for it in items:
            name = it.get("name", it.get("title", "")).lower()
            desc = it.get("description", "").lower()
            if q_lower in name or q_lower in desc:
                results.append(it)
        return results

    @classmethod
    async def recommend(cls, product_id: Optional[str] = None, category_slug: Optional[str] = None, limit: int = 4) -> List[Dict[str, Any]]:
        db = get_database()
        query: Dict[str, Any] = {"active": {"$ne": False}}
        if product_id and ObjectId.is_valid(product_id):
            query["_id"] = {"$ne": ObjectId(product_id)}
        if category_slug:
            query["category_slug"] = category_slug

        cursor = db.products.find(query).sort("ratings_average", -1).limit(limit)
        items = await cursor.to_list(length=limit)
        return items
