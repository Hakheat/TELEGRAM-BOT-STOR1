# 🚀 ការណែនាំលម្អិតអំពីការ Deploy Project ទៅកាន់ Vercel, Render, Supabase និង Cloudinary

សៀវភៅណែនាំនេះនឹងជួយអ្នកក្នុងការបង្ហោះ (Deploy) ប្រព័ន្ធ **FastAPI Backend (Telegram Bot)** និង **Next.js Frontend (Admin Dashboard)** ទៅកាន់ Cloud Services ដោយឥតគិតថ្លៃ (Free Tier)។

---

## 🗺️ គំនូសបំព្រួញនៃស្ថាបត្យកម្ម (Architecture Overview)
```mermaid
graph TD
    User[User on Telegram] -->|Interact| TelegramBot[Telegram Bot API]
    TelegramBot -->|Webhook| Render[Render Backend FastAPI]
    Admin[Admin User] -->|Manage| Vercel[Vercel Next.js Frontend]
    Vercel -->|API Requests| Render
    Render -->|Read/Write DB| Supabase[(Supabase PostgreSQL)]
    Render -->|Cache/Queue| Upstash[(Upstash Redis)]
    Render -->|Upload Images| Cloudinary[(Cloudinary CDN)]
```

---

## 🛠️ ជំហានទី ១: រៀបចំទិន្នន័យនៅ Supabase (PostgreSQL Database)
Supabase ផ្តល់សេវាកម្ម PostgreSQL DB ឥតគិតថ្លៃ និងមានល្បឿនលឿន។

