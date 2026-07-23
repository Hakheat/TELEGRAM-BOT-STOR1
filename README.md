# 🛍️ Telegram Digital Store Bot & Admin Dashboard

A complete, highly-scalable, production-ready **Telegram Digital Store Bot** with an **Admin Dashboard** built using Python (FastAPI, aiogram 3.x, SQLAlchemy Async, Alembic), PostgreSQL, Redis, and Next.js 14 (TypeScript, Tailwind CSS, Zustand).

---

## 🌟 System Highlights

- **Telegram Bot Engine (aiogram 3.x)**: Persistent Khmer menu keyboard, dynamic inline pagination (Page 1/N, Next/Back), and automated instant delivery.
- **Concurrency-Safe Key Allocation**: Uses PostgreSQL `SELECT ... FOR UPDATE SKIP LOCKED` inside explicit transactions to guarantee zero race conditions or double-allocations during high-traffic flash sales.
- **AES-256 Fernet Encryption**: All digital credentials (Email:Pass / License Keys) are encrypted before storing in PostgreSQL.
- **KHQR Automated Top-Up System**: Webhook endpoint `/api/v1/webhooks/khqr` for real-time bank top-up notifications & user balance crediting.
- **Redis Rate Limiting**: Anti-spam throttling middleware protecting bot callback queries.
- **Executive Admin Dashboard (Next.js 14)**: Three-pane layout featuring real-time revenue stats, live bot order activity feed, digital inventory vault with bulk key upload modal, user balance auditing, and bulk telegram broadcast console.

---

## 📁 Repository Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/       # REST API endpoints (Auth, Analytics, Stock, Products, Orders, Users, Webhooks, Broadcast)
│   │   ├── bot/                    # aiogram 3.x Telegram Bot Subsystem
│   │   ├── core/                   # Config, Database, Redis, Security (Fernet/JWT), Exceptions
│   │   ├── db/                     # ORM Models & Repositories (FOR UPDATE SKIP LOCKED)
│   │   ├── schemas/                # Pydantic DTOs
│   │   ├── services/               # Atomic Business Logic Services
│   │   └── main.py                 # FastAPI Gateway entrypoint
│   ├── alembic/                    # Database Schema Migrations
│   ├── tests/                      # Pytest unit & integration test suite
│   ├── Dockerfile & docker-compose.yml
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── app/                    # Next.js 14 App Router (Auth & Dashboard Routes)
    │   ├── components/             # Reusable UI Primitives & Three-Pane Layout
    │   ├── hooks/, lib/, services/ # API Clients, Zustand Stores, Axios Interceptors
    │   └── types/                  # TypeScript Contracts
    ├── tailwind.config.ts & postcss.config.js
    └── package.json
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup

```bash
cd backend
python -m pip install -r requirements.txt
alembic upgrade head
python -m uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Admin Dashboard Setup

```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:3000`** in your browser.
- **Email:** `adminhakcambodai168@gmail.com`
- **Password:** `adminhak&168$`

---

## 📝 License

This project is licensed under the MIT License.
