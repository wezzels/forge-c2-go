# FORGE-C2 TODO — J-series Roundtrip & Data-Driven Refactor

## Context
Two remaining tasks from the MDPAF build (2026-04-04). The subagent timed out trying to do them in one shot.

---

## Phase 1 — J-series Roundtrip Tests (18 files)

Test that `Pack → Unpack → original` is lossless for every J-series struct.

### 1.1 — Fixed-size J-types (batch A: 8 files)
- [ ] `j0_track_mgmt.go` — J0TrackManagement
- [ ] `j1_network_init.go` — J1NetworkInit
- [ ] `j2_surveillance.go` — J2Surveillance
- [ ] `j3_track.go` — J3TrackUpdate
- [ ] `j4_engagement_order.go` — J4EngagementOrder
- [ ] `j5_engagement_status.go` — J5EngagementStatus
- [ ] `j6_sensor_reg.go` — J6SensorRegistration
- [ ] `j18_space_track.go` — J18SpaceTrack

### 1.2 — Fixed-size J-types (batch B: 7 files)
- [ ] `j7_platform.go` — J7PlatformData
- [ ] `j9_electronic_warfare.go` — J9ElectronicAttack
- [ ] `j10_offset.go` — J10Offset
- [ ] `j11_data_transfer.go` — J11DataTransfer
- [ ] `j12_alert.go` — J12Alert
- [ ] `j13_participant.go` — J13PrecisionParticipant
- [ ] `j14_17_command.go` — J14ProcessSpec, J15Command, J16Acknowledge, J17InitiateTransfer

### 1.3 — Fixed-size J-types (batch C: 3 files)
- [ ] `j26_27_time.go` — J26Test, J27Time
- [ ] `j28_space.go` — J28SpaceTrack
- [ ] `j29_30_31_symbology.go` — J29Symbology, J30IFF, J31FileTransfer

### 1.4 — Variable-size J-types
- [ ] `j8_radio.go` — J8Radio (variable MessageText field)
  - Roundtrip with 3 lengths: empty, 128 bytes, 256 bytes (max)

### 1.5 — Verify existing tests pass
- [ ] `pack_unpack_test.go` — 10 primitive tests still pass
- [ ] `encoder_test.go` — 5 tests (EncodeSensorEvent, EncodeTrack, EncodeEngagementOrder, RoundTrip, CRC16)
- [ ] `decoder_test.go` — 5 tests (DecodeOPIR, DecodeTrackUpdate, DecodeEngagementOrder, DecodeWrongType, InvalidCRC, InvalidHeader)

---

## Phase 2 — Data-Driven Encoder/Decoder

Replace switch-case chains with a registry table.

### 2.1 — Encoder registry
- [ ] Map `JSeriesType → func(interface{}) []byte` in `jreap/encoder.go`
- [ ] Replace `EncodeFull` switch cases with table lookup
- [ ] Test: existing encoder tests still pass

### 2.2 — Decoder registry
- [ ] Map `JSeriesType → func([]byte) interface{}` in `jreap/decoder.go`
- [ ] Replace `DecodeFull` switch cases with table lookup
- [ ] Test: existing decoder tests still pass

---

## Phase 3 — QualityFlags Pipeline (MDPAF gap)

Wired in encoder but not propagated through correlator → output.

- [ ] `correlator.go` — set QualityFlags on outgoing metadata
- [ ] `kafka.go` or `c2bmc.go` — carry QualityFlags to JREAP output
- [ ] Add test: track with known flags → roundtrip preserves flags

---

## Phase 4 — CorrelationID Propagation (MDPAF gap)

Metadata field defined but not populated.

- [ ] `correlator.go` — assign CorrelationID on new tracks
- [ ] `server.go` — propagate CorrelationID through JREAP output
- [ ] Add test: sensor event → track → verify CorrelationID set

---

## Phase 5 — J0/J1 Network Management (MDPAF gap)

J0/J1 encode functions exist but aren't called from anywhere.

- [ ] Define when J0/J1 should be generated (network join, track ownership transfer)
- [ ] Wire into server or kafka consumer
- [ ] Roundtrip test (Phase 1 covers the mechanics)

---

## Done (2026-04-04)
- ✅ All 18 J-series types built (j0–j31 minus unused)
- ✅ JREAP-C encoding layer (header, CRC-16, message types)
- ✅ MIL-STD-3011 compliance matrix documented
- ✅ MDPAF data model + J-series mapping
- ✅ Kafka + C2BMC integration with JREAP output methods
- ✅ Variable-size J31 (File Transfer) with submessage chain
- ✅ Primitive pack/unpack roundtrip tests (10 tests)
- ✅ High-level encoder/decoder tests (10 tests)
- ✅ `go build`, `go vet`, `gofmt` clean
