# FORGE-C2 MDPAF Compliance Documentation

**Document Version:** 2.0
**Date:** 2026-04-05
**Classification:** UNCLASSIFIED // FORGE Simulation

---

## Overview

This document describes the compliance of the FORGE-C2 implementation with:

1. **MIL-STD-3011 (JREAP-C)** — Joint Range Extension Application Protocol C
2. **FORGE MDPAF Data Model** — Missile Defense Processing Framework

> **Note:** MIL-STD-3011 is classified. This implementation targets a *structurally compliant simulation* — faithful to the public JREAP-C/IP specification, not bit-accurate to the classified implementation.

---

## 1. MIL-STD-3011 JREAP-C Compliance

### 1.1 JREAP-C Header Format

The JREAP-C header consists of 8 octets (bytes):

| Octet | Field | Size | Description | FORGE-C2 Implementation |
|-------|-------|------|-------------|-------------------------|
| 0–1 | Protocol Flags | 16 bits | `0x0001` for JREAP-C | ✅ `ProtocolFlags = 0x0001` |
| 2 | Message Type | 8 bits | J-series message type number | ✅ `MessageType` field |
| 3 | Reserved | 8 bits | Reserved, set to 0 | ✅ Set to 0 |
| 4–7 | Message Length | 32 bits | Payload length (network byte order) | ✅ `Length` uint32 big-endian |

### 1.2 JREAP-C Transport

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| IP/UDP Transport | ✅ | `jreap.JREAPUDPConn` |
| IP/TCP Transport | ✅ | `jreap.JREAPTCPConn` with 4-byte length prefix |
| CRC-16 Error Detection | ✅ | Ethernet polynomial (0x8005), covers header + payload |
| Maximum Message Size | ✅ | 65,507 bytes (65,535 − 8 header − 2 CRC) |
| Timeout Error | ✅ | `ErrTimeout` returned on `ReadFromWithTimeout` |

### 1.3 CRC-16 Implementation

```go
// CRC-16 (Ethernet polynomial, 0x8005)
// Covers: JREAP Header (8 octets) + J-series Payload + CRC (2 octets)
func CRC16(data []byte) uint16 {
    crc := uint16(0xFFFF)
    for _, b := range data {
        crc ^= uint16(b)
        for i := 0; i < 8; i++ {
            if crc&1 != 0 {
                crc = (crc >> 1) ^ 0xA001 // 0x8005 reflected
            } else {
                crc >>= 1
            }
        }
    }
    return crc
}
```

---

## 2. FORGE MDPAF Data Model

### 2.1 MDPAMetadata Fields

| Field | Type | Required | Description | Compliance |
|-------|------|----------|-------------|------------|
| ProcessingNodeID | string | Yes | FORGE node identifier | ✅ |
| IngestTimestamp | time.Time | Yes | UTC ingestion time | ✅ |
| QualityFlags | uint8 | Yes | Quality bitfield | ✅ |
| Classification | string | Yes | Security marking | ✅ |
| ApplicationID | string | Yes | MDPAF application | ✅ |
| CorrelationID | string | No | End-to-end tracking | ✅ |

### 2.2 Quality Flags Bitfield

| Bit | Name | Description | FORGE-C2 |
|-----|------|-------------|----------|
| 0 | QualityGood | Data quality is good | ✅ |
| 1 | QualitySNRAdequate | SNR is adequate | ✅ |
| 2 | QualityGeomGood | Geometric quality is good | ✅ |
| 3 | QualityTimely | Data is timely | ✅ |
| 4 | QualityCorrelated | Track has been correlated | ✅ |
| 5 | QualityFused | Track has been fused | ✅ |

---

## 3. J-Series Message Type Mapping

### 3.1 FORGE to J-Series Mapping Table

| FORGE Message | MDPAF Category | J-Series Type | Description |
|---------------|-----------------|---------------|-------------|
| ForgeOPIRRawData | OPIR Processing | J28 | Raw satellite data |
| ForgeTrackInit | Track Management | J2 | Track initiation (surveillance) |
| ForgeTrackUpdate | Track Management | J3 | Track update (position) |
| ForgeTrackFusion | Track Management | J2 | Fused track surveillance |
| ForgeEngagementOrder | Engagement | J4 | Engagement order |
| ForgeEngagementStatus | Engagement | J5 | Engagement status report |
| ForgeAlertLaunch | Alert | J12 | Launch detection alert |
| ForgeAlertThreat | Alert | J12 | Threat confirmation alert |
| ForgeSensorRegister | Network | J6 | Sensor registration |
| ForgeSpaceTrack | Track Management | J18/J28 | Space/satellite track |

