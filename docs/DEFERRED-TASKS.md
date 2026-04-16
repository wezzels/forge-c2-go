# FORGE-C2 Deferred Tasks

**Last Updated:** 2026-04-16

---

## ✅ All Phases Complete

Phases 1-6 are fully implemented and tested. See ROADMAP.md for details.

---

## 📋 Remaining Work

### 1. Push Documentation to GitLab Web UI
**Priority:** Low
**Status:** Not started

Push FORGE-C2 docs to stsgym-forge GitLab project on darth for web viewing.

### 2. Create PPTX from Technical Paper
**Priority:** Low
**Status:** Not started

Convert `docs/FORGE-C2-TECHNICAL-PAPER.md` to PowerPoint slides.

### 3. Test Coverage Improvements
**Priority:** Medium
**Status:** Partial

Current coverage by package:
| Package | Coverage | Notes |
|---------|----------|-------|
| jreap/jseries | 93.7% | Excellent |
| internal/dis | 73.5% | Good |
| mdpa | 64.3% | Good |
| internal/gateway | 62.3% | Good |
| internal | 37.9% | Needs work (server.go paths) |
| internal/swap | 38.2% | Needs work |
| internal/hla | 35.6% | Needs work |
| jreap | 43.2% | Needs work (transport paths) |
| internal/bmds | 10.0% | Needs work |
| internal/tena | 23.5% | Needs work |

### 4. Live Integration Testing
**Priority:** Medium
**Status:** Demo passing

- `scripts/deploy-demo.sh` passes 13/13 on darth
- HTTP suite passes 15/15
- Need: JREAP UDP/TCP transport test against live server
- Need: DIS gateway integration test with real UDP traffic
- Need: Kafka end-to-end pipeline test

### 5. Performance Benchmarks
**Priority:** Low
**Status:** Not started

- Benchmark JREAP encode/decode throughput
- Benchmark track correlator under load (1000+ concurrent tracks)
- Benchmark WebSocket fanout latency
- Load test with vegeta or wrk

---

*Move tasks to active work as they become priority.*