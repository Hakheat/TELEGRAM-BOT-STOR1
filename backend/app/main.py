import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
from app.core.config import settings
from app.core.redis import init_redis, close_redis
from app.api.v1.router import api_v1_router
from app.bot.bot import bot, dp, setup_bot_handlers


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create all missing database tables on startup (PostgreSQL/Supabase & SQLite)
    from app.db.models import Base
    from app.core.database import engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Startup actions
    await init_redis()
    setup_bot_handlers()

    # Start scheduled broadcast polling service
    from app.services.broadcast_scheduler import start_scheduler, stop_scheduler
    scheduler_task = asyncio.create_task(start_scheduler())

    # If long polling or webhook mode setup
    import app.bot.bot as bot_module
    if not settings.TELEGRAM_WEBHOOK_URL:
        # Start bot polling in background task for local dev
        bot_module.bot_task = asyncio.create_task(dp.start_polling(bot))

    yield

    # Shutdown actions
    await stop_scheduler(scheduler_task)

    if bot_module.bot_task:
        bot_module.bot_task.cancel()
        try:
            await bot_module.bot_task
        except asyncio.CancelledError:
            pass
    await close_redis()



app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Mount uploads static directory
app_dir = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(app_dir, "static")
uploads_dir = os.path.join(static_dir, "uploads")
os.makedirs(uploads_dir, exist_ok=True)

# Copy any legacy files from app/api/static/uploads or app/app/static/uploads to app/static/uploads
for legacy_folder in [
    os.path.join(app_dir, "api", "static", "uploads"),
    os.path.join(app_dir, "app", "static", "uploads"),
]:
    if os.path.exists(legacy_folder):
        for fname in os.listdir(legacy_folder):
            src_f = os.path.join(legacy_folder, fname)
            dst_f = os.path.join(uploads_dir, fname)
            if os.path.isfile(src_f) and not os.path.exists(dst_f):
                try:
                    shutil.copy2(src_f, dst_f)
                except Exception:
                    pass

app.mount("/static", StaticFiles(directory=static_dir), name="static")

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
