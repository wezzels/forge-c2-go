# Contributing to FORGE-C2

## Development Setup

```bash
# Clone
git clone git@idm.wezzel.com:crab-meat-repos/forge-c2-go.git
cd forge-c2-go

# Build
go build -o forge-c2 ./cmd/forge-c2

# Test (all 11 packages)
go test ./... -count=1

# Test specific packages
go test ./jreap/... -v          # JREAP encoder/decoder
go test ./internal/gateway/ -v  # DIS/HLA/TENA gateways
go test ./internal/ -v          # Server, security, metrics
```

## Code Structure

```
forge-c2-go/
├── cmd/forge-c2/          # Entrypoint (main.go, modes: serve/worker/health)
├── jreap/                  # JREAP-C protocol (encoder, decoder, transport, compliance)
│   └── jseries/            # J0-J31 message types (pack/unpack)
├── mdpa/                   # MDPAF data model (metadata, track extension, message map)
├── internal/
│   ├── server.go           # HTTP/WS server, routes, Kafka consumer
│   ├── security.go         # CSRF, CORS, rate limiting, headers
│   ├── metrics.go          # Prometheus metrics
│   ├── kafka.go            # Kafka producer/consumer
│   ├── correlator.go       # Track correlation
│   ├── bmds/               # BMDS C2BMC interface
│   ├── dis/                # DIS PDU types
│   ├── gateway/            # DIS/HLA/TENA gateway bridging
│   ├── hla/                # HLA RTI interface
│   ├── tena/               # TENA session/bridge
│   ├── conformance/        # Conformance testing
│   └── swap/               # SWAP optimization
├── deploy/                 # Deployment configs (K8s, Helm, Grafana, etc.)
├── docs/                   # Documentation
└── scripts/                # Build/entrypoint scripts
```

## Making Changes

1. Create a branch: `git checkout -b feature/my-feature`
2. Make changes and add tests
3. Run the full test suite: `go test ./... -count=1`
4. Run vet: `go vet ./...`
5. Format: `gofmt -w .`
6. Commit with descriptive message
7. Push: `git push origin feature/my-feature:feature/my-feature`

## Adding a New J-Series Message Type

1. Define struct in `jreap/jseries/` (e.g., `j32_weather.go`)
2. Implement `Pack()` and `Unpack()` methods
3. Register in `jreap/message_types.go` registry
4. Add `PayloadSize()` method
5. Add roundtrip test in `jreap/registry_integration_test.go`
6. Add compliance validator in `jreap/compliance.go`
7. Update `docs/USAGE.md` message types table

## Adding a New Gateway

1. Create `internal/gateway/<protocol>_gateway.go`
2. Implement `Start()`, `Stop()`, and bridge converters (e.g., `J0To<Proto>`)
3. Add tests in `internal/gateway/<protocol>_gateway_test.go`
4. Wire into server config in `internal/server.go`
5. Add CLI flag and environment variable

## Testing Conventions

- Table-driven tests for message encode/decode
- Roundtrip tests: encode → decode → compare
- Compliance tests: validate against MIL-STD-3011 field requirements
- Gateway tests: mock transport, verify PDU/message conversion

## Pull Request Checklist

- [ ] All tests pass (`go test ./... -count=1`)
- [ ] No vet warnings (`go vet ./...`)
- [ ] Formatted (`gofmt -w .`)
- [ ] New J-series types have roundtrip + compliance tests
- [ ] Documentation updated (USAGE.md, CHANGELOG.md if applicable)
- [ ] No hardcoded secrets or credentials