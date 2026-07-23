from aiogram import Router, F
from aiogram.types import Message
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.user import User
from app.db.repositories.order_repository import OrderRepository

router = Router()


@router.message(F.text == "👤 គណនី")
async def user_account_handler(message: Message, db_user: User):
    text = (
        f"<b>👤 ព័ត៌មានគណនីរបស់អ្នក (Account Overview)</b>\n\n"
        f"🆔 <b>Telegram ID:</b> <code>{db_user.telegram_id}</code>\n"
        f"👤 <b>ឈ្មោះ:</b> {db_user.first_name} {db_user.last_name or ''}\n"
        f"🏷️ <b>Username:</b> @{db_user.username or 'N/A'}\n"
        f"💵 <b>តុល្យភាព (Balance):</b> <code>${db_user.balance:.2f}</code>\n"
        f"📅 <b>កាលបរិច្ឆេទចូលរួម:</b> {db_user.created_at.strftime('%Y-%m-%d')}\n"
    )
    await message.answer(text)


@router.message(F.text == "📜 ប្រវត្តិទិញ")
async def purchase_history_handler(message: Message, session: AsyncSession, db_user: User):
    order_repo = OrderRepository(session)
    orders = await order_repo.get_user_orders(user_id=db_user.id, limit=10)

    if not orders:
        await message.answer("📜 អ្នកមិនទាន់មានប្រវត្តិបញ្ជាទិញនៅឡើយទេ។")
        return

    history_lines = ["<b>📜 ប្រវត្តិបញ្ជាទិញ ១០ លើកចុងក្រោយ៖</b>\n"]
    for idx, order in enumerate(orders, 1):
        item_names = [item.product.title if item.product else "Product" for item in order.items]
        prod_str = ", ".join(item_names)
        date_str = order.created_at.strftime("%Y-%m-%d %H:%M")

        # Get key delivered string
        delivered_str = ""
        if order.items and order.items[0].delivered_payload:
            delivered_str = f"\n   🔑 K: <code>{order.items[0].delivered_payload}</code>"

        history_lines.append(
            f"<b>{idx}. #{order.id}</b> | {prod_str}\n"
            f"   💰 ${order.total_amount:.2f} | 📅 {date_str}"
            f"{delivered_str}\n"
        )

    await message.answer("\n".join(history_lines))
