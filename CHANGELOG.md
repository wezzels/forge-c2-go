# FORGE-C2 Changelog

All notable changes to FORGE-C2 will be documented in this file.

## [1.0.0] - 2026-04-15

### Added
- JREAP-C encoder/decoder for all 32 J-series message types (J0-J31)
- DIS gateway (IEEE 1278.1) with bidirectional Entity State, Fire, Detonation PDU bridge
- HLA gateway (IEEE 1516-2010) with RTI federation management
- TENA gateway with session bridging and DIS/HLA cross-registration
- MDPAF-compliant metadata, quality flags, and correlation tracking
- Track correlator with gate distance and force type classification
- C2BMC interface for engagement orders and weapon status
- Alert engine for threat notifications
- REST API: `/api/tracks`, `/api/status`, `/api/alerts`, `/api/c2bmc/*`
- WebSocket: `/ws/c2` (track updates), `/ws/alerts` (alert stream)
- Prometheus `/metrics` endpoint with 20+ counters/gauges
- `/health` and `/ready` endpoints for K8s probes
- Security middleware: CSRF, CORS, rate limiting, security headers, request size limits
- Kafka consumer with shared consumer group for horizontal scaling
- Helm chart (`deploy/helm/forge-c2/`)
- K8s manifests (`deploy/k8s/`)
- Kind cluster config
- HA proxy config for load balancing
- Grafana dashboard (`deploy/grafana/forge-c2.json`)
- Alertmanager config + Prometheus alerting rules
- 15 MDPAF compliance validators
- Full J-series roundtrip test suite (31 message types)
- Installation guide (`docs/INSTALL.md`)
- Usage guide (`docs/USAGE.md`)
- Configuration reference (`docs/CONFIG.md`)
- Security guide (`docs/SECURITY.md`)
- Monitoring guide (`docs/MONITORING.md`)
- C2 landscape comparison (`docs/C2-LANDSCAPE.md`)
- MDPAF compliance matrix (`docs/FORGE-MDPAF-COMPLIANCE.md`)
- Dockerfile with multi-stage build
- Makefile with build, test, docker, kind targets
- Graceful shutdown with 10s timeout

### Fixed
- J31/J19-J25 registry interleaving bug in encoder/decoder
- J8 Radio registry (was no-op → calls PackJ8Radio)
- Variable-length J-series types (J8, J31) use PayloadSize() = -1
- Zero-value SecurityConfig blocking all POST requests
- Rate limiter too aggressive (60/min → 600/min, burst 10 → 50)
- Localhost rate limiting exemption for health/metrics/admin endpoints