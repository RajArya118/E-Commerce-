from pydantic import BaseModel, EmailStr


class NewsletterSubscribeRequest(BaseModel):
    email: EmailStr
    source: str = "footer"


class NewsletterResponse(BaseModel):
    success: bool
    message: str
