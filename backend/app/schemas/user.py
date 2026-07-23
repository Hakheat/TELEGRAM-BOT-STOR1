from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field


class UserBase(BaseModel):
    telegram_id: int
    username: Optional[str] = None
    first_name: str
    last_name: Optional[str] = None
    language_code: str = "km"


class UserBalanceAdjustRequest(BaseModel):
    amount: Decimal = Field(..., description="Amount to add (positive) or deduct (negative)")
    reason: Optional[str] = "Admin Manual Adjustment"


class UserResponse(UserBase):
    id: int
    balance: Decimal
    role: str
    is_blocked: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
