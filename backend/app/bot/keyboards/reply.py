from aiogram.types import ReplyKeyboardMarkup, KeyboardButton


def get_main_reply_keyboard() -> ReplyKeyboardMarkup:
    """Returns the persistent Khmer Reply Keyboard Main Menu."""
    keyboard = [
        [
            KeyboardButton(text="🛍️ ផលិតផល"),
            KeyboardButton(text="👤 គណនី"),
        ],
        [
            KeyboardButton(text="💰 បញ្ចូលថវិកា"),
            KeyboardButton(text="📜 ប្រវត្តិទិញ"),
        ],
        [
            KeyboardButton(text="🌐 ភាសា"),
            KeyboardButton(text="❓ ជំនួយ"),
        ],
    ]
    return ReplyKeyboardMarkup(
        keyboard=keyboard,
        resize_keyboard=True,
        persistent=True,
    )
