# 🎯 Complete Production Deployment Guide for Vercel, Supabase & Cloudinary

Complete, step-by-step blueprint to achieve 100% successful deployment of your Telegram Digital Store Bot & Dashboard.

---

## 📌 Production Architecture Overview

```
 ┌─────────────────────────┐        ┌─────────────────────────┐
 │   Vercel Cloud (CDN)    │        │ Render / Railway (Cloud)│
 │  Next.js Admin Dashboard│        │ FastAPI + Telegram Bot  │
 └────────────┬────────────┘        └────────────┬────────────┘
              │                                  │
              ▼                                  ▼
 ┌─────────────────────────┐        ┌─────────────────────────┐
 │   Supabase Database     │        │   Cloudinary Media CDN  │
 │   PostgreSQL Database   │        │   Image & Video Storage │
 └─────────────────────────┘        └─────────────────────────┘
```

---

## 🛠️ Step 1: Run Database Migrations on Supabase

Your Supabase database URL is already configured in `backend/.env`. Now, apply all database schemas (Users, Products, Orders, Broadcasts) to Supabase:

1. Open PowerShell / Terminal in `backend/`:
   ```powershell
   cd backend
   .venv\Scripts\activate
   alembic upgrade head
   ```
2. Verification: Open your [Supabase Dashboard](https://supabase.com) ➔ **Table Editor**. You will see all tables (`users`, `products`, `orders`, `broadcast_schedules`, `settings`) created live!

---

## 🚀 Step 2: Deploy Frontend to Vercel (100% Free & Fast)

1. Push your project code to **GitHub** (or GitLab).
2. Go to **[Vercel Dashboard](https://vercel.com)** ➔ Click **`Add New...`** ➔ **`Project`**.
3. Import your GitHub Repository `TELEGRAM-BOT-STOR1`.
4. Configure Vercel Project Settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: Click `Edit` ➔ Select `frontend`
5. Expand **Environment Variables**:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend.onrender.com/api/v1` (or your Backend domain)
6. Click **`Deploy`**!
   *(Vercel will compile and issue your live HTTPS site, e.g., `https://telegram-store-admin.vercel.app`)*

---

## ⚙️ Step 3: Deploy Backend API & Telegram Bot (Render.com - 100% Free)

Since Telegram Bots & background broadcast workers require a 24/7 Python process, deploy the backend to **Render.com** or **Railway.app**:

1. Go to **[Render.com](https://render.com)** ➔ Click **`New`** ➔ **`Web Service`**.
2. Connect your GitHub repository.
3. Configure Service:
   - **Name**: `telegram-store-api`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && alembic upgrade head`
   - **Start Command**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add **Environment Variables** on Render:
   - `DATABASE_URL` = `postgresql+asyncpg://postgres.pjsqicxwpffjyqtpanpc:Heathak%4006102001@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`
   - `CLOUDINARY_CLOUD_NAME` = `xfmwvi52`
   - `CLOUDINARY_API_KEY` = `351712782278362`
   - `CLOUDINARY_API_SECRET` = `OFjIrEKKoBbIxxdTCAIIwFUEPvY`
   - `BOT_TOKEN` = `7600340772:AAG0WTfCOGjC_6MJYmk16fLrFOtTu2-Rk8I`
   - `JWT_SECRET` = `super_secret_jwt_key_change_me_in_production_32bytes_min`
5. Click **`Create Web Service`**.

---

## 🤖 Step 4: Link Web App in Telegram @BotFather

1. Open Telegram ➔ Search **[@BotFather](https://t.me/BotFather)**.
2. Send `/mybots` ➔ Select your Bot (`@StoreManagerBot`).
3. Click **`Bot Settings`** ➔ **`Configure Mini App`** (or **`Menu Button`**).
4. Enter your Vercel URL: `https://telegram-store-admin.vercel.app`.
5. Enter button text: `🛒 បញ្ជាទិញឥឡូវនេះ (Open Store)`.

---

## 🎉 Success Checklist
- [x] Database Schema live on Supabase PostgreSQL
- [x] Media assets hosted on Cloudinary CDN
- [x] Frontend deployed on Vercel with HTTPS
- [x] Telegram Bot & API running 24/7 on Render
- [x] Mini App linked in @BotFather
