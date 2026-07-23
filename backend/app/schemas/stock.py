from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class BulkKeyUploadPayload(BaseModel):
    product_id: int
    raw_keys_text: str = Field(..., description="Multi-line text with 1 key / account per line")


class BulkKeyUploadResponse(BaseModel):
    product_id: int
    keys_added: int
    message: str


class StockAuditItemResponse(BaseModel):
    id: int
    product_id: int
    is_sold: bool
    order_id: Optional[int] = None
    created_at: datetime
    sold_at: Optional[datetime] = None

    class Config:
        from_attributes = True
