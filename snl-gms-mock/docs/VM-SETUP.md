# VM Setup Guide

## Minimum Requirements

- **OS:** Ubuntu 22.04 LTS or Rocky Linux 9
- **RAM:** 8GB minimum, 16GB recommended
- **CPU:** 4 cores minimum
- **Disk:** 50GB free space
- **Network:** Static IP with port 3001, 31595, 31845 open

---

## Quick Setup

### 1. Install Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Rocky/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

### 2. Clone and Build

```bash
# Clone repository
git clone https://github.com/your-org/snl-gms-mock.git
cd snl-gms-mock

# Install dependencies
npm install

# Build production bundle
npm run build
```

### 3. Install as Systemd Service

```bash
# Copy service file
sudo cp /home/wez/stsgym-work/snl-gms-mock/gms-mock-ui.service /etc/systemd/system/

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable gms-mock-ui
sudo systemctl start gms-mock-ui

# Check status
sudo systemctl status gms-mock-ui
```

### 4. Configure Firewall

```bash
# Ubuntu (ufw)
sudo ufw allow 3001/tcp
sudo ufw allow 31595/tcp
sudo ufw allow 31845/tcp

# Rocky (firewalld)
sudo firewall-cmd --add-port=3001/tcp --permanent
sudo firewall-cmd --add-port=31595/tcp --permanent
sudo firewall-cmd --add-port=31845/tcp --permanent
sudo firewall-cmd --reload
```

---

## Full Setup Script

Save as `install-gms-mock.sh`:

```bash
#!/bin/bash
set -e

echo "=== GMS Mock UI VM Setup ==="

# Check root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit 1
fi

# Install Node.js
echo "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install npm packages
echo "Installing npm packages globally..."
npm install -g npm@latest

# Create user
echo "Creating gms user..."
useradd -m -s /bin/bash gms || true

# Clone repository
echo "Cloning repository..."
cd /opt
git clone https://github.com/your-org/snl-gms-mock.git gms-mock-ui || true
cd gms-mock-ui

# Install dependencies
echo "Installing dependencies..."
npm install

# Build
echo "Building..."
npm run build

# Create systemd service
echo "Creating systemd service..."
cat > /etc/systemd/system/gms-mock-ui.service << 'SERVICE'
[Unit]
Description=GMS Mock UI
After=network.target

[Service]
Type=simple
User=gms
Group=gms
WorkingDirectory=/opt/gms-mock-ui
Environment=HOST=0.0.0.0
Environment=PORT=3001
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
SERVICE

# Enable and start
systemctl daemon-reload
systemctl enable gms-mock-ui
systemctl start gms-mock-ui

# Configure firewall
echo "Configuring firewall..."
ufw allow 3001/tcp
ufw allow 31595/tcp
ufw allow 31845/tcp

# Done
echo "=== Setup Complete ==="
echo "GMS Mock UI: http://$(hostname -I | cut -d' ' -f1):3001/"
echo "Status: $(systemctl is-active gms-mock-ui)"
```

---

## Memory Requirements

| Component | Memory |
|-----------|--------|
| Node.js | 256MB |
| GMS Mock UI | 512MB |
| GMS Simulator | 512MB |
| Wezzelos Dashboard | 128MB |
| **Total** | **~1.5GB** |

**Recommended:** 8GB RAM minimum (allows for OS and caching)

---

## Health Checks

```bash
# Check GMS Mock UI
curl http://localhost:3001/health

# Check GMS Simulator
curl http://localhost:31595/api/stations

# Check Wezzelos Dashboard
curl http://localhost:31845/health
```

---

## Troubleshooting

### Service won't start

```bash
# Check logs
sudo journalctl -u gms-mock-ui -n 50

# Check port
sudo lsof -i :3001

# Restart service
sudo systemctl restart gms-mock-ui
```

### Out of memory

```bash
# Increase Node memory
echo "NODE_OPTIONS=--max-old-space-size=4096" >> /etc/environment
systemctl restart gms-mock-ui
```

### Connection refused

```bash
# Check firewall
sudo ufw status

# Check service
sudo systemctl status gms-mock-ui

# Check port binding
sudo ss -tlnp | grep 3001
```

---

## Auto-start on Boot

Services are enabled by default:

```bash
# Verify
sudo systemctl is-enabled gms-mock-ui
# Should output: enabled

# Disable auto-start
sudo systemctl disable gms-mock-ui

# Re-enable auto-start
sudo systemctl enable gms-mock-ui
```

---

## Logs

```bash
# View logs
sudo journalctl -u gms-mock-ui -f

# View last 100 lines
sudo journalctl -u gms-mock-ui -n 100

# View since boot
sudo journalctl -u gms-mock-ui -b
```

---

*Created: 2026-03-15*
