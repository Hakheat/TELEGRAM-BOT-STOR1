# 🌐 Cloud Deployment Guide: Vercel + Cloudinary + Supabase

Guide for deploying your Telegram Bot Store using **Vercel (Frontend)**, **Supabase (Database)**, and **Cloudinary (CDN Media Storage)**.

---

## 🏗️ Architecture Overview

| Component | Service | Role | Cost |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** | Hosting Next.js 14 Admin Dashboard | Free Tier |
| **Database** | **Supabase** | Managed PostgreSQL Database | Free Tier |
| **Media CDN** | **Cloudinary** | Image & Video Cloud Storage | Free Tier |
| **Backend API** | **Render / Railway / VPS** | FastAPI + Telegram Bot Engine | Free / Low Cost |

---

## 🗄️ Step 1: Configure Supabase Database

1. Log in to [Supabase Console](https://supabase.com) and create a new project.
2. Go to **Project Settings** ➔ **Database** ➔ **Connection String** (URI).
3. Copy the Connection String and format it for Async SQLAlchemy:
   ```env
   DATABASE_URL="postgresql+asyncpg://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

---

## 🖼️ Step 2: Configure Cloudinary Media Storage

1. Register at [Cloudinary](https://cloudinary.com) (Free Account).
2. From your Dashboard, copy the credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

3. Add these variables to your `backend/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```

*Note: With Cloudinary configured, all broadcast photo and video uploads are stored globally on Cloudinary's CDN, returning secure HTTPS URLs directly to Telegram users!*

---

## 🚀 Step 3: Deploy Frontend to Vercel

1. Push your project to GitHub / GitLab.
2. Go to [Vercel Dashboard](https://vercel.com) ➔ **Add New Project** ➔ Import your repository.
3. Set **Root Directory** to `frontend`.
4. Add **Environment Variables** in Vercel settings:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-api.onrender.com/api/v1` (Your production backend URL)
5. Click **Deploy**.

---

## ⚙️ Step 4: Deploy Backend API & Bot (Render / Railway / VPS)

### Option A: Render (Free Tier)
1. Go to [Render Dashboard](https://render.com) ➔ **New Web Service**.
2. Connect your Git repository.
3. Set **Root Directory** to `backend`.
4. Set **Build Command**: `pip install -r requirements.txt && alembic upgrade head`
5. Set **Start Command**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variables:
   - `DATABASE_URL`: *(Your Supabase connection string)*
   - `BOT_TOKEN`: *(Your Telegram Bot Token)*
   - `CLOUDINARY_CLOUD_NAME`: *(Your Cloudinary Cloud Name)*
   - `CLOUDINARY_API_KEY`: *(Your Cloudinary API Key)*
   - `CLOUDINARY_API_SECRET`: *(Your Cloudinary API Secret)*
   - `JWT_SECRET`: *(Your random 32-character secret key)*

---

## 🤖 Step 5: Configure Telegram Mini App in @BotFather

1. Open [@BotFather](https://t.me/BotFather) on Telegram.
2. Send `/mybots` ➔ Select your Bot.
3. Go to **`Bot Settings`** ➔ **`Configure Mini App`** (or **`Menu Button`**).
4. Enter your Vercel frontend URL: `https://your-app.vercel.app`.
5. Save changes.
