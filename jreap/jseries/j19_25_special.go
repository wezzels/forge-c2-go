package jseries

import (
	"time"
)

// =============================================================================
// J19 Component - Composite Track Component/Part
// =============================================================================

// J19Component represents a component or part of a composite track.
// Used for articulated parts, attached equipment, or composite track segments.
type J19Component struct {
	TrackNumber     uint16    // 16 bits: Parent track number
	ComponentID     uint8     // 8 bits: Component identifier
	ComponentType   uint8     // 8 bits: Type of component
	Latitude       float64   // degrees
	Longitude      float64   // degrees
	Altitude       float64   // meters
	VelocityX      float64   // m/s in ECI frame
	VelocityY      float64   // m/s
	VelocityZ      float64   // m/s
	AccelerationX  float64   // m/s²
	AccelerationY  float64   // m/s²
	AccelerationZ  float64   // m/s²
	EntityType     uint32    // Entity type encoding
	Time           time.Time // 32 bits: milliseconds since epoch
}

// J19PayloadSize is the packed size in bytes
const J19PayloadSize = 52 // Conservative estimate

// PackJ19Component packs a J19 Component message
func PackJ19Component(j *J19Component, buf []byte) int {
	off := 0
	PackUint16(j.TrackNumber, buf, off)
	off += 2
	buf[off] = j.ComponentID
	off++
	buf[off] = j.ComponentType
	off++
	
	// Latitude (24-bit NIPO)
	latP := PackLatitudePacked(j.Latitude)
	PackUint24(latP, buf, off)
	off += 3
	
	// Longitude (24-bit NIPO)
	lonP := PackLongitudePacked(j.Longitude)
	PackUint24(lonP, buf, off)
	off += 3
	
	// Altitude (24-bit)
	altP := uint32(j.Altitude * 10) // ×10 for precision
	PackUint24(altP, buf, off)
	off += 3
	
	// Velocities (16-bit each)
	PackUint16(uint16(j.VelocityX+5000), buf, off) // Offset to handle negative
	off += 2
	PackUint16(uint16(j.VelocityY+5000), buf, off)
	off += 2
	PackUint16(uint16(j.VelocityZ+5000), buf, off)
	off += 2
	
	// Accelerations (16-bit each)
	PackUint16(uint16((j.AccelerationX+100)*100), buf, off)
	off += 2
	PackUint16(uint16((j.AccelerationY+100)*100), buf, off)
	off += 2
	PackUint16(uint16((j.AccelerationZ+100)*100), buf, off)
	off += 2
	
	// Time and entity type
	ms := PackMilliseconds(j.Time)
	PackUint32(ms, buf, off)
	off += 4
	PackUint32(j.EntityType, buf, off)
	off += 4
	
	// Pad to even size
	if off%2 != 0 {
		buf[off] = 0
		off++
	}
	
	return off
}

// UnpackJ19Component unpacks a J19 Component message
func UnpackJ19Component(buf []byte) *J19Component {
	off := 0
	j := &J19Component{}
	j.TrackNumber = UnpackUint16(buf, off)
	off += 2
	j.ComponentID = buf[off]
	off++
	j.ComponentType = buf[off]
	off++
	
	latP := UnpackUint24(buf, off)
	j.Latitude = UnpackLatitude(latP)
	off += 3
	
	lonP := UnpackUint24(buf, off)
	j.Longitude = UnpackLongitude(lonP)
	off += 3
	
	altP := UnpackUint24(buf, off)
	j.Altitude = float64(int32(altP)) / 10
	off += 3
	
	vx := UnpackUint16(buf, off)
	j.VelocityX = float64(int16(vx)) - 5000
	off += 2
	vy := UnpackUint16(buf, off)
	j.VelocityY = float64(int16(vy)) - 5000
	off += 2
	vz := UnpackUint16(buf, off)
	j.VelocityZ = float64(int16(vz)) - 5000
	off += 2
	
	ax := UnpackUint16(buf, off)
	j.AccelerationX = float64(int16(ax))/100 - 100
	off += 2
	ay := UnpackUint16(buf, off)
	j.AccelerationY = float64(int16(ay))/100 - 100
	off += 2
	az := UnpackUint16(buf, off)
	j.AccelerationZ = float64(int16(az))/100 - 100
	off += 2
	
	ms := UnpackUint32(buf, off)
	j.Time = time.UnixMilli(int64(ms))
	off += 4
	j.EntityType = UnpackUint32(buf, off)
	
	return j
}

