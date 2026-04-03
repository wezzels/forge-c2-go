# Photos-Node Recovery — 2026-03-20
**Site:** photos.stsgym.com  
**Server:** miner (207.244.226.151)  
**SSH:** `ssh wez@bedimsecurity.com`

---

## Incident

After rebooting miner (bedimsecurity.com) for OS updates, both sites failed:
- **bedimsecurity.com** — returned wrong SSL cert (auth.stsgym.com)
- **photos.stsgym.com** — returned 502 Bad Gateway

---

## Root Causes

### 1. photos-node container killed (Exit 137)
The `photos-node` container was killed (exit code 137 = OOM or SIGKILL) during the reboot process. The container wasn't running when nginx tried to proxy requests, causing 502.

**Recovery steps:**
```bash
# Remove stale container that conflicted with docker-compose
sudo docker rm photos-node

# Recreate via docker-compose
cd /home/wez/photos-node
sudo docker-compose up -d web
```

### 2. bedimsecurity.com missing SSL vhost
The nginx config for `bedimsecurity.com` only had an HTTP (port 80) block. The `listen 443 ssl` block was entirely missing. HTTPS requests fell through to the default vhost (`auth.stsgym.com`), which served its own cert.

**Recovery steps:**
```bash
# Edit nginx config
sudo nano /etc/nginx/sites-available/bedimsecurity.com

# Add missing SSL server block (see below)
sudo nginx -t && sudo systemctl reload nginx
```

---

## photos-node Docker Compose

**Location:** `/home/wez/photos-node/docker-compose.yml`

```yaml
version: "3.8"

services:
  web:
    build: .
    container_name: photos-node
    environment:
      NODE_ENV: production
      PORT: 5009
      SESSION_SECRET: photos-session-secret-2026
      COOKIE_SECRET: photos-cookie-secret-2026
      APP_URL: https://photos.stsgym.com
      AUTH_URL: https://auth.stsgym.com
    ports:
      - "127.0.0.1:5009:5009"
    volumes:
      - ./uploads:/app/uploads
      - ./public:/app/public
      - ./views:/app/views
      - ./src:/app/src
    restart: unless-stopped
    networks:
      - photos-network
    extra_hosts:
      - "auth.stsgym.com:host-gateway"

networks:
  photos-network:
    driver: bridge
```

**Restart policy:** `unless-stopped` — survives reboot ✅

---

## nginx Configuration

### bedimsecurity.com (fixed)
**Location:** `/etc/nginx/sites-available/bedimsecurity.com`

HTTP block (port 80) was present, SSL block (port 443) was missing. Added:

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name bedimsecurity.com www.bedimsecurity.com;

    ssl_certificate /etc/letsencrypt/live/bedimsecurity.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bedimsecurity.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://127.0.0.1:5013;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### photos.stsgym.com
**Location:** `/etc/nginx/sites-available/photos.stsgym.com`

No issues found. SSL cert: `/etc/letsencrypt/live/photos.stsgym.com/`

---

## Verification

After fix, server was rebooted again to confirm clean startup:

```bash
# Server status
uptime: 1 min
nginx: enabled, running ✅
docker: enabled, running ✅

# Containers
bedimsecurity-web: Up ~1 minute ✅
bedimsecurity-db: healthy ✅
bedimsecurity-redis: Up ✅
photos-node: Up ~1 minute ✅
photos-db: healthy ✅
photos-redis: Up ✅

# HTTPS responses
bedimsecurity.com → 200 ✅
photos.stsgym.com → 200 ✅
```

---

## Lessons Learned

1. **photos-node exit 137** — Container was killed, likely OOM. The `restart: unless-stopped` policy didn't help because the container object still existed and conflicted with `docker-compose up`. Need `docker rm` before recreating.

2. **bedimsecurity.com SSL vhost** — Someone edited the nginx config and removed or never added the SSL block. This site was likely set up with only HTTP initially and the SSL step was missed.

3. **Reboot test** — Always verify after kernel/OS updates with a full reboot test.

---

## Managing photos-node

```bash
# SSH to server
ssh wez@bedimsecurity.com

# Check status
sudo docker ps | grep photos

# View logs
sudo docker logs photos-node --tail 50

# Restart
cd /home/wez/photos-node
sudo docker-compose restart web

# Full rebuild if needed
sudo docker rm photos-node
sudo docker-compose up -d web
```
