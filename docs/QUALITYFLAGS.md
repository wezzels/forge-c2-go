# QualityFlags Mapping Documentation

## Overview

QualityFlags is a bitfield that flows through the entire FORGE-C2 pipeline from sensor input to J-series output. It captures data quality indicators that affect track reliability and downstream processing decisions.

## MDPAMetadata QualityFlags

Defined in `mdpa/metadata.go`:

```go
const (
    QualityGood        = 1 << 0 // Data quality is good
    QualitySNRAdequate = 1 << 1 // Signal-to-noise ratio is adequate
    QualityGeomGood    = 1 << 2 // Geometric quality is good
    QualityTimely      = 1 << 3 // Data is timely (not stale)
    QualityCorrelated  = 1 << 4 // Track has been correlated
    QualityFused       = 1 << 5 // Track has been fused with other sources
)
```

### Quality Level Mapping

| MDPAMetadata Flags | Quality Level | Description |
|-------------------|---------------|-------------|
| QualityGood only | 1 (normal) | Good detection, SNR unknown |
| QualityGood + QualitySNRAdequate | 2 (good) | Good detection with adequate SNR |
| QualityGood + QualitySNRAdequate + QualityGeomGood | 3 (excellent) | Best quality track |
| QualityGood + QualityTimely | 1 (normal) | Timely updates |

## J-series QualityIndicator Mapping

Mapped in `jreap/encoder.go` via `metadataToQuality()`:

```go
// MDPAMetadata bits: 0=Good, 1=SNR, 2=Geom, 3=Timely, 4=Correlated, 5=Fused
// jseries QualityIndicator: 0-1=quality level, jamming, multipath, invalid, coasting, manual, derived
```

| MDPAMetadata | J-series QualityIndicator |
|--------------|---------------------------|
| QualityGood | Quality = 1 or 2 |
| QualityTimely NOT set | Coasting = true |
| QualityCorrelated | Derived = true |
| QualityFused | (propagated via FORGETrackExtension) |

## Pipeline Flow

```
Sensor Event
    ↓
correlator.computeQualityFlags()
    ↓
MDPAMetadata.QualityFlags (mdpa package)
    ↓
encoder.metadataToQuality()
    ↓
jseries.QualityIndicator
    ↓
J0/J2/J3 Quality field (8 bits)
    ↓
Link 16 Network
```

## Usage in Code

### Setting QualityFlags (internal/correlator.go)

```go
// Update QualityFlags based on sensor characteristics
func (tc *TrackCorrelator) updateTrackQualityFlagsUnsafe(
    track *Track,
    sensorType string,
    snr, confidence float64,
    hasMultipleSources bool) {
    
    flags := uint8(0)
    
    // QualityGood: set if confidence >= 0.7
    if confidence >= 0.7 {
        flags |= mdpa.QualityGood
    }
    
    // QualitySNRAdequate: set if SNR >= 3.0
    if snr >= 3.0 {
        flags |= mdpa.QualitySNRAdequate
    }
    
    // QualityTimely: set if update is recent
    if time.Since(track.LastUpdate) < 10*time.Second {
        flags |= mdpa.QualityTimely
    }
    
    track.QualityFlags = flags
}
```

### Reading QualityFlags

```go
meta := &mdpa.MDPAMetadata{
    QualityFlags: mdpa.QualityGood | mdpa.QualitySNRAdequate,
}

// Check individual flags
if meta.IsQualityGood() {
    // High confidence detection
}
if meta.QualityFlags&mdpa.QualityTimely != 0 {
    // Track is current
}
```

### Encoding to J-series

```go
enc := NewEncoder("TEST", "ENC")

meta := &mdpa.MDPAMetadata{
    ProcessingNodeID: "SENSOR-1",
    QualityFlags: mdpa.QualityGood | mdpa.QualitySNRAdequate | mdpa.QualityCorrelated,
    Classification: "UNCLASSIFIED",
}

track := &myTrack{...}
encoded, err := enc.EncodeTrackWithMetadata(track, meta)
```

## Roundtrip Test

See `jreap/encoder_integration_test.go:TestQualityFlagsPipeline`:

```bash
$ go test -v -run TestQualityFlagsPipeline ./jreap/
=== RUN   TestQualityFlagsPipeline
=== RUN   TestQualityFlagsPipeline/Good+SNR
=== RUN   TestQualityFlagsPipeline/Good_only
=== RUN   TestQualityFlagsPipeline/Good+SNR+Correlated
=== RUN   TestQualityFlagsPipeline/All_flags
--- PASS: TestQualityFlagsPipeline (0.00s)
```

## Quality Threshold Guidelines

| Threshold | Value | Usage |
|-----------|-------|-------|
| Confidence | ≥ 0.7 | QualityGood |
| SNR | ≥ 3.0 dB | QualitySNRAdequate |
| Update Age | < 10 sec | QualityTimely |
| Correlation | N/A | QualityCorrelated (set after correlation) |
| Fusion | N/A | QualityFused (set after fusion) |

## Future Enhancements

- [ ] Add QualityGeomGood computation based on GDOP
- [ ] Add QualityJamming flag for EW interference
- [ ] Add QualityMultipath flag for multipath detection
