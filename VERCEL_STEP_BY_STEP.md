# 🚀 Vercel Deployment Step-by-Step Guide

Complete visual walkthrough for deploying the `frontend` Next.js application to Vercel.

---

## 📋 Vercel UI Form Fields Configuration

When importing your GitHub repository (`Hakheat/TELEGRAM-BOT-STOR1`) in Vercel, configure the fields exactly as shown below:

### 1. Project Name
- **Field**: `Project Name`
- **Value**: `telegram-bot-store` *(Must be lowercase only!)*

### 2. Framework Preset
- **Field**: `Framework Preset`
- **Value**: `Next.js`

### 3. Root Directory (CRITICAL STEP ⚠️)
- **Field**: `Root Directory`
- **Action**: Click the **`Edit`** button next to Root Directory.
- **Select Folder**: `frontend`
- **Save**: Click **`Save`**.

---

## 🔑 Environment Variables Setup

Expand the **Environment Variables** section on Vercel and add the following keys:

| Environment Variable Key | Recommended Value | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://your-backend.onrender.com/api/v1` | Connects Next.js UI with FastAPI Backend |
| `NEXT_PUBLIC_SITE_NAME` | `Telegram Store Admin` | Header branding title |

---

## 🎯 Click Deploy!

Click the **`Deploy`** button at the bottom of the Vercel screen.

Vercel will execute:
1. `npm install`
2. `npm run build`
3. Generate your live HTTPS URL: `https://telegram-bot-store.vercel.app`

---

## 🤖 Final Step: Attach URL to Telegram @BotFather

1. Open Telegram and search for **[@BotFather](https://t.me/BotFather)**.
2. Send `/mybots` ➔ Select your Bot (`@StoreManagerBot`).
3. Click **`Bot Settings`** ➔ **`Configure Mini App`** (or **`Menu Button`**).
4. Paste your Vercel URL: `https://telegram-bot-store.vercel.app`.
5. Save changes!
