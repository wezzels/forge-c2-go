
# FORGE-C2 Phases 2-4 Memory (2026-04-10)

## Phase 2: Encoder Registry - DONE
- Commit: `31d00087`
- Added `Encoder.registry map[MessageType]encodeFn`
- Added `NewEncoder`, `Register`, `EncodeUsing`, `registerDefaults`
- Added `MessageType.PayloadSize()` method in `message_types.go`
- Fixed PackFloat24 formula (was completely broken)
- Fixed J2 heading: 24-bit -> 16-bit PackUint16
- Fixed J2 lat/lon: PackUint32 -> PackUint24

## Phase 3: Decoder Registry - DONE  
- Commit: `de10392d`
- Added `Decoder.registry map[MessageType]decodeFn`
- Added `NewDecoder`, `Register`, `DecodeUsing`, `registerDefaults`
- Mirror image of encoder registry pattern

## Phase 4: Roundtrip Tests - IN PROGRESS
- Creating comprehensive roundtrip tests for J0-J31
- Using encode/decode cycle to verify pack/unpack correctness
- Focus on integer and float field precision

## Key Technical Details

### PackFloat24 Fix
- Old (broken): `(value + range_/2.0) / range_ * maxValue` with maxValue=-90
- New (correct): `(value + offset) * 0xFFFFFF / range_`
- For lat: range_=180, offset=90 → -90→0, 0→0x800000, 90→0xFFFFFF
- For lon: range_=360, offset=180 → -180→0, 0→0x800000, 180→0xFFFFFF

### J2 Field Layout (14-bit heading)
- Heading: 14 bits fit in 16-bit uint16, mask 0x3FFF
- Radial velocity: 24 bits, offset -819.2 m/s, 0.1 m/s resolution

### J3 Issues
- J3 uses PackLatitude/Lon (wrong - different from PackLatitudePacked)
- J3PayloadSize = 24 (fixed from 21)

## Files Changed
- `jreap/encoder.go` - registry + EncodeUsing
- `jreap/decoder.go` - registry + DecodeUsing  
- `jreap/message_types.go` - PayloadSize method
- `jreap/encoder_test.go` - EncodeUsing tests
- `jreap/decoder_test.go` - DecodeUsing tests
- `jreap/jseries/pack_unpack.go` - PackFloat24 fix
- `jreap/jseries/j2_surveillance.go` - field width fixes
- `jreap/jseries/j3_track.go` - J3PayloadSize fix

## Bug Tracking
- docs/PACK-BUGS.md - detailed bug documentation
