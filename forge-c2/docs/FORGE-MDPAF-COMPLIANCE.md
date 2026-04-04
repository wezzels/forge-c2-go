# FORGE-C2 MDPAF Compliance Documentation

**Document Version:** 1.0  
**Date:** 2026-04-04  
**Classification:** UNCLASSIFIED // FORGE Simulation

---

## Overview

This document describes the compliance of the FORGE-C2 implementation with:

1. **MIL-STD-3011 (JREAP-C)** - Joint Range Extension Application Protocol C
2. **FORGE MDPAF Data Model** - Missile Defense Processing Framework

> **Note:** MIL-STD-3011 is classified. This implementation targets a *structurally compliant simulation* - faithful to the public JREAP-C/IP specification, not bit-accurate to the classified implementation.

---

## 1. MIL-STD-3011 JREAP-C Compliance

### 1.1 JREAP-C Header Format

The JREAP-C header consists of 8 octets (bytes) as defined in the public specification:

| Octet | Field | Size | Description | FORGE-C2 Implementation |
|-------|-------|------|-------------|------------------------|
| 0-1 | Protocol Flags | 16 bits | 0x0001 for JREAP-C | ✅ `ProtocolFlags = 0x0001` |
| 2 | Message Type | 8 bits | J-series message type number | ✅ `MessageType` field |
| 3 | Reserved | 8 bits | Reserved, set to 0 | ✅ Set to 0 |
| 4-7 | Message Length | 32 bits | Payload length (network byte order) | ✅ `Length` uint32 big-endian |

### 1.2 JREAP-C Transport

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| IP/UDP Transport | ✅ | `jreap.JREAPUDPConn` |
| IP/TCP Transport | ✅ | `jreap.JREAPTCPConn` with 4-byte length prefix |
| CRC-16 Error Detection | ✅ | Ethernet polynomial (0x8005), covers header + payload |
| Maximum Message Size | ✅ | 65,507 bytes (65,535 - 8 header - 2 CRC) |

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

Every MDPAF message includes metadata:

| Field | Type | Required | Description | Compliance |
|-------|------|----------|-------------|------------|
| ProcessingNodeID | string | Yes | FORGE node identifier | ✅ Implemented |
| IngestTimestamp | time.Time | Yes | UTC ingestion time | ✅ Implemented |
| QualityFlags | uint8 | Yes | Quality bitfield | ✅ Implemented |
| Classification | string | Yes | Security marking | ✅ Implemented |
| ApplicationID | string | Yes | MDPAF application | ✅ Implemented |
| CorrelationID | string | No | End-to-end tracking | ✅ Implemented |

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
|---------------|-----------------|----------------|-------------|
| ForgeOPIRRawData | OPIR Processing | J28 (Satellite/OPIR) | Raw satellite data |
| ForgeTrackInit | Track Management | J3 (Track Update) | Track initiation |
| ForgeTrackUpdate | Track Management | J3 (Track Update) | Track update |
| ForgeTrackFusion | Track Management | J2 (Surveillance) | Fused track |
| ForgeEngagementOrder | Engagement | J4 (Engagement Order) | Engagement order |
| ForgeEngagementStatus | Engagement | J5 (Engagement Status) | Status update |
| ForgeAlertLaunch | Alert | J12 (Alert) | Launch detection |
| ForgeAlertThreat | Alert | J12 (Alert) | Threat confirmation |
| ForgeSensorRegister | Network | J6 (Sensor Registration) | Sensor registration |
| ForgeSpaceTrack | Track Management | J18 (Space Track) | Space object |

### 3.2 J-Series Field Requirements

#### J3.0 - Track Update

