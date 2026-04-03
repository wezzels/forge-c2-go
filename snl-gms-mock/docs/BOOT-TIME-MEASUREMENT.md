# GMS Mock UI Boot Time Measurement

## Overview

This document describes how the GMS Mock UI boot time is measured and logged.

---

## Architecture



---

## Services

### gms-mock-ui.service

- **Purpose:** GMS Mock UI Node.js server
- **Port:** 3001
- **Start:** After network.target

### wezzelos-gms.service

- **Purpose:** Wezzelos dashboard
- **Port:** 31845
- **Start:** After gms-mock-ui.service

### x-windows.service

- **Purpose:** X Windows display
- **Display:** :0
- **Start:** After network.target

### gms-chrome.service

- **Purpose:** Chrome browser in kiosk mode
- **Dependencies:** gms-mock-ui, x-windows
- **Wait:** Up to 60 seconds for GMS Mock UI
- **URL:** http://localhost:3001/

### gms-boot-logger.service

- **Purpose:** Log boot time
- **Log:** /var/log/gms-boot-time.log
- **Start:** After all services

---

## Boot Time Log

### Location

/var/log/gms-boot-time.log

### Format

```
[YYYY-MM-DD HH:MM:SS] System uptime: XXs, GMS UI: active, Wezzelos: active, Chrome: active
```

### Example

```
[2026-03-15 20:00:00] System uptime: 45s, GMS UI: active, Wezzelos: active, Chrome: active
GMS Mock UI ready at boot time: 30 seconds
Chrome started at: 2026-03-15 20:00:30
Total boot time: 45 seconds
```

---

## Viewing Boot Times

```bash
# View all boot times
cat /var/log/gms-boot-time.log

# View last boot
tail -5 /var/log/gms-boot-time.log

# View boot time in seconds
grep "System uptime" /var/log/gms-boot-time.log | tail -1 | cut -d':' -f2 | cut -d's' -f1
```

---

## Expected Boot Times

| Component | Expected Time |
|-----------|--------------|
| GMS Mock UI | 10-15 seconds |
| Wezzelos | 5-10 seconds |
| X Windows | 3-5 seconds |
| Chrome | 5-10 seconds |
| **Total** | **30-45 seconds** |

---

## Chrome Kiosk Mode

Chrome runs with these flags:

```bash
google-chrome \
  --kiosk \
  --no-sandbox \
  --disable-gpu \
  --disable-software-rasterizer \
  --disable-dev-shm-usage \
  --disable-extensions \
  --disable-plugins \
  --disable-translate \
  --disable-sync \
  --disable-default-apps \
  --disable-background-networking \
  --disable-infobars \
  --no-first-run \
  --no-default-browser-check \
  --window-position=0,0 \
  --window-size=1920,1080 \
  --start-maximized \
  --app=http://localhost:3001/
```

---

## Troubleshooting

### Chrome won't start

```bash
# Check X Windows
systemctl status x-windows

# Check Chrome service
systemctl status gms-chrome

# Check logs
journalctl -u gms-chrome -n 50
```

### Display not found

```bash
# Check if X is running
pgrep -a X

# Set DISPLAY
export DISPLAY=:0
xhost +local:
```

### Port 3001 not responding

```bash
# Check GMS Mock UI
systemctl status gms-mock-ui

# Check port
ss -tlnp | grep 3001
```

---

## Manual Start

```bash
# Start all services
sudo systemctl start gms-mock-ui
sudo systemctl start wezzelos-gms
sudo systemctl start x-windows
sudo systemctl start gms-chrome

# Or start Chrome manually
DISPLAY=:0 google-chrome --kiosk --app=http://localhost:3001/
```

---

## Disable Auto-start

```bash
# Disable Chrome auto-start
sudo systemctl disable gms-chrome

# Disable X Windows
sudo systemctl disable x-windows
```

---

## Log Rotation

Add to /etc/logrotate.d/gms-boot:

```
/var/log/gms-boot-time.log {
    daily
    rotate 30
    compress
    missingok
    notifempty
    create 0644 root root
}
```

---

*Created: 2026-03-15*
