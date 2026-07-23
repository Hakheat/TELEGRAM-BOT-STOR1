from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_db, get_current_admin
from app.db.models.user import User
from app.bot.bot import bot

router = APIRouter(prefix="/broadcast", tags=["Broadcast Engine"])


class BroadcastPayload(BaseModel):
    message_text: str = Field(..., description="HTML or plain text broadcast message content")


@router.post("")
async def send_broadcast(
    payload: BroadcastPayload,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    stmt = select(User.telegram_id).where(User.is_blocked.is_(False))
    res = await db.execute(stmt)
    telegram_ids = res.scalars().all()

    success_count = 0
    fail_count = 0

    for tg_id in telegram_ids:
        try:
            await bot.send_message(chat_id=tg_id, text=payload.message_text)
            success_count += 1
        except Exception:
            fail_count += 1

    return {
        "total_targets": len(telegram_ids),
        "sent_successfully": success_count,
        "failed_or_blocked": fail_count,
        "message": f"Broadcast delivered to {success_count} users.",
    }
