
## J0/J1 Network Management Design

This document describes the design for J0 (Track Management) and J1 (Network Initialization) event handling in FORGE-C2.

### Current Implementation

The system currently processes incoming J0 and J1 messages via `track_mgr_handler.go` and `coordination_handler.go`. J-series encoding is available via `Encoder.EncodeJ0()` and `Encoder.EncodeJ1()`.

### J0 Event Types (Track Lifecycle)

```go
const (
    J0TrackInitiation  = 1  // New track confirmed
    J0TrackData       = 2  // Track update (kinematics)
    J0TrackDrop       = 3  // Track removed/exceeded covariance
    J0TrackGroup      = 4  // Group update
)
```

#### Events that SHOULD trigger J0 generation:

| Event | J0 MgtType | Trigger |
|-------|------------|---------|
| Track ownership transfer | `J0TrackData` | Track ownership moves to/from this network participant |
| Track delete/expire | `J0TrackDrop` | Track covariance exceeded or manually deleted |
| Track priority change | `J0TrackData` | Priority field updated |

### J1 Event Types (Network Initialization)

```go
const (
    J1Join         = 1  // Participant joining network
    J1Leave        = 2  // Participant leaving network  
    J1Heartbeat    = 3  // Network status heartbeat
    J1Init         = 4  // Network initialization
)
```

#### Events that SHOULD trigger J1 generation:

| Event | J1 Type | Trigger |
|-------|---------|---------|
| Network join | `J1Join` | Node joins the Link 16 network |
| Network leave | `J1Leave` | Node leaves the network |
| Participant status change | `J1Heartbeat` | Periodic heartbeat with participant status |

### Implementation Gaps

The following are NOT currently implemented and would need to be added:

1. **Track ownership transfer events** - No handler for ownership change callbacks
2. **Track delete/expiration events** - No scheduled cleanup or covariance-based drop detection
3. **J0 message generation** - `Encoder.EncodeJ0()` exists but not called in any handler
4. **J1 message generation** - `Encoder.EncodeJ1()` exists but not called in any handler

### Proposed Implementation

```go
// In track_mgr_handler.go

// OnTrackDrop is called when a track should be removed
func (h *trackManagerHandler) OnTrackDrop(trackNum uint16, reason string) error {
    enc := jreap.NewEncoder(h.decoder.NodeID(), "TRACK-MGR")
    
    j0 := &jseries.J0TrackManagement{
        TrackNumber: trackNum,
        MgtType:    jseries.J0TrackDrop,
        TrackStatus: jseries.TrackStatusDropped,
        Time:       time.Now(),
    }
    
    msg, err := enc.EncodeJ0(j0)
    if err != nil {
        return err
    }
    
    // Send to network output channel
    return h.outputChannel.Send(msg)
}

// OnOwnershipTransfer is called when track ownership changes
func (h *trackManagerHandler) OnOwnershipTransfer(trackNum uint16, from, to string) error {
    enc := jreap.NewEncoder(h.decoder.NodeID(), "TRACK-MGR")
    
    j0 := &jseries.J0TrackManagement{
        TrackNumber: trackNum,
        MgtType:    jseries.J0TrackData,
        TrackStatus: jseries.TrackStatusConfirmed,
        Time:       time.Now(),
    }
    
    msg, err := enc.EncodeJ0(j0)
    if err != nil {
        return err
    }
    
    return h.outputChannel.Send(msg)
}
```

### Test Coverage

```bash
# J0 encoding/decoding roundtrip
$ go test -v -run TestEncodeJ0Roundtrip ./jreap/
# J1 encoding/decoding roundtrip  
$ go test -v -run TestEncodeJ1Roundtrip ./jreap/
```

### Status

| Component | Status |
|-----------|--------|
| J0 encoder | ✅ Implemented |
| J1 encoder | ✅ Implemented |
| J0 decoder | ✅ Implemented |
| J1 decoder | ✅ Implemented |
| J0 event definitions | ⚠️ Design documented (not wired) |
| J1 event definitions | ⚠️ Design documented (not wired) |
| J0 generation handlers | ❌ Not implemented |
| J1 generation handlers | ❌ Not implemented |
