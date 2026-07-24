import asyncio
import logging
import os
import traceback
from datetime import datetime, timezone
from sqlalchemy import select, update
from app.core.database import AsyncSessionLocal
from app.db.models.broadcast_schedule import BroadcastSchedule
from app.db.models.user import User
from app.bot.bot import bot
from aiogram.types import FSInputFile, BufferedInputFile, URLInputFile

logger = logging.getLogger("uvicorn.error")


def get_input_file(file_path: str):
    """Creates a Telegram InputFile using FSInputFile, with fallback to BufferedInputFile."""
    try:
        return FSInputFile(file_path)
    except Exception:
        with open(file_path, "rb") as f:
            return BufferedInputFile(f.read(), filename=os.path.basename(file_path))


async def run_broadcast_worker(schedule_id: int):
    """Executes a single broadcast in the background."""
    async with AsyncSessionLocal() as db:
        # Fetch the schedule
        stmt = select(BroadcastSchedule).where(BroadcastSchedule.id == schedule_id)
        res = await db.execute(stmt)
        schedule = res.scalar_one_or_none()
        if not schedule or schedule.status not in ["pending", "sending"]:
            return

        # Mark as sending
        schedule.status = "sending"
        await db.commit()

        # Fetch all active users
        stmt_users = select(User.telegram_id).where(User.is_blocked.is_(False))
        res_users = await db.execute(stmt_users)
        telegram_ids = res_users.scalars().all()

        schedule.total_targets = len(telegram_ids)
        await db.commit()

    success_count = 0
    fail_count = 0

    # Prepare title + message content
    formatted_text = schedule.message_text or ""
    if schedule.title and schedule.title.strip():
        formatted_text = f"<b>{schedule.title.strip()}</b>\n\n{formatted_text}"

    # Resolve local or remote media path if provided
    local_path = None
    is_remote_url = False
    if schedule.image_path:
        if schedule.image_path.startswith("http://") or schedule.image_path.startswith("https://"):
            is_remote_url = True
        else:
            app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            rel_path = os.path.normpath(schedule.image_path.lstrip("/\\"))
            
            target_path = os.path.join(app_dir, rel_path)
            alt_path1 = os.path.join(app_dir, "api", rel_path)
            alt_path2 = os.path.join(app_dir, "app", rel_path)

            if os.path.exists(target_path):
                local_path = target_path
            elif os.path.exists(alt_path1):
                local_path = alt_path1
            elif os.path.exists(alt_path2):
                local_path = alt_path2
            else:
                local_path = target_path

    # Process each user
    for tg_id in telegram_ids:
        try:
            if is_remote_url:
                url_path = schedule.image_path.lower()
                is_video = any(ext in url_path for ext in [".mp4", ".mov", ".avi", ".webm", ".mkv", "/video/"])
                input_file = URLInputFile(schedule.image_path)

                if is_video:
                    try:
                        await bot.send_video(
                            chat_id=tg_id,
                            video=input_file,
                            caption=formatted_text,
                            parse_mode="HTML"
                        )
                    except Exception as parse_err:
                        logger.warning(f"HTML parse failed for video caption to {tg_id}, falling back to plain text: {parse_err}")
                        await bot.send_video(
                            chat_id=tg_id,
                            video=URLInputFile(schedule.image_path),
                            caption=formatted_text,
                            parse_mode=None
                        )
                else:
                    try:
                        await bot.send_photo(
                            chat_id=tg_id,
                            photo=input_file,
                            caption=formatted_text,
                            parse_mode="HTML"
                        )
                    except Exception as parse_err:
                        logger.warning(f"HTML parse failed for photo caption to {tg_id}, falling back to plain text: {parse_err}")
                        await bot.send_photo(
                            chat_id=tg_id,
                            photo=URLInputFile(schedule.image_path),
                            caption=formatted_text,
                            parse_mode=None
                        )
            elif local_path and os.path.exists(local_path):
                is_video = any(local_path.lower().endswith(ext) for ext in [".mp4", ".mov", ".avi", ".webm", ".mkv", ".3gp"])
                input_file = get_input_file(local_path)
                
                if is_video:
                    try:
                        await bot.send_video(
                            chat_id=tg_id,
                            video=input_file,
                            caption=formatted_text,
                            parse_mode="HTML"
                        )
                    except Exception as parse_err:
                        logger.warning(f"HTML parse failed for video caption to {tg_id}, falling back to plain text: {parse_err}")
                        await bot.send_video(
                            chat_id=tg_id,
                            video=get_input_file(local_path),
                            caption=formatted_text,
                            parse_mode=None
                        )
                else:
                    try:
                        await bot.send_photo(
                            chat_id=tg_id,
                            photo=input_file,
                            caption=formatted_text,
                            parse_mode="HTML"
                        )
                    except Exception as parse_err:
                        logger.warning(f"HTML parse failed for photo caption to {tg_id}, falling back to plain text: {parse_err}")
                        await bot.send_photo(
                            chat_id=tg_id,
                            photo=get_input_file(local_path),
                            caption=formatted_text,
                            parse_mode=None
                        )
            else:
                if schedule.image_path:
                    logger.warning(f"Media file not found at {local_path}, sending text-only broadcast.")
                try:
                    await bot.send_message(
                        chat_id=tg_id,
                        text=formatted_text,
                        parse_mode="HTML"
                    )
                except Exception as parse_err:
                    logger.warning(f"HTML parse failed for message to {tg_id}, falling back to plain text: {parse_err}")
                    await bot.send_message(
                        chat_id=tg_id,
                        text=formatted_text,
                        parse_mode=None
                    )
            success_count += 1
        except Exception as e:
            logger.error(f"Failed to send broadcast to {tg_id}: {e}")
            traceback.print_exc()
            fail_count += 1

        # Delay between sends to avoid Telegram spam rate limits
        await asyncio.sleep(schedule.interval_delay)

    # Mark as completed
    async with AsyncSessionLocal() as db:
        stmt = select(BroadcastSchedule).where(BroadcastSchedule.id == schedule_id)
        res = await db.execute(stmt)
        schedule = res.scalar_one_or_none()
        if schedule:
            schedule.status = "completed"
            schedule.sent_successfully = success_count
            schedule.failed_or_blocked = fail_count
            schedule.sent_at = datetime.now(timezone.utc)
            await db.commit()
            logger.info(f"Broadcast schedule {schedule_id} completed: {success_count} success, {fail_count} failed.")