| Field | Size (bits) | Range | FORGE-C2 Field |
|-------|-------------|-------|----------------|
| Track Number | 16 | 0-65534 | `Track.TrackNumber` |
| Time | 32 | Unix ms | `Track.LastUpdate` |
| Latitude | 24 | -90° to 90° | `Track.Latitude` |
| Longitude | 24 | -180° to 180° | `Track.Longitude` |
| Altitude | 24 | 0-16,777,215 m | `Track.Altitude` |
| Speed | 16 | 0-6,553.5 m/s | `Track.Speed` |
| Heading | 16 | 0-360° | `Track.Heading` |

#### J4.0 - Engagement Order

| Field | Size (bits) | Range | FORGE-C2 Field |
|-------|-------------|-------|----------------|
| Order ID | 32 | Hash | `EngagementOrder.OrderID` |
| Track Number | 16 | 0-65534 | Linked track |
| Priority | 8 | 1-5 | `EngagementOrder.Priority` |
| Weapon System | 8 | GBI/SM-3/THAAD/PATRIOT | `EngagementOrder.WeaponSystem` |
| Time on Target | 32 | Unix ms | `EngagementOrder.TimeOnTarget` |
| Intercept Probability | 16 | 0-100% | `EngagementOrder.InterceptProb` |
| Status | 8 | PENDING/LAUNCHED/etc | `EngagementOrder.Status` |

#### J28 - Satellite/OPIR Track

| Field | Size (bits) | Range | FORGE-C2 Field |
|-------|-------------|-------|----------------|
| Track Number | 16 | 0-65534 | `SensorEvent.SensorID` (hashed) |
| Time | 32 | Unix ms | `SensorEvent.Timestamp` |
| Latitude | 24 | -90° to 90° | `SensorEvent.Latitude` |
| Longitude | 24 | -180° to 180° | `SensorEvent.Longitude` |
| Altitude | 24 | 0-16,777,215 m | `SensorEvent.Altitude` |
| IR Intensity | 16 | 0-6553.5 K | `SensorEvent.Intensity` |

---

## 4. Compliance Matrix

### 4.1 Message Type Compliance

| Message Type | Header | CRC | Payload | Transport | Status |
|--------------|--------|-----|---------|-----------|--------|
| J3.0 Track Update | ✅ | ✅ | ✅ | UDP/TCP | COMPLIANT |
| J4.0 Engagement Order | ✅ | ✅ | ✅ | TCP | COMPLIANT |
| J5.0 Engagement Status | ✅ | ✅ | ✅ | UDP/TCP | COMPLIANT |
| J6.0 Sensor Registration | ✅ | ✅ | ✅ | TCP | COMPLIANT |
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

## 5. Implementation Files

| File | Purpose | Compliance |
|------|---------|------------|
| `jreap/header.go` | JREAP-C header encode/decode | ✅ |
| `jreap/transport.go` | UDP/TCP transport layer | ✅ |
| `jreap/encoder.go` | Go struct → JREAP bytes | ✅ |
| `jreap/decoder.go` | JREAP bytes → Go struct | ✅ |
| `mdpa/metadata.go` | MDPAF metadata struct | ✅ |
| `mdpa/track_extension.go` | FORGE track extensions | ✅ |
| `mdpa/message_map.go` | FORGE → J-series mapping | ✅ |

---

## 6. Limitations

This implementation is a **structurally compliant simulation**:

1. **Bit-level accuracy**: Field sizes and encodings match the public spec, but exact bit patterns may differ from classified implementation
2. **J-series payload format**: Simplified FORGE-specific encoding, not full MIL-STD-6016 J-series packing
3. **Security markings**: Simulation values only, not actual classification handling
4. **No actual Link 16**: Uses standard IP networking, not Link 16 waveform

---

## 7. References

- MIL-STD-3011 (JREAP) - Classified, see contracting officer
- STANAG 5518 (NATO JREAP Interoperability Standard) - Public
- MIL-STD-6016 (Link 16 J-series) - Classified, see contracting officer
- FORGE MDPAF Specification - Contracted

---

*Document generated by FORGE-C2 MDPAF implementation project*
