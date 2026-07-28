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
from app.bot.utils.localization import get_text

router = Router()


@router.callback_query(F.data.startswith("buy_confirm:"))
async def buy_confirm_prompt(callback: CallbackQuery, session: AsyncSession, db_user: User):
    lang = db_user.language_code or "km"
    product_id = int(callback.data.split(":")[1])
    product_repo = ProductRepository(session)
    res = await product_repo.get_product_with_stock(product_id)

    if not res:
        msg = "Product not found!" if lang == "en" else "មិនរកឃើញផលិតផល!"
        await callback.answer(f"⚠️ {msg}", show_alert=True)
        return

    product, stock_count = res

    if stock_count <= 0:
        msg = "Product out of stock!" if lang == "en" else "ស្តុកត្រូវបានលក់អស់ហើយ!"
        await callback.answer(f"⚠️ {msg}", show_alert=True)
        return

    prod_lbl = "Product" if lang == "en" else "ផលិតផល"
    price_lbl = "Price" if lang == "en" else "តម្លៃត្រូវទូទាត់"
    bal_lbl = "Your Balance" if lang == "en" else "តុល្យភាពរបស់អ្នក"

    text = (
        f"{get_text(lang, 'buy_confirm_title')}\n\n"
        f"📦 <b>{prod_lbl}:</b> {product.title}\n"
        f"💵 <b>{price_lbl}:</b> ${product.price:.2f}\n"
        f"💳 <b>{bal_lbl}:</b> ${db_user.balance:.2f}\n\n"
        f"{get_text(lang, 'buy_confirm_prompt')}"
    )

    kb = get_buy_confirm_keyboard(product.id)
    await callback.message.edit_text(text, reply_markup=kb)
    await callback.answer()


@router.callback_query(F.data == "cancel_buy")
async def cancel_buy_handler(callback: CallbackQuery, db_user: User):
    lang = db_user.language_code or "km"
    await callback.message.edit_text(get_text(lang, "order_cancelled"))
    await callback.answer()


@router.callback_query(F.data.startswith("buy_execute:"))
async def execute_purchase_handler(callback: CallbackQuery, session: AsyncSession, db_user: User):
    lang = db_user.language_code or "km"
    product_id = int(callback.data.split(":")[1])
    purchase_service = PurchaseService(session)

    try:
        order, plain_key_content = await purchase_service.execute_purchase(
            telegram_id=db_user.telegram_id,
            product_id=product_id,
        )

        delivery_text = get_text(
            lang,
            "order_success",
            order_id=order.id,
            amount=order.total_amount,
            payload=plain_key_content,
        )

        await callback.message.edit_text(delivery_text)
        alert_msg = "Purchase successful!" if lang == "en" else "ប្រគល់ទំនិញជោគជ័យ!"
        await callback.answer(f"🎉 {alert_msg}", show_alert=True)

    except OutOfStockException:
        msg = "Product out of stock!" if lang == "en" else "ស្តុកត្រូវបានលក់អស់ហើយ!"
        await callback.answer(f"❌ {msg}", show_alert=True)
    except InsufficientBalanceException:
        product_repo = ProductRepository(session)
        res = await product_repo.get_product_with_stock(product_id)
        price = res[0].price if res else 0.0
        
        text = get_text(
            lang,
            "insufficient_balance",
            price=price,
            balance=db_user.balance,
        )
        from app.bot.keyboards.inline import get_insufficient_balance_keyboard
        kb = get_insufficient_balance_keyboard(product_id, float(price), db_user.telegram_id, lang)
        
        await callback.message.edit_text(text, reply_markup=kb)
        await callback.answer()
    except ProductNotFoundException:
        msg = "Product not found!" if lang == "en" else "មិនរកឃើញផលិតផល!"
        await callback.answer(f"⚠️ {msg}", show_alert=True)
    except Exception:
        msg = "Technical error, please try again!" if lang == "en" else "មានបញ្ហាបច្ចេកទេស ៖ សូមព្យាយាមម្តងទៀត!"
        await callback.answer(f"⚠️ {msg}", show_alert=True)


@router.callback_query(F.data.startswith("show_buy_qr:"))
async def show_buy_qr_handler(callback: CallbackQuery, db_user: User):
    from decimal import Decimal
    import os
    lang = db_user.language_code or "km"
    parts = callback.data.split(":")
    product_id = int(parts[1])
    price = Decimal(parts[2])
    
    from app.services.payment_service import PaymentService
    khqr_string = PaymentService.generate_khqr_payload(db_user.telegram_id, price)
    qr_url = f"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={khqr_string}"
    
    from app.core.config import settings
    photo = qr_url
    if settings.ABA_QR_LINK:
        if settings.ABA_QR_LINK.startswith("/static/"):
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
            local_path = os.path.join(base_dir, "app", settings.ABA_QR_LINK.lstrip("/"))
            if os.path.exists(local_path):
                from aiogram.types import FSInputFile
                photo = FSInputFile(local_path)
        else:
            photo = settings.ABA_QR_LINK

    caption = get_text(
        lang,
        "direct_qr_title",
        telegram_id=db_user.telegram_id,
        price=price,
        aba_name=settings.ABA_ACCOUNT_NAME,
        aba_number=settings.ABA_ACCOUNT_NUMBER,
    )
    
    await callback.message.delete()
    await callback.message.answer_photo(photo=photo, caption=caption)
    await callback.answer()

