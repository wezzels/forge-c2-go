# FORGE-C2 Deferred Tasks

**Last Updated:** 2026-04-16

---

## ✅ All Phases Complete

Phases 1-6 are fully implemented and tested. See ROADMAP.md for details.

---

## ✅ Completed This Session

### Test Coverage Improvements
| Package | Before | After |
|---------|--------|-------|
| bmds | 10.0% | 98.6% |
| internal | 37.9% | 44.1% |
| hla | 35.6% | 48.1% |
| swap | 38.2% | 42.2% |
| tena | 23.5% | 26.6% |
| jseries | 93.7% | 93.7% |
| dis | 73.5% | 73.5% |

### Performance Benchmarks
| Benchmark | ns/op | allocs |
|-----------|-------|--------|
| J0 Encode | 328 | 2 |
| J0 Decode | 347 | 3 |
| J3 Encode | 205 | 2 |
| J12 Encode | 326 | 2 |
| J28 Encode | 432 | 2 |
| Full Roundtrip | 775 | 5 |
| Health Endpoint | 4,407 | 54 |
| Inject Sensor | 1,972 | 23 |
| Track List | 1,779 | 19 |
| Metrics | 6,519 | 82 |
| Security Middleware | 1,712 | 19 |

### Bug Fix: J3 TrackUpdate Registry
J3 was missing from both encoder and decoder registries. Fixed and test updated.

### Integration Testing
- `scripts/deploy-demo.sh` — 13/13 on darth
- `scripts/integration-test.sh` — 16/16 on darth
- HTTP test suite — 15/15

---

## 📋 Remaining Work

### 1. Push Documentation to GitLab Web UI
**Priority:** Low
**Status:** Blocked (GitLab not running on darth)

### 2. Create PPTX from Technical Paper
**Priority:** Low
**Status:** Not started

### 3. Live JREAP/DIS Transport Tests
**Priority:** Medium
**Status:** Script ready, needs server restart with transport ports

Start server with: `./forge-c2 -mode serve --jreap-udp-port 5000 --jreap-tcp-port 5001 --dis-port 3000`

### 4. Kafka End-to-End Pipeline Test
**Priority:** Medium
**Status:** Not started

Requires Kafka running. Use docker-compose.yml to spin up the full stack.

### 5. Load Testing
**Priority:** Low
**Status:** Not started

Use vegeta or wrk to benchmark under concurrent load (1000+ tracks, 100+ WebSocket clients).

---

*Move tasks to active work as they become priority.*