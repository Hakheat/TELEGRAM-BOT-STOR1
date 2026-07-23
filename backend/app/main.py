import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.redis import init_redis, close_redis
from app.api.v1.router import api_v1_router
from app.bot.bot import bot, dp, setup_bot_handlers


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    await init_redis()
    setup_bot_handlers()

    # If long polling or webhook mode setup
    bot_task = None
    if not settings.TELEGRAM_WEBHOOK_URL:
        # Start bot polling in background task for local dev
        bot_task = asyncio.create_task(dp.start_polling(bot))

    yield

    # Shutdown actions
    if bot_task:
        bot_task.cancel()
    await close_redis()


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS middleware for Next.js Admin Dashboard frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Router
app.include_router(api_v1_router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "env": settings.ENV}
