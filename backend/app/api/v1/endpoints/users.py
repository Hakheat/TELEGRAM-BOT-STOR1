from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_db, get_current_admin
from app.db.repositories.user_repository import UserRepository
from app.schemas.user import UserResponse, UserBalanceAdjustRequest

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=List[UserResponse])
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    repo = UserRepository(db)
    return await repo.get_users_list(skip=skip, limit=limit)


@router.patch("/{user_id}/balance", response_model=UserResponse)
async def adjust_user_balance(
    user_id: int,
    payload: UserBalanceAdjustRequest,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    repo = UserRepository(db)
    user = await repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    updated_user = await repo.add_balance(user.id, payload.amount)
    return updated_user
