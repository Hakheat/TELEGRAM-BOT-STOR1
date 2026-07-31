import asyncio
import time
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_db, get_current_admin
from app.db.repositories.order_repository import OrderRepository
from app.db.repositories.user_repository import UserRepository
from app.db.repositories.product_repository import ProductRepository

router = APIRouter(prefix="/analytics", tags=["Analytics"])

# 3-Second In-Memory Cache to prevent database overloading from admin dashboard polling
_cache_data = None
_cache_time = 0.0
CACHE_TTL = 3.0


@router.get("/overview")
async def get_analytics_overview(
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    global _cache_data, _cache_time
    now = time.time()
    if _cache_data is not None and (now - _cache_time) < CACHE_TTL:
        return _cache_data

    order_repo = OrderRepository(db)
    user_repo = UserRepository(db)
    prod_repo = ProductRepository(db)

    metrics, total_users, low_stock_count, recent_orders = await asyncio.gather(
        order_repo.get_dashboard_metrics(),
        user_repo.count_total_users(),
        prod_repo.count_low_stock_products(threshold=5),
        order_repo.get_recent_orders_with_user(limit=10)
    )
    live_feed = []

    for order, user, prod in recent_orders:
        live_feed.append(
            {
                "order_id": order.id,
                "user": f"@{user.username}" if user.username else user.first_name,
                "product_title": prod.title,
                "amount": float(order.total_amount),
                "created_at": order.created_at.isoformat(),
            }
        )

    _cache_data = {
        "today_revenue": metrics["revenue_today"],
        "total_revenue": metrics["total_revenue"],
        "sold_today": metrics["sold_today"],
        "total_orders": metrics["total_orders"],
        "total_users": total_users,
        "low_stock_alerts": low_stock_count,
        "live_feed": live_feed,
    }
    _cache_time = now
    return _cache_data