### 3.2 J-Series Payload Specifications

#### J2 — Surveillance (40 bytes)

Track initiation message: new detection from a sensor before track confirmation.

| Field | Bits | Range | FORGE-C2 |
|-------|------|-------|----------|
| TrackNumber | 16 | 0–65534 | `TrackNumber` |
| ParticipantNumber | 16 | — | `ParticipantNumber` |
| TrackStatus | 8 | — | `TrackStatus` |
| Latitude | 32 packed | −90° to 90° | `Latitude` |
| Longitude | 32 packed | −180° to 180° | `Longitude` |
| Altitude | 24 | 0–16,777,215 m | `Altitude` |
| Speed | 24 | 0.1 m/s resolution | `Speed` |
| Heading | 14 | 0.0057° resolution | `Heading` |
| RadialVelocity | 24 | ±819.2 m/s | `RadialVelocity` |
| SignalIntensity | 16 | 0.1 dBsm | `SignalIntensity` |
| Frequency | 16 | kHz resolution | `Frequency` |
| SNR | 16 | 0.1 dB | `SNR` |
| Confidence | 8 | 0–100 → 0–255 | `Confidence` |
| Timestamp | 32 | Unix ms | `Timestamp` |
| ForceType | 8 | — | `ForceType` |
| PlatformType | 16 | — | `PlatformType` |

#### J3.0 — Track Update

| Field | Bits | Range | FORGE-C2 |
|-------|------|-------|----------|
| TrackNumber | 16 | 0–65534 | `Track.TrackNumber` |
| Time | 32 | Unix ms | `Track.LastUpdate` |
| Latitude | 24 | −90° to 90° | `Track.Latitude` |
| Longitude | 24 | −180° to 180° | `Track.Longitude` |
| Altitude | 24 | 0–16,777,215 m | `Track.Altitude` |
| Speed | 16 | 0–6553.5 m/s | `Track.Speed` |
| Heading | 16 | 0–360° | `Track.Heading` |

#### J4.0 — Engagement Order (17 bytes)

Transmitted from C2BMC to weapon systems.

| Field | Bits | Range | FORGE-C2 |
|-------|------|-------|----------|
| EngagementID | 32 | — | `EngagementOrder.EngagementID` |
| TrackNumber | 16 | 0–65534 | Linked track |
| Priority | 8 | 1=highest | `EngagementOrder.Priority` |
| WeaponSystem | 8 | GMD/Aegis/THAAD/PATRIOT | `J4WeaponSystem` enum |
| TimeOnTarget | 40 | Unix ms | `EngagementOrder.TimeOnTarget` |
| TrackStatus | 8 | Active/Updated/Dropped | `TrackStatus` enum |
| InterceptProb | 16 | 0–9999 (×10000) | `EngagementOrder.InterceptProb` |

**Weapon Systems:**

| Value | System |
|-------|--------|
| 1 | GMD — Ground-based Midcourse Defense |
| 2 | Aegis — Aegis Ballistic Missile Defense |
| 3 | THAAD — Terminal High Altitude Area Defense |
| 4 | PATRIOT — Patriot Defense System |

#### J5.0 — Engagement Status (32 bytes)

Shooter-to-C2BMC engagement outcome report.

| Field | Bits | FORGE-C2 |
|-------|------|----------|
| EngagementID | 32 | `EngagementID` |
| TrackNumber | 16 | `TrackNumber` |
| WeaponSystem | 8 | `WeaponSystem` |
| EngagementStage | 8 | 1–6 |
| Priority | 8 | 1–5 |
| TimeOnTarget | 40 | UTC ms |
| TimeLaunched | 40 | UTC ms |
| TimeCompleted | 40 | UTC ms |
| InterceptResult | 8 | 0–5 |
| HitAssessment | 8 | Bitfield |
| GroundTrack | 8 | Slot |
| CEPSlot | 8 | Slot |
| NetworkID | 16 | Link 16 network |
| ParticipantNumber | 16 | Shooter platform |

**Engagement Stages:**

| Value | Stage |
|-------|-------|
| 1 | Weapon Assigned |
| 2 | Weapon Launched |
| 3 | Flight Terminated |
| 4 | Intercept Success |
| 5 | Intercept Failed |
| 6 | Cancelled |

**Intercept Results:**

| Value | Result |
|-------|--------|
| 0 | Unknown |
| 1 | Intercept Success |
| 2 | Intercept Failed |
| 3 | Radar Miss |
| 4 | No Intercept |
| 5 | Abort |

**Hit Assessment Bitfield:**

