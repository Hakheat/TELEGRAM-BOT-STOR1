# 🚀 Telegram Bot Store - Production Deployment Guide

Guide for deploying both backend (FastAPI + Telegram Bot) and frontend (Next.js Admin Dashboard) to production.

---

## 📋 Production Prerequisites
1. **Cloud VPS / Server**: Ubuntu 22.04 LTS (DigitalOcean, AWS EC2, Linode, Vultr, Hetzner, etc.).
2. **Domain Name**: (e.g., `yourstore.com` or `admin.yourstore.com`).
3. **Telegram Bot Token**: Issued from [@BotFather](https://t.me/BotFather).

---

## 🛠️ Option 1: VPS Deployment with Docker Compose (Recommended)

### Step 1: Install Docker & Docker Compose on VPS
Run these commands on your Ubuntu VPS:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose git curl
sudo systemctl enable --now docker
```

### Step 2: Clone Project & Prepare `.env`
```bash
git clone <your-git-repository-url> /opt/telegram-bot-store
cd /opt/telegram-bot-store
```

Create production configuration files:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PROJECT_NAME="Store Manager Bot"
SECRET_KEY="your-super-secret-random-jwt-key"
BOT_TOKEN="your_telegram_bot_token_here"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your_secure_password"
KHQR_MERCHANT_NAME="YOUR STORE NAME"
KHQR_MERCHANT_CITY="PHNOM PENH"
KHQR_ACCOUNT_NUMBER="000123456@bakong"
ABA_ACCOUNT_NAME="YOUR ABA NAME"
ABA_ACCOUNT_NUMBER="000 123 456"
ABA_QR_LINK="https://qr.ababank.com/..."
```

### Step 3: Run Database Migrations
```bash
cd backend
.venv/bin/alembic upgrade head
cd ..
```

### Step 4: Build & Start Docker Containers
```bash
docker-compose up -d --build
```

Verify containers are running:
```bash
docker-compose ps
```

---

## 🔒 Step 5: Configure Nginx & Free SSL (Certbot)

Install Nginx:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Create Nginx site configuration `/etc/nginx/sites-available/telegram-store`:
```nginx
server {
    server_name yourstore.com www.yourstore.com;

    # Frontend Next.js Admin Dashboard
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend FastAPI API & Media Files
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        proxy_pass http://127.0.0.1:8000/static/;
        proxy_set_header Host $host;
    }
}
```

Enable site and activate SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/telegram-store /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d yourstore.com -d www.yourstore.com
```

---

## 🤖 Step 6: Attach Telegram Mini App in @BotFather

1. Open [@BotFather](https://t.me/BotFather) on Telegram.
2. Send `/mybots` -> Select your Bot.
3. Go to **`Bot Settings`** -> **`Configure Mini App`** (or **`Menu Button`**).
4. Enter your web app URL: `https://yourstore.com`.
5. Name the button (e.g., `🛒 Open Store`).

---

## ⚡ Useful Operations Commands
* **View Logs**: `docker-compose logs -f`
* **Restart Backend**: `docker-compose restart backend`
* **Update Code**:
  ```bash
  git pull
  docker-compose up -d --build
  ```
