# Plan: MDPAF-Compliant FORGE-C2 Implementation

**Goal:** Build a FORGE-C2 that produces/consumes messages structurally compliant to MIL-STD-3011 (JREAP-C) and FORGE MDPAF specifications.

**Note:** MIL-STD-3011 is classified. This plan targets a *compliant simulation* — structurally faithful to the public JREAP-C/IP specification and FORGE MDPAF data model, not bit-accurate to the classified implementation.

---

## Gap Analysis

The current FORGE-C2 has:
- ✅ Sensor event ingestion (Kafka)
- ✅ Track correlation (nearest-neighbor, 50km gate)
- ✅ C2BMC engagement orders (internal Go structs)
- ✅ WebSocket/REST API
- ❌ **No JREAP-C / MIL-STD-3011 encoding**
- ❌ **No Link 16 J-series message types**
- ❌ **No MDPAF-specific field mapping**
- ❌ **No UDP/TCP transport for JREAP-C**
- ❌ **No compliance documentation**

---

## Implementation Phases

### Phase 1: JREAP-C Message Encoding Layer

**JREAP-C overview (public spec):**
- Transport: IP/UDP or IP/TCP (we'll support both)
- JREAP wrapper around Link 16 J-series messages
- Header: flags, message type, length, padding
- CRC-16 at JREAP layer

**Files to create:**
```
forge-c2/
  jreap/
    doc.go                    # Package docs + MIL-STD-3011 reference
    header.go                 # JREAP-C header struct + encode/decode
    message_types.go          # Link 16 J-series message type constants
    jseries/
      doc.go                  # J-series message package
      message.go              # Base J-series message structure
      pack_unpack.go          # Bit-level pack/unpack utilities
    encoder.go               # JREAP-C encoder (Go struct → JREAP bytes)
    decoder.go               # JREAP-C decoder (JREAP bytes → Go struct)
    transport.go             # UDP/TCP JREAP transport layer
    compliance.go            # Compliance checker + field validation
```

**JREAP-C Header (estimated from public docs):**
```
Octet 0-1:   Protocol Flags (0x01 for JREAP-C)
Octet 2:     Message Type (J-series type number)
Octet 3:     Reserved
Octet 4-7:   Message Length (network byte order)
Octet 8-N:   J-series Message Payload
Last 2 octets: CRC-16 (Ethernet-style)
```

**J-series Message Types needed for FORGE:**
| Type | Name | Use |
|------|------|-----|
| 1 | Track Update (J3.0) | Track position, speed, heading |
| 4 | Engagement Order (J6.0) | Engagement orders |
| 5 | Engagement Status (J6.5) | Intercept result |
| 6 | Sensor Registration (J7.1) | Sensor capabilities |
| 12 | Alert/Notification (J2.0) | Launch detected, threat alert |
| 15 | Command (J0.x) | C2BMC commands |
| 28 | Space Track (J18.x) | Satellite/OPIR track data |

---

### Phase 2: MDPAF Data Model Mapping

**MDPAF-specific fields to add on top of standard J-series:**

```go
// MDPAF metadata added to every message
type MDPAMetadata struct {
    ProcessingNodeID   string    // Which FORGE node processed this
    IngestTimestamp    time.Time // When received by MDPAF
    QualityFlags       uint8     // Sensor quality indicators
    Classification     string    // e.g., "SECRET//NOFORN"
    ApplicationID      string    // MDPAF app that generated the message
    CorrelationID      string    // End-to-end tracking ID
}

// FORGE-specific extensions to standard tracks
type FORGETrackExtension struct {
    SatelliteID        string    // SBIRS/NextGen OPIR satellite ID
    SensorMode         string    // STARE, SURVEIL, TRACK
    IRIntensity        float64   // MWIR/LWIR intensity (K)
    BackgroundTemp     float64   // Background temperature (K)
    DetectionConfidence float64  // Detection probability
    FalseAlarmRate     float64   // FAR (per hour)
}
```

**MDPAF Message Categories:**
1. **OPIR Processing** — Raw satellite data → track messages
2. **Track Management** — Track initiation, update, fusion
3. **Engagement Management** — Orders, status updates
4. **Alert Dissemination** — Launch warnings, threat alerts
5. **Network Management** — Link status, sensor registration

---

### Phase 3: JREAP Transport Layer

**Architecture:**
```
Kafka (raw sensor events)
    ↓
MDPAF Processing Apps (plural — NOS3 style)
    ↓
FORGE Track Manager ←→ JREAP-C Encoder/Decoder
    ↓
JREAP Transport (UDP/TCP)
    ↓
Network (simulated or real)
```

**JREAP Transport features:**
- UDP: Low-latency, no acknowledgment (use for track updates)
- TCP: Reliable, ordered (use for engagement orders)
- Multicast support (simulated)
- Configurable port numbers
- Automatic CRC-16 computation and verification

---

### Phase 4: Integration with Existing FORGE-C2

**Changes to existing code:**
1. `internal/kafka.go` — Add JREAP output adapter (wire existing SensorEvent/Track to JREAP encoder)
2. `internal/c2bmc.go` — Wire EngagementOrder → J-series type 4 messages
3. `internal/correlator.go` — Wire Track → J-series type 1 messages
4. New JREAP consumer that feeds decoded tracks back into the correlator
5. `main.go` — Add `--jreap-udp`, `--jreap-tcp`, `--jreap-port` flags

**Dual-transport mode:**
- Kafka still used for internal high-throughput event bus
- JREAP used for external compliance-facing interfaces

---

### Phase 5: Compliance Documentation

**Document 100% compliance to:**
1. MIL-STD-3011 JREAP-C over IP
   - Header format (8 octets minimum)
   - CRC-16 computation
   - Message type field encoding
   - Maximum message length
   
2. FORGE MDPAF data model
   - Field presence (required vs optional)
   - Value ranges and units
   - Timestamp formats (UTC, ms precision)

**Compliance Matrix (per message type):**
| Message Type | MIL-STD-3011 Field | Present | Valid Range | FORGE-C2 Field |
|---|---|---|---|---|
| J3.0 Track Update | Track Number | ✅ | 0-65534 | TrackNumber |
| J3.0 Track Update | Latitude | ✅ | -90 to 90 | Latitude |
| ... | ... | ... | ... | ... |

---

### Phase 6: Testing & Validation

**Unit tests per package:**
- `jreap/` — Header encode/decode round-trip
- `jseries/` — Bit-level pack/unpack for each message type
- `encoder` — Go struct → bytes → Go struct (round-trip)
- `decoder` — bytes → Go struct validation
- `compliance` — Field range checking

**Integration tests:**
- JREAP-C over UDP localhost
- JREAP-C over TCP localhost
- Full flow: sensor event → Kafka → MDPAF → JREAP → decode → track store
- Compliance validation on all generated messages

---

## File Structure (target)

```
forge-c2/
  jreap/
    doc.go
    header.go
    message_types.go
    jseries/
      doc.go
      message.go
      pack_unpack.go
      j3_track.go        # Track Update (J3.0)
      j4_engagement.go  # Engagement Order (J6.0)
      j5_engage_status.go
      j6_sensor_reg.go  # Sensor Registration (J7.1)
      j12_alert.go      # Alert/Notification (J2.0)
      j28_space.go      # Space Track (J18.x)
    encoder.go
    decoder.go
    transport.go
    compliance.go
  mdpa/
    doc.go
    metadata.go        # MDPAMetadata
    track_extension.go # FORGETrackExtension
    message_map.go     # FORGE → J-series mapping
  internal/
    ...existing files...
  main.go              # Add JREAP flags
```

---

## Dependencies (Go packages needed)

- `github.com/google/gopacket/layers` — For CRC-16, ethernet frame helpers
- Standard library `encoding/binary` — Byte order for JREAP header
- `golang.org/x/net/ipv4` / `ipv6` — For raw IP socket control

---

## Estimated Effort

| Phase | Complexity | Time |
|-------|-----------|------|
| Phase 1: JREAP Encoding | High | 2-3 days |
| Phase 2: MDPAF Mapping | Medium | 1 day |
| Phase 3: Transport Layer | Medium | 1 day |
| Phase 4: Integration | Medium | 1 day |
| Phase 5: Documentation | Low | 0.5 day |
| Phase 6: Testing | Medium | 1-2 days |
| **Total** | | **7-9 days** |

---

## Next Steps

1. Create `jreap/doc.go` + `jreap/header.go` as the foundation
2. Implement bit-level J-series pack/unpack in `jseries/pack_unpack.go`
3. Implement J3.0 (Track Update) as the first message type
4. Build the encoder/decoder round-trip
5. Add JREAP transport (UDP first, TCP second)
6. Integrate with existing kafka.go/c2bmc.go correlator
7. Write compliance matrix documentation
8. Add unit tests

---

*Last updated: 2026-04-04*