async def start_scheduler():
    """Polls database for pending scheduled broadcasts and runs them."""
    logger.info("Broadcast scheduler service started.")

    # Reset any 'sending' status back to 'pending' on startup
    try:
        async with AsyncSessionLocal() as db:
            await db.execute(
                update(BroadcastSchedule)
                .where(BroadcastSchedule.status == "sending")
                .values(status="pending")
            )
            await db.commit()
    except Exception as e:
        logger.error(f"Failed to reset stuck broadcast schedules: {e}")

    while True:
        try:
            now = datetime.now(timezone.utc)
            async with AsyncSessionLocal() as db:
                stmt = select(BroadcastSchedule).where(
                    (BroadcastSchedule.status == "pending") &
                    (BroadcastSchedule.scheduled_at <= now)
                )
                res = await db.execute(stmt)
                pending_schedules = res.scalars().all()

                for schedule in pending_schedules:
                    # Run each schedule task in the background
                    asyncio.create_task(run_broadcast_worker(schedule.id))

        except Exception as e:
            logger.error(f"Error in broadcast scheduler loop: {e}")

        await asyncio.sleep(15)  # Poll every 15 seconds


async def stop_scheduler(task: asyncio.Task):
    """Stops the scheduler loop."""
    logger.info("Stopping broadcast scheduler...")
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        logger.info("Broadcast scheduler stopped successfully.")