// =============================================================================
// J20 Air Track - Dedicated Air Platform Track
// =============================================================================

// J20AirTrack represents a track for an airborne platform.
type J20AirTrack struct {
	TrackNumber        uint16    // 16 bits
	Time              time.Time // 32 bits: milliseconds since epoch
	Latitude          float64   // degrees
	Longitude         float64   // degrees
	Altitude          float64   // meters
	Speed             float64   // m/s
	Heading           float64   // degrees (0-360)
	VerticalVelocity  float64   // m/s
	SpeedType         uint8     // True/Airspeed/Mach
	AltitudeType      uint8     // Geometric/Radar/Barometric
	IFF               uint8     // IFF mode codes
	IFFData           uint32    // IFF supplemental data
	TrackQuality      uint8     // Track quality indicator
	Quality           QualityIndicator
	ParticipantNumber uint16    // Link 16 participant number
	ForceType         uint8     // FRIEND/HOSTILE/NEUTRAL/UNKNOWN
}

// J20PayloadSize = 2+4+3+3+3+2+2+2+1+1+1+4+1+2+2 = 30 bytes
const J20PayloadSize = 34

// PackJ20AirTrack packs a J20 Air Track message
func PackJ20AirTrack(j *J20AirTrack, buf []byte) int {
	off := 0
	PackUint16(j.TrackNumber, buf, off)
	off += 2
	ms := PackMilliseconds(j.Time)
	PackUint32(ms, buf, off)
	off += 4
	
	latP := PackLatitudePacked(j.Latitude)
	PackUint24(latP, buf, off)
	off += 3
	
	lonP := PackLongitudePacked(j.Longitude)
	PackUint24(lonP, buf, off)
	off += 3
	
	altP := uint32(j.Altitude / 0.5) // 0.5m resolution
	PackUint24(altP, buf, off)
	off += 3
	
	spdP := uint16(j.Speed * 10) // 0.1 m/s resolution
	PackUint16(spdP, buf, off)
	off += 2
	
	hdgP := PackHeading(j.Heading)
	PackUint16(hdgP, buf, off)
	off += 2
	
	vvP := uint16(j.VerticalVelocity + 500) // Offset for negative
	PackUint16(vvP, buf, off)
	off += 2
	
	buf[off] = (j.SpeedType << 4) | (j.AltitudeType & 0x0F)
	off++
	buf[off] = j.IFF
	off++
	buf[off] = j.TrackQuality
	off++
	
	PackUint32(j.IFFData, buf, off)
	off += 4
	
	PackUint16(j.ParticipantNumber, buf, off)
	off += 2
	
	forceHdl := uint16((j.ForceType & 0x03) << 6)
	PackUint16(forceHdl<<8, buf, off)
	off += 2
	
	return off
}

// UnpackJ20AirTrack unpacks a J20 Air Track message
func UnpackJ20AirTrack(buf []byte) *J20AirTrack {
	off := 0
	j := &J20AirTrack{}
	j.TrackNumber = UnpackUint16(buf, off)
	off += 2
	j.Time = time.UnixMilli(int64(UnpackUint32(buf, off)))
	off += 4
	
	latP := UnpackUint24(buf, off)
	j.Latitude = UnpackLatitude(latP)
	off += 3
	
	lonP := UnpackUint24(buf, off)
	j.Longitude = UnpackLongitude(lonP)
	off += 3
	
	altP := UnpackUint24(buf, off)
	j.Altitude = float64(altP) * 0.5
	off += 3
	
	spdP := UnpackUint16(buf, off)
	j.Speed = float64(spdP) / 10
	off += 2
	
	hdgP := UnpackUint16(buf, off)
	j.Heading = float64(hdgP) * 360.0 / 65536.0
	off += 2
	
	vvP := UnpackUint16(buf, off)
	j.VerticalVelocity = float64(int16(vvP)) - 500
	off += 2
	
	j.SpeedType = buf[off] >> 4
	j.AltitudeType = buf[off] & 0x0F
	off++
	j.IFF = buf[off]
	off++
	j.TrackQuality = buf[off]
	off++
	
	j.IFFData = UnpackUint32(buf, off)
	off += 4
	
	j.ParticipantNumber = UnpackUint16(buf, off)
	off += 2
	
	j.ForceType = uint8(UnpackUint16(buf, off) >> 14)
	
	return j
}

