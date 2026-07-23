from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_db, get_current_admin
from app.services.stock_service import StockService
from app.schemas.stock import BulkKeyUploadPayload, BulkKeyUploadResponse
from app.core.exceptions import ProductNotFoundException

router = APIRouter(prefix="/stock", tags=["Stock Vault"])


@router.post("/bulk-upload", response_model=BulkKeyUploadResponse, status_code=status.HTTP_201_CREATED)
async def bulk_upload_keys(
    payload: BulkKeyUploadPayload,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    service = StockService(db)
    try:
        count = await service.bulk_upload_keys(
            product_id=payload.product_id,
            raw_text_data=payload.raw_keys_text,
        )
        return BulkKeyUploadResponse(
            product_id=payload.product_id,
            keys_added=count,
            message=f"Successfully encrypted & uploaded {count} keys into vault!",
        )
    except ProductNotFoundException as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.get("/audit/{product_id}")
async def audit_stock(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    service = StockService(db)
    stats = await service.stock_repo.get_stock_stats_by_product(product_id)
    return {"product_id": product_id, "stats": stats}
