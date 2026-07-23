from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from aiogram.types import Update
from app.api.dependencies import get_db
from app.schemas.payment import KHQRWebhookPayload, KHQRWebhookResponse
from app.services.payment_service import PaymentService
from app.bot.bot import bot, dp

router = APIRouter(tags=["Webhooks"])


@router.post("/webhooks/khqr", response_model=KHQRWebhookResponse)
async def khqr_webhook(
    payload: KHQRWebhookPayload,
    db: AsyncSession = Depends(get_db),
):
    """
    Receives automated KHQR payment notification from Bank Gateway,
    credits user balance in real-time, and notifies customer via Telegram Bot!
    """
    payment_service = PaymentService(db)
    try:
        tx, new_balance = await payment_service.process_khqr_topup(
            telegram_id=payload.telegram_id,
            amount=payload.amount,
            khqr_md5=payload.khqr_md5,
        )

        # Notify user on Telegram
        try:
            notification_msg = (
                f"🎉 <b>បញ្ចូលថវិកាបានជោគជ័យ! (Top-up Successful)</b>\n\n"
                f"💵 <b>ចំនួន:</b> ${payload.amount:.2f}\n"
                f"💳 <b>តុល្យភាពថ្មី:</b> ${new_balance:.2f}\n"
                f"🧾 <b>Transaction:</b> <code>#{tx.id}</code>\n\n"
                f"អរគុណសម្រាប់ការប្រើប្រាស់សេវាកម្ម!"
            )
            await bot.send_message(chat_id=payload.telegram_id, text=notification_msg)
        except Exception:
            pass  # User might have blocked the bot

        return KHQRWebhookResponse(
            success=True,
            new_balance=new_balance,
            transaction_id=tx.id,
            message="User balance credited successfully",
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server processing error")


@router.post("/telegram/webhook")
async def telegram_webhook(request: Request):
    """Handles incoming Telegram bot updates via Webhook."""
    data = await request.json()
    update = Update.model_validate(data, context={"bot": bot})
    await dp.feed_update(bot, update)
    return {"status": "ok"}
