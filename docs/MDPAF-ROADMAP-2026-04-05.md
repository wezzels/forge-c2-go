# MDPAF Gap Closure Roadmap

**Date:** 2026-04-05
**Source:** FORGE-C2/MDPAF build (commits a85a54c5 → fadfe2a2, 2026-04-04)
**Status:** Phases 1-6 complete; gaps below remain

---

## J-Series Message Coverage

| Type | Name | Status | Notes |
|------|------|--------|-------|
| J0 | Track Management | ✅ Built | j0_track_mgmt.go (36 bytes) |
| J1 | Network Init | ✅ Built | j1_network_init.go (40 bytes) |
| J2 | Surveillance | ✅ Built | `j2_surveillance.go` |
| J3 | Track Update | ✅ Built | `j3_track.go` |
| J4 | Engagement Order | ✅ Built | `j4_engagement_order.go` |
| J5 | Engagement Status | ✅ Built | `j5_engagement_status.go` |
| J6 | Sensor Registration | ✅ Built | `j6_sensor_reg.go` |
| J7 | Platform/Sensor Data | ❌ Missing | Platform state, pointing |
| J8 | Radio | ❌ Missing | J8.0-8.5 voice/data |
| J9 | Electronic Warfare | ❌ Missing | ELINT, ESM, EA |
| J10 | Offset | ❌ Missing | Offset aimpoint |
| J11 | Data Transfer | ❌ Missing | File/data transfer |
| J12 | Alert/Notification | ✅ Built | `j12_alert.go` |
| J13 | Parameter | ❌ Missing | NCTR parameter |
| J14 | Test/Training | ❌ Missing | Simulation control |
| J15 | Command | ❌ Missing | C2BMC commands |
| J16 | Acknowledge | ❌ Missing | Ack/NAK messages |
| J17 | Collective | ❌ Missing | Collective operations |
| J28 | Space Track | ✅ Built | `j28_space.go` |

**Coverage:** 7/24 built (~29%)

---

## Priority Work Items

### P0 — QualityFlags & CorrelationID Pipeline ✅ DONE (2026-04-05)

**Completed:** All `MDPAMetadata` fields now wired through the pipeline:

- `metadata.go`: `NewMDPAMetadataFromSensor()`, `NewMDPAMetadataFromTrack()`
- `encoder.go`: `EncodeSensorEvent/EncodeTrack/EncodeEngagementOrder` accept `*mdpa.MDPAMetadata`; `metadataToQuality()` wires flags to J-series
- `decoder.go`: `DecodeOPIR/DecodeTrackUpdate/DecodeEngagementOrder(msg, meta)` extract QualityFlags; `extractMetadata()` builds metadata
- `kafka.go`: `Track.QualityFlags` + `Track.CorrelationID` fields; `GenerateCorrelationID()` on track creation
- `correlator.go`: `createTrack` generates CorrelationID and QualityFlags; `updateTrack` recomputes flags; `UpdateTrackQualityFlags()` exported
- `c2bmc.go`: `JREAPOutput/JREAPOutputAll` accept metadata
- `jreap_consumer.go`: all paths propagate CorrelationID

**Commit:** `349d898c` (pushed)

---

### P1 — J0 (Track Management) + J1 (Network Init) ✅ DONE (2026-04-05)

**Commit:** `f36db631` (pushed)

- `jreap/jseries/j0_track_mgmt.go`: J0TrackManagement (36 bytes), TrackManagementStatus/Type, Pack/Unpack
- `jreap/jseries/j1_network_init.go`: J1NetworkInit (40 bytes), NetworkStatus, Pack/Unpack
- `jreap/encoder.go`: EncodeJ0, EncodeJ1
- `jreap/decoder.go`: DecodeJ0, DecodeJ1
- `jreap_consumer.go`: processJ0 (track drop/init/update), processJ1 (network logging)

---

### P2 — J7 (Platform/Sensor Data) + J8 (Radio)

**Use case:**
- J7: Platform position, attitude, sensor pointing for track attribution
- J8: Voice/data comms status (used in Link 16 nets for coordination)

