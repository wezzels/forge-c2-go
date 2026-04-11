# CorrelationID Documentation

## Overview

CorrelationID is an end-to-end tracking identifier that persists through the entire FORGE-C2 pipeline. It enables tracing a track from initial sensor detection through correlation, fusion, and output to J-series messages.

## Format

```
{satellite_id}-{track_number:04d}-{timestamp_ms}
```

**Example:** `SBIRS-GEO-1-1234-1744354800000`

| Component | Description |
|-----------|-------------|
| satellite_id | Sensor/satellite identifier (e.g., SBIRS-GEO-1, NG-OPIR-2, FUSED) |
| track_number | 4-digit zero-padded Link 16 track number |
| timestamp_ms | Unix timestamp in milliseconds |

## Implementation

### Generation (internal/kafka.go)

```go
func GenerateCorrelationID(satID string, trackNum uint16, t time.Time) string {
    return fmt.Sprintf("%s-%04d-%d", satID, trackNum, t.UnixMilli())
}
```

### Assignment (internal/correlator.go)

```go
// Generate CorrelationID: satellite_id-track_num-timestamp
corrID := GenerateCorrelationID(event.SensorID, trackNum, event.Timestamp)
```

### Storage (mdpa/metadata.go)

```go
type MDPAMetadata struct {
    CorrelationID string  // end-to-end tracking identifier
    // ...
}
```

## Pipeline Flow

```
Sensor Event
    ↓
TrackCorrelator.ProcessEvent()
    ↓
GenerateCorrelationID(sensorID, trackNum, timestamp)
    ↓
MDPAMetadata.CorrelationID
    ↓
EncodeTrackWithMetadata()
    ↓
JREAP Output (preserved in EncodedMessage.Metadata)
    ↓
Link 16 Network
```

## Usage

### Setting CorrelationID

```go
meta := &mdpa.MDPAMetadata{
    ProcessingNodeID: "SENSOR-1",
    CorrelationID:   "SBIRS-GEO-1-1234-1744354800000",
    Classification:   "UNCLASSIFIED",
}
```

### Reading CorrelationID

```go
if meta.CorrelationID != "" {
    log.Printf("Track correlation ID: %s", meta.CorrelationID)
}
```

## J-series Mapping

CorrelationID is carried in `EncodedMessage.Metadata` and is available for:

- **J-series logging/audit trails** (outside the wire format)
- **Cross-reference tables** (correlation of J-series to source tracks)
- **Debug tracing** end-to-end through the pipeline

Note: CorrelationID is NOT encoded into the J-series wire format itself (no dedicated field in Link 16). It is carried as metadata alongside the encoded bytes.

## Tests

See `jreap/encoder_integration_test.go`:

- `TestCorrelationIDPropagation` - verifies CorrelationID preserved in metadata
- `TestCorrelationIDFormat` - verifies format: `{sat}-{num:04d}-{ms}`

```bash
$ go test -v -run TestCorrelationID ./jreap/
=== RUN   TestCorrelationIDPropagation
=== RUN   TestCorrelationIDPropagation/SBIRS-GEO-1
=== RUN   TestCorrelationIDPropagation/NG-OPIR-2
=== RUN   TestCorrelationIDPropagation/FUSED
--- PASS: TestCorrelationIDPropagation (0.00s)
=== RUN   TestCorrelationIDFormat
--- PASS: TestCorrelationIDFormat (0.00s)
```
