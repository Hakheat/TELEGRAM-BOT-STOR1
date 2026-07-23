from pydantic import BaseModel
from fastapi import APIRouter, Response, HTTPException, status, Depends
from app.services.auth_service import AuthService
from app.api.dependencies import get_current_admin

router = APIRouter(prefix="/auth", tags=["Auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(payload: LoginRequest, response: Response):
    token = AuthService.authenticate_admin(payload.username, payload.password)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    # Set HTTP-Only Cookie
    response.set_cookie(
        key="access_token",
        value=f"Bearer {token}",
        httponly=True,
        max_age=86400 * 30,  # 30 days
        samesite="lax",
        secure=False,  # Set to True in production with HTTPS
    )

    return {"access_token": token, "token_type": "bearer", "message": "Logged in successfully"}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}


@router.get("/me")
async def get_me(admin=Depends(get_current_admin)):
    return {"username": admin.get("sub"), "role": admin.get("role")}
