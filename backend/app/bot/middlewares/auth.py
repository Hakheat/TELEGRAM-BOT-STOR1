from typing import Any, Awaitable, Callable, Dict
from aiogram import BaseMiddleware
from aiogram.types import TelegramObject, User as TelegramUser
from app.db.repositories.user_repository import UserRepository


class TelegramAuthMiddleware(BaseMiddleware):
    async def __call__(
        self,
        handler: Callable[[TelegramObject, Dict[str, Any]], Awaitable[Any]],
        event: TelegramObject,
        data: Dict[str, Any],
    ) -> Any:
        session = data.get("session")
        event_user: TelegramUser = data.get("event_from_user")

        if session and event_user:
            user_repo = UserRepository(session)
            db_user = await user_repo.get_or_create(
                telegram_id=event_user.id,
                username=event_user.username,
                first_name=event_user.first_name or "",
                last_name=event_user.last_name,
                language_code=event_user.language_code or "km",
            )
            data["db_user"] = db_user

        return await handler(event, data)
