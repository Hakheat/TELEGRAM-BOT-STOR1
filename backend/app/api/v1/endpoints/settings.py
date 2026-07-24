import os
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies import get_current_admin
from app.core.config import settings
from app.bot.bot import reload_bot

router = APIRouter(prefix="/settings", tags=["Settings"])


class SettingsUpdate(BaseModel):
    bot_token: str = Field(..., description="The Telegram Bot Token")


class SettingsResponse(BaseModel):
    bot_token: str


def update_env_variable(key: str, value: str):
    # __file__ is in backend/app/api/v1/endpoints/settings.py
    # 4 levels up is backend/
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    env_path = os.path.join(base_dir, ".env")

    lines = []
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            lines = f.readlines()

    updated = False
    for i, line in enumerate(lines):
        if line.strip().startswith(f"{key}="):
            lines[i] = f"{key}={value}\n"
            updated = True
            break

    if not updated:
        lines.append(f"\n{key}={value}\n")

    with open(env_path, "w", encoding="utf-8") as f:
        f.writelines(lines)


@router.get("", response_model=SettingsResponse)
async def get_settings(admin=Depends(get_current_admin)):
    return SettingsResponse(bot_token=settings.BOT_TOKEN)


@router.post("", response_model=SettingsResponse)
async def update_settings(payload: SettingsUpdate, admin=Depends(get_current_admin)):
    token = payload.bot_token.strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bot token cannot be empty",
        )

    # 1. Update .env file
    try:
        update_env_variable("BOT_TOKEN", token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update config file: {e}",
        )

    # 2. Reload the bot with the new token
    try:
        await reload_bot(token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to hot-reload bot client: {e}",
        )

    return SettingsResponse(bot_token=settings.BOT_TOKEN)
