# GMS Mock UI Installer

## System Requirements

- **Node.js:** v18.x or higher
- **npm:** v9.x or higher
- **OS:** Linux, macOS, or Windows
- **Memory:** 4GB minimum, 8GB recommended
- **Disk:** 500MB free space

---

## Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/snl-gms-mock.git
cd snl-gms-mock

# Install dependencies
npm install

# Build for production
npm run build

# Start development server
HOST=0.0.0.0 PORT=3001 npm run dev
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `0.0.0.0` | Server host |
| `PORT` | `3001` | Server port |
| `API_URL` | `http://localhost:3000` | API gateway URL |
| `WS_URL` | `ws://localhost:3000` | WebSocket URL |
| `CESIUM_ION_TOKEN` | - | Cesium Ion token (optional) |

---

## Docker Deployment

```bash
# Build image
docker build -t gms-mock-ui:latest .

# Run container
docker run -d \
  --name gms-mock-ui \
  -p 3001:3001 \
  -e HOST=0.0.0.0 \
  -e PORT=3001 \
  gms-mock-ui:latest
```

---

## Kubernetes Deployment

```bash
# Apply deployment
kubectl apply -f k8s-deployment.yaml

# Get external IP
kubectl get svc gms-mock-ui
```

---

*Created: 2026-03-15*
