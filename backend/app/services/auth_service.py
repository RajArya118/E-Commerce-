from datetime import datetime, timezone
from bson import ObjectId
from typing import Optional, Dict, Any
from app.database.connection import get_database
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.core.exceptions import UnauthorizedException, NovaException, NotFoundException
from app.schemas.user import UserRegister, UserLogin, AddressBase


class AuthService:
    @staticmethod
    async def register(user_in: UserRegister) -> Dict[str, Any]:
        db = get_database()
        existing = await db.users.find_one({"email": user_in.email.lower()})
        if existing:
            raise NovaException("User with this email already exists", status_code=409, error_code="EMAIL_EXISTS")
        
        now = datetime.now(timezone.utc)
        user_doc = {
            "email": user_in.email.lower(),
            "password_hash": hash_password(user_in.password),
            "full_name": user_in.full_name,
            "role": "customer",
            "phone": user_in.phone or "",
            "is_active": True,
            "addresses": [],
            "created_at": now,
            "updated_at": now
        }
        res = await db.users.insert_one(user_doc)
        user_id = str(res.inserted_id)
        
        token_data = {"sub": user_id, "email": user_doc["email"], "role": user_doc["role"]}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": user_doc["email"],
                "full_name": user_doc["full_name"],
                "role": user_doc["role"],
                "phone": user_doc["phone"],
                "is_active": user_doc["is_active"],
                "addresses": [],
                "created_at": now
            }
        }

    @staticmethod
    async def login(credentials: UserLogin) -> Dict[str, Any]:
        db = get_database()
        user = await db.users.find_one({"email": credentials.email.lower()})
        if not user or not verify_password(credentials.password, user.get("password_hash", "")):
            raise UnauthorizedException("Invalid email or password")
        
        if not user.get("is_active", True):
            raise UnauthorizedException("Account has been deactivated")
        
        user_id = str(user["_id"])
        token_data = {"sub": user_id, "email": user["email"], "role": user.get("role", "customer")}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": user["email"],
                "full_name": user["full_name"],
                "role": user.get("role", "customer"),
                "phone": user.get("phone", ""),
                "is_active": user.get("is_active", True),
                "addresses": user.get("addresses", []),
                "created_at": user.get("created_at")
            }
        }

    @staticmethod
    async def refresh_tokens(refresh_token: str) -> Dict[str, Any]:
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise UnauthorizedException("Invalid or expired refresh token")
        
        user_id = payload.get("sub")
        db = get_database()
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise UnauthorizedException("User not found")
        
        token_data = {"sub": str(user["_id"]), "email": user["email"], "role": user.get("role", "customer")}
        new_access = create_access_token(token_data)
        new_refresh = create_refresh_token(token_data)
        
        return {
            "access_token": new_access,
            "refresh_token": new_refresh,
            "token_type": "bearer",
            "user": {
                "id": str(user["_id"]),
                "email": user["email"],
                "full_name": user["full_name"],
                "role": user.get("role", "customer"),
                "phone": user.get("phone", ""),
                "is_active": user.get("is_active", True),
                "addresses": user.get("addresses", []),
                "created_at": user.get("created_at")
            }
        }

    @staticmethod
    async def get_user_by_id(user_id: str) -> Dict[str, Any]:
        db = get_database()
        try:
            user = await db.users.find_one({"_id": ObjectId(user_id)})
        except Exception:
            raise NotFoundException("User not found")
            
        if not user:
            raise NotFoundException("User not found")
            
        return {
            "id": str(user["_id"]),
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user.get("role", "customer"),
            "phone": user.get("phone", ""),
            "is_active": user.get("is_active", True),
            "addresses": user.get("addresses", []),
            "created_at": user.get("created_at")
        }

    @staticmethod
    async def update_profile(user_id: str, full_name: Optional[str] = None, phone: Optional[str] = None) -> Dict[str, Any]:
        db = get_database()
        update_data = {"updated_at": datetime.now(timezone.utc)}
        if full_name:
            update_data["full_name"] = full_name
        if phone is not None:
            update_data["phone"] = phone
            
        await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
        return await AuthService.get_user_by_id(user_id)

    @staticmethod
    async def add_or_update_address(user_id: str, address: AddressBase) -> Dict[str, Any]:
        db = get_database()
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise NotFoundException("User not found")
            
        addresses = user.get("addresses", [])
        addr_dict = address.model_dump()
        if not addr_dict.get("id"):
            addr_dict["id"] = f"addr_{ObjectId()}"
            
        if address.is_default:
            for a in addresses:
                a["is_default"] = False
                
        existing_idx = next((i for i, a in enumerate(addresses) if a.get("id") == addr_dict["id"]), -1)
        if existing_idx >= 0:
            addresses[existing_idx] = addr_dict
        else:
            addresses.append(addr_dict)
            
        await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"addresses": addresses}})
        return await AuthService.get_user_by_id(user_id)
