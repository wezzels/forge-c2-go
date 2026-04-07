# Infrastructure Setup Manual

**Generated**: 2026-04-06  
**Author**: Spark (Wez AI Assistant)  
**Repository**: idm.wezzel.com:crab-meat-repos/stsgym-work

---

## Table of Contents

1. [Server Overview](#server-overview)
2. [ComfyUI Setup (Image Generation)](#comfyui-setup-image-generation)
3. [Ollama LLM Server](#ollama-llm-server)
4. [Web Services](#web-services)
5. [SSL Certificates](#ssl-certificates)
6. [DNS Configuration](#dns-configuration)
7. [Service Management](#service-management)
8. [Troubleshooting](#troubleshooting)

---

## Server Overview

### Infrastructure Map

| Server | IP (LAN) | IP (Tailscale) | Purpose |
|--------|----------|----------------|---------|
| miner | 207.244.226.151 | 100.116.245.125 | Production web, Docker |
| darth | 10.0.0.117 | 100.92.94.92 | Wazuh SIEM, Ollama, ComfyUI |
| trooper1 | 10.0.0.99 | 100.116.156.61 | RTL-SDR, temperature monitoring |
| RPI42 | 192.168.1.151 | (none) | OpenClaw agent |
| swordfish | 209.145.59.209 | (jump server) | SSH jump server (port 23) |

### SSH Keys

| Key | Location | Purpose |
|-----|----------|---------|
| id_ed25519 | ~/.ssh/id_ed25519 | miner, darth (primary) |
| id_rsa | ~/.ssh/id_rsa | Legacy access |
| crackers | ~/.openclaw/workspace/crackers | swordfish jump server |

### Quick Access

```bash
# Primary servers
ssh -i ~/.ssh/id_ed25519 wez@10.0.0.117     # darth (Ollama, ComfyUI)
ssh -i ~/.ssh/id_ed25519 wez@207.244.226.151 # miner (production web)

# Jump server
ssh -i ~/.openclaw/workspace/crackers -p 23 wez@wezzel.com  # swordfish
```

---

## ComfyUI Setup (Image Generation)

### Server: darth (10.0.0.117)
### GPU: NVIDIA GeForce RTX 5060 Ti (16GB VRAM)

#### Installation

ComfyUI was chosen over Automatic1111 due to Python 3.12 compatibility issues on Ubuntu 24.04. ComfyUI has cleaner dependency management.

```bash
# Clone repository
cd /home/wez
git clone https://github.com/comfyanonymous/ComfyUI.git

# Create Python 3.10 virtual environment
cd ComfyUI
python3.10 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
pip install -r requirements.txt
```

#### Models

SDXL Base 1.0 is installed:

```bash
# Model location
/home/wez/ComfyUI/models/checkpoints/sd_xl_base_1.0.safetensors

# Download additional models
cd /home/wez/ComfyUI/models/checkpoints
wget https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors
```

#### Running ComfyUI

```bash
# Manual start
cd /home/wez/ComfyUI
source venv/bin/activate
python main.py --listen 0.0.0.0 --port 8188

# Check status
curl http://127.0.0.1:8188/system_stats
```

#### Access URLs

| Network | URL |
|---------|-----|
| Local | http://127.0.0.1:8188 |
| LAN | http://10.0.0.117:8188 |
| Tailscale | http://100.92.94.92:8188 |

#### Systemd Service

Service file: `/etc/systemd/system/comfyui.service`

```ini
[Unit]
Description=ComfyUI - Stable Diffusion WebUI
After=network.target

[Service]
Type=simple
User=wez
WorkingDirectory=/home/wez/ComfyUI
Environment=CUDA_VISIBLE_DEVICES=0
ExecStart=/home/wez/ComfyUI/venv/bin/python main.py --listen 0.0.0.0 --port 8188
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable comfyui
sudo systemctl start comfyui
```

#### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/system_stats` | GET | System info (GPU, VRAM, versions) |
| `/object_info` | GET | Available nodes |
| `/prompt` | POST | Submit workflow |
| `/history` | GET | Generation history |
| `/view` | GET | View generated image |

#### Generating Images via API

```python
import requests
import json

# Basic text-to-image workflow
workflow = {
    "3": {
        "class_type": "KSampler",
        "inputs": {
            "seed": 123456,
            "steps": 20,
            "cfg": 7.5,
            "sampler_name": "euler",
            "scheduler": "normal",
            "denoise": 1.0,
            "model": ["4", 0],
            "positive": ["6", 0],
            "negative": ["7", 0],
            "latent_image": ["5", 0]
        }
    },
    "4": {
        "class_type": "CheckpointLoaderSimple",
        "inputs": {
            "ckpt_name": "sd_xl_base_1.0.safetensors"
        }
    },
    "5": {
        "class_type": "EmptyLatentImage",
        "inputs": {
            "width": 1024,
            "height": 1024,
            "batch_size": 1
        }
    },
    "6": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "text": "a cherry blossom tree with abundant pink flowers, minimalist style",
            "clip": ["4", 1]
        }
    },
    "7": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "text": "ugly, blurry, low quality",
            "clip": ["4", 1]
        }
    },
    "8": {
        "class_type": "VAEDecode",
        "inputs": {
            "samples": ["3", 0],
            "vae": ["4", 2]
        }
    },
    "9": {
        "class_type": "SaveImage",
        "inputs": {
            "filename_prefix": "ComfyUI",
            "images": ["8", 0]
        }
    }
}

response = requests.post(
    "http://10.0.0.117:8188/prompt",
    json={"prompt": workflow}
)
print(response.json())
```

#### GPU Memory Management

RTX 5060 Ti has 16GB VRAM - sufficient for SDXL at full resolution.

```bash
# Check VRAM usage
nvidia-smi

# Monitor during generation
watch -n 1 nvidia-smi
```

---

## Ollama LLM Server

### Server: darth (10.0.0.117)
### Port: 11434

#### Installed Models

| Model | Size | Purpose |
|-------|------|---------|
| llama3.1:8b | 4.9 GB | General purpose, fast |
| gemma3:12b | 8.1 GB | Multimodal capabilities |
| dolphin-llama3:8b-256k | 4.7 GB | Extended context |
| qwen3-coder:latest | 18 GB | Code generation |
| nomic-embed-text:latest | 274 MB | Embeddings |

#### Usage

```bash
# List models
ollama list

# Run model
ollama run llama3.1:8b

# API call
curl http://127.0.0.1:11434/api/generate -d '{
  "model": "llama3.1:8b",
  "prompt": "Why is the sky blue?"
}'
```

#### API Endpoint

```python
import requests

response = requests.post(
    "http://10.0.0.117:11434/api/generate",
    json={
        "model": "llama3.1:8b",
        "prompt": "Write a poem about clouds",
        "stream": False
    }
)
print(response.json()["response"])
```

---

## Web Services

### Server: miner (207.244.226.151)

#### Active Services (Docker)

| Service | Port | Status |
|---------|------|--------|
| fiftyone-app | 12765 | Running |
| auth-service | 5000 | Running |
| exerciseme-app | 5014 | Running |
| satellite | 5006 | Running |
| market-app | 12770 | Running |
| trade-stsgym | 5060 | Running |
| stock-analysis | 5061 | Running |

#### Nginx Sites

| Domain | Backend | SSL |
|--------|---------|-----|
| stsgym.com | 5003 (Flask) | Let's Encrypt |
| papers.stsgym.com | Static files | papers.stsgym.com cert |
| 51o8.stsgym.com | 12765 | 51o8.stsgym.com cert |
| auth.stsgym.com | 5000 | auth.stsgym.com cert |
| exerciseme.stsgym.com | 5014 | stsgym.com cert |
| satellite.stsgym.com | 5006 | satellite.stsgym.com cert |
| photos.stsgym.com | 5003 | stsgym.com cert |
| trade.stsgym.com | 5060 | trade.stsgym.com cert |

#### Docker Management

```bash
# List containers
docker ps -a

# Restart container
docker restart <container_name>

# View logs
docker logs -f <container_name>

# Check health
curl http://127.0.0.1:<port>/health
```

### Server: swordfish (209.145.59.209)

Jump server with nginx reverse proxy for wezzel.com domains.

#### Sites Configured

| Domain | Backend |
|--------|---------|
| wezzel.com | Static (countdown) |
| idm.wezzel.com | GitLab (port 8080) |
| n8n.wezzel.com | n8n (port 5678) |
| pushit.wezzel.com | Push service (port 7581) |
| motd.wezzel.com | MOTD (port 7544) |
| stsgym.com | Proxy to miner |

---

## SSL Certificates

### Let's Encrypt Certificates

Managed via certbot on respective servers.

#### miner Certificates

```bash
# List certificates
sudo certbot certificates

# Renew all
sudo certbot renew

# Issue new certificate
sudo certbot certonly --nginx -d newdomain.stsgym.com
```

#### Recent Certificate Issues (2026-04-06)

**papers.stsgym.com** was using wildcard certificate from stsgym.com which didn't include the subdomain. Fixed by issuing dedicated certificate:

```bash
sudo certbot certonly --nginx -d papers.stsgym.com
# Updated nginx config to use new cert
sudo sed -i 's|stsgym.com/fullchain|papers.stsgym.com/fullchain|g' /etc/nginx/sites-enabled/papers.stsgym.com
sudo nginx -t && sudo systemctl reload nginx
```

### Certificate Locations

| Domain | Certificate Path |
|--------|------------------|
| stsgym.com | /etc/letsencrypt/live/stsgym.com/ |
| papers.stsgym.com | /etc/letsencrypt/live/papers.stsgym.com/ |
| 51o8.stsgym.com | /etc/letsencrypt/live/51o8.stsgym.com/ |
| auth.stsgym.com | /etc/letsencrypt/live/auth.stsgym.com/ |

---

## DNS Configuration

### Cloudflare-Managed Domains

Most stsgym.com subdomains are proxied through Cloudflare.

#### Cloudflare SSL Mode

**Important**: SSL/TLS mode must be set to "Full" or "Full (Strict)", NOT "Flexible".

With "Flexible" mode, Cloudflare connects to origin via HTTP, origin redirects to HTTPS, creating a redirect loop.

#### Known Issues (2026-04-06)

| Domain | Issue | Fix |
|--------|-------|-----|
| 51o8.stsgym.com | 301 redirect loop | Check Cloudflare SSL mode |
| exerciseme.stsgym.com | 301 redirect loop | Check Cloudflare SSL mode |
| satellite.stsgym.com | 301 redirect loop | Check Cloudflare SSL mode |

#### DNS Records

| Domain | Type | Value | Proxy |
|--------|------|-------|-------|
| stsgym.com | A | 207.244.226.151 | Yes |
| *.stsgym.com | A | 207.244.226.151 | Yes |
| wezzel.com | A | 209.145.59.209 | No |
| *.wezzel.com | A | 209.145.59.209 | No |

---

## Service Management

### Systemd Services

#### darth

```bash
# Ollama
sudo systemctl status ollama
sudo systemctl restart ollama

# ComfyUI
sudo systemctl status comfyui
sudo systemctl restart comfyui

# Wazuh
sudo systemctl status wazuh-manager
sudo systemctl status wazuh-agent
```

#### miner

```bash
# Nginx
sudo systemctl status nginx
sudo systemctl reload nginx

# Docker
sudo systemctl status docker
docker ps -a
```

### Logs

```bash
# ComfyUI logs
tail -f /home/wez/comfyui.log

# Ollama logs
journalctl -u ollama -f

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log
```

---

## Troubleshooting

### ComfyUI Won't Start

```bash
# Check GPU
nvidia-smi

# Check Python environment
cd /home/wez/ComfyUI
source venv/bin/activate
python -c "import torch; print(torch.cuda.is_available())"

# Check port
ss -tlnp | grep 8188

# Check logs
tail -100 /home/wez/comfyui.log
```

### SSL Certificate Errors

```bash
# Test certificate
openssl s_client -connect domain.stsgym.com:443 -servername domain.stsgym.com

# Check certificate dates
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
```

### Docker Container Issues

```bash
# Check container status
docker inspect <container_name>

# Check container logs
docker logs <container_name> --tail 100

# Restart container
docker restart <container_name>

# Check network
docker network ls
docker network inspect bridge
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check for port conflicts
sudo ss -tlnp | grep :443

# Reload configuration
sudo systemctl reload nginx

# Check specific site
curl -I http://127.0.0.1/ -H "Host: domain.stsgym.com"
```

### Cloudflare Redirect Loops

1. Log into Cloudflare dashboard
2. Go to SSL/TLS > Overview
3. Set encryption mode to "Full" or "Full (Strict)"
4. Clear Cloudflare cache (Caching > Configuration > Purge Everything)

---

## Maintenance

### Daily Tasks

- Check service status: `docker ps` and `systemctl status`
- Monitor disk space: `df -h`
- Check logs for errors

### Weekly Tasks

- Update system packages: `sudo apt update && sudo apt upgrade`
- Renew SSL certificates: `sudo certbot renew`
- Check GPU temperature: `nvidia-smi`

### Monthly Tasks

- Update Docker images
- Review access logs for anomalies
- Backup configurations

---

## File Locations Reference

### darth (10.0.0.117)

| Path | Purpose |
|------|---------|
| /home/wez/ComfyUI | ComfyUI installation |
| /home/wez/ComfyUI/models/checkpoints | SDXL models |
| /home/wez/comfyui.log | ComfyUI log |
| /usr/share/ollama/.ollama/models | Ollama models |

### miner (207.244.226.151)

| Path | Purpose |
|------|---------|
| /etc/nginx/sites-enabled/ | Nginx site configs |
| /etc/letsencrypt/live/ | SSL certificates |
| /var/www/papers/ | Papers static files |
| /home/wez/stsgym-work/ | Documentation repository |

### swordfish (209.145.59.209)

| Path | Purpose |
|------|---------|
| /etc/nginx/conf.d/ | Nginx configs |
| /etc/letsencrypt/live/wezzel.com/ | SSL certificate |
| /home/crackers/ | User home |

---

## Quick Reference Commands

```bash
# SSH to darth
ssh -i ~/.ssh/id_ed25519 wez@10.0.0.117

# SSH to miner
ssh -i ~/.ssh/id_ed25519 wez@207.244.226.151

# SSH to swordfish (jump server)
ssh -i ~/.openclaw/workspace/crackers -p 23 wez@wezzel.com

# Check ComfyUI status
curl http://10.0.0.117:8188/system_stats

# Check Ollama status
curl http://10.0.0.117:11434/api/tags

# Check web service health
curl -I https://papers.stsgym.com/
curl -I https://51o8.stsgym.com/health

# View docker containers
ssh wez@207.244.226.151 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'

# Reload nginx
ssh wez@207.244.226.151 'sudo systemctl reload nginx'

# GPU status
ssh wez@10.0.0.117 'nvidia-smi --query-gpu=name,memory.total,memory.free --format=csv'
```

---

_Last updated: 2026-04-06_