// =============================================================================
// J21 Surface Track - Surface Ship Track
// =============================================================================

// J21SurfaceTrack represents a track for a surface vessel.
type J21SurfaceTrack struct {
	TrackNumber        uint16    // 16 bits
	Time              time.Time // 32 bits
	Latitude          float64   // degrees
	Longitude         float64   // degrees
	Altitude          float64   // meters (0 for surface)
	Speed             float64   // m/s
	Heading           float64   // degrees
	CourseOverGround  float64   // degrees
	SpeedOverGround   float64   // m/s
	TurnRate          float64   // degrees/second
	ShipType          uint16    // Ship type enumeration
	VesselID          uint32    // Identification number
	TrackQuality      uint8     // Quality indicator
	Quality           QualityIndicator
	ParticipantNumber uint16
	ForceType         uint8
}

// J21PayloadSize = 2+4+3+3+2+2+2+2+2+2+2+2+4+1+2+2+1 = 36 bytes
const J21PayloadSize = 36

// PackJ21SurfaceTrack packs a J21 Surface Track message
func PackJ21SurfaceTrack(j *J21SurfaceTrack, buf []byte) int {
	off := 0
	PackUint16(j.TrackNumber, buf, off)
	off += 2
	ms := PackMilliseconds(j.Time)
	PackUint32(ms, buf, off)
	off += 4
	
	latP := PackLatitudePacked(j.Latitude)
	PackUint24(latP, buf, off)
	off += 3
	
	lonP := PackLongitudePacked(j.Longitude)
	PackUint24(lonP, buf, off)
	off += 3
	
	altP := uint16(j.Altitude * 10) // 0.1m resolution
	PackUint16(altP, buf, off)
	off += 2
	
	spdP := uint16(j.Speed * 10)
	PackUint16(spdP, buf, off)
	off += 2
	
	hdgP := PackHeading(j.Heading)
	PackUint16(hdgP, buf, off)
	off += 2
	
	cogP := PackHeading(j.CourseOverGround)
	PackUint16(cogP, buf, off)
	off += 2
	
	sogP := uint16(j.SpeedOverGround * 10)
	PackUint16(sogP, buf, off)
	off += 2
	
	trP := uint16((j.TurnRate + 100) * 10) // Offset for negative
	PackUint16(trP, buf, off)
	off += 2
	
	PackUint16(j.ShipType, buf, off)
	off += 2
	
	PackUint32(j.VesselID, buf, off)
	off += 4
	
	buf[off] = j.TrackQuality
	off++
	
	PackUint16(j.ParticipantNumber, buf, off)
	off += 2
	
	forceHdl := uint16((j.ForceType & 0x03) << 6)
	PackUint16(forceHdl<<8, buf, off)
	off += 2
	
	return off
}

// UnpackJ21SurfaceTrack unpacks a J21 Surface Track message
func UnpackJ21SurfaceTrack(buf []byte) *J21SurfaceTrack {
	off := 0
	j := &J21SurfaceTrack{}
	j.TrackNumber = UnpackUint16(buf, off)
	off += 2
	j.Time = time.UnixMilli(int64(UnpackUint32(buf, off)))
	off += 4
	
	latP := UnpackUint24(buf, off)
	j.Latitude = UnpackLatitude(latP)
	off += 3
	
	lonP := UnpackUint24(buf, off)
	j.Longitude = UnpackLongitude(lonP)
	off += 3
	
	altP := UnpackUint16(buf, off)
	j.Altitude = float64(altP) / 10
	off += 2
	
	spdP := UnpackUint16(buf, off)
	j.Speed = float64(spdP) / 10
	off += 2
	
	hdgP := UnpackUint16(buf, off)
	j.Heading = float64(hdgP) * 360.0 / 65536.0
	off += 2
	
	cogP := UnpackUint16(buf, off)
	j.CourseOverGround = float64(cogP) * 360.0 / 65536.0
	off += 2
	
	sogP := UnpackUint16(buf, off)
	j.SpeedOverGround = float64(sogP) / 10
	off += 2
	
	trP := UnpackUint16(buf, off)
	j.TurnRate = float64(int16(trP))/10 - 100
	off += 2
	
	j.ShipType = UnpackUint16(buf, off)
	off += 2
	
	j.VesselID = UnpackUint32(buf, off)
	off += 4
	
	j.TrackQuality = buf[off]
	off++
	
	j.ParticipantNumber = UnpackUint16(buf, off)
	off += 2
	
	j.ForceType = uint8(UnpackUint16(buf, off) >> 14)
	
	return j
}

