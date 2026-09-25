"""Authentication & User Management Router: Secure PBKDF2 Hashing & Token-Based Sessions."""

import os
import re
import secrets
import hashlib
import datetime
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Header, status
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.db_models import User, AuthToken

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

# Password hashing configuration (NIST & OWASP recommended parameters)
HASH_ALGORITHM = "sha256"
ITERATIONS = 100000
SALT_SIZE_BYTES = 16
TOKEN_EXPIRY_DAYS = 7
TOKEN_EXPIRY_DAYS_REMEMBER = 30

def hash_password(password: str) -> tuple[str, str]:
    """Generate cryptographic salt and PBKDF2-HMAC-SHA256 hash."""
    salt = os.urandom(SALT_SIZE_BYTES)
    key = hashlib.pbkdf2_hmac(
        HASH_ALGORITHM,
        password.encode("utf-8"),
        salt,
        ITERATIONS
    )
    return salt.hex(), key.hex()

def verify_password(password: str, salt_hex: str, hash_hex: str) -> bool:
    """Verify password against stored salt and hash using constant-time comparison."""
    try:
        salt = bytes.fromhex(salt_hex)
        expected_key = bytes.fromhex(hash_hex)
        key = hashlib.pbkdf2_hmac(
            HASH_ALGORITHM,
            password.encode("utf-8"),
            salt,
            ITERATIONS
        )
        return secrets.compare_digest(key, expected_key)
    except Exception:
        return False

# Pydantic Request & Response Schemas
class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    email: str = Field(..., min_length=5, max_length=150)
    password: str = Field(..., min_length=6, max_length=100)
    confirm_password: str = Field(..., min_length=6, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    location: Optional[str] = Field(None, max_length=100)
    role: Optional[str] = Field("farmer", max_length=50)

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        v_clean = v.strip().lower()
        if not EMAIL_REGEX.match(v_clean):
            raise ValueError("Invalid email address format.")
        return v_clean

class LoginRequest(BaseModel):
    email: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)
    remember_me: Optional[bool] = False

def get_current_user_from_token(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """Dependency to extract and validate the authenticated user from Bearer token."""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in."
        )

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Use 'Bearer <token>'."
        )

    token_str = parts[1]
    now_utc = datetime.datetime.now(datetime.timezone.utc)

    # Note: SQLite stores naive datetimes, so compare consistently
    auth_token = db.query(AuthToken).filter(AuthToken.token == token_str).first()
    if not auth_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token. Please log in again."
        )

    # Check expiry
    token_exp = auth_token.expires_at
    if token_exp.tzinfo is None:
        token_exp = token_exp.replace(tzinfo=datetime.timezone.utc)

    if token_exp < now_utc:
        db.delete(auth_token)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please log in again."
        )

    user = auth_token.user
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account associated with this session no longer exists."
        )

    return user

@router.post("/register")
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user account with secure password hashing."""
    # 1. Validate matching passwords
    if payload.password != payload.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match. Please re-enter matching passwords."
        )

    # 2. Check for duplicate email
    clean_email = payload.email.strip().lower()
    existing_user = db.query(User).filter(User.email == clean_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please login instead."
        )

    # 3. Hash password with cryptographic salt
    salt_hex, hash_hex = hash_password(payload.password)

    # 4. Save new user record
    new_user = User(
        full_name=payload.full_name.strip(),
        email=clean_email,
        hashed_password=hash_hex,
        salt=salt_hex,
        phone=payload.phone.strip() if payload.phone else None,
        location=payload.location.strip() if payload.location else None,
        role=payload.role.strip() if payload.role else "farmer"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "message": "Account created successfully! You can now log in with your credentials.",
        "user_id": new_user.id
    }

@router.post("/login")
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate credentials and return a secure 256-bit session token."""
    clean_email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()

    if not user or not verify_password(payload.password, user.salt, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify your credentials."
        )

    # Generate cryptographically secure token
    token_str = secrets.token_urlsafe(32)
    duration_days = TOKEN_EXPIRY_DAYS_REMEMBER if payload.remember_me else TOKEN_EXPIRY_DAYS
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    expires_at = now_utc + datetime.timedelta(days=duration_days)

    auth_token = AuthToken(
        user_id=user.id,
        token=token_str,
        expires_at=expires_at
    )

    db.add(auth_token)
    db.commit()

    return {
        "success": True,
        "token": token_str,
        "expires_at": expires_at.isoformat(),
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "location": user.location,
            "phone": user.phone
        }
    }

@router.get("/me")
def get_current_user_profile(user: User = Depends(get_current_user_from_token)):
    """Retrieve current authenticated user profile."""
    return {
        "success": True,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "location": user.location,
            "phone": user.phone,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    }

@router.post("/logout")
def logout_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Revoke session token and log out the user."""
    if authorization:
        parts = authorization.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            token_str = parts[1]
            token = db.query(AuthToken).filter(AuthToken.token == token_str).first()
            if token:
                db.delete(token)
                db.commit()

    return {
        "success": True,
        "message": "Logged out successfully."
    }
