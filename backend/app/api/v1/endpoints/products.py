from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_db, get_current_admin
from app.db.repositories.product_repository import ProductRepository
from app.db.models.product import Category, Product
from app.schemas.product import (
    CategoryCreate,
    CategoryResponse,
    ProductCreate,
    ProductResponse,
    ProductUpdate,
)

router = APIRouter(prefix="/products", tags=["Products"])


# Category Endpoints
@router.get("/categories", response_model=List[CategoryResponse])
async def list_categories(
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    repo = ProductRepository(db)
    return await repo.get_all_categories()


@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    payload: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    repo = ProductRepository(db)
    cat = Category(**payload.model_dump())
    return await repo.create_category(cat)


# Product Endpoints
@router.get("", response_model=List[ProductResponse])
async def list_products(
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    repo = ProductRepository(db)
    items = await repo.get_all_products_with_stock()
    result = []
    for prod, stock in items:
        p_dict = ProductResponse.model_validate(prod).model_dump()
        p_dict["stock_count"] = stock
        result.append(ProductResponse(**p_dict))
    return result


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    payload: ProductCreate,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    repo = ProductRepository(db)
    prod = Product(**payload.model_dump())
    created = await repo.create(prod)
    p_dict = ProductResponse.model_validate(created).model_dump()
    p_dict["stock_count"] = 0
    return ProductResponse(**p_dict)


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    repo = ProductRepository(db)
    prod = await repo.get_by_id(product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    data = payload.model_dump(exclude_unset=True)
    for key, val in data.items():
        setattr(prod, key, val)

    await db.flush()
    res = await repo.get_product_with_stock(product_id)
    p, stock = res
    p_dict = ProductResponse.model_validate(p).model_dump()
    p_dict["stock_count"] = stock
    return ProductResponse(**p_dict)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    repo = ProductRepository(db)
    prod = await repo.get_by_id(product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    await repo.delete(prod)
