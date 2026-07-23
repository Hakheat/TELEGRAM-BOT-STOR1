from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.product_repository import ProductRepository
from app.bot.keyboards.inline import (
    get_categories_inline_keyboard,
    get_products_paginated_keyboard,
    get_product_detail_keyboard,
)

router = Router()


async def show_categories(message_or_query, session: AsyncSession):
    product_repo = ProductRepository(session)
    categories = await product_repo.get_active_categories()

    if not categories:
        text = "⚠️ បច្ចុប្បន្នមិនទាន់មានជំពូកផលិតផលនៅឡើយទេ។"
        if isinstance(message_or_query, CallbackQuery):
            await message_or_query.message.edit_text(text)
        else:
            await message_or_query.answer(text)
        return

    text = "<b>🛍️ សូមជ្រើសរើសជំពូកផលិតផល៖</b>"
    kb = get_categories_inline_keyboard(categories)

    if isinstance(message_or_query, CallbackQuery):
        await message_or_query.message.edit_text(text, reply_markup=kb)
    else:
        await message_or_query.answer(text, reply_markup=kb)


@router.message(F.text == "🛍️ ផលិតផល")
async def products_menu_handler(message: Message, session: AsyncSession):
    await show_categories(message, session)


@router.callback_query(F.data == "back_to_categories")
async def back_to_categories_handler(callback: CallbackQuery, session: AsyncSession):
    await show_categories(callback, session)
    await callback.answer()


@router.callback_query(F.data.startswith("cat:"))
async def category_select_handler(callback: CallbackQuery, session: AsyncSession):
    category_id = int(callback.data.split(":")[1])
    await show_category_products(callback, session, category_id, page=1)
    await callback.answer()


@router.callback_query(F.data.startswith("cat_page:"))
async def category_page_handler(callback: CallbackQuery, session: AsyncSession):
    _, category_id_str, page_str = callback.data.split(":")
    await show_category_products(callback, session, int(category_id_str), page=int(page_str))
    await callback.answer()


async def show_category_products(callback: CallbackQuery, session: AsyncSession, category_id: int, page: int):
    product_repo = ProductRepository(session)
    category = await product_repo.get_category_by_id(category_id)
    if not category:
        await callback.answer("⚠️ មិនរកឃើញជំពូកនេះទេ!", show_alert=True)
        return

    products = await product_repo.get_products_by_category(category_id, only_active=True)
    products_with_stock = []

    for prod in products:
        prod_tuple = await product_repo.get_product_with_stock(prod.id)
        if prod_tuple:
            products_with_stock.append(prod_tuple)

    if not products_with_stock:
        await callback.message.edit_text(
            f"<b>{category.icon or '📦'} {category.name}</b>\n\n⚠️ មិនទាន់មានផលិតផលនៅក្នុងជំពូកនេះទេ!",
            reply_markup=get_products_paginated_keyboard([], category_id, page=1),
        )
        return

    text = (
        f"<b>{category.icon or '📦'} {category.name}</b>\n"
        f"{category.description or 'ជ្រើសរើសផលិតផលខាងក្រោមដើម្បីទិញ៖'}\n\n"
        f"<i>💡 ចុចលើឈ្មោះផលិតផលដើម្បីមើលព័ត៌មានលម្អិត</i>"
    )

    kb = get_products_paginated_keyboard(products_with_stock, category_id, page=page)
    await callback.message.edit_text(text, reply_markup=kb)


@router.callback_query(F.data.startswith("prod:"))
async def product_detail_handler(callback: CallbackQuery, session: AsyncSession):
    product_id = int(callback.data.split(":")[1])
    product_repo = ProductRepository(session)

    res = await product_repo.get_product_with_stock(product_id)
    if not res:
        await callback.answer("⚠️ មិនរកឃើញផលិតផលនេះទេ!", show_alert=True)
        return

    product, stock_count = res
    is_available = stock_count > 0

    stock_status = f"🟢 មានស្តុក ({stock_count})" if is_available else "🔴 អស់ស្តុក"

    detail_text = (
        f"📦 <b>{product.title}</b>\n\n"
        f"📝 <b>ពិពណ៌នា:</b> {product.description or 'គ្មាន'}\n"
        f"💰 <b>តម្លៃ:</b> <code>${product.price:.2f}</code>\n"
        f"📊 <b>ស្ថានភាព:</b> {stock_status}\n"
    )

    kb = get_product_detail_keyboard(product.id, product.category_id, is_available)
    await callback.message.edit_text(detail_text, reply_markup=kb)
    await callback.answer()