// =============================================================================
// J22 Subsurface Track - Submarine/Underwater Track  
// =============================================================================

// J22SubsurfaceTrack represents a track for an underwater platform.
type J22SubsurfaceTrack struct {
	TrackNumber        uint16    // 16 bits
	Time              time.Time // 32 bits
	Latitude          float64   // degrees
	Longitude         float64   // degrees
	Depth             float64   // meters (negative = below surface)
	Speed             float64   // m/s
	Heading           float64   // degrees
	CourseOverGround  float64   // degrees
	SpeedOverGround   float64   // m/s
	SonarType         uint8     // Sonar mode/type
	DetectionMethod   uint8     // How detected
	SubmarineType     uint16    // Submarine classification
	VesselID          uint32    // Identification
	TrackQuality      uint8
	Quality           QualityIndicator
	ParticipantNumber uint16
	ForceType         uint8
}

// J22PayloadSize = 2+4+3+3+3+2+2+2+2+2+1+1+2+4+1+2+2+1 = 36 bytes
const J22PayloadSize = 36

// PackJ22SubsurfaceTrack packs a J22 Subsurface Track message
func PackJ22SubsurfaceTrack(j *J22SubsurfaceTrack, buf []byte) int {
	off := 0
	PackUint16(j.TrackNumber, buf, off)
	off += 2
	ms := PackMilliseconds(j.Time)
	PackUint32(ms, buf, off)
	off += 4
	
	latP := PackLatitudePacked(j.Latitude)
	PackUint24(latP, buf, off)
	off += 3
	
	lonP := PackLongitudePacked(j.Longitude)
	PackUint24(lonP, buf, off)
	off += 3
	
	// Depth: offset by 10000m for negative values
	depthP := uint32(j.Depth + 10000)
	PackUint24(depthP, buf, off)
	off += 3
	
	spdP := uint16(j.Speed * 10)
	PackUint16(spdP, buf, off)
	off += 2
	
	hdgP := PackHeading(j.Heading)
	PackUint16(hdgP, buf, off)
	off += 2
	
	cogP := PackHeading(j.CourseOverGround)
	PackUint16(cogP, buf, off)
	off += 2
	
	sogP := uint16(j.SpeedOverGround * 10)
	PackUint16(sogP, buf, off)
	off += 2
	
	buf[off] = j.SonarType
	off++
	buf[off] = j.DetectionMethod
	off++
	
	PackUint16(j.SubmarineType, buf, off)
	off += 2
	
	PackUint32(j.VesselID, buf, off)
	off += 4
	
	buf[off] = j.TrackQuality
	off++
	
	PackUint16(j.ParticipantNumber, buf, off)
	off += 2
	
	forceHdl := uint16((j.ForceType & 0x03) << 6)
	PackUint16(forceHdl<<8, buf, off)
	off += 2
	
	return off
}

