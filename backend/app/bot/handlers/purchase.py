from aiogram import Router, F
from aiogram.types import CallbackQuery
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.user import User
from app.db.repositories.product_repository import ProductRepository
from app.services.purchase_service import PurchaseService
from app.bot.keyboards.inline import get_buy_confirm_keyboard
from app.core.exceptions import (
    OutOfStockException,
    InsufficientBalanceException,
    ProductNotFoundException,
)

router = Router()


@router.callback_query(F.data.startswith("buy_confirm:"))
async def buy_confirm_prompt(callback: CallbackQuery, session: AsyncSession, db_user: User):
    product_id = int(callback.data.split(":")[1])
    product_repo = ProductRepository(session)
    res = await product_repo.get_product_with_stock(product_id)

    if not res:
        await callback.answer("⚠️ មិនរកឃើញផលិតផល!", show_alert=True)
        return

    product, stock_count = res

    if stock_count <= 0:
        await callback.answer("⚠️ ស្តុកត្រូវបានលក់អស់ហើយ!", show_alert=True)
        return

    text = (
        f"<b>⚠️ បញ្ជាក់ការបញ្ជាទិញ (Order Confirmation)</b>\n\n"
        f"📦 <b>ផលិតផល:</b> {product.title}\n"
        f"💵 <b>តម្លៃត្រូវទូទាត់:</b> ${product.price:.2f}\n"
        f"💳 <b>តុល្យភាពរបស់អ្នក:</b> ${db_user.balance:.2f}\n\n"
        f"តើអ្នកពិតជាចង់បន្តការទិញផលិតផលនេះមែនទេ?"
    )

    kb = get_buy_confirm_keyboard(product.id)
    await callback.message.edit_text(text, reply_markup=kb)
    await callback.answer()


@router.callback_query(F.data == "cancel_buy")
async def cancel_buy_handler(callback: CallbackQuery):
    await callback.message.edit_text("❌ ការបញ្ជាទិញត្រូវបានបោះបង់!")
    await callback.answer()


@router.callback_query(F.data.startswith("buy_execute:"))
async def execute_purchase_handler(callback: CallbackQuery, session: AsyncSession, db_user: User):
    product_id = int(callback.data.split(":")[1])
    purchase_service = PurchaseService(session)

    try:
        order, plain_key_content = await purchase_service.execute_purchase(
            telegram_id=db_user.telegram_id,
            product_id=product_id,
        )

        delivery_text = (
            f"🎉 <b>ការទិញបានជោគជ័យ! (Purchase Successful)</b>\n\n"
            f"🧾 <b>លេខវិក្កយបត្រ:</b> <code>#{order.id}</code>\n"
            f"💰 <b>ចំនួនទឹកប្រាក់:</b> ${order.total_amount:.2f}\n\n"
            f"🔑 <b>ទិន្នន័យ/កូដផលិតផលរបស់អ្នក៖</b>\n"
            f"<code>{plain_key_content}</code>\n\n"
            f"<i>💡 អរគុណសម្រាប់ការគាំទ្រហាងរបស់យើងខ្ញុំ!</i>"
        )

        await callback.message.edit_text(delivery_text)
        await callback.answer("🎉 ប្រគល់ទំនិញជោគជ័យ!", show_alert=True)

    except OutOfStockException as e:
        await callback.answer(f"❌ {e.message}", show_alert=True)
    except InsufficientBalanceException as e:
        await callback.answer(f"⚠️ {e.message}", show_alert=True)
    except ProductNotFoundException as e:
        await callback.answer(f"⚠️ {e.message}", show_alert=True)
    except Exception as e:
        await callback.answer("⚠️ មានបញ្ហាបច្ចេកទេស ៖ សូមព្យាយាមម្តងទៀត!", show_alert=True)
