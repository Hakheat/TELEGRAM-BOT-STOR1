from decimal import Decimal
from typing import Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.user_repository import UserRepository
from app.db.repositories.product_repository import ProductRepository
from app.db.repositories.stock_repository import StockRepository
from app.db.repositories.order_repository import OrderRepository
from app.db.models.order import Order
from app.core.security import decrypt_key_content
from app.core.exceptions import (
    OutOfStockException,
    InsufficientBalanceException,
    ProductNotFoundException,
    UserNotFoundException,
)


class PurchaseService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.user_repo = UserRepository(session)
        self.product_repo = ProductRepository(session)
        self.stock_repo = StockRepository(session)
        self.order_repo = OrderRepository(session)

    async def execute_purchase(self, telegram_id: int, product_id: int) -> Tuple[Order, str]:
        """
        Executes a race-condition safe digital item purchase.
        
        Steps in an Atomic DB Transaction:
        1. Fetch & lock product entity.
        2. Safely lock 1 unsold digital key via PostgreSQL FOR UPDATE SKIP LOCKED.
        3. Lock user row with FOR UPDATE and verify balance sufficiency.
        4. Deduct balance from user.
        5. Decrypt digital key content for instant delivery.
        6. Log Order & OrderItem records.
        7. Flag digital key as sold with order reference.
        """
        # Step 1: Check product validity
        product = await self.product_repo.get_by_id(product_id)
        if not product or not product.is_active:
            raise ProductNotFoundException("Product is not available for purchase.")

        # Step 2: Lock 1 unsold key safely
        digital_key = await self.stock_repo.fetch_and_lock_unsold_key(product_id)
        if not digital_key:
            raise OutOfStockException(f"Sorry, '{product.title}' is currently out of stock!")

        # Step 3: Fetch & lock user record
        user = await self.user_repo.get_by_telegram_id_for_update(telegram_id)
        if not user:
            raise UserNotFoundException("User profile not found. Please type /start first.")

        if user.is_blocked:
            raise InsufficientBalanceException("Your account is currently suspended.")

        # Step 4: Verify balance
        if user.balance < product.price:
            needed = product.price - user.balance
            raise InsufficientBalanceException(
                f"Insufficient balance! Required: ${product.price:.2f}, Balance: ${user.balance:.2f}. "
                f"Please top up ${needed:.2f} more."
            )

        # Step 5: Deduct balance
        user.balance -= product.price

        # Step 6: Decrypt key content
        plain_key_content = decrypt_key_content(digital_key.encrypted_content)

        # Step 7: Record Order & OrderItem
        order = await self.order_repo.create_order_with_item(
            user_id=user.id,
            product_id=product.id,
            unit_price=product.price,
            delivered_payload=plain_key_content,
        )

        # Step 8: Mark key sold
        await self.stock_repo.mark_key_as_sold(key_id=digital_key.id, order_id=order.id)

        # Commit explicit transaction
        await self.session.commit()

        return order, plain_key_content
