from aiogram import Router, F
from aiogram.filters import CommandStart, Command
from aiogram.types import Message
from app.db.models.user import User
from app.bot.keyboards.reply import get_main_reply_keyboard

router = Router()


@router.message(CommandStart())
async def start_handler(message: Message, db_user: User):
    welcome_text = (
        f"👋 សួស្ដី <b>{message.from_user.first_name}</b>!\n\n"
        f"សូមស្វាគមន៍មកកាន់ <b>Store Manager Digital Bot</b> 🛍️\n"
        f"ហាងលក់អាខោន និង License Keys ឌីជីថលស្វ័យប្រវត្តិ 24/7!\n\n"
        f"💵 តុល្យភាពបច្ចុប្បន្ន: <b>${db_user.balance:.2f}</b>\n"
        f"🆔 Telegram ID: <code>{db_user.telegram_id}</code>\n\n"
        f"សូមជ្រើសរើសម៉ឺនុយខាងក្រោមដើម្បីចាប់ផ្តើម៖"
    )
    await message.answer(welcome_text, reply_markup=get_main_reply_keyboard())


@router.message(Command("help"))
@router.message(F.text == "❓ ជំនួយ")
async def help_handler(message: Message):
    help_text = (
        "<b>❓ មជ្ឈមណ្ឌលជំនួយ (Support & Help)</b>\n\n"
        "• <b>🛍️ ផលិតផល:</b> មើលបញ្ជីអាខោន/License Keys ដែលមានលក់\n"
        "• <b>💰 បញ្ចូលថវិកា:</b> បញ្ចូលទឹកប្រាក់តាមរយៈ KHQR ស្វ័យប្រវត្តិ\n"
        "• <b>📜 ប្រវត្តិទិញ:</b> ពិនិត្យមើលកូដ/អាខោនដែលបានទិញរួច\n\n"
        "📞 ទំនាក់ទំនងផ្នែកសេវាអតិថិជន: @StoreSupportAdmin"
    )
    await message.answer(help_text)


@router.message(F.text == "🌐 ភាសា")
async def language_handler(message: Message):
    await message.answer("🌐 ប្រព័ន្ធកំពុងប្រើប្រាស់ <b>ភាសាខ្មែរ (Khmer)</b> ជាភាសាដើម។")