// UnpackJ22SubsurfaceTrack unpacks a J22 Subsurface Track message
func UnpackJ22SubsurfaceTrack(buf []byte) *J22SubsurfaceTrack {
	off := 0
	j := &J22SubsurfaceTrack{}
	j.TrackNumber = UnpackUint16(buf, off)
	off += 2
	j.Time = time.UnixMilli(int64(UnpackUint32(buf, off)))
	off += 4
	
	latP := UnpackUint24(buf, off)
	j.Latitude = UnpackLatitude(latP)
	off += 3
	
	lonP := UnpackUint24(buf, off)
	j.Longitude = UnpackLongitude(lonP)
	off += 3
	
	depthP := UnpackUint24(buf, off)
	j.Depth = float64(int32(depthP)) - 10000
	off += 3
	
	spdP := UnpackUint16(buf, off)
	j.Speed = float64(spdP) / 10
	off += 2
	
	hdgP := UnpackUint16(buf, off)
	j.Heading = float64(hdgP) * 360.0 / 65536.0
	off += 2
	
	cogP := UnpackUint16(buf, off)
	j.CourseOverGround = float64(cogP) * 360.0 / 65536.0
	off += 2
	
	sogP := UnpackUint16(buf, off)
	j.SpeedOverGround = float64(sogP) / 10
	off += 2
	
	j.SonarType = buf[off]
	off++
	j.DetectionMethod = buf[off]
	off++
	
	j.SubmarineType = UnpackUint16(buf, off)
	off += 2
	
	j.VesselID = UnpackUint32(buf, off)
	off += 4
	
	j.TrackQuality = buf[off]
	off++
	
	j.ParticipantNumber = UnpackUint16(buf, off)
	off += 2
	
	j.ForceType = uint8(UnpackUint16(buf, off) >> 14)
	
	return j
}

// =============================================================================
// J23 Land Track - Ground Vehicle Track
// =============================================================================

// J23LandTrack represents a track for a land-based platform.
type J23LandTrack struct {
	TrackNumber        uint16    // 16 bits
	Time              time.Time // 32 bits
	Latitude          float64   // degrees
	Longitude         float64   // degrees
	Altitude          float64   // meters MSL
	Speed             float64   // m/s (ground speed)
	Heading           float64   // degrees
	Course            float64   // degrees
	VehicleType       uint16    // Vehicle classification
	VehicleID         uint32    // Identification
	Formation         uint8     // Formation position
	UnitSize          uint8     // Unit size (squad, platoon, etc.)
	TrackQuality      uint8
	Quality           QualityIndicator
	ParticipantNumber uint16
	ForceType         uint8
}

// J23PayloadSize = 2+4+3+3+2+2+2+2+2+4+1+1+1+2+2+1 = 31 bytes
const J23PayloadSize = 34

// PackJ23LandTrack packs a J23 Land Track message
func PackJ23LandTrack(j *J23LandTrack, buf []byte) int {
	off := 0
	PackUint16(j.TrackNumber, buf, off)
	off += 2
	ms := PackMilliseconds(j.Time)
	PackUint32(ms, buf, off)
	off += 4
	
	latP := PackLatitudePacked(j.Latitude)
	PackUint24(latP, buf, off)
	off += 3
	
	lonP := PackLongitudePacked(j.Longitude)
	PackUint24(lonP, buf, off)
	off += 3
	
	altP := uint16(j.Altitude / 0.5)
	PackUint16(altP, buf, off)
	off += 2
	
	spdP := uint16(j.Speed * 10)
	PackUint16(spdP, buf, off)
	off += 2
	
	hdgP := PackHeading(j.Heading)
	PackUint16(hdgP, buf, off)
	off += 2
	
	courseP := PackHeading(j.Course)
	PackUint16(courseP, buf, off)
	off += 2
	
	PackUint16(j.VehicleType, buf, off)
	off += 2
	
	PackUint32(j.VehicleID, buf, off)
	off += 4
	
	buf[off] = j.Formation
	off++
	buf[off] = j.UnitSize
	off++
	buf[off] = j.TrackQuality
	off++
	
	PackUint16(j.ParticipantNumber, buf, off)
	off += 2
	
	forceHdl := uint16((j.ForceType & 0x03) << 6)
	PackUint16(forceHdl<<8, buf, off)
	off += 2
	
	return off
}

