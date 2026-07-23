from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field


class KHQRWebhookPayload(BaseModel):
    telegram_id: int
    amount: Decimal = Field(..., gt=0)
    khqr_md5: str = Field(..., max_length=64)
    signature: Optional[str] = None


class KHQRWebhookResponse(BaseModel):
    success: bool
    new_balance: Decimal
    transaction_id: int
    message: str
