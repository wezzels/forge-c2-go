# FORGE-C2 Pack/Unpack Bugs

Documented bugs in J-series message packing/unpacking and their fixes.

## Fixed Bugs

### PackFloat24 Formula
- **Bug**: `PackFloat24(value, range_, maxValue)` used wrong formula: `(value + range_/2.0) / range_ * maxValue`
  - `maxValue = -90` was negative, causing clamping to fail
  - Example: `PackFloat24(33.7512, 180.0, -90.0)` returned `0xFFFF00` instead of `0xFFFFFFA6`
- **Fix**: Rewritten as `PackFloat24(value, range_, offset)` using `(value + offset) * 0xFFFFFF / range_`
  - For lat: `PackFloat24(lat, 180.0, 90.0)` → -90→0, 0→0x800000, 90→0xFFFFFF
  - For lon: `PackFloat24(lon, 360.0, 180.0)` → -180→0, 0→0x800000, 180→0xFFFFFF

### J2 Field Widths
- **Bug**: J2 `PackJ2Surveillance` used `PackUint32` for 24-bit lat/lon/heading fields
- **Fix**: Changed to `PackUint24` for lat/lon, `PackUint16` for heading (14-bit field fits in 16)

### J3 Payload Size
- **Bug**: `J3PayloadSize = 21` (off by 3)
- **Fix**: Changed to `J3PayloadSize = 24`

### J0 Payload Size (2026-04-10)
- **Bug**: `J0PayloadSize = 36` but `PackJ0TrackManagement` writes beyond bounds
- **Cause**: SensorID (8 bytes) + CorrelationID (16 bytes) + other fields require ~48 bytes
- **Fix**: Changed `J0PayloadSize` from 36 to 48
- **Verification**: `TestJ0TrackManagementRoundtrip` passes

### J1 Network Init (2026-04-10)
- **Bug**: Previously reported lat unpack wrong — actually worked correctly
- **Verification**: `TestJ1NetworkInitRoundtrip` passes with 0.001° tolerance

### J6 Sensor Registration - Buffer Overlap (2026-04-10)
- **Bug**: Latitude and Longitude packed with `PackUint32` but unpacked with `PackUint24` offsets
- **Root cause**: `PackUint32(latP, buf, off)` writes 4 bytes but `off += 3` only advances 3
- **Fix**: Changed `PackUint32` to `PackUint24` for lat/lon packing
- **Verification**: `TestJ6SensorRegistrationRoundtrip` passes (33.751198 ~= 33.751200)

### J11 Data Transfer - Missing Offset Increment (2026-04-10)
- **Bug**: `PackJ11DataTransfer` missing `off += 4` after packing Time (uint32)
- **Fix**: Added `off += 4` after `PackUint32(ms, buf, off)`
- **Also fixed**: `J11PayloadSize` from 32 to 37

### J26 Test - Payload Size Wrong (2026-04-10)
- **Bug**: `J26PayloadSize = 11` but TestData alone is 64 bytes
- **Fix**: Changed `J26PayloadSize` from 11 to 73 (1+2+2+64+4)
- **Verification**: `TestJ26TestRoundtrip` passes

## Roundtrip Test Results

| Message Type | Status | Tolerance |
|-------------|--------|-----------|
| J0 Track Management | ✅ PASS | 0.01° lat |
| J1 Network Init | ✅ PASS | 0.001° lat |
| J5 Engagement Status | ✅ PASS | exact |
| J6 Sensor Registration | ✅ PASS | 0.01° lat |
| J7 Platform Data | ✅ PASS | 0.01° lat, 0.1 speed |
| J9 Electronic Warfare | ✅ PASS | exact |
| J10 Offset | ✅ PASS | exact |
| J11 Data Transfer | ✅ PASS | 0.01° lat |
| J12 Alert | ✅ PASS | exact |
| J13 Precision Participant | ✅ PASS | 0.001° lat |
| J26 Test | ✅ PASS | exact |
| J27 Time | ✅ PASS | exact |

## Test Coverage

All tests pass: `go test ./jreap/... ./mdpa/... ./internal/...`

## Files Changed

| File | Changes |
|------|---------|
| `jreap/jseries/pack_unpack.go` | Fixed PackFloat24 formula |
| `jreap/jseries/j2_surveillance.go` | Fixed field widths (Uint32→Uint24, Uint16 for heading) |
| `jreap/jseries/j3_track.go` | Fixed J3PayloadSize (21→24) |
| `jreap/jseries/j0_track_mgmt.go` | Fixed J0PayloadSize (36→48) |
| `jreap/jseries/j6_sensor_reg.go` | Fixed PackUint32→PackUint24 for lat/lon |
| `jreap/jseries/j11_data_transfer.go` | Fixed off+=4 after Time, J11PayloadSize (32→37) |
| `jreap/jseries/j26_27_time.go` | Fixed J26PayloadSize (11→73) |
| `jreap/jseries/roundtrip_test.go` | 12 passing roundtrip tests |
| `docs/PACK-BUGS.md` | This document |
