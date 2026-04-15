# FORGE-C2 Installation Guide

**Version:** 1.0 | **Date:** 2026-04-15 | **Classification:** Unclassified // FOUO

---

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Quick Start](#3-quick-start)
4. [Building from Source](#4-building-from-source)
5. [Docker Deployment](#5-docker-deployment)
6. [Kubernetes Deployment](#6-kubernetes-deployment)
7. [Configuration Reference](#7-configuration-reference)
8. [Verifying Installation](#8-verifying-installation)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Overview

FORGE-C2 is a JREAP-C/Link 16 compliant command and control middleware that provides:

- **JREAP-C encoding/decoding** for all 32 J-series message types (J0-J31)
- **DIS gateway** (IEEE 1278.1) for Entity State, Fire, Detonation PDUs
- **HLA gateway** (IEEE 1516) with RTI federation management
- **TENA gateway** with session bridging and discovery
- **MDPAF-compliant** metadata, quality flags, and correlation tracking
- **REST API** and **WebSocket** for real-time track updates
- **Prometheus metrics** and health endpoints

### Architecture

```
                    ┌──────────────────────────────────────────┐
                    │              FORGE-C2                     │
                    │                                           │
  Kafka ──────────►│  Sensor Ingest ─► Track Correlator        │
  DIS UDP ────────►│  DIS Gateway   ─► JREAP Encoder/Decoder  │
  HLA Federation ─►│  HLA Gateway   ─► C2BMC Interface        │
  TENA Session ───►│  TENA Gateway  ─► Alert Engine            │
                    │                     │                     │
                    │              ┌──────▼──────┐              │
                    │              │  JREAP-C    │              │
                    │              │  Transport  │              │
                    │              │  (UDP/TCP)  │              │
                    │              └─────────────┘              │
                    └──────────────────────────────────────────┘
                                        │
                              Link 16 Network
```

---

## 2. Prerequisites

### Minimum Requirements

| Component | Requirement |
|-----------|------------|
| OS | Linux (Ubuntu 22.04+), macOS, Windows (WSL2) |
| CPU | 2 cores |
| RAM | 512 MB |
| Disk | 100 MB |
| Go | 1.22+ |
| Docker | 20.10+ (for containerized deployment) |
| Kubernetes | 1.27+ (for K8s deployment) |

### Optional Dependencies

| Component | Purpose | Version |
|-----------|---------|---------|
| Kafka | Sensor event streaming | 3.0+ |
| Kind | Local K8s cluster | 0.20+ |
| Helm | K8s package management | 3.12+ |
| Prometheus | Metrics collection | 2.45+ |
| Grafana | Dashboard visualization | 10.0+ |
| HAProxy | Load balancing | 2.8+ |

---

## 3. Quick Start

### Download and Build

```bash
# Clone the repository
git clone git@idm.wezzel.com:crab-meat-repos/forge-c2-go.git
cd forge-c2-go

# Build
go build -o forge-c2 ./cmd/forge-c2

# Verify
./forge-c2 --version
```

### Run Standalone

```bash
# Start with default settings (port 8080)
./forge-c2 serve --port 8080

# With JREAP transport
./forge-c2 serve --port 8080 --jreap-udp-port 5000 --jreap-tcp-port 5001

# With DIS gateway
./forge-c2 serve --port 8080 --jreap-udp-port 5000 --dis-port 3000
```

### Verify It's Running

```bash
# Health check
curl http://localhost:8080/health

# Readiness
curl http://localhost:8080/ready

# Prometheus metrics
curl http://localhost:8080/metrics

# Expected health response:
# {"status":"ok","uptime":"...","active_tracks":0,"jreap_encoded":0,...}
```

---

## 4. Building from Source

### Standard Build

```bash
go build -o forge-c2 ./cmd/forge-c2
```

### Optimized Build

```bash
CGO_ENABLED=0 go build -ldflags="-s -w" -o forge-c2 ./cmd/forge-c2
# Produces ~15MB binary (stripped)
```

### Cross-Compilation

```bash
# Linux ARM64 (e.g., Raspberry Pi)
GOOS=linux GOARCH=arm64 go build -o forge-c2-arm64 ./cmd/forge-c2

# Windows
GOOS=windows GOARCH=amd64 go build -o forge-c2.exe ./cmd/forge-c2

# macOS Apple Silicon
GOOS=darwin GOARCH=arm64 go build -o forge-c2-mac ./cmd/forge-c2
```

### Run Tests

```bash
# Full test suite (11 packages)
go test ./... -count=1

# Verbose with coverage
go test ./... -v -cover -count=1

# Specific package
go test ./jreap/... -v -count=1        # JREAP encoder/decoder
go test ./internal/gateway/ -v -count=1 # All gateways
go test ./internal/ -run TestSecurity  # Security middleware
```

---

## 5. Docker Deployment

### Build Image

```bash
# From project root
docker build -t forge-c2:latest .

# Or with Docker Compose
docker-compose up -d
```

### Docker Compose Example

```yaml
version: '3.8'
services:
  forge-c2:
    image: forge-c2:latest
    ports:
      - "8080:8080"   # HTTP API + WebSocket
      - "5000:5000/udp"  # JREAP UDP
      - "5001:5001/tcp"  # JREAP TCP
      - "3000:3000/udp"  # DIS
    environment:
      - FORGE_C2_PORT=8080
      - KAFKA_BROKER=kafka:9092
      - C2BMC_URL=http://c2bmc:5016
      - SECURITY_ALLOWED_ORIGINS=https://forge.example.com
      - SECURITY_RATE_LIMIT=60
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 10s
      timeout: 5s
      retries: 3
```

### Run with Docker

```bash
docker run -d \
  --name forge-c2 \
  -p 8080:8080 \
  -p 5000:5000/udp \
  -p 5001:5001/tcp \
  -p 3000:3000/udp \
  -e KAFKA_BROKER=kafka:9092 \
  -e SECURITY_ALLOWED_ORIGINS=https://forge.example.com \
  forge-c2:latest
```

---

## 6. Kubernetes Deployment

### Option A: Raw Manifests

```bash
# Create namespace
kubectl create namespace gms

# Apply configs
kubectl apply -f deploy/k8s/forge-c2-config.yaml
kubectl apply -f deploy/k8s/forge-c2-secret.yaml
kubectl apply -f deploy/k8s/forge-c2-deploy.yaml
kubectl apply -f deploy/k8s/forge-c2-svc.yaml

# Verify
kubectl get pods -n gms -l app=forge-c2
kubectl logs -n gms -l app=forge-c2 --tail=20
```

### Option B: Helm Chart

```bash
# Install from local chart
helm install forge-c2 deploy/helm/forge-c2/ \
  --namespace gms \
  --set kafka.broker=kafka.gms.svc.cluster.local:9092 \
  --set c2bmc.url=http://c2bmc.gms.svc.cluster.local:5016 \
  --set security.allowedOrigins[0]=https://forge.example.com

# Upgrade
helm upgrade forge-c2 deploy/helm/forge-c2/ --namespace gms

# Uninstall
helm uninstall forge-c2 --namespace gms
```

### Option C: Kind (Local Development)

```bash
# Create cluster
kind create cluster --config deploy/kind/config.yaml

# Load image into cluster
kind load docker-image forge-c2:latest --name forge-c2

# Deploy
kubectl apply -f deploy/k8s/

# Port-forward for local access
kubectl port-forward -n gms svc/forge-c2 8080:8080
```

### Verify K8s Deployment

```bash
# Pod status
kubectl get pods -n gms -l app=forge-c2

# Health check via port-forward
kubectl port-forward -n gms svc/forge-c2 8080:8080 &
curl http://localhost:8080/health

# Logs
kubectl logs -n gms -l app=forge-c2 -f

# Metrics
curl http://localhost:8080/metrics
```

---

## 7. Configuration Reference

### Command-Line Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--port` | `8080` | HTTP API port |
| `--jreap-udp-port` | `0` | JREAP UDP listen port (0=disabled) |
| `--jreap-tcp-port` | `0` | JREAP TCP listen port (0=disabled) |
| `--dis-port` | `0` | DIS gateway UDP port (0=disabled) |
| `--kafka-broker` | `""` | Kafka broker address |
| `--c2bmc-url` | `""` | C2BMC interface URL |

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FORGE_C2_PORT` | `8080` | HTTP port |
| `KAFKA_BROKER` | `""` | Kafka broker |
| `KAFKA_CONSUMER_GROUP` | `forge-c2-group` | Consumer group ID |
| `C2BMC_URL` | `""` | C2BMC URL |
| `SECURITY_ALLOWED_ORIGINS` | `""` | Comma-separated CORS origins |
| `SECURITY_RATE_LIMIT` | `60` | Requests per minute per IP |
| `SECURITY_CSRF_KEY` | `""` | CSRF auth key (empty=disabled) |
| `SECURITY_MAX_REQUEST_SIZE` | `1048576` | Max request bytes |

### Security Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `AllowedOrigins` | `[]` | CORS allowed origins (empty=deny cross-origin) |
| `MaxRequestSize` | `1MB` | Maximum HTTP request body |
| `RateLimitPerMin` | `60` | Token bucket rate per IP |
| `RateLimitBurst` | `10` | Token bucket burst per IP |
| `EnableCSRF` | `true` | CSRF token validation for POST/PUT/DELETE |
| `CSRFAuthKey` | `""` | HMAC key for CSRF (empty=skip in dev) |
| `TrustedProxies` | `[]` | Trusted reverse proxy IPs for X-Forwarded-For |

### Kafka Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `consumerGroupID` | `forge-c2-group` | Shared group for horizontal scaling |

Set via `kafka.SetConsumerGroup("my-group")` or `KAFKA_CONSUMER_GROUP` env var.

---

## 8. Verifying Installation

### Health Checks

```bash
# Basic health
curl -s http://localhost:8080/health | jq .

# Readiness
curl -s http://localhost:8080/ready | jq .

# Metrics
curl -s http://localhost:8080/metrics | head -20
```

### API Tests

```bash
# List tracks (should be empty on fresh start)
curl http://localhost:8080/api/tracks

# Get server status
curl http://localhost:8080/api/status

# Correlator stats
curl http://localhost:8080/api/correlator/stats

# WebSocket (requires wscat or similar)
wscat -c ws://localhost:8080/ws/c2
```

### JREAP Tests

```bash
# Send a test JREAP message via UDP
echo -n '<JREAP binary message>' | nc -u localhost 5000

# Monitor JREAP TCP
nc localhost 5001
```

### DIS Tests

```bash
# Send a DIS Entity State PDU via UDP (Python)
python3 -c "
import socket, struct
# Minimal DIS Entity State PDU header
header = struct.pack('>HBBHII', 7, 0, 1, 0, 144, 0)
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.sendto(header + b'\x00'*128, ('localhost', 3000))
print('DIS PDU sent')
"
```

---

## 9. Troubleshooting

### Server Won't Start

| Symptom | Cause | Fix |
|---------|-------|-----|
| `bind: address already in use` | Port conflict | Change `--port` or kill conflicting process |
| `kafka: client has run out of brokers` | Kafka unreachable | Check `--kafka-broker` address |
| `JREAP-UDP: Failed to start` | Permission denied | Use port >1024 or run as root |

### No Tracks Appearing

1. Check sensor events are arriving: `curl /api/status`
2. Verify Kafka connection: check logs for `[KAFKA]` messages
3. Check correlator stats: `curl /api/correlator/stats`

### WebSocket Disconnects

1. Check `AllowedOrigins` matches your frontend URL
2. Verify proxy supports WebSocket upgrade (check HAProxy/nginx config)
3. Check rate limiting: `SECURITY_RATE_LIMIT` may be too low

### High Memory Usage

1. Reduce track age: lower `MaxTrackAge` in correlator config
2. Check active WebSocket connections: `curl /metrics | grep active_ws`
3. Monitor via Grafana: import `deploy/grafana/forge-c2.json`

### Rate Limiting Too Aggressive

```bash
# Increase limit via environment
export SECURITY_RATE_LIMIT=200
export SECURITY_RATE_BURST=30
```

### K8s Pods CrashLoopBackOff

```bash
kubectl logs -n gms -l app=forge-c2 --previous
kubectl describe pod -n gms -l app=forge-c2
```

---

## Support

- **Docs:** `docs/` directory in this repository
- **Compliance:** `docs/FORGE-MDPAF-COMPLIANCE.md`
- **Roadmap:** `docs/ROADMAP.md`
- **Security:** `docs/SECURITY.md`

---

*FORGE-C2 v1.0 — STSGYM*