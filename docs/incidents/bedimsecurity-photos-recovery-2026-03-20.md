# Incident: bedimsecurity.com & photos.stsgym.com Down — 2026-03-20

**Severity:** High  
**Duration:** ~20 minutes  
**Resolved:** 2026-03-20 14:07 UTC

## Summary

After rebooting miner (207.244.226.151) to apply OS security updates, both bedimsecurity.com and photos.stsgym.com were unreachable or returning errors.

## Symptoms

- **bedimsecurity.com** — HTTPS returned wrong SSL certificate (auth.stsgym.com instead of bedimsecurity.com)
- **photos.stsgym.com** — 502 Bad Gateway

## Root Causes

### 1. Missing SSL vhost for bedimsecurity.com
The nginx config at `/etc/nginx/sites-available/bedimsecurity.com` only had a port 80 (HTTP) block. The `listen 443 ssl` server block was entirely missing.

When a request came in for `https://bedimsecurity.com`, nginx had no matching SSL vhost, so it fell through to the default vhost which served `auth.stsgym.com`'s certificate.

**Fix:** Added complete SSL server block with correct Let's Encrypt cert paths.

### 2. photos-node container killed (Exit 137)
The `photos-node` Docker container was in an `Exited (137)` state. This typically means the process was killed by SIGKILL (signal 9), possibly due to OOM or the container being stopped during the reboot.

The container had `restart: unless-stopped` but the stale container object conflicted with `docker-compose up`, preventing automatic restart.

**Fix:** `sudo docker rm photos-node` then `sudo docker-compose up -d web`.

## Resolution

1. Removed conflicting photos-node container
2. Recreated photos-node via docker-compose
3. Added missing SSL vhost block to bedimsecurity.com nginx config
4. Reloaded nginx
5. Rebooted server to confirm clean startup
6. Verified all services after reboot — all healthy

## Files Changed

- `/etc/nginx/sites-available/bedimsecurity.com` — Added SSL (port 443) server block

## Verification

Post-recovery reboot test confirmed:
- nginx: enabled, running
- docker: enabled, running
- bedimsecurity-web: Up ~1 minute
- bedimsecurity-db: healthy
- bedimsecurity-redis: Up
- photos-node: Up ~1 minute
- photos-db: healthy
- photos-redis: Up
- bedimsecurity.com → HTTPS 200
- photos.stsgym.com → HTTPS 200

## Related Docs

- `BEDIMSECURITY-SITE-SETUP-2026-03-20.md` — Full site documentation
- `PHOTOS-NODE-RECOVERY-2026-03-20.md` — Detailed recovery procedure
