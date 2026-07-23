from datetime import datetime, timezone, timedelta
from decimal import Decimal
from typing import List, Optional, Tuple
from sqlalchemy import select, func, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.order import Order, OrderItem
from app.db.models.user import User
from app.db.models.product import Product
from app.db.repositories.base import BaseRepository


class OrderRepository(BaseRepository[Order]):
    def __init__(self, session: AsyncSession):
        super().__init__(Order, session)

    async def create_order_with_item(
        self,
        user_id: int,
        product_id: int,
        unit_price: Decimal,
        delivered_payload: str,
    ) -> Order:
        order = Order(
            user_id=user_id,
            total_amount=unit_price,
            status="COMPLETED",
        )
        self.session.add(order)
        await self.session.flush()

        item = OrderItem(
            order_id=order.id,
            product_id=product_id,
            unit_price=unit_price,
            delivered_payload=delivered_payload,
        )
        self.session.add(item)
        await self.session.flush()
        return order

    async def get_user_orders(self, user_id: int, limit: int = 20) -> List[Order]:
        stmt = (
            select(Order)
            .options(selectinload(Order.items).selectinload(OrderItem.product))
            .where(Order.user_id == user_id)
            .order_by(Order.id.desc())
            .limit(limit)
        )
        res = await self.session.execute(stmt)
        return list(res.scalars().all())

    async def get_recent_orders_with_user(self, limit: int = 10) -> List[Tuple[Order, User, Product]]:
        stmt = (
            select(Order, User, Product)
            .join(User, Order.user_id == User.id)
            .join(OrderItem, OrderItem.order_id == Order.id)
            .join(Product, OrderItem.product_id == Product.id)
            .order_by(Order.id.desc())
            .limit(limit)
        )
        res = await self.session.execute(stmt)
        return list(res.all())

    async def get_all_orders_paginated(self, skip: int = 0, limit: int = 50) -> List[Order]:
        stmt = (
            select(Order)
            .options(
                selectinload(Order.user),
                selectinload(Order.items).selectinload(OrderItem.product),
            )
            .order_by(Order.id.desc())
            .offset(skip)
            .limit(limit)
        )
        res = await self.session.execute(stmt)
        return list(res.scalars().all())

    async def get_dashboard_metrics(self) -> dict:
        now = datetime.now(timezone.utc)
        today_start = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)

        # Revenue today
        stmt_rev_today = select(func.sum(Order.total_amount)).where(
            Order.created_at >= today_start,
            Order.status == "COMPLETED",
        )
        rev_today_res = await self.session.execute(stmt_rev_today)
        revenue_today = rev_today_res.scalar_one() or Decimal("0.00")

        # Total revenue all time
        stmt_rev_total = select(func.sum(Order.total_amount)).where(Order.status == "COMPLETED")
        rev_total_res = await self.session.execute(stmt_rev_total)
        total_revenue = rev_total_res.scalar_one() or Decimal("0.00")

        # Orders sold today
        stmt_sold_today = select(func.count(Order.id)).where(
            Order.created_at >= today_start,
            Order.status == "COMPLETED",
        )
        sold_today_res = await self.session.execute(stmt_sold_today)
        sold_today = sold_today_res.scalar_one() or 0

        # Total orders all time
        stmt_sold_total = select(func.count(Order.id)).where(Order.status == "COMPLETED")
        sold_total_res = await self.session.execute(stmt_sold_total)
        total_orders = sold_total_res.scalar_one() or 0

        return {
            "revenue_today": float(revenue_today),
            "total_revenue": float(total_revenue),
            "sold_today": sold_today,
            "total_orders": total_orders,
        }
