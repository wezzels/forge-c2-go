# FORGE-C2

Military-grade C2 middleware supporting DIS, HLA, Link 16 J-series, TENA, and BMDS protocols. JREAP-C/MDPAF-compliant with real-time track correlation, engagement management, and multi-protocol gateway bridging.

## Quick Start

```bash
# Build
go build -o forge-c2 ./cmd/forge-c2

# Run
./forge-c2 -mode serve

# Test
go test ./... -count=1

# Docker
docker-compose up -d
```

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check with subsystem status |
| `GET /ready` | Readiness probe |
| `GET /metrics` | Prometheus metrics (20+ gauges) |
| `GET /api/tracks` | Active tracks |
| `GET /api/status` | Server + correlator status |
| `GET /api/alerts` | Alert list |
| `POST /api/inject/sensor` | Inject sensor event |
| `GET /api/c2bmc/status` | C2BMC sensor status |
| `WS /ws/c2` | Real-time track updates |
| `WS /ws/alerts` | Alert stream |

## Protocol Support

| Protocol | Standard | Coverage |
|----------|----------|----------|
| **J-series** | MIL-STD-3011 (JREAP-C) | 32/32 types (J0-J31) |
| **DIS** | IEEE 1278.1 | Entity State, Fire, Detonation |
| **HLA** | IEEE 1516-2010 | Federation, object publish/reflect |
| **TENA** | TENA v2.1 | Session gateway, discovery |
| **BMDS** | BMD Studio ICD | Track correlation, engagement |

## Architecture

```
forge-c2/
├── cmd/forge-c2/          # Entrypoint (serve/worker/health modes)
├── jreap/                  # JREAP-C protocol
│   └── jseries/            # J0-J31 message types
├── mdpa/                   # MDPAF data model
├── internal/
│   ├── server.go           # HTTP/WS server, routes, Kafka
│   ├── security.go         # CSRF, CORS, rate limiting
│   ├── metrics.go          # Prometheus metrics
│   ├── kafka.go            # Kafka producer/consumer
│   ├── correlator.go       # Track correlation
│   ├── bmds/               # C2BMC interface
│   ├── dis/                # DIS PDU types
│   ├── gateway/            # Protocol bridging
│   ├── hla/                # HLA RTI interface
│   ├── tena/               # TENA session/bridge
│   ├── conformance/        # Conformance testing
│   └── swap/               # SWAP optimization
├── deploy/                 # K8s, Helm, Grafana, HA proxy
├── docs/                   # Documentation
└── scripts/                # Entrypoint script
```

## Documentation

| Doc | Description |
|-----|-------------|
| [INSTALL.md](docs/INSTALL.md) | Full installation guide (source, Docker, K8s, Helm) |
| [USAGE.md](docs/USAGE.md) | API reference, JREAP examples, gateway usage |
| [CONFIG.md](docs/CONFIG.md) | Configuration reference |
| [SECURITY.md](docs/SECURITY.md) | Security guide (CSRF, CORS, rate limiting, headers) |
| [MONITORING.md](docs/MONITORING.md) | Prometheus metrics and Grafana setup |
| [ROADMAP.md](docs/ROADMAP.md) | Implementation roadmap (all 6 phases complete) |
| [FORGE-MDPAF-COMPLIANCE.md](docs/FORGE-MDPAF-COMPLIANCE.md) | MDPAF compliance matrix |
| [C2-LANDSCAPE.md](docs/C2-LANDSCAPE.md) | Comparison against C2BMC, Aegis, FORGE, ICBS |

## Deployment

```bash
# Docker Compose (with Kafka, Prometheus, Grafana)
docker-compose up -d

# Kubernetes
kubectl apply -f deploy/k8s/

# Helm
helm install forge-c2 deploy/helm/forge-c2/ --namespace gms

# Kind (local dev)
kind create cluster --config deploy/kind/config.yaml
```

## Testing

```bash
# Full suite (11 packages)
go test ./... -count=1

# Specific packages
go test ./jreap/... -v              # JREAP encoder/decoder
go test ./internal/gateway/ -v      # All gateways
go test ./internal/ -run TestSecurity  # Security middleware

# With coverage
go test ./... -cover -count=1
```

## C2 Landscape

| System | Role | FORGE-C2 Equivalent |
|--------|------|---------------------|
| **C2BMC** (Lockheed/MDA) | BMDS integration & command | Track correlation + engagement orders |
| **FORGE** (Space Force/BAE) | OPIR data processing | Kafka sensor pipeline + track formation |
| **Aegis Baseline** (Navy) | Ship-based BMD | Aegis shooter simulation |
| **ICBS** (Israel) | Multi-layer defense C2 | Threat classification + fire control |

## License

Proprietary — STSGYM LLC