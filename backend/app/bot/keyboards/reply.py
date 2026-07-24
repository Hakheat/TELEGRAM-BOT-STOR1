from aiogram.types import ReplyKeyboardMarkup, KeyboardButton


def get_main_reply_keyboard() -> ReplyKeyboardMarkup:
    """Returns the persistent Khmer Reply Keyboard Main Menu matching the user's screenshot layout."""
    keyboard = [
        [
            KeyboardButton(text="👤 គណនី"),
            KeyboardButton(text="🛍️ ផលិតផល"),
        ],
        [
            KeyboardButton(text="💰 បញ្ចូលទឹកប្រាក់"),
            KeyboardButton(text="💸 កម្មវិធីណែនាំ"),
        ],
        [
            KeyboardButton(text="🌀 ប្រវត្តិការបញ្ជាទិញ"),
            KeyboardButton(text="💳 ប្រវត្តិការទូទាត់"),
        ],
        [
            KeyboardButton(text="🌐 ភាសា"),
        ],
    ]
    return ReplyKeyboardMarkup(
        keyboard=keyboard,
        resize_keyboard=True,
        persistent=True,
    )
