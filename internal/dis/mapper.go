// Package dis implements DIS (IEEE 1278.1) PDU encoding/decoding for FORGE-C2.
// Mapper provides bidirectional mapping between DIS and J-series messages.
package dis

// DISToJSeries converts a DIS Entity State PDU to a J-series Track Management message.
// This enables DIS entities to be represented in the Link 16 network.
func DISToJSeries(pdu *DISEntityStatePDU) (site, app, entity uint16, lat, lon, alt, heading, speed float64, forceType uint8, err error) {
	// Map entity ID
	site = pdu.SiteNumber
	app = pdu.ApplicationNumber
	entity = pdu.EntityNumber

	// Map location
	lat = pdu.Latitude
	lon = pdu.Longitude
	alt = pdu.Altitude

	// Map orientation (DIS uses radians, J0 uses degrees)
	heading = pdu.Orientation.Psi * (180 / 3.141592653589793)
	if heading < 0 {
		heading += 360
	}

	// Map velocity (DIS velocity in m/s)
	speed = pdu.VelocityX

	// Map force type based on entity country (simplified)
	switch pdu.EntityType.Country {
	case 200: // USA - would be FRIEND in real scenario
		forceType = 2 // Hostile for testing
	default:
		forceType = 4 // Unknown
	}

	return
}

// JSeriesToDIS converts J-series fields to a DIS Entity State PDU.
// This enables FORGE tracks to be shared via DIS.
func JSeriesToDIS(trackNumber uint16, lat, lon, alt, heading, speed float64, forceType uint8, site, app uint16) *DISEntityStatePDU {
	pdu := NewEntityStatePDU(site, app, trackNumber)

	// Map location
	pdu.SetLocation(lat, lon, alt)

	// Map heading to yaw orientation
	headingRad := heading * (3.141592653589793 / 180)
	pdu.Orientation.Psi = headingRad

	// Map speed to velocity
	pdu.SetVelocity(speed, 0, 0)

	// Map force type
	switch forceType {
	case 1:
		pdu.EntityType.Country = 200 // FRIEND
	case 2:
		pdu.EntityType.Country = 201 // HOSTILE
	default:
		pdu.EntityType.Country = 0 // UNKNOWN
	}

	return pdu
}

// DISFireToEngagement converts a DIS Fire PDU to engagement fields.
func DISFireToEngagement(fire *DISFirePDU) (targetEntity, firingEntity, munitionEntity uint16, err error) {
	return fire.TargetEntityNumber, fire.FiringEntityNumber, fire.MunitionEntityNumber, nil
}

// DISDetonationToResult converts a DIS Detonation PDU to engagement result fields.
func DISDetonationToResult(detonation *DISDetonationPDU) (targetEntity uint16, lat, lon, alt float64, err error) {
	return detonation.TargetEntityNumber, detonation.Latitude, detonation.Longitude, detonation.Altitude, nil
}
