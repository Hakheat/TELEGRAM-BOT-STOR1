from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from app.core.config import settings

bot = Bot(
    token=settings.BOT_TOKEN,
    default=DefaultBotProperties(parse_mode=ParseMode.HTML)
)
dp = Dispatcher(storage=MemoryStorage())


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
