package mdpa

import (
	"fmt"
	"time"
)

// MDPAMetadata contains the standard MDPAF metadata fields that are attached
// to every message processed through the FORGE system. This metadata provides
// provenance, quality, and classification information required for MDPAF
// compliance.
type MDPAMetadata struct {
	// ProcessingNodeID identifies the specific FORGE processing node that
	// last modified this message. Format: "FORGE-NODE-XXXX" where XXXX is
	// a unique node identifier.
	ProcessingNodeID string

	// IngestTimestamp is when this message was received/ingested by the
	// MDPAF system. Stored as UTC.
	IngestTimestamp time.Time

	// QualityFlags is a bitfield indicating sensor/data quality indicators.
	// Bits (from LSB):
	//   0: Quality Good (1=good, 0=unknown/bad)
	//   1: SNR Adequate (1=adequate, 0=low)
	//   2: Geometric Quality (1=good geometry, 0=poor)
	//   3: Timeliness (1=timely, 0=stale)
	//   4: Correlated (1=correlated, 0=raw)
	//   5: Fused (1=fused, 0=not fused)
	//   6: Reserved
	//   7: Reserved
	QualityFlags uint8

	// Classification is the security classification marking for this message.
	// Standard values: "UNCLASSIFIED", "CONFIDENTIAL//NOFORN", "SECRET//NOFORN",
	// "TOP SECRET//SI//NOFORN"
	Classification string

	// ApplicationID identifies which MDPAF application generated or last
	// processed this message. Format varies by application (e.g., "TRK-INIT",
	// "OPIR-INGEST", "ENG-MGR").
	ApplicationID string

	// CorrelationID is an end-to-end tracking identifier used to correlate
	// related messages across processing stages. Format: UUID or
	// "SRC-TIME-NNNNN" where SRC is source, TIME is ISO8601, NNNNN is seq.
	CorrelationID string
}

// QualityFlag constants for MDPAMetadata.QualityFlags
const (
	QualityGood        = 1 << 0 // Data quality is good
	QualitySNRAdequate = 1 << 1 // Signal-to-noise ratio is adequate
	QualityGeomGood    = 1 << 2 // Geometric quality is good
	QualityTimely      = 1 << 3 // Data is timely (not stale)
	QualityCorrelated  = 1 << 4 // Track has been correlated
	QualityFused       = 1 << 5 // Track has been fused with other sources
)

// NewMDPAMetadata creates a new MDPAMetadata with default values.
// Classification defaults to "UNCLASSIFIED", other fields must be set.
func NewMDPAMetadata(nodeID, appID, correlationID, classification string) *MDPAMetadata {
	if classification == "" {
		classification = "UNCLASSIFIED"
	}
	return &MDPAMetadata{
		ProcessingNodeID: nodeID,
		IngestTimestamp:  time.Now().UTC(),
		QualityFlags:     QualityGood | QualityTimely, // Default to good
		Classification:   classification,
		ApplicationID:    appID,
		CorrelationID:   correlationID,
	}
}

// NewMDPAMetadataFromSensor creates metadata for a sensor event,
// computing QualityFlags from sensor characteristics.
func NewMDPAMetadataFromSensor(nodeID, appID, correlationID, classification string, snr, confidence float64, sensorType string) *MDPAMetadata {
	m := NewMDPAMetadata(nodeID, appID, correlationID, classification)
	// Set SNR flag
	if snr >= 10 {
		m.SetQualityFlag(QualitySNRAdequate)
	}
	// Confidence flag
	if confidence >= 0.7 {
		m.SetQualityFlag(QualityGood)
	}
	// Sensor-specific adjustments
	if sensorType == "OPIR" {
		m.SetQualityFlag(QualityGeomGood) // OPIR has good geometric quality from space
	}
	return m
}

// NewMDPAMetadataFromTrack creates metadata for a track update,
// setting correlated/fused flags based on track state.
func NewMDPAMetadataFromTrack(nodeID, appID, correlationID, classification string, isCorrelated, isFused bool) *MDPAMetadata {
	m := NewMDPAMetadata(nodeID, appID, correlationID, classification)
	if isCorrelated {
		m.SetQualityFlag(QualityCorrelated)
	}
	if isFused {
		m.SetQualityFlag(QualityFused)
	}
	return m
}

// IsQualityGood returns true if the quality flag indicates good data.
func (m *MDPAMetadata) IsQualityGood() bool {
	return m.QualityFlags&QualityGood != 0
}

// IsCorrelated returns true if the track has been correlated.
func (m *MDPAMetadata) IsCorrelated() bool {
	return m.QualityFlags&QualityCorrelated != 0
}

// IsFused returns true if the track has been fused with other sources.
func (m *MDPAMetadata) IsFused() bool {
	return m.QualityFlags&QualityFused != 0
}

// SetQualityFlag sets a quality flag bit.
func (m *MDPAMetadata) SetQualityFlag(flag uint8) {
	m.QualityFlags |= flag
}

// ClearQualityFlag clears a quality flag bit.
func (m *MDPAMetadata) ClearQualityFlag(flag uint8) {
	m.QualityFlags &^= flag
}

// String implements fmt.Stringer for MDPAMetadata.
func (m *MDPAMetadata) String() string {
	return fmt.Sprintf("MDPAF[Node=%s App=%s Class=%s Corr=%s Time=%s Quality=0x%02X]",
		m.ProcessingNodeID, m.ApplicationID, m.Classification,
		m.CorrelationID, m.IngestTimestamp.Format(time.RFC3339), m.QualityFlags)
}

// Validate checks if the metadata has all required fields set.
func (m *MDPAMetadata) Validate() error {
	if m.ProcessingNodeID == "" {
		return fmt.Errorf("ProcessingNodeID is required")
	}
	if m.ApplicationID == "" {
		return fmt.Errorf("ApplicationID is required")
	}
	if m.Classification == "" {
		return fmt.Errorf("Classification is required")
	}
	// CorrelationID can be empty for some message types
	return nil
}
