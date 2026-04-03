# BEDIM Security Site Setup
**Date:** 2026-03-20  
**URL:** https://bedimsecurity.com  
**Server:** miner (207.244.226.151)  
**SSH:** `ssh wez@bedimsecurity.com`

---

## Overview

BEDIM Security (bedimsecurity.com) is a standalone cybersecurity compliance platform — **no connection to stsgym.com**. Clients, artifacts, CMMC/NIST/SCRM compliance tools.

> **Note:** BEDIM was originally part of STSGYM ecosystem but has been rebranded and separated. All STSGYM references were removed on 2026-03-20.

---

## Architecture

```
Cloudflare (DNS)
    └── bedimsecurity.com → 207.244.226.151:443
            └── nginx (reverse proxy, port 443)
                └── bedimsecurity-web (Docker)
                        ├── bedimsecurity-db (PostgreSQL 15)
                        └── bedimsecurity-redis (Redis 7)
```

### Container Stack

| Container | Image | Port | Purpose |
|-----------|-------|------|---------|
| bedimsecurity-web | bedimsecurity_web | 127.0.0.1:5013→5000 | Flask/Gunicorn app |
| bedimsecurity-db | postgres:15 | 5432 | PostgreSQL database |
| bedimsecurity-redis | redis:7 | 6379 | Session storage |

---

## Docker Compose

**Location:** `/opt/bedimsecurity/docker-compose.yml`

```yaml
services:
  web:
    build: .
    container_name: bedimsecurity-web
    environment:
      DATABASE_URL: postgresql://bedim:bedim123@db:5432/bedim
      SECRET_KEY: bedimsecurity-secret-key-2026-CHANGE-ME
      SMTP_HOST: localhost
      SMTP_PORT: 587
      SMTP_USER: noreply@bedimsecurity.com
      SMTP_PASSWORD: CHANGE-ME
      BASE_URL: https://bedimsecurity.com
    ports:
      - "127.0.0.1:5013:5000"
    restart: unless-stopped

  db:
    image: postgres:15
    container_name: bedimsecurity-db
    environment:
      POSTGRES_USER: bedim
      POSTGRES_PASSWORD: bedim123
      POSTGRES_DB: bedim
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bedim"]

  redis:
    image: redis:7
    container_name: bedimsecurity-redis
    restart: unless-stopped
```

---

## Nginx Configuration

**Config file:** `/etc/nginx/sites-available/bedimsecurity.com`

- Port 80 (HTTP) — redirect to HTTPS or proxy to app
- Port 443 (HTTPS) — SSL termination, proxy to `127.0.0.1:5013`
- SSL cert managed by Certbot: `/etc/letsencrypt/live/bedimsecurity.com/`
- Let's Encrypt cert expires: **2026-06-18** (89 days)

### Security Headers
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block

---

## Access

- **URL:** https://bedimsecurity.com
- **Admin login:** https://bedimsecurity.com/admin
- **Admin credentials:** `admin@bedimsecurity.com` / `CHANGE-ME-ADMIN-2026!`
- **Local auth only** — no SSO connection to stsgym.com

---

## Managing

```bash
# SSH to server
ssh wez@bedimsecurity.com

# Check container status
sudo docker ps | grep bedim

# View logs
sudo docker logs bedimsecurity-web --tail 50
sudo docker logs bedimsecurity-db --tail 50

# Restart service
cd /opt/bedimsecurity
sudo docker-compose restart web

# Stop/start
sudo docker-compose down
sudo docker-compose up -d
```

---

## Reboot Survival

- `nginx`: enabled in systemd — starts on boot
- `docker`: enabled in systemd — starts on boot
- All containers: `restart: unless-stopped` — automatically restart after reboot

---

## Key Paths

| Path | Description |
|------|-------------|
| `/opt/bedimsecurity/` | Application root |
| `/opt/bedimsecurity/app.py` | Main Flask application |
| `/opt/bedimsecurity/docker-compose.yml` | Container orchestration |
| `/etc/nginx/sites-available/bedimsecurity.com` | Nginx vhost config |
| `/etc/letsencrypt/live/bedimsecurity.com/` | SSL certificates |

---

## Cloudflare

- **Zone:** bedimsecurity.com (Zone ID: 3481f50f6025c32e992c2d6da67516f6)
- **DNS:** A record `bedimsecurity.com` → `207.244.226.151`
- **Proxy status:** DNS only (no Cloudflare proxy for app)

---

## Fixes Applied 2026-03-20

### Missing SSL vhost block
**Problem:** `bedimsecurity.com` nginx config was missing `listen 443 ssl` server block. HTTPS requests fell through to default vhost and served `auth.stsgym.com` cert.

**Fix:** Added complete SSL server block with correct cert paths:
```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name bedimsecurity.com www.bedimsecurity.com;

    ssl_certificate /etc/letsencrypt/live/bedimsecurity.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bedimsecurity.com/privkey.pem;
    ...
}
```

**Verification:** After fix, HTTPS returns correct cert and 200 response.
