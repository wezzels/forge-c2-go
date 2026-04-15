# FORGE-C2

Military-grade C2 (Command & Control) simulation platform supporting DIS, HLA, Link 16 J-series, TENA, and BMDS protocols.

## Quick Start

```bash
# Build
go build ./...

# Test
go test ./... -v

# Run
./cmd/forge-c2/forge-c2 -config config.yaml
```

## Protocol Support

| Protocol | Standard | Status |
|----------|----------|--------|
| **DIS** | IEEE 1278.1 | 94% |
| **HLA** | IEEE 1516-2010 | 78% |
| **J-series** | Link 16 SJ-UTPLink | 98% |
| **TENA** | TENA v2.1 | 55% |
| **BMDS** | BMD Studio ICD | 85% |

## Architecture

```
forge-c2/
├── cmd/forge-c2/          # Main application
├── jreap/                 # JREAP/J-series encoding
├── mdpa/                  # MDPA protocol
├── internal/
│   ├── dis/               # DIS IEEE 1278.1
│   ├── hla/               # HLA IEEE 1516
│   ├── tena/              # TENA v2.1
│   ├── bmds/              # BMDS C2 integration
│   ├── gateway/           # Protocol bridging
│   └── swap/             # SWAP optimization
└── docs/                  # Protocol specs
```

## Configuration

```yaml
# config.yaml
server:
  host: "0.0.0.0"
  port: 8080

dis:
  exercise_id: 1
  site_number: 1
  application_number: 1

hla:
  rti_host: "localhost:13988"
  federation_name: "FORGE-Federation"
```

## Testing

```bash
# Unit tests
go test ./... -v

# Conformance tests
go test ./internal/conformance/... -v

# Stress tests
go test ./internal/conformance/... -v -run "Stress"
```

## Deployment

See [docs/deployment/README.md](docs/deployment/README.md) for Kubernetes and Docker deployment.

## C2 Landscape

FORGE-C2 implements capabilities found in real-world missile defense systems. See [docs/C2-LANDSCAPE.md](docs/C2-LANDSCAPE.md) for a detailed comparison against C2BMC, FORGE (Space Force), Aegis, ICBS, and others.

| System | Role | FORGE-C2 Equivalent |
|--------|------|---------------------|
| **C2BMC** (Lockheed/MDA, $847M) | BMDS integration & command | Track correlation + engagement orders |
| **FORGE** (Space Force/BAE, $151M) | OPIR data processing | Kafka sensor pipeline + track formation |
| **Aegis Baseline** (Navy) | Ship-based BMD | Aegis shooter simulation |
| **ICBS** (Israel) | Multi-layer defense C2 | Threat classification + fire control |

## License

Proprietary - STSGYM LLC