// UnpackJ23LandTrack unpacks a J23 Land Track message
func UnpackJ23LandTrack(buf []byte) *J23LandTrack {
	off := 0
	j := &J23LandTrack{}
	j.TrackNumber = UnpackUint16(buf, off)
	off += 2
	j.Time = time.UnixMilli(int64(UnpackUint32(buf, off)))
	off += 4
	
	latP := UnpackUint24(buf, off)
	j.Latitude = UnpackLatitude(latP)
	off += 3
	
	lonP := UnpackUint24(buf, off)
	j.Longitude = UnpackLongitude(lonP)
	off += 3
	
	altP := UnpackUint16(buf, off)
	j.Altitude = float64(altP) * 0.5
	off += 2
	
	spdP := UnpackUint16(buf, off)
	j.Speed = float64(spdP) / 10
	off += 2
	
	hdgP := UnpackUint16(buf, off)
	j.Heading = float64(hdgP) * 360.0 / 65536.0
	off += 2
	
	courseP := UnpackUint16(buf, off)
	j.Course = float64(courseP) * 360.0 / 65536.0
	off += 2
	
	j.VehicleType = UnpackUint16(buf, off)
	off += 2
	
	j.VehicleID = UnpackUint32(buf, off)
	off += 4
	
	j.Formation = buf[off]
	off++
	j.UnitSize = buf[off]
	off++
	j.TrackQuality = buf[off]
	off++
	
	j.ParticipantNumber = UnpackUint16(buf, off)
	off += 2
	
	j.ForceType = uint8(UnpackUint16(buf, off) >> 14)
	
	return j
}

// =============================================================================
// J24 Foreign Equipment - Foreign/National Equipment Identification
// =============================================================================

// J24ForeignEquipment represents equipment identification data.
type J24ForeignEquipment struct {
	TrackNumber        uint16    // 16 bits
	Time              time.Time // 32 bits
	EquipmentType     uint8     // Equipment category
	Nation            uint16    // Nation code (STANAG 1059)
	EquipmentCode     uint16    // National equipment code
	AdditionalInfo     uint64    // Additional identification
	Latitude          float64   // degrees
	Longitude         float64   // degrees
	Altitude          float64   // meters
	TrackQuality      uint8
	Quality           QualityIndicator
	ParticipantNumber uint16
	ForceType         uint8
}

// J24PayloadSize = 2+4+1+2+2+8+3+3+2+1+2+2+1 = 32 bytes
const J24PayloadSize = 34

// PackJ24ForeignEquipment packs a J24 Foreign Equipment message
func PackJ24ForeignEquipment(j *J24ForeignEquipment, buf []byte) int {
	off := 0
	PackUint16(j.TrackNumber, buf, off)
	off += 2
	ms := PackMilliseconds(j.Time)
	PackUint32(ms, buf, off)
	off += 4
	
	buf[off] = j.EquipmentType
	off++
	
	PackUint16(j.Nation, buf, off)
	off += 2
	
	PackUint16(j.EquipmentCode, buf, off)
	off += 2
	
	PackUint32(uint32(j.AdditionalInfo), buf, off)
	off += 4
	PackUint32(uint32(j.AdditionalInfo>>32), buf, off)
	off += 4
	
	latP := PackLatitudePacked(j.Latitude)
	PackUint24(latP, buf, off)
	off += 3
	
	lonP := PackLongitudePacked(j.Longitude)
	PackUint24(lonP, buf, off)
	off += 3
	
	altP := uint16(j.Altitude / 0.5)
	PackUint16(altP, buf, off)
	off += 2
	
	buf[off] = j.TrackQuality
	off++
	
	PackUint16(j.ParticipantNumber, buf, off)
	off += 2
	
	forceHdl := uint16((j.ForceType & 0x03) << 6)
	PackUint16(forceHdl<<8, buf, off)
	off += 2
	
	return off
}

