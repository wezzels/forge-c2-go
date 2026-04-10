// Package mdpa implements MDPAF compliance for FORGE-C2.
package mdpa

import (
	"forge-c2/jreap/jseries"
)

// JSeriesToMDPAF converts a J-series Track Management message to MDPAF metadata.
func JSeriesToMDPAF(j0 *jseries.J0TrackManagement) *MDPAFTrackMetadata {
	m := NewMDPAFTrackMetadata(j0.TrackNumber, 0)
	
	// Set location
	m.SetLocation(j0.Latitude, j0.Longitude, j0.Altitude)
	
	// Set motion
	m.SetMotion(j0.Heading, j0.Speed, 0)
	
	// Set source info
	m.SensorID = j0.SensorID
	m.SourceSystem = "FORGE-C2"
	
	// Map force type to classification
	switch j0.ForceType {
	case 1:
		m.Header.Classification = ClassificationUnclassified
	case 2:
		m.Header.Classification = ClassificationConfidential
	case 3:
		m.Header.Classification = ClassificationSecret
	case 4:
		m.Header.Classification = ClassificationTopSecret
	}
	
	// Map quality (QualityIndicator is uint8)
	m.TrackConfidence = float64(j0.Quality.Quality) * 100.0 / 3.0
	
	return m
}

// MDPAFToJSeries converts MDPAF metadata to J-series fields.
func MDPAFToJSeries(m *MDPAFTrackMetadata) (trackNum uint16, lat, lon, alt, heading, speed float64, forceType uint8) {
	// Map classification to force type
	switch m.Header.Classification {
	case ClassificationUnclassified:
		forceType = 1
	case ClassificationConfidential:
		forceType = 2
	case ClassificationSecret:
		forceType = 3
	case ClassificationTopSecret:
		forceType = 4
	}
	
	return m.TrackNumber, m.Latitude, m.Longitude, m.Altitude, m.Heading, m.Speed, forceType
}