1. ចូលទៅកាន់ [Supabase.com](https://supabase.com) ហើយចុះឈ្មោះបង្កើត Account។
2. បង្កើត Project ថ្មីមួយ (ឧទាហរណ៍៖ `telegram-store-db`)។
3. កំណត់ **Database Password** ឱ្យបានត្រឹមត្រូវ (សូមកត់ចំណាំទុក)។
4. ជ្រើសរើស Region យក **Singapore (ap-southeast-1)** ដើម្បីឱ្យល្បឿនដើរលឿននៅកម្ពុជា។
5. នៅពេល Project បង្កើតរួចរាល់៖
   - ចូលទៅកាន់ **Project Settings** (រូបកង់ធ្មេញនៅខាងឆ្វេងផ្នែកខាងក្រោម) ➔ **Database**។
   - ស្វែងរកផ្នែក **Connection string** ➔ ជ្រើសរើសយក **URI**។
   - ចម្លងយក (Copy) URI string នោះ។ វានឹងមានទម្រង់បែបនេះ៖
     ```
     postgresql://postgres.[YOUR-PROJECT-ID]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
     ```
   - **សំខាន់បំផុត ⚠️:** នៅពេលយកទៅដាក់ក្នុង Render Environment variables ត្រូវប្តូរ `postgresql://` ទៅជា `postgresql+asyncpg://` ឧទាហរណ៍៖
     `postgresql+asyncpg://postgres.xxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`

---

## 🛠️ ជំហានទី ២: រៀបចំ Cloudinary (សម្រាប់រក្សាទុករូបភាពផលិតផល និង QR Code)
ដោយសារ Render ប្រើប្រាស់ Ephemeral File System (រាល់ពេល Restart ឬ Deploy ថ្មី រូបភាពដែលបាន Upload នឹងត្រូវលុបបាត់) ដូចនេះយើងត្រូវការប្រើ Cloudinary ដើម្បីរក្សាទុករូបភាពជាអចិន្ត្រៃយ៍។

1. ចូលទៅកាន់ [Cloudinary.com](https://cloudinary.com) ហើយចុះឈ្មោះបង្កើត Account (ឥតគិតថ្លៃ ២៥GB)។
2. ចូលទៅកាន់ **Dashboard** របស់អ្នក រួចស្វែងរកព័ត៌មានទាំងនេះ៖
   - **Cloud Name** (ឧទាហរណ៍៖ `xfmwvi52`)
   - **API Key** (ឧទាហរណ៍៖ `351712782278362`)
   - **API Secret** (ឧទាហរណ៍៖ `OFjIrEKKoBbIxxdTCAIIwFUEPvY`)
3. កត់ចំណាំតម្លៃទាំង ៣ នេះទុកដើម្បីកំណត់ក្នុង Render Environment Variables។

---

## 🛠️ ជំហានទី ៣: រៀបចំ Upstash Redis (សម្រាប់ Cache និង Scheduler)
Upstash ផ្តល់សេវាកម្ម Serverless Redis ដោយឥតគិតថ្លៃ និងល្បឿនលឿនបំផុត។

1. ចូលទៅកាន់ [Upstash.com](https://upstash.com) ហើយចុះឈ្មោះតាមរយៈ GitHub ឬ Google។
2. ចុចលើ **Create Database**៖
   - **Name**: `telegram-store-redis`
   - **Type**: `Redis`
   - **Region**: `ap-southeast-1` (Singapore)
3. នៅពេលបង្កើតរួចរាល់ ស្វែងរកផ្នែក **Redis Connect** ➔ ជ្រើសរើសយក **Redis URL** (ស្វែងរកពាក្យ `REDIS_URL` ក្នុងផ្ទាំង Dashboard)។
4. ចម្លងយក URL នោះ ដែលមានទម្រង់បែបនេះ៖
   ```
   rediss://default:xxxxxx@YOUR-REDIS-ENDPOINT.upstash.io:6379
   ```

---

## 🛠️ ជំហានទី ៤: Deploy Backend ទៅកាន់ Render
Render នឹងដំណើរការ FastAPI Application និង Telegram Webhook។

1. ចូលទៅកាន់ [Render.com](https://render.com) និង Login ជាមួយ GitHub Account របស់អ្នក។
2. ចុចប៊ូតុង **New +** ➔ ជ្រើសរើសយក **Web Service**។
3. ជ្រើសរើសយក Repository របស់អ្នក (`Hakheat/TELEGRAM-BOT-STOR1`) រួចចុច **Connect**។
4. កំណត់ព័ត៌មានខាងក្រោម៖
   - **Name**: `telegram-bot-api`
   - **Region**: `Singapore` (ឬ Region ណាដែលនៅជិតខ្មែរ)
   - **Branch**: `main`
   - **Root Directory**: *(ទុកឱ្យនៅទំនេរ ឬដាក់ `/`)*
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free` (ឬ Starter)
5. ចុចលើផ្នែក **Advanced** ដើម្បីបន្ថែម **Environment Variables**៖

| Key | Value | ពន្យល់ |
| :--- | :--- | :--- |
| `ENV` | `production` | កំណត់ដំណើរការសម្រាប់ Production |
| `DEBUG` | `False` | បិទ Debug mode ដើម្បីសុវត្ថិភាព |
| `DATABASE_URL` | `postgresql+asyncpg://...` | Connection String ពី Supabase |
| `REDIS_URL` | `rediss://...` | Connection String ពី Upstash Redis |
| `JWT_SECRET` | `វាយអក្សរឬលេខសម្ងាត់វែងៗលាយគ្នា` | សោរសម្ងាត់សម្រាប់ Sign Token របស់ Admin |
| `KEY_ENCRYPTION_KEY` | `gK7xL2Z8N3V_pW9Q1mY4sT0uR6vX8zA5bC2dE1fG3hI=` | សោរសម្ងាត់សម្រាប់ Encrypt ឌីជីថលឃី (AES-256) |
| `BOT_TOKEN` | `7600340772:AAG0WTf...` | Token របស់ Telegram Bot ទទួលបានពី @BotFather |
| `TELEGRAM_WEBHOOK_URL` | `https://your-render-app-url.onrender.com/api/v1/telegram/webhook` | URL របស់ Render ខ្លួនឯងសម្រាប់ Webhook |
| `FRONTEND_URL` | `https://your-vercel-app.vercel.app` | URL របស់ Next.js Admin Panel នៅលើ Vercel |
| `CLOUDINARY_CLOUD_NAME` | `ឈ្មោះ cloud របស់អ្នក` | ពី Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | `លេខកូដ API` | ពី Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | `កូដសម្ងាត់ API` | ពី Cloudinary Dashboard |
| `ADMIN_USERNAME` | `adminhakcambodai168@gmail.com` | អ៊ីមែលសម្រាប់ឡុកចូល Admin Panel |
| `ADMIN_PASSWORD` | `adminhak&168$` | ពាក្យសម្ងាត់សម្រាប់ឡុកចូល Admin Panel |
| `KHQR_MERCHANT_NAME` | `DIGITAL STORE KH` | ឈ្មោះហាងសម្រាប់បង្ហាញលើ KHQR |
| `KHQR_MERCHANT_CITY` | `PHNOM PENH` | ទីក្រុងរបស់ហាង |
| `KHQR_ACCOUNT_NUMBER` | `លេខគណនីបាគងរបស់អ្នក` | គណនីបាគងសម្រាប់ទទួលប្រាក់ |

6. ចុចប៊ូតុង **Create Web Service**។ Render នឹងចាប់ផ្តើមទាញយកកូដ បង្កើត Database structure ស្វ័យប្រវត្ត និងបង្កើត Webhook ទៅ Telegram!

---

## 🛠️ ជំហានទី ៥: Deploy Frontend (Next.js) ទៅកាន់ Vercel
Vercel គឺជាជម្រើសដ៏ល្អបំផុតសម្រាប់ Hosting Next.js។

1. ចូលទៅកាន់ [Vercel.com](https://vercel.com) និង Login ជាមួយ GitHub Account របស់អ្នក។
2. ចុចប៊ូតុង **Add New...** ➔ ជ្រើសរើសយក **Project**។
3. ស្វែងរក Repository របស់អ្នក (`Hakheat/TELEGRAM-BOT-STOR1`) រួចចុច **Import**។
4. កំណត់ការកំណត់ (Settings) ដូចខាងក្រោម៖
   - **Framework Preset**: ជ្រើសរើសយក `Next.js`
   - **Root Directory**: ចុចលើប៊ូតុង **Edit** រួចជ្រើសរើសយកថត (Folder) `frontend` រួចចុច **Save**។ (សំខាន់ខ្លាំងណាស់ ⚠️)
5. បើកផ្នែក **Environment Variables** ហើយបន្ថែម Keys ទាំងនេះ៖
   - `NEXT_PUBLIC_API_URL`: ដាក់ URL របស់ Render Backend របស់អ្នក បូករួមនឹង `/api/v1` (ឧទាហរណ៍៖ `https://telegram-bot-api.onrender.com/api/v1`)
   - `NEXT_PUBLIC_SITE_NAME`: ដាក់ឈ្មោះប្រព័ន្ធគ្រប់គ្រង (ឧទាហរណ៍៖ `Telegram Store Admin Panel`)
6. ចុចប៊ូតុង **Deploy**។
7. នៅពេលរួចរាល់ Vercel នឹងផ្តល់ URL មួយដល់អ្នក (ឧទាហរណ៍៖ `https://telegram-bot-store.vercel.app`)។

---

## 🤖 ជំហានទី ៦: ភ្ជាប់ URL ទៅកាន់ Telegram @BotFather

ដើម្បីឱ្យ Telegram Bot របស់អ្នកអាចបើកដំណើរការ Mini App បានយ៉ាងរលូន៖

1. បើកកម្មវិធី Telegram និងស្វែងរក **[@BotFather](https://t.me/BotFather)**។
2. ផ្ញើសារសរសេរថា `/mybots` ➔ ជ្រើសរើសយក Bot របស់អ្នក។
3. ចុចលើ **Bot Settings** ➔ **Configure Mini App** (ឬ **Menu Button**)។
4. ចម្លងយក URL របស់ Vercel (ឧទាហរណ៍៖ `https://telegram-bot-store.vercel.app`) ទៅផាស (Paste) ចូល។
5. រក្សាទុកការផ្លាស់ប្តូរ (Save Changes)។

បច្ចុប្បន្ននេះ រាល់ពេលដែលអតិថិជនចុចលើប៊ូតុង **Menu / Open Store** នៅក្នុង Telegram Bot វានឹងបើក Next.js web application យ៉ាងស្រស់ស្អាតភ្លាមៗ!
