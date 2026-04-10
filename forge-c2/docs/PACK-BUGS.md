# FORGE-C2 Pack/Unpack Bugs

## J3PayloadSize Off-by-3

**File:** `jreap/jseries/j3_track.go`
**Line:** 25
**Bug:** `J3PayloadSize = 21` but actual packed size is 24 bytes

**Fields in J3 pack (24 bytes total):**
- TrackNumber: 2 bytes
- Time (ms): 4 bytes
- Latitude: 3 bytes (24-bit NIPO)
- Longitude: 3 bytes (24-bit NIPO)
- Altitude: 3 bytes
- Speed: 2 bytes (via PackVelocity)
- Heading: 2 bytes
- Status: 1 byte
- ThreatLevel: 1 byte
- Quality: 1 byte
- PlatformType: 1 byte
- ForceType: 1 byte
- **Total: 24 bytes**

**Impact:** `PackJ3TrackUpdate` writes to `buf[21]` (off=21) but only allocates 21 bytes → panic at line 64

**Fix:** Change `const J3PayloadSize = 21` to `const J3PayloadSize = 24`

---

## J2 Pack/Unpack Field Misalignment

**File:** `jreap/jseries/j2_surveillance.go`

**Bug:** `PackJ2Surveillance` writes lat/lon as 32-bit values using `PackUint32` (which writes 4 bytes), but J2 standard specifies 24-bit packed lat/lon.

Current code:
```go
latP := PackLatitudePacked(j2.Latitude)  // returns uint32 (24-bit value as 32-bit)
lonP := PackLongitudePacked(j2.Longitude) // returns uint32 (24-bit value as 32-bit)
PackUint32(latP, buf, off)   // writes 4 bytes starting at off
off += 4
PackUint32(lonP, buf, off)   // writes 4 bytes starting at off+4
off += 4
```

But `UnpackJ2Surveillance` reads them as 24-bit values:
```go
latP := UnpackUint32(buf, off)    // reads 4 bytes but should read 3
off += 4
lonP := UnpackUint32(buf, off)     // reads 4 bytes but should read 3
off += 4
j2.Latitude = UnpackLatitudePacked(latP)
j2.Longitude = UnpackLongitudePacked(lonP)
```

**Impact:** All lat/lon values corrupted. Similar issues with Heading (14 bits from 24-bit field).

**Fix:** Change Pack side to use `PackUint24` instead of `PackUint32` for lat, lon, heading, radial velocity.

---

## J2 Frequency Field Size

**File:** `jreap/jseries/j2_surveillance.go`

**Bug:** Frequency packed as 16-bit kHz (max ~65 MHz) but struct comment says Hz. Original frequency 9700 MHz (9700e6) overflows uint16 → becomes ~324 kHz.

**Fix:** Either extend to 32-bit or document the kHz limitation.

---

## Root Cause Analysis

The pack/unpack code was written without roundtrip tests. Existing encoder tests use `EncodeTrack` which bypasses the J-series pack functions and uses inline byte manipulation directly in `packTrackUpdate()`.

The encoder.go `packTrackUpdate()` function uses correct 24-bit NIPO packing inline (no PackLatitudePacked call), which is why `EncodeTrack` works correctly.

The J-series `PackJ2Surveillance` and `PackJ3TrackUpdate` functions are dead code paths never exercised by tests.

---

## Test Coverage Gap

`go test ./jreap/` passes (uses EncodeTrack/EncodeSensorEvent which bypass pack functions)
`go test ./jreap/jseries/ -run Roundtrip` fails on J2/J3/J4 because pack/unpack has bugs

---

**Discovered:** 2026-04-10
**Status:** Documented, not yet fixed
