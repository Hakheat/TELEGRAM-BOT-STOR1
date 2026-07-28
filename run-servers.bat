@echo off
title Telegram Bot Store Launcher
echo ===================================================
echo   Starting Telegram Bot Store Backend & Frontend   
echo ===================================================
echo.

echo Launching Backend (FastAPI & Telegram Bot)...
start "Backend - FastAPI & Telegram Bot" cmd /k "cd /d "%~dp0backend" && call .venv\Scripts\activate && python -m uvicorn app.main:app --reload --port 8000"

echo Launching Frontend (Next.js Admin Dashboard)...
start "Frontend - Next.js Admin Dashboard" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ===================================================
echo Backend API:  http://localhost:8000
echo Frontend UI:  http://localhost:3000
echo ===================================================
echo.
