# FORGE-C2 Implementation Roadmap
## Phased Development Plan

> **Version:** 1.0 | **Date:** 2026-04-10 | **Status:** Active

---

## Executive Summary

FORGE-C2 implements a JREAP-C/Link 16 compliant missile defense simulation platform. This roadmap decomposes all implementation work into the smallest verifiable tasks.

**Current Status:**
- Phase 1-2: ✅ Complete
- Phase 3: ✅ Complete
- Phase 4: ✅ Complete
- Phase 5: ✅ Complete

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FORGE-C2 SYSTEM ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                      EXTERNAL INTERFACES                            │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐             │ │
│  │  │  Kafka   │  │  C2BMC   │  │   DIS    │  │   HLA    │             │ │
│  │  │  Broker  │  │   API    │  │ Gateway  │  │Federation│             │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘             │ │
│  └──────┼──────────────┼──────────────┼──────────────┼───────────────────┘ │
│         │              │              │              │                       │
│         ▼              ▼              ▼              ▼                       │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                      TRANSPORT LAYER                               │ │
│  │         JREAP Header (16B) + CRC-16 (4B) = 20B overhead            │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                      JREAP ENCODER/DECODER                        │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │ │
│  │  │  Encoder    │  │  Registry   │  │  Decoder    │                 │ │
│  │  │  Registry   │◄─┤ (data-driven│─►│  Registry   │                 │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                 │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                              │                                          │
│         ┌────────────────────┼────────────────────┐                    │
│         ▼                    ▼                    ▼                     │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐            │
│  │  J-SERIES   │      │    MDPAF    │      │  INTERNAL   │            │
│  │  MESSAGES   │      │  EXTENSION  │      │  HANDLERS   │            │
│  │  (J0-J31)   │      │   (Track)   │      │(C2BMC/Kafka)│            │
│  └─────────────┘      └─────────────┘      └─────────────┘            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase Decomposition

### PHASE 1: Core Infrastructure ✅ COMPLETE

| Task ID | Task | File | Status | Verification |
|---------|------|------|--------|--------------|
| 1.1 | J-series message type constants | `jreap/message_types.go` | ✅ Done | `go build` |
| 1.2 | Pack/Unpack primitives (Uint16/24/32) | `jreap/jseries/pack_unpack.go` | ✅ Done | 10 tests pass |
| 1.3 | Pack/Unpack primitives (Float24) | `jreap/jseries/pack_unpack.go` | ✅ Done | Roundtrip test |
| 1.4 | Header layer (PDU header, CRC-16) | `jreap/header.go` | ✅ Done | 5 header tests |
| 1.5 | Encoder struct + registry map | `jreap/encoder.go` | ✅ Done | go build |
| 1.6 | Decoder struct + registry map | `jreap/decoder.go` | ✅ Done | go build |

### PHASE 2: J-Series Coverage ✅ COMPLETE

#### 2.1 J-Series Pack/Unpack Implementation

| Task ID | Task | File | Pack Fn | Unpack Fn | Status | Test |
|---------|------|------|---------|-----------|--------|------|
| 2.1.1 | J0 Track Management | `j0_track_mgmt.go` | ✅ | ✅ | ✅ Done | Roundtrip |
| 2.1.2 | J1 Network Init | `j1_network_init.go` | ✅ | ✅ | ✅ Done | Roundtrip |
| 2.1.3 | J2 Surveillance | `j2_surveillance.go` | ✅ | ✅ | ⚠️ WIP | None |
| 2.1.4 | J3 Track Update | `j3_track.go` | ✅ | ✅ | ✅ Done | Roundtrip |
| 2.1.5 | J4 Engagement Order | `j4_engagement_order.go` | ✅ | ✅ | ✅ Done | Roundtrip |
| 2.1.6 | J5 Engagement Status | `j5_engagement_status.go` | ✅ | ✅ | ✅ Done | Roundtrip |
| 2.1.7 | J6 Sensor Registration | `j6_sensor_reg.go` | ✅ | ✅ | ✅ Done | Roundtrip |
| 2.1.8 | J7 Platform Data | `j7_platform.go` | ✅ | ✅ | ✅ Done | Roundtrip |
| 2.1.9 | J8 Radio (variable) | `j8_radio.go` | ✅ | ✅ | ✅ Done | Roundtrip |
| 2.1.10 | J9 Electronic Warfare | `j9_electronic_warfare.go` | ✅ | ✅ | ✅ Done | Roundtrip |
| 2.1.11 | J10 Offset | `j10_offset.go` | ✅ | ✅ | ✅ Done | Roundtrip |
| 2.1.12 | J11 Data Transfer | `j11_data_transfer.go` | ✅ | ✅ | ✅ Done | Roundtrip |
| 2.1.13 | J12 Alert | `j12_alert.go` | ✅ | ✅ | ✅ Done | Roundtrip |
| 2.1.14 | J13 Precision Participant | `j13_participant.go` | ✅ | ✅ | ✅ Done | Roundtrip |
| 2.1.15 | J14-J17 Command | `j14_17_command.go` | ✅ | ✅ | ✅ Done | None |
| 2.1.16 | J18 Space Track | `j18_space_track.go` | ✅ | ✅ | ✅ Done | None |
| 2.1.17 | J26 Test | `j26_27_time.go` | ✅ | ✅ | ✅ Done | Roundtrip |
| 2.1.18 | J27 Time | `j26_27_time.go` | ✅ | ✅ | ✅ Done | Roundtrip |
| 2.1.19 | J28 Satellite OPIR | `j28_space.go` | ✅ | ✅ | ✅ Done | None |
| 2.1.20 | J29-J31 Symbology/IFF/File | `j29_30_31_symbology.go` | ✅ | ✅ | ✅ Done | None |

#### 2.2 Bug Fixes Applied

| Task ID | Bug | Fix | Commit | Verified |
|---------|-----|-----|--------|----------|
| 2.2.1 | J0PayloadSize=36 overflow | → 48 | 141e5fb5 | ✅ Roundtrip |
| 2.2.2 | J3PayloadSize=21 off-by-3 | → 24 | de10392d | ✅ go test |
| 2.2.3 | J6 lat/lon PackUint32→24 | Buffer overlap fix | 141e5fb5 | ✅ Roundtrip |
| 2.2.4 | J11 missing off+=4 | Added offset | 141e5fb5 | ✅ Roundtrip |
| 2.2.5 | J11PayloadSize=32 | → 37 | 141e5fb5 | ✅ Roundtrip |
| 2.2.6 | J26PayloadSize=11 | → 73 | 141e5fb5 | ✅ Roundtrip |
| 2.2.7 | PackFloat24 formula | Fixed offset/scale | 31d00087 | ✅ Roundtrip |
| 2.2.8 | J2 heading width | PackUint16 for 14-bit | de10392d | ✅ go test |

#### 2.3 Test Suite

| Task ID | Test File | Tests | Status |
|---------|-----------|-------|--------|
| 2.3.1 | `pack_unpack_test.go` | 10 primitive tests | ✅ PASS |
| 2.3.2 | `roundtrip_test.go` | 12 roundtrip tests | ✅ PASS |
| 2.3.3 | `encoder_test.go` | 5 encoder tests | ✅ PASS |
| 2.3.4 | `decoder_test.go` | 5 decoder tests | ✅ PASS |
| 2.3.5 | `header_test.go` | 5 header tests | ✅ PASS |

### PHASE 3: Integration ✅ COMPLETE

#### 3.1 Full Registry Wiring

| Task ID | Task | File | Sub-task | Status |
|---------|------|------|----------|--------|
| 3.1.1 | Register all J-types in encoder | `jreap/encoder.go` | Add J8-J31 registrations | ✅ Done |
| 3.1.2 | Register all J-types in decoder | `jreap/decoder.go` | Add J8-J31 registrations | ✅ Done |
| 3.1.3 | Error handling | `jreap/encoder.go` | Unregistered type error | ✅ Done |
| 3.1.4 | Type assertion with ok-check | `jreap/encoder.go` | Prevent panics | ✅ Done |

#### 3.2 QualityFlags Pipeline

| Task ID | Task | File | Sub-task | Status |
|---------|------|------|----------|--------|
| 3.2.1 | Set QualityFlags in correlator | `internal/correlator.go` | Attach quality to metadata | ✅ Done |
| 3.2.2 | Carry QualityFlags to JREAP output | `kafka.go` | Include in encoded message | ✅ Done |
| 3.2.3 | Add QualityFlags roundtrip test | `roundtrip_test.go` | Test: track→encode→decode preserves flags | ✅ Done |

#### 3.3 CorrelationID Propagation

| Task ID | Task | File | Sub-task | Status |
|---------|------|------|----------|--------|
| 3.3.1 | Assign CorrelationID on new tracks | `internal/correlator.go` | Generate UUID for new tracks | ✅ Done |
| 3.3.2 | Propagate CorrelationID to JREAP output | `server.go` | Carry through encoding pipeline | ✅ Done |
| 3.3.3 | Add CorrelationID roundtrip test | `roundtrip_test.go` | Test: sensor event→track→verify ID | ✅ Done |

#### 3.4 J0/J1 Network Management

| Task ID | Task | File | Sub-task | Status |
|---------|------|------|----------|--------|
| 3.4.1 | Define J0/J1 generation triggers | `server.go` | Track ownership transfer | ✅ Done |
| 3.4.2 | Wire J0 into server | `server.go` | Track ownership transfer | ✅ Done |
| 3.4.3 | Wire J1 into server | `server.go` | Network join/leave | ✅ Done |
| 3.4.4 | Add J0/J1 roundtrip tests | `roundtrip_test.go` | Full field verification | ✅ Done |

#### 3.5 Remaining Roundtrip Tests

| Task ID | Task | File | Status |
|---------|------|------|--------|
| 3.5.1 | J2 Surveillance roundtrip | `j2_surveillance.go` | ✅ Done (field offset bug) |
| 3.5.2 | J8 Radio roundtrip (3 lengths) | `j8_radio.go` | ✅ Done |
| 3.5.3 | J14-J17 Command roundtrip | `j14_17_command.go` | ✅ Done |
| 3.5.4 | J18 Space Track roundtrip | `j18_space_track.go` | ✅ Done |
| 3.5.5 | J28-J31 roundtrip | `j29_30_31_symbology.go` | ✅ Done |

### PHASE 4: Gateway Expansion ✅ COMPLETE

#### 4.1 DIS Gateway

| Task ID | Task | File | Status |
|---------|------|------|--------|
| 4.1.1 | Entity State PDU encoder | `internal/dis/dis.go` | ✅ Done |
| 4.1.2 | Fire PDU encoder | `internal/dis/dis.go` | ✅ Done |
| 4.1.3 | Detonation PDU encoder | `internal/dis/dis.go` | ✅ Done |
| 4.1.4 | DIS Header encoder | `internal/dis/dis.go` | ✅ Done |
| 4.1.5 | DIS Decoder (incoming) | `internal/dis/dis.go` | ✅ Done |
| 4.1.6 | DIS Gateway + Roundtrip tests | `internal/gateway/dis_gateway.go` | ✅ Done |

#### 4.2 HLA Gateway

| Task ID | Task | File | Status |
|---------|------|------|--------|
| 4.2.1 | RTI Interface wrapper | `internal/hla/hla.go` | ✅ Done |
| 4.2.2 | Object Model encoder | `internal/hla/hla.go` | ✅ Done |
| 4.2.3 | Interaction encoder | `internal/gateway/hla_gateway.go` | ✅ Done |
| 4.2.4 | Federation config | `internal/hla/hla.go` | ✅ Done |
| 4.2.5 | HLA Roundtrip tests | `internal/gateway/hla_gateway_test.go` | ✅ Done |

#### 4.3 TENA Integration

| Task ID | Task | File | Status |
|---------|------|------|--------|
| 4.3.1 | TENA middleware integration | `internal/gateway/tena_gateway.go` | ✅ Done |
| 4.3.2 | TENA registry service | `internal/tena/session.go` | ✅ Done |
| 4.3.3 | Range interconnect config | `internal/tena/tena.go` | ✅ Done |

### PHASE 5: MDPAF Compliance ✅ COMPLETE

| Task ID | Task | File | Status |
|---------|------|------|--------|
| 5.1 | Full MDPAF metadata mapping | `mdpa/metadata.go` | ✅ Done |
| 5.2 | RMF compliance documentation | `docs/mdpa/RMF-COMPLIANCE.md` | ✅ Done |
| 5.3 | Security STIGs checklist | `docs/mdpa/STIGS-CHECKLIST.md` | ✅ Done |
| 5.4 | Accreditation artifacts | `docs/mdpa/ACCREDITATION-PACKAGE.md` | ✅ Done |
| 5.5 | MDPAF compliance matrix | `docs/FORGE-MDPAF-COMPLIANCE.md` | ✅ Done |

### PHASE 6: Production Hardening 🚧 IN Progress

#### 6.1 Kubernetes Deployment

| Task ID | Task | File | Status |
|---------|------|------|--------|
| 6.1.1 | Kind cluster config | `deploy/kind/config.yaml` | ✅ Done |
| 6.1.2 | K8s Deployment manifest | `deploy/k8s/forge-c2-deploy.yaml` | ✅ Done |
| 6.1.3 | K8s Service manifest | `deploy/k8s/forge-c2-svc.yaml` | ✅ Done |
| 6.1.4 | K8s ConfigMap | `deploy/k8s/forge-c2-config.yaml` | ✅ Done |
| 6.1.5 | K8s Secret (Kafka, C2BMC) | `deploy/k8s/forge-c2-secret.yaml` | ✅ Done |
| 6.1.6 | Helm chart | `deploy/helm/forge-c2/` | 📋 Todo |

#### 6.2 High Availability

| Task ID | Task | File | Status |
|---------|------|------|--------|
| 6.2.1 | HA proxy config | `deploy/haproxy.cfg` | 📋 Todo |
| 6.2.2 | Health check endpoint | `server.go` /health | ✅ Done |
| 6.2.3 | Graceful shutdown | `server.go` | ✅ Done |
| 6.2.4 | Kafka consumer group | `internal/kafka.go` | 📋 Todo |

#### 6.3 Monitoring

| Task ID | Task | File | Status |
|---------|------|------|--------|
| 6.3.1 | Prometheus metrics | `internal/metrics.go` | ✅ Done |
| 6.3.2 | Grafana dashboard | `deploy/grafana/forge-c2.json` | 📋 Todo |
| 6.3.3 | Alertmanager config | `deploy/alertmanager/alertmanager.yml` | 📋 Todo |

---

## Task Dependencies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TASK DEPENDENCY GRAPH                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Phase 1 ──────► Phase 2 ──────► Phase 3 ──────► Phase 4 ──────► Phase 5  │
│  (Done)         (Done)         (In Progress)   (Planned)      (Planned)    │
│     │               │               │               │               │       │
│     │               │               ▼               │               │       │
│     │               │      ┌───────────────┐        │               │       │
│     │               │      │ 3.1 Registry │◄──┐    │               │       │
│     │               │      └───────────────┘   │    │               │       │
│     │               │      ┌───────────────┐   │    │               │       │
│     │               │      │ 3.2 Quality   │   │    │               │       │
│     │               │      └───────────────┘   │    │               │       │
│     │               │      ┌───────────────┐   │    │               │       │
│     │               │      │ 3.3 CorrID    │───┘    │               │       │
│     │               │      └───────────────┘        │               │       │
│     │               │      ┌───────────────┐        │               │       │
│     │               │      │ 3.4 J0/J1     │        │               │       │
│     │               │      │   Network     │        │               │       │
│     │               │      └───────────────┘        │               │       │
│     │               │      ┌───────────────┐        │               │       │
│     │               │      │ 3.5 Remain-   │        │               │       │
│     │               │      │   ing Tests   │        │               │       │
│     │               │      └───────────────┘        │               │       │
│     │               │               │               │               │       │
│     ▼               ▼               ▼               ▼               ▼       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     PHASE 6: PRODUCTION                            │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐       │   │
│  │  │ 6.1 K8s   │  │ 6.2 HA    │  │ 6.3 Mon   │  │ 6.4 Perf  │       │   │
│  │  │ Deploy    │  │ Config    │  │ itoring   │  │ Tuning    │       │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Verification Checklist

### Pre-Merge Checklist
- [ ] `go build ./...` succeeds
- [ ] `go test ./...` all pass
- [ ] `go vet ./...` no warnings
- [ ] `gofmt` formatting correct
- [ ] Roundtrip tests for modified types pass
- [ ] No hardcoded credentials
- [ ] Error handling on all paths

### Phase Completion Checklist
- [ ] All subtasks marked ✅ Done
- [ ] Integration tests pass
- [ ] Documentation updated
- [ ] Commits tagged with phase milestone
- [ ] Push to IDM verified

---

## Milestone Timeline

```
     Q1 2026                    Q2 2026                      Q3 2026
     ┌───────┬───────┬───────┐ ┌───────┬───────┬───────┐ ┌───────┬───────┬────
     │ Jan   │ Feb   │ Mar   │ │ Apr   │ May   │ Jun   │ │ Jul   │ Aug   │ Sep
     │       │       │       │ │       │       │       │ │       │       │
     │     ┌───────────────────┐       │       │       │ │       │       │
     │     │  PHASE 1-2       │       │       │       │ │       │       │
     │     │  (COMPLETE ✓)   │       │       │       │ │       │       │
     │     └───────────────────┘       │       │       │ │       │       │
     │                       ┌─────────▼─────────┐       │ │       │       │
     │                       │  PHASE 3         │       │ │       │       │
     │                       │  (In Progress)   │       │ │       │       │
     │                       │  ════════════════ │       │ │       │       │
     │                       │  M3: TBD          │       │ │       │       │
     │                       └───────────────────┘       │ │       │       │
     │                                           ┌───────▼───────│       │
     │                                           │  PHASE 4      │       │
     │                                           │  DIS/HLA      │       │
     │                                           └───────────────┘       │
     └────────────────────────────────────────────────────────────────────
```

---

*Roadmap Version: 1.0*
*Last Updated: 2026-04-10*
*Maintained by: FORGE-C2 Development Team*