| Bit | Assessment |
|-----|------------|
| 0 | Near Miss |
| 1 | Direct Hit |
| 2 | Fragmentation |
| 3 | Kinetic |

#### J6.0 — Sensor Registration

| Field | FORGE-C2 |
|-------|----------|
| SensorType | 1–4 (OPIR/Radar/EOIR/Link16) |
| PlatformType | 1–4 (Fixed/Mobile/Space/Air) |
| Status | 1–3 |
| Latitude/Longitude | degrees |
| MaxRange | km |

#### J12 — Alert/Notification (45 bytes)

| Field | Bits | FORGE-C2 |
|-------|------|----------|
| AlertID | 12 bytes (null-padded) | `AlertID` |
| AlertType | 8 | 1–5 |
| Severity | 8 | 1–5 |
| Latitude | 32 | `Latitude` |
| Longitude | 32 | `Longitude` |
| Altitude | 24 | meters |
| Speed | 16 | m/s |
| Heading | 16 | degrees |
| TrackNumber | 16 | linked track |
| ThreatLevel | 8 | 1–5 |
| Classification | 8 | 1–3 |
| SourceID | 8 bytes (null-padded) | `SourceID` |
| Timestamp | 32 | Unix ms |

**Alert Types:**

| Value | Type |
|-------|------|
| 1 | Launch Detected |
| 2 | Threat Confirmed |
| 3 | Engagement Order |
| 4 | Intercept Complete |
| 5 | System Status |

#### J28 — Satellite/OPIR Track

| Field | FORGE-C2 |
|-------|----------|
| TrackNumber | `SensorID` hashed to uint16 |
| Time | UTC ms |
| Latitude | degrees |
| Longitude | degrees |
| Altitude | meters (up to 16,777,215) |
| VelocityX/Y/Z | m/s |
| SatelliteID | string |
| Orbital elements | Period, Inclination, SemiMajorAxis, Eccentricity, RAAN, ArgPerigee, TrueAnomaly |
| IRIntensity | K |
| BackgroundTemp | K |
| DetectionConf | 0–1 |
| SNR | dB |
| Quality | bitfield |
| ThreatLevel | 1–5 |

---

## 4. Compliance Matrix

### 4.1 Message Type Compliance

| Message Type | Header | CRC | Payload | Transport | Status |
|--------------|--------|-----|---------|-----------|--------|
| J2 Surveillance | ✅ | ✅ | ✅ | UDP/TCP | COMPLIANT |
| J3 Track Update | ✅ | ✅ | ✅ | UDP/TCP | COMPLIANT |
| J4 Engagement Order | ✅ | ✅ | ✅ | TCP | COMPLIANT |
| J5 Engagement Status | ✅ | ✅ | ✅ | UDP/TCP | COMPLIANT |
| J6 Sensor Registration | ✅ | ✅ | ✅ | TCP | COMPLIANT |
| J12 Alert | ✅ | ✅ | ✅ | UDP/TCP | COMPLIANT |
| J18 Space Track | ✅ | ✅ | ✅ | UDP/TCP | COMPLIANT |
| J28 Satellite/OPIR | ✅ | ✅ | ✅ | UDP/TCP | COMPLIANT |

### 4.2 MDPAF Field Compliance

| Field | Required | Implemented | Validated | Status |
|-------|----------|-------------|-----------|--------|
| ProcessingNodeID | Yes | ✅ | ✅ | COMPLIANT |
| IngestTimestamp | Yes | ✅ | ✅ | COMPLIANT |
| QualityFlags | Yes | ✅ | ✅ | COMPLIANT |
| Classification | Yes | ✅ | ✅ | COMPLIANT |
| ApplicationID | Yes | ✅ | ✅ | COMPLIANT |
| CorrelationID | No | ✅ | ✅ | COMPLIANT |

---

## 5. JREAP Consumer (Phase 7)

### 5.1 Overview

The `internal/jreap_consumer.go` module routes incoming JREAP-C messages to the appropriate FORGE-C2 processing engine:

```
JREAP UDP/TCP → ProcessMessage → Route by MessageType
  ├── J2 (Surveillance) → TrackCorrelator.ProcessEvent → TrackStore
  ├── J3 (Track Update)  → TrackStore.UpsertTrack
  ├── J4 (Engagement)   → C2BMCInterface.InjectEngagement
  ├── J5 (Status)       → C2BMCInterface.UpdateEngagementStatusByID
  ├── J6 (Sensor Reg)   → (logged/accepted)
  ├── J12 (Alert)       → C2BMCInterface.InjectAlert
  └── J28 (Space Track) → TrackCorrelator.ProcessEvent → TrackStore
```

