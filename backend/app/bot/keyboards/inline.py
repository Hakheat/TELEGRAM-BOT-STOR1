from typing import List, Tuple
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from app.db.models.product import Category, Product


def get_categories_inline_keyboard(categories: List[Category]) -> InlineKeyboardMarkup:
    builder: List[List[InlineKeyboardButton]] = []
    for cat in categories:
        icon = cat.icon or "📦"
        button_text = f"{icon} {cat.name}"
        builder.append([InlineKeyboardButton(text=button_text, callback_data=f"cat:{cat.id}")])

    return InlineKeyboardMarkup(inline_keyboard=builder)


def get_products_paginated_keyboard(
    products_with_stock: List[Tuple[Product, int]],
    category_id: int,
    page: int = 1,
    per_page: int = 5,
) -> InlineKeyboardMarkup:
    """
    Renders product items with dynamic page pagination controls.
    """
    total_items = len(products_with_stock)
    total_pages = max(1, (total_items + per_page - 1) // per_page)
    page = max(1, min(page, total_pages))

    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    current_items = products_with_stock[start_idx:end_idx]

    rows: List[List[InlineKeyboardButton]] = []

    # Product list buttons
    for prod, stock in current_items:
        stock_badge = f"🟢 ({stock})" if stock > 0 else "🔴 (អស់ស្តុក)"
        btn_text = f"{prod.title} - ${prod.price:.2f} {stock_badge}"
        rows.append([InlineKeyboardButton(text=btn_text, callback_data=f"prod:{prod.id}")])

    # Pagination navigation controls
    nav_row: List[InlineKeyboardButton] = []
    if page > 1:
        nav_row.append(InlineKeyboardButton(text="⬅️ មុន", callback_data=f"cat_page:{category_id}:{page - 1}"))

    nav_row.append(InlineKeyboardButton(text=f"📄 {page}/{total_pages}", callback_data="noop"))

    if page < total_pages:
        nav_row.append(InlineKeyboardButton(text="បន្ទាប់ ➡️", callback_data=f"cat_page:{category_id}:{page + 1}"))

    rows.append(nav_row)

    # Back to Categories button
    rows.append([InlineKeyboardButton(text="🔙 ត្រឡប់ទៅជំពូក", callback_data="back_to_categories")])

    return InlineKeyboardMarkup(inline_keyboard=rows)


def get_product_detail_keyboard(product_id: int, category_id: int, is_available: bool) -> InlineKeyboardMarkup:
    rows: List[List[InlineKeyboardButton]] = []
    if is_available:
        rows.append([InlineKeyboardButton(text="🛒 ទិញឥឡូវនេះ (Buy Now)", callback_data=f"buy_confirm:{product_id}")])
    else:
        rows.append([InlineKeyboardButton(text="❌ អស់ស្តុក (Out of Stock)", callback_data="noop")])

    rows.append([InlineKeyboardButton(text="🔙 ត្រឡប់ក្រោយ", callback_data=f"cat:{category_id}")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def get_buy_confirm_keyboard(product_id: int) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="✅ បញ្ជាក់ការទិញ (Confirm)", callback_data=f"buy_execute:{product_id}"),
                InlineKeyboardButton(text="❌ បោះបង់ (Cancel)", callback_data="cancel_buy"),
            ]
        ]
    )


def get_topup_preset_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="💵 $1.00", callback_data="topup_amt:1"),
                InlineKeyboardButton(text="💵 $5.00", callback_data="topup_amt:5"),
                InlineKeyboardButton(text="💵 $10.00", callback_data="topup_amt:10"),
            ],
            [
                InlineKeyboardButton(text="💵 $20.00", callback_data="topup_amt:20"),
                InlineKeyboardButton(text="💵 $50.00", callback_data="topup_amt:50"),
                InlineKeyboardButton(text="✏️ បញ្ចូលចំនួនផ្សេងៗ", callback_data="topup_custom"),
            ],
            [InlineKeyboardButton(text="❌ បោះបង់", callback_data="cancel_topup")],
        ]
    )
