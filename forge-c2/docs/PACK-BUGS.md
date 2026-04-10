# FORGE-C2 Pack/Unpack Bugs

Documented bugs in J-series message packing/unpacking.

## Fixed Bugs

### PackFloat24 Formula (FIXED)
- **Bug**: `PackFloat24(value, range_, maxValue)` used wrong formula: `(value + range_/2.0) / range_ * maxValue`
  - `maxValue = -90` was negative, causing clamping to fail
  - Example: `PackFloat24(33.7512, 180.0, -90.0)` returned `0xFFFF00` instead of `0xFFFFFFA6`
- **Fix**: Rewritten as `PackFloat24(value, range_, offset)` using `(value + offset) * 0xFFFFFF / range_`
  - For lat: `PackFloat24(lat, 180.0, 90.0)` → -90→0, 0→0x800000, 90→0xFFFFFF
  - For lon: `PackFloat24(lon, 360.0, 180.0)` → -180→0, 0→0x800000, 180→0xFFFFFF

### J2 Field Widths (PARTIALLY FIXED)
- **Bug**: J2 `PackJ2Surveillance` used `PackUint32` for 24-bit lat/lon/heading fields
- **Fix**: Changed to `PackUint24` for lat/lon, `PackUint16` for heading (14-bit field fits in 16)
- **Still broken**: Heading still misaligned due to remaining field offset issues

### J3 Payload Size (FIXED)
- **Bug**: `J3PayloadSize = 21` (off by 3)
- **Fix**: Changed to `J3PayloadSize = 24`

## Known Bugs (Not Yet Fixed)

### J0 Track Management - Buffer Overflow
- **Bug**: `J0PayloadSize = 36` but `PackJ0TrackManagement` writes beyond bounds
- **Cause**: SensorID (8 bytes) + CorrelationID (16 bytes) + other fields exceed 36 bytes
- **Test**: `TestJ0TrackManagementRoundtrip` panics with "index out of range [36]"
- **Fix needed**: Either increase `J0PayloadSize` to ~48, or truncate strings

### J1 Network Init - Latitude Unpack Wrong
- **Bug**: Latitude unpacked as -89.5 instead of 33.75
- **Cause**: Uses `PackLatitudePacked` (signed 24-bit) but unpacks with wrong offset
- **Test**: `TestJ1NetworkInitRoundtrip` shows lat mismatch
- **Fix needed**: Check if J1 uses signed vs unsigned lat packing

### J6 Sensor Registration - Latitude Unpack Wrong
- **Bug**: Latitude unpacked as -89.5 instead of 33.75
- **Cause**: Similar to J1 - uses `PackLatitudePacked` with wrong unpacking offset
- **Test**: `TestJ6SensorRegistrationRoundtrip` shows lat mismatch
- **Fix needed**: Verify J6 uses signed vs unsigned lat packing

### J11 Data Transfer - Buffer Overflow
- **Bug**: `J11PayloadSize = 32` but `PackJ11DataTransfer` writes beyond bounds
- **Cause**: Time field and other data exceed 32 bytes
- **Test**: `TestJ11DataTransferRoundtrip` panics with "index out of range"
- **Fix needed**: Increase `J11PayloadSize` or check field packing

### J26 Test - Buffer Overflow
- **Bug**: `J26PayloadSize = 11` but `PackJ26Test` writes TestData string beyond bounds
- **Cause**: TestData string (up to 64 bytes) + other fields exceed 11 bytes
- **Test**: `TestJ26TestRoundtrip` panics with "index out of range"
- **Fix needed**: Increase `J26PayloadSize` to accommodate TestData

## Roundtrip Test Results (Phase 4)

| Message Type | Status | Notes |
|-------------|--------|-------|
| J0 Track Management | ❌ FAIL | Buffer overflow |
| J1 Network Init | ❌ FAIL | Lat unpack wrong |
| J5 Engagement Status | ✅ PASS | |
| J6 Sensor Registration | ❌ FAIL | Lat unpack wrong |
| J7 Platform Data | ✅ PASS | |
| J9 Electronic Warfare | ✅ PASS | |
| J10 Offset | ✅ PASS | |
| J11 Data Transfer | ❌ FAIL | Buffer overflow |
| J12 Alert | ✅ PASS | |
| J13 Precision Participant | ✅ PASS | |
| J26 Test | ❌ FAIL | Buffer overflow |
| J27 Time | ✅ PASS | |

## Root Cause Analysis

Most bugs stem from:
1. **Payload size constants don't match actual packed sizes** (J0, J11, J26)
2. **Signed vs unsigned latitude/longitude packing** (J1, J6) - `PackLatitudePacked` uses signed int algorithm but unpacking may use unsigned

## Files Changed

- `jreap/jseries/pack_unpack.go` - Fixed PackFloat24 formula
- `jreap/jseries/j2_surveillance.go` - Fixed field widths
- `jreap/jseries/j3_track.go` - Fixed J3PayloadSize
- `jreap/jseries/roundtrip_test.go` - Phase 4 tests (14 passing)
