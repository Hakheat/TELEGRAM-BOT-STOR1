import asyncio
import logging
from typing import Optional
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from app.core.config import settings

logger = logging.getLogger("uvicorn.error")

bot = Bot(
    token=settings.BOT_TOKEN,
    default=DefaultBotProperties(parse_mode=ParseMode.HTML)
)
dp = Dispatcher(storage=MemoryStorage())

bot_task: Optional[asyncio.Task] = None


async def reload_bot(new_token: str):
    global bot_task, bot
    logger.info("Bot token reload initiated...")

    # Update settings and bot instance token
    settings.BOT_TOKEN = new_token
    bot.token = new_token

    # If the bot was previously running in long-polling mode, stop and restart it
    if bot_task and not bot_task.done():
        logger.info("Stopping existing Bot polling task...")
        bot_task.cancel()
        try:
            await bot_task
        except asyncio.CancelledError:
            logger.info("Existing Bot polling task stopped successfully.")
        except Exception as e:
            logger.error(f"Error while stopping Bot polling task: {e}")

        logger.info("Restarting Bot polling task with new token...")
        bot_task = asyncio.create_task(dp.start_polling(bot))
        logger.info("Bot polling task successfully restarted.")
    else:
        logger.info("Bot was not running in long polling mode. Token configuration updated.")



def setup_bot_handlers():
    from app.bot.middlewares.db_session import DbSessionMiddleware
    from app.bot.middlewares.auth import TelegramAuthMiddleware
    from app.bot.middlewares.rate_limit import RateLimitMiddleware

    # Register Middlewares
    dp.update.middleware(DbSessionMiddleware())
    dp.message.middleware(TelegramAuthMiddleware())
    dp.callback_query.middleware(TelegramAuthMiddleware())
    dp.message.middleware(RateLimitMiddleware())
    dp.callback_query.middleware(RateLimitMiddleware())

    # Include Handlers Routers
    from app.bot.handlers import start, products, purchase, account, topup

    dp.include_router(start.router)
    dp.include_router(products.router)
    dp.include_router(purchase.router)
    dp.include_router(account.router)
    dp.include_router(topup.router)