**J7 Platform/Sensor Data (J7.0 — Platform Data):**
```
Platform ID (16 bits)
Latitude, Longitude, Altitude (32+32+16 bits)
Platform Speed, Heading
Sensor Pointing (azimuth, elevation)
```

**J8 Radio Communications (J8.0 — Voice/Data):**
```
Net ID (16 bits)
Radio ID (8 bits)
Frequency, Mode (voice/data/ji)
```

**Effort:** ~4 hours

---

### P3 — J9 (Electronic Warfare) + J10 (Offset) + J11 (Data Transfer)

**Use case:**
- J9: ELINT/ESM detections — could represent IR sensor characterization data
- J10: Offset engagement — aimpoint offset for interceptor guidance
- J11: Bulk data transfer — could carry missile defense engagement data

**Effort:** ~4 hours

---

### P4 — J13 (Parameter) + J14 (Test/Training) + J15 (Command) + J16 (Acknowledge) + J17 (Collective)

**Use case:**
- J14: Simulation control — important for LVC inject/scenario control
- J15: C2BMC command interface — tie into `c2bmc.go` EngagementOrder path
- J16: Ack/NAK for command acknowledgment
- J17: Collective operations (group commands)

**J15/C2BMC integration path:**
```
c2bmc.go: EngagementOrder
    → J4 EncodeEngagementOrder()
    → J15 EncodeCommand() [for C2BMC direct command path]
    → J16 Acknowledge (outbound ack)
```

**Effort:** ~6 hours

---

### P5 — MDPAF Processing Apps (NOS3-style multi-app)

**Current state:** Single consumer in `jreap_consumer.go` handles all JREAP messages.

**Target state:** NOS3-style distinct processing apps (per Phase 3 plan):

| App | Function | Input | Output |
|-----|----------|-------|--------|
| `opir-ingest` | Raw SBIRS/OPIR events → tracks | Kafka `sensor.events` | Kafka `opir.tracks` |
| `track-manager` | Track initiation, update, drop | Kafka `opir.tracks` | J0 (drop), J3 (update) |
| `engagement-manager` | Orders, status | J15 (cmd), J16 (ack) | J4 (order), J5 (status) |
| `alert-processor` | Alert generation | Tracks, engagements | J12 (alert) |
| `network-manager` | Link status, registration | J1 (init), J7 (platform) | J1 (response), J6 (reg) |

**Approach:** Refactor `jreap_consumer.go` into per-message-type handlers, each as a distinct goroutine/function. Not necessarily separate binaries (single Go service), but logically separated like NOS3 apps.

**Effort:** ~6-8 hours

---

### P6 — Classification Markings & Satellite ID Lookups

**Problems:**
1. `Classification` field in `MDPAMetadata` uses placeholder strings ("SECRET//NOFORN")
2. SBIRS/OPIR satellite IDs hardcoded in `opir-ingest` and elsewhere

**Fixes:**
1. Add classification level to config/env — Classification: os.Getenv("FORGE_CLASSIFICATION")
2. Pull satellite IDs from a config/lookup table instead of hardcoding
3. Wire classification into J-series metadata fields where applicable

**Effort:** ~2 hours

---

## Timeline

| Item | Priority | Effort | Total |
|------|----------|--------|-------|
| P0: QualityFlags + CorrelationID | ✅ Done | 4h | 4h |
| P1: J0 + J1 | P1 | 4h | 8h |
| P2: J7 + J8 | ✅ Done | 4h | 12h |
| P3: J9 + J10 + J11 | P2 | 4h | 16h |
| P4: J13-J17 | P3 | 6h | 22h |
| P5: Multi-app consumer | P2 | 8h | 30h |
| P6: Classification + ID lookups | P3 | 2h | 32h |

**Estimated total:** 32 hours (~4-5 days at 8h/day)

**Recommended order:** P2 → P3 → P4 → P6

---

## Top 3 Immediate Actions (remaining)

1. **Implement J0 + J1** — J0 for track drop/init management, J1 for network participation status
2. **NOS3-style multi-app refactor** — split jreap_consumer.go into per-message-type handlers
3. **J7 + J8** — Platform/sensor data and radio communications messages

---

*Last updated: 2026-04-06 00:05 UTC*
