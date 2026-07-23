from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.digital_key import DigitalKey
from app.db.repositories.stock_repository import StockRepository
from app.db.repositories.product_repository import ProductRepository
from app.core.security import encrypt_key_content
from app.core.exceptions import ProductNotFoundException


class StockService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.stock_repo = StockRepository(session)
        self.product_repo = ProductRepository(session)

    async def bulk_upload_keys(self, product_id: int, raw_text_data: str) -> int:
        """
        Parses multi-line text input (1 key / account credential per line),
        encrypts each item with AES-Fernet, and inserts them into PostgreSQL in batch.
        """
        product = await self.product_repo.get_by_id(product_id)
        if not product:
            raise ProductNotFoundException(f"Product ID {product_id} not found.")

        lines = [line.strip() for line in raw_text_data.splitlines() if line.strip()]
        if not lines:
            return 0

        digital_keys: List[DigitalKey] = []
        for line in lines:
            encrypted_val = encrypt_key_content(line)
            key_item = DigitalKey(
                product_id=product_id,
                encrypted_content=encrypted_val,
                is_sold=False,
            )
            digital_keys.append(key_item)

        inserted_count = await self.stock_repo.bulk_add_keys(digital_keys)
        await self.session.commit()
        return inserted_count
