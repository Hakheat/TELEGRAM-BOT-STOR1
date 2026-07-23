import base64
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
import jwt
from cryptography.fernet import Fernet
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")


# Password Utilities
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# JWT Utilities
def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None


# Digital Key Content Encryption (AES-Fernet)
def _get_fernet_cipher() -> Fernet:
    key = settings.KEY_ENCRYPTION_KEY.encode()
    # Fernet requires 32 url-safe base64-encoded bytes. If provided key isn't standard length, format it safely.
    if len(key) != 44:
        key = base64.urlsafe_b64encode(key.ljust(32, b"0")[:32])
    return Fernet(key)


def encrypt_key_content(plain_text: str) -> str:
    """Encrypts plain text digital item key/credential string."""
    cipher = _get_fernet_cipher()
    encrypted_bytes = cipher.encrypt(plain_text.encode("utf-8"))
    return encrypted_bytes.decode("utf-8")


def decrypt_key_content(encrypted_text: str) -> str:
    """Decrypts AES-Fernet encrypted digital key content string."""
    cipher = _get_fernet_cipher()
    decrypted_bytes = cipher.decrypt(encrypted_text.encode("utf-8"))
    return decrypted_bytes.decode("utf-8")
