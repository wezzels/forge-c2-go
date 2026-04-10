# FORGE-C2 Pack/Unpack Bugs

Documented bugs in J-series message packing/unpacking and their fixes.

## Fixed Bugs

### PackFloat24 Formula
- **Bug**: `PackFloat24(value, range_, maxValue)` used wrong formula
- **Fix**: Rewritten as `PackFloat24(value, range_, offset)` using `(value + offset) * 0xFFFFFF / range_`

### J2 Field Widths
- **Bug**: J2 `PackJ2Surveillance` used `PackUint32` for 24-bit lat/lon fields
- **Fix**: Changed to `PackUint24`

### J3 Payload Size
- **Bug**: `J3PayloadSize = 21` (off by 3)
- **Fix**: Changed to `J3PayloadSize = 24`

### J0 Payload Size
- **Bug**: `J0PayloadSize = 36` but `PackJ0TrackManagement` writes beyond bounds
- **Fix**: Changed `J0PayloadSize` from 36 to 48

### J6 Sensor Registration - Buffer Overlap
- **Bug**: Latitude and Longitude packed with `PackUint32` but unpacked with `PackUint24` offsets
- **Fix**: Changed `PackUint32` to `PackUint24` for lat/lon packing

### J11 Data Transfer - Missing Offset Increment
- **Bug**: `PackJ11DataTransfer` missing `off += 4` after packing Time (uint32)
- **Fix**: Added `off += 4` after `PackUint32(ms, buf, off)`
- **Also fixed**: `J11PayloadSize` from 32 to 37

### J26 Test - Payload Size Wrong
- **Bug**: `J26PayloadSize = 11` but TestData alone is 64 bytes
- **Fix**: Changed `J26PayloadSize` from 11 to 73

### J2 Surveillance - Missing SensorID Packing
- **Bug**: `J2PayloadSize = 40` but struct has SensorID field (8 bytes) not packed
- **Fix**: 
  - Changed `J2PayloadSize` from 40 to 44 (added SensorID field at end)
  - Added SensorID packing in `PackJ2Surveillance` (8 bytes, null-padded)
  - Added SensorID unpacking in `UnpackJ2Surveillance` (null-terminated)
  - Updated encoder test: Expected bytes 50→54 (header 8 + payload 44 + CRC 2)

## Roundtrip Test Results

| Message Type | Status | Tolerance |
|-------------|--------|-----------|
| J0 Track Management | ✅ PASS | 0.01° lat |
| J1 Network Init | ✅ PASS | 0.001° lat |
| J2 Surveillance | ✅ PASS | 0.01° lat (FIXED 2026-04-10) |
| J3 Track Update | ✅ PASS | 0.01° lat |
| J4 Engagement Order | ✅ PASS | exact |
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

**All 13 roundtrip tests passing**

## Files Changed

| File | Changes |
|------|---------|
| `jreap/jseries/pack_unpack.go` | Fixed PackFloat24 formula |
| `jreap/jseries/j0_track_mgmt.go` | Fixed J0PayloadSize (36→48) |
| `jreap/jseries/j2_surveillance.go` | Fixed SensorID packing, J2PayloadSize (40→44) |
| `jreap/jseries/j3_track.go` | Fixed J3PayloadSize (21→24) |
| `jreap/jseries/j6_sensor_reg.go` | Fixed PackUint32→PackUint24 for lat/lon |
| `jreap/jseries/j11_data_transfer.go` | Fixed off+=4 after Time, J11PayloadSize (32→37) |
| `jreap/jseries/j26_27_time.go` | Fixed J26PayloadSize (11→73) |
| `jreap/jseries/roundtrip_test.go` | 13 passing roundtrip tests |
| `jreap/encoder_test.go` | Fixed expected bytes for J2 (50→54) |
| `docs/PACK-BUGS.md` | This document |

## Test Command

```bash
cd ~/forge-c2-go-src
go test ./jreap/... -v
```
