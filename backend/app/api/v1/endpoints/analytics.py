from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_db, get_current_admin
from app.db.repositories.order_repository import OrderRepository
from app.db.repositories.user_repository import UserRepository
from app.db.repositories.product_repository import ProductRepository

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview")
async def get_analytics_overview(
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    order_repo = OrderRepository(db)
    user_repo = UserRepository(db)
    prod_repo = ProductRepository(db)

    metrics = await order_repo.get_dashboard_metrics()
    total_users = await user_repo.count_total_users()
    low_stock_count = await prod_repo.count_low_stock_products(threshold=5)

    recent_orders = await order_repo.get_recent_orders_with_user(limit=10)
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

    return {
        "today_revenue": metrics["revenue_today"],
        "total_revenue": metrics["total_revenue"],
        "sold_today": metrics["sold_today"],
        "total_orders": metrics["total_orders"],
        "total_users": total_users,
        "low_stock_alerts": low_stock_count,
        "live_feed": live_feed,
    }
