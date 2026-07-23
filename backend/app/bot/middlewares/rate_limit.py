import time
from typing import Any, Awaitable, Callable, Dict
from aiogram import BaseMiddleware
from aiogram.types import TelegramObject, User, CallbackQuery, Message
from app.core.redis import get_redis


class RateLimitMiddleware(BaseMiddleware):
    def __init__(self, limit_seconds: float = 1.0):
        self.limit_seconds = limit_seconds

    async def __call__(
        self,
        handler: Callable[[TelegramObject, Dict[str, Any]], Awaitable[Any]],
        event: TelegramObject,
        data: Dict[str, Any],
    ) -> Any:
        user: User = data.get("event_from_user")
        if not user:
            return await handler(event, data)

        redis_client = await get_redis()
        rate_key = f"rate_limit:{user.id}"

        # Check existing timestamp
        last_request_time = await redis_client.get(rate_key)
        now = time.time()

        if last_request_time and (now - float(last_request_time)) < self.limit_seconds:
            # Throttling trigger
            if isinstance(event, CallbackQuery):
                await event.answer("⚠️ សូមកុំចុចប៊ូតុងលឿនពេក! (Too fast)", show_alert=True)
            elif isinstance(event, Message):
                await event.answer("⚠️ សូមមេត្តារង់ចាំបន្តិចមុនផ្ញើសារបន្ទាប់!")
            return None

        # Set new timestamp in Redis with expiry
        await redis_client.set(rate_key, str(now), px=int(self.limit_seconds * 1000))
        return await handler(event, data)
