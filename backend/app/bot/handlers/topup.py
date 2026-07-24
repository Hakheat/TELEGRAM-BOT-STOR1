from decimal import Decimal
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.fsm.context import FSMContext
from app.db.models.user import User
from app.bot.keyboards.inline import get_topup_preset_keyboard
from app.bot.states.topup_states import TopUpStatesGroup
from app.services.payment_service import PaymentService

router = Router()


@router.message(F.text.in_({"💰 បញ្ចូលថវិកា", "💰 បញ្ចូលទឹកប្រាក់"}))
async def topup_menu_handler(message: Message):
    text = (
        "<b>💰 បញ្ចូលថវិកាស្វ័យប្រវត្តិ 24/7 (KHQR Auto Top-up)</b>\n\n"
        "សូមជ្រើសរើសចំនួនទឹកប្រាក់ដែលអ្នកចង់បញ្ចូល ៖"
    )
    await message.answer(text, reply_markup=get_topup_preset_keyboard())


@router.callback_query(F.data == "cancel_topup")
async def cancel_topup_handler(callback: CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.edit_text("❌ បដិសេធការបញ្ចូលថវិកា!")
    await callback.answer()


@router.callback_query(F.data.startswith("topup_amt:"))
async def topup_preset_selected(callback: CallbackQuery, db_user: User):
    amount_str = callback.data.split(":")[1]
    amount = Decimal(amount_str)
    await generate_topup_qr_response(callback, db_user, amount)
    await callback.answer()


@router.callback_query(F.data == "topup_custom")
async def topup_custom_prompt(callback: CallbackQuery, state: FSMContext):
    await state.set_state(TopUpStatesGroup.waiting_for_amount)
    await callback.message.edit_text(
        "✏️ <b>សូមវាយបញ្ចូលចំនួនទឹកប្រាក់ ($) ដែលអ្នកចង់បញ្ចូល៖</b>\n"
        "<i>ឧទាហរណ៍: 2.50 ឬ 15</i>"
    )
    await callback.answer()


@router.message(TopUpStatesGroup.waiting_for_amount)
async def process_custom_topup_amount(message: Message, state: FSMContext, db_user: User):
    try:
        amount = Decimal(message.text.strip())
        if amount <= 0:
            raise ValueError()
    except Exception:
        await message.answer("⚠️ សូមវាយបញ្ចូលចំនួនលេខទឹកប្រាក់ត្រឹមត្រូវ (ឧទាហរណ៍: 5.00) ៖")
        return

    await state.clear()

    # Generate QR response
    khqr_string = PaymentService.generate_khqr_payload(db_user.telegram_id, amount)
    qr_url = f"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={khqr_string}"

    caption = (
        f"<b>🇰🇭 KHQR បញ្ចូលថវិកាស្វ័យប្រវត្តិ</b>\n\n"
        f"👤 Telegram ID: <code>{db_user.telegram_id}</code>\n"
        f"💵 ចំនួនទឹកប្រាក់: <b>${amount:.2f}</b>\n\n"
        f"📌 <b>ចំណាំ:</b> បន្ទាប់ពីលោកអ្នកបានទូទាត់ប្រាក់តាម Bakong App ឬ Mobile Banking ស្កេនរួចរាល់ ទឹកប្រាក់នឹងចូលគណនីស្វ័យប្រវត្តិ!"
    )

    await message.answer_photo(photo=qr_url, caption=caption)


async def generate_topup_qr_response(callback: CallbackQuery, db_user: User, amount: Decimal):
    khqr_string = PaymentService.generate_khqr_payload(db_user.telegram_id, amount)
    qr_url = f"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={khqr_string}"

    caption = (
        f"<b>🇰🇭 KHQR បញ្ចូលថវិកាស្វ័យប្រវត្តិ</b>\n\n"
        f"👤 Telegram ID: <code>{db_user.telegram_id}</code>\n"
        f"💵 ចំនួនទឹកប្រាក់: <b>${amount:.2f}</b>\n\n"
        f"📌 <b>ចំណាំ:</b> បន្ទាប់ពីលោកអ្នកបានទូទាត់ប្រាក់តាម Bakong App ឬ Mobile Banking ស្កេនរួចរាល់ ទឹកប្រាក់នឹងចូលគណនីស្វ័យប្រវត្តិ!"
    )

    await callback.message.delete()
    await callback.message.answer_photo(photo=qr_url, caption=caption)
