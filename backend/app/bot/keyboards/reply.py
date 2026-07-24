from aiogram.types import ReplyKeyboardMarkup, KeyboardButton


def get_main_reply_keyboard(lang: str = "km") -> ReplyKeyboardMarkup:
    """Returns the persistent Khmer or English Reply Keyboard Main Menu layout."""
    if lang == "en":
        keyboard = [
            [
                KeyboardButton(text="👤 Account"),
                KeyboardButton(text="🛍️ Products"),
            ],
            [
                KeyboardButton(text="💰 Top Up"),
                KeyboardButton(text="💸 Referral Program"),
            ],
            [
                KeyboardButton(text="🌀 Order History"),
                KeyboardButton(text="💳 Payment History"),
            ],
            [
                KeyboardButton(text="🌐 Language"),
            ],
        ]
    else:
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
