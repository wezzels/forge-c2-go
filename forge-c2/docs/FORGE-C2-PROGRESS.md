
## Phase 4 - Roundtrip Tests (2026-04-10)

### Status: In Progress

### Commits (Phases 2-4)
- `31d00087` jreap: Phase 2 - data-driven encoder registry + PayloadSize method
- `de10392d` jreap: Phase 3 - data-driven decoder registry

### Encoder Registry (Phase 2 - DONE)
```go
Encoder
├── registry map[MessageType]encodeFn
├── NewEncoder(nodeID, appID)  // auto-registers all J-types
├── Register(msgType, fn)       // runtime override
├── EncodeUsing(msgType, msg)  // data-driven encode
└── registerDefaults()           // J0-J31 built-in
```

### Decoder Registry (Phase 3 - DONE)
```go
Decoder
├── registry map[MessageType]decodeFn
├── NewDecoder(nodeID, appID)  // auto-registers all J-types
├── Register(msgType, fn)       // runtime override
├── DecodeUsing(msg)            // data-driven decode
└── registerDefaults()           // J0-J31 built-in
```

### Known Bugs (tracked in docs/PACK-BUGS.md)
- J2 lat/lon/heasing/radial velocity pack/unpack - field layout issues
- J3 lat/lon - uses wrong PackLatitude/Longitude functions
- PackFloat24 formula was wrong - fixed but roundtrip still fails

### Next Steps
1. Phase 4: Roundtrip tests for J0, J1, J5-J31
2. Fix remaining J2/J3 pack/unpack bugs
3. Update PACK-BUGS.md with current status