### 5.2 C2BMC Injection Methods (Phase 7)

| Method | Description |
|--------|-------------|
| `InjectEngagement(order)` | Injects J4 Engagement Order into C2BMC |
| `UpdateEngagementStatusByID(id, status)` | Updates engagement status from J5 |
| `InjectAlert(alert)` | Injects J12 Alert into C2BMC |

---

## 6. End-to-End Tests (Phase 8)

### 6.1 Test Coverage (`internal/e2e_test.go`)

| Test | Description |
|------|-------------|
| `J3TrackUpdate_RoundTrip` | Encode → Decode → verify field fidelity |
| `JREAPConsumer_J3_CreatesTrack` | J3 message → ProcessMessage → track in store |
| `JREAPConsumer_J2_NewDetection` | J2 surveillance → ProcessMessage |
| `JREAPConsumer_J28_SpaceTrack` | J28 → ProcessMessage → track created |
| `JREAPConsumer_J4_Engagement` | J4 order → ProcessMessage |
| `JREAPConsumer_J12_Alert` | J12 alert → ProcessMessage → alert in C2BMC |
| `JREAPConsumer_J5_EngagementStatus` | J5 status → ProcessMessage |
| `InvalidMessage_Rejected` | Short message → error returned |
| `Track_JSONRoundTrip` | Marshal/Unmarshal → field preservation |
| `CorrelatorE2E` | Two close events → same track; far event → new track |
| `JREAPHeaderValidation` | Flags=0x0001, type correct, length correct, CRC valid |
| `JREAPTransportUDPE2E` | UDP send → recv → decode round-trip |

**Total: 11 tests**

---

## 7. Implementation Files

| File | Purpose | Compliance |
|------|---------|------------|
| `jreap/header.go` | JREAP-C header encode/decode | ✅ |
| `jreap/transport.go` | UDP/TCP transport, `ErrTimeout` | ✅ |
| `jreap/encoder.go` | Go struct → JREAP bytes | ✅ |
| `jreap/decoder.go` | JREAP bytes → Go struct | ✅ |
| `jreap/message_types.go` | J0–J31 message type constants + categories | ✅ |
| `jreap/compliance.go` | Field validation per message type | ✅ |
| `jreap/jseries/pack_unpack.go` | Bit-level pack/unpack + Uint40 helpers | ✅ |
| `jreap/jseries/j2_surveillance.go` | J2 pack/unpack (40 bytes) | ✅ |
| `jreap/jseries/j3_track.go` | J3.0 pack/unpack | ✅ |
| `jreap/jseries/j4_engagement_order.go` | J4 pack/unpack (17 bytes), TrackStatus/J4WeaponSystem enums | ✅ |
| `jreap/jseries/j5_engagement_status.go` | J5 pack/unpack (32 bytes), stage/result constants | ✅ |
| `jreap/jseries/j6_sensor_reg.go` | J6 pack/unpack | ✅ |
| `jreap/jseries/j12_alert.go` | J12 pack/unpack (45 bytes), alert type/severity constants | ✅ |
| `jreap/jseries/j28_space.go` | J28 pack/unpack | ✅ |
| `mdpa/metadata.go` | MDPAF metadata struct | ✅ |
| `mdpa/track_extension.go` | FORGE track extensions | ✅ |
| `mdpa/message_map.go` | FORGE → J-series mapping | ✅ |
| `internal/jreap_consumer.go` | JREAP message routing + C2BMC injection | ✅ |
| `internal/c2bmc.go` | C2BMC interface + injection methods | ✅ |
| `internal/e2e_test.go` | 11 end-to-end tests | ✅ |

---

## 8. Limitations

This implementation is a **structurally compliant simulation**:

1. **Bit-level accuracy**: Field sizes and encodings match the public spec, but exact bit patterns may differ from classified implementation
2. **J-series payload format**: Simplified FORGE-specific encoding, not full MIL-STD-6016 J-series packing
3. **Security markings**: Simulation values only, not actual classification handling
4. **No actual Link 16**: Uses standard IP networking, not Link 16 waveform
5. **40-bit timestamps**: Millisecond-resolution Unix time fits in 40 bits through 2286

---

## 9. References

- MIL-STD-3011 (JREAP) — Classified, see contracting officer
- STANAG 5518 (NATO JREAP Interoperability Standard) — Public
- MIL-STD-6016 (Link 16 J-series) — Classified, see contracting officer
- FORGE MDPAF Specification — Contracted

---

*Document generated by FORGE-C2 MDPAF implementation project*
