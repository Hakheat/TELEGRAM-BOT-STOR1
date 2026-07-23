from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.security import create_access_token, decode_access_token
from app.core.exceptions import InvalidTokenException


class AuthService:
    @staticmethod
    def authenticate_admin(username: str, password: str) -> Optional[str]:
        if username == settings.ADMIN_USERNAME and password == settings.ADMIN_PASSWORD:
            token_data = {"sub": username, "role": "admin"}
            return create_access_token(token_data)
        return None

    @staticmethod
    def verify_token(token: str) -> Dict[str, Any]:
        payload = decode_access_token(token)
        if not payload or payload.get("role") != "admin":
            raise InvalidTokenException("Invalid or expired administrative token")
        return payload
