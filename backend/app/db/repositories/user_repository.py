from decimal import Decimal
from typing import List, Optional
from sqlalchemy import select, update, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.user import User
from app.db.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, session: AsyncSession):
        super().__init__(User, session)

    async def get_by_telegram_id(self, telegram_id: int) -> Optional[User]:
        stmt = select(User).where(User.telegram_id == telegram_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_telegram_id_for_update(self, telegram_id: int) -> Optional[User]:
        """Fetches user with a FOR UPDATE row lock to safely adjust balance."""
        stmt = select(User).where(User.telegram_id == telegram_id).with_for_update()
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_or_create(
        self,
        telegram_id: int,
        username: Optional[str] = None,
        first_name: str = "",
        last_name: Optional[str] = None,
        language_code: str = "km",
    ) -> User:
        user = await self.get_by_telegram_id(telegram_id)
        if not user:
            user = User(
                telegram_id=telegram_id,
                username=username,
                first_name=first_name,
                last_name=last_name,
                language_code=language_code,
                balance=Decimal("0.00"),
                role="customer",
            )
            self.session.add(user)
            await self.session.flush()
        else:
            # Update user metadata if changed
            updated = False
            if username is not None and user.username != username:
                user.username = username
                updated = True
            if first_name and user.first_name != first_name:
                user.first_name = first_name
                updated = True
            if last_name is not None and user.last_name != last_name:
                user.last_name = last_name
                updated = True
            if updated:
                await self.session.flush()
        return user

    async def add_balance(self, user_id: int, amount: Decimal) -> User:
        stmt = select(User).where(User.id == user_id).with_for_update()
        res = await self.session.execute(stmt)
        user = res.scalar_one_or_none()
        if user:
            user.balance += amount
            await self.session.flush()
        return user

    async def get_users_list(self, skip: int = 0, limit: int = 50) -> List[User]:
        stmt = select(User).order_by(User.id.desc()).offset(skip).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def count_total_users(self) -> int:
        stmt = select(func.count(User.id))
        res = await self.session.execute(stmt)
        return res.scalar_one() or 0
