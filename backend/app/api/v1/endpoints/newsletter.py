from typing import Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter
from app.schemas.newsletter import NewsletterSubscribeRequest
from app.database.connection import get_database

router = APIRouter(prefix="/newsletter", tags=["Newsletter"])


@router.post("/subscribe", response_model=Dict[str, Any])
async def subscribe_newsletter(req: NewsletterSubscribeRequest):
    """Subscribe email to promotional drops and notifications."""
    db = get_database()
    email_clean = req.email.lower()
    await db.newsletters.update_one(
        {"email": email_clean},
        {
            "$set": {
                "email": email_clean,
                "source": req.source,
                "is_active": True,
                "updated_at": datetime.now(timezone.utc)
            },
            "$setOnInsert": {
                "subscribed_at": datetime.now(timezone.utc)
            }
        },
        upsert=True
    )
    return {"success": True, "message": "Successfully subscribed to NOVA drops and innovations"}
