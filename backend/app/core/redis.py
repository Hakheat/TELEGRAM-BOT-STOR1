import logging
from typing import Optional, Any
import redis.asyncio as redis
from app.core.config import settings

logger = logging.getLogger("uvicorn.error")
redis_client: Optional[Any] = None


class MockRedis:
    def __init__(self):
        self.data = {}
        self.expiry = {}

    async def get(self, key: str) -> Optional[str]:
        import time
        if key in self.expiry and time.time() > self.expiry[key]:
            self.data.pop(key, None)
            self.expiry.pop(key, None)
            return None
        return self.data.get(key)

    async def set(self, key: str, value: str, px: Optional[int] = None) -> bool:
        import time
        self.data[key] = value
        if px:
            self.expiry[key] = time.time() + (px / 1000.0)
        return True

    async def ping(self):
        return True

    async def close(self):
        pass


async def init_redis():
    global redis_client
    if redis_client is None:
        try:
            client = redis.from_url(
                settings.get_redis_url,
                encoding="utf-8",
                decode_responses=True,
            )
            # Force connection check
            await client.ping()
            redis_client = client
            logger.info("Successfully connected to Redis.")
        except Exception as e:
            logger.warning(f"Could not connect to Redis: {e}. Falling back to In-Memory simulation.")
            redis_client = MockRedis()
    return redis_client


async def get_redis():
    global redis_client
    if redis_client is None:
        return await init_redis()
    return redis_client


async def close_redis():
    global redis_client
    if redis_client is not None:
        await redis_client.close()
        redis_client = None