// UnpackJ24ForeignEquipment unpacks a J24 Foreign Equipment message
func UnpackJ24ForeignEquipment(buf []byte) *J24ForeignEquipment {
	off := 0
	j := &J24ForeignEquipment{}
	j.TrackNumber = UnpackUint16(buf, off)
	off += 2
	j.Time = time.UnixMilli(int64(UnpackUint32(buf, off)))
	off += 4
	
	j.EquipmentType = buf[off]
	off++
	
	j.Nation = UnpackUint16(buf, off)
	off += 2
	
	j.EquipmentCode = UnpackUint16(buf, off)
	off += 2
	
	low := UnpackUint32(buf, off)
	off += 4
	high := UnpackUint32(buf, off)
	off += 4
	j.AdditionalInfo = uint64(high)<<32 | uint64(low)
	
	latP := UnpackUint24(buf, off)
	j.Latitude = UnpackLatitude(latP)
	off += 3
	
	lonP := UnpackUint24(buf, off)
	j.Longitude = UnpackLongitude(lonP)
	off += 3
	
	altP := UnpackUint16(buf, off)
	j.Altitude = float64(altP) * 0.5
	off += 2
	
	j.TrackQuality = buf[off]
	off++
	
	j.ParticipantNumber = UnpackUint16(buf, off)
	off += 2
	
	j.ForceType = uint8(UnpackUint16(buf, off) >> 14)
	
	return j
}

// =============================================================================
// J25 Production Level - System Throughput/Production Information
// =============================================================================

// J25ProductionLevel represents production or throughput information.
type J25ProductionLevel struct {
	TrackNumber        uint16    // 16 bits
	Time              time.Time // 32 bits
	SystemType        uint8     // System generating this
	ProductionType    uint8     // Type of production
	CurrentLevel      uint32    // Current production level
	MaximumLevel      uint32    // Maximum capacity
	Utilization       uint16    // Percentage utilized (0-100)
	QueueDepth        uint16    // Items in queue
	Latency           uint32    // Average latency (ms)
	Throughput        uint32    // Items processed per second
	TrackQuality      uint8
	Quality           QualityIndicator
	ParticipantNumber uint16
	ForceType         uint8
}

// J25PayloadSize = 2+4+1+1+4+4+2+2+4+4+1+2+2+1 = 33 bytes
const J25PayloadSize = 36

// PackJ25ProductionLevel packs a J25 Production Level message
func PackJ25ProductionLevel(j *J25ProductionLevel, buf []byte) int {
	off := 0
	PackUint16(j.TrackNumber, buf, off)
	off += 2
	ms := PackMilliseconds(j.Time)
	PackUint32(ms, buf, off)
	off += 4
	
	buf[off] = j.SystemType
	off++
	buf[off] = j.ProductionType
	off++
	
	PackUint32(j.CurrentLevel, buf, off)
	off += 4
	
	PackUint32(j.MaximumLevel, buf, off)
	off += 4
	
	PackUint16(j.Utilization, buf, off)
	off += 2
	
	PackUint16(j.QueueDepth, buf, off)
	off += 2
	
	PackUint32(j.Latency, buf, off)
	off += 4
	
	PackUint32(j.Throughput, buf, off)
	off += 4
	
	buf[off] = j.TrackQuality
	off++
	
	PackUint16(j.ParticipantNumber, buf, off)
	off += 2
	
	forceHdl := uint16((j.ForceType & 0x03) << 6)
	PackUint16(forceHdl<<8, buf, off)
	off += 2
	
	return off
}

// UnpackJ25ProductionLevel unpacks a J25 Production Level message
func UnpackJ25ProductionLevel(buf []byte) *J25ProductionLevel {
	off := 0
	j := &J25ProductionLevel{}
	j.TrackNumber = UnpackUint16(buf, off)
	off += 2
	j.Time = time.UnixMilli(int64(UnpackUint32(buf, off)))
	off += 4
	
	j.SystemType = buf[off]
	off++
	j.ProductionType = buf[off]
	off++
	
	j.CurrentLevel = UnpackUint32(buf, off)
	off += 4
	
	j.MaximumLevel = UnpackUint32(buf, off)
	off += 4
	
	j.Utilization = UnpackUint16(buf, off)
	off += 2
	
	j.QueueDepth = UnpackUint16(buf, off)
	off += 2
	
	j.Latency = UnpackUint32(buf, off)
	off += 4
	
	j.Throughput = UnpackUint32(buf, off)
	off += 4
	
	j.TrackQuality = buf[off]
	off++
	
	j.ParticipantNumber = UnpackUint16(buf, off)
	off += 2
	
	j.ForceType = uint8(UnpackUint16(buf, off) >> 14)
	
	return j
}
