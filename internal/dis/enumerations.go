package dis

// =============================================================================
// DIS Enumerations Extension (IEEE 1278.1-2012)
// =============================================================================
// Note: Force IDs, EntityType, and some Collision types already defined in dis.go
// This file extends with additional enumerations

// Entity Kind - broad category of entity
type EntityKind uint8

const (
	EntityKindPlatform     EntityKind = 0
	EntityKindMunition     EntityKind = 1
	EntityKindSector       EntityKind = 2
	EntityKindExpendable   EntityKind = 3
	EntityKindEnvironmental EntityKind = 4
)

// Domain - operational domain
type Domain uint8

const (
	DomainOther     Domain = 0
	DomainLand      Domain = 1
	DomainAir       Domain = 2
	DomainSurface   Domain = 3
	DomainSubsurface Domain = 4
	DomainSpace     Domain = 5
)

// Entity State - status (extends base uint8)
type EntityState uint8

const (
	EntityStateActive     EntityState = 0
	EntityStateDeactivated EntityState = 1
	EntityStateDestroyed   EntityState = 2
	EntityStateDamage      EntityState = 3
	EntityStateRecovered   EntityState = 4
)

// Damage Status
type DamageStatus uint8

const (
	DamageNo        DamageStatus = 0
	DamageLight     DamageStatus = 1
	DamageModerate   DamageStatus = 2
	DamageDestroyed  DamageStatus = 3
	DamageUnknown    DamageStatus = 4
)

// Coordinate System
type CoordinateSystem uint8

const (
	CoordOther        CoordinateSystem = 0
	CoordWorldGeodetic CoordinateSystem = 1 // WGS84
	CoordWorldGeocentric CoordinateSystem = 2
)

// Country codes (ISO 3166-1 numeric)
type CountryCode uint16

const (
	CountryOther    CountryCode = 0
	CountryUSA      CountryCode = 840
	CountryUK       CountryCode = 826
	CountryFrance   CountryCode = 250
	CountryGermany  CountryCode = 276
	CountryRussia   CountryCode = 643
	CountryChina    CountryCode = 156
	CountryJapan    CountryCode = 392
	CountryIsrael   CountryCode = 376
	CountryAustralia CountryCode = 36
	CountryCanada   CountryCode = 124
)

// Platform Categories (Land)
type LandPlatformCategory uint8

const (
	LandOther             LandPlatformCategory = 0
	LandTank               LandPlatformCategory = 1
	LandArmoredCar         LandPlatformCategory = 2
	LandInfantry           LandPlatformCategory = 3
	LandUtility            LandPlatformCategory = 4
	LandHelicopter         LandPlatformCategory = 5
	LandArtillery          LandPlatformCategory = 6
	LandMortar             LandPlatformCategory = 7
	LandAntiAircraft       LandPlatformCategory = 8
	LandEngineering        LandPlatformCategory = 9
	LandMedical            LandPlatformCategory = 10
	LandMissileLauncher    LandPlatformCategory = 11
)

// Platform Categories (Air)
type AirPlatformCategory uint8

const (
	AirOther              AirPlatformCategory = 0
	AirFighter            AirPlatformCategory = 1
	AirBomber             AirPlatformCategory = 2
	AirAttack             AirPlatformCategory = 3
	AirCargo              AirPlatformCategory = 4
	AirFighterEscort      AirPlatformCategory = 5
	AirAWACS               AirPlatformCategory = 6
	AirHelicopter         AirPlatformCategory = 7
	AirUAV                 AirPlatformCategory = 8
	AirTanker             AirPlatformCategory = 9
	AirTrainer            AirPlatformCategory = 10
	AirTransport          AirPlatformCategory = 11
)

// Platform Categories (Surface)
type SurfacePlatformCategory uint8

const (
	SurfaceOther          SurfacePlatformCategory = 0
	SurfaceCombatant      SurfacePlatformCategory = 1
	SurfaceCarrier        SurfacePlatformCategory = 2
	SurfaceCruiser        SurfacePlatformCategory = 3
	SurfaceDestroyer      SurfacePlatformCategory = 4
	SurfaceFrigate        SurfacePlatformCategory = 5
	SurfaceCorvette       SurfacePlatformCategory = 6
	SurfaceAmphibious     SurfacePlatformCategory = 7
	SurfaceAuxiliary      SurfacePlatformCategory = 8
	SurfaceMerchant       SurfacePlatformCategory = 9
	SurfacePatrol         SurfacePlatformCategory = 10
	SurfaceMineWarfare    SurfacePlatformCategory = 11
)

// Platform Categories (Subsurface)
type SubsurfacePlatformCategory uint8

const (
	SubsurfaceOther       SubsurfacePlatformCategory = 0
	SubsurfaceSubmarine   SubsurfacePlatformCategory = 1
	SubsurfaceAUV        SubsurfacePlatformCategory = 2
)

// Munition Categories
type MunitionCategory uint8

const (
	MunitionOther        MunitionCategory = 0
	MunitionBullet       MunitionCategory = 1
	MunitionRifle        MunitionCategory = 2
	MunitionGrenade      MunitionCategory = 3
	MunitionArtillery    MunitionCategory = 4
	MunitionBomb         MunitionCategory = 5
	MunitionMissile      MunitionCategory = 6
	MunitionTorpedo      MunitionCategory = 7
	MunitionRocket       MunitionCategory = 8
	MunitionSAM          MunitionCategory = 9
	MunitionAAM          MunitionCategory = 10
	MunitionATM          MunitionCategory = 11
	MunitionDepthCharge  MunitionCategory = 12
)

// Fire Type
type FireType uint8

const (
	FireOther           FireType = 0
	FireBullet          FireType = 1
	FireBurst           FireType = 2
	FireBurstMultiple   FireType = 3
	FireSalvo           FireType = 4
	FireSalvoMultiple   FireType = 5
)

// Detonation Result
type DetonationResult uint8

const (
	DetResultOther             DetonationResult = 0
	DetResultEntityImpact       DetonationResult = 1
	DetResultEntityProximity    DetonationResult = 2
	DetResultGroundImpact       DetonationResult = 3
	DetResultGroundProximity    DetonationResult = 4
	DetResultWaterImpact        DetonationResult = 5
	DetResultWaterProximity     DetonationResult = 6
	DetResultAirburst           DetonationResult = 7
	DetResultTarget             DetonationResult = 8
	DetResultMiss               DetonationResult = 9
	DetResultNone               DetonationResult = 10
)

// Collision Type extensions
type CollisionTypeEx uint8

const (
	CollisionOtherCollision      CollisionTypeEx = 0
)

// Radio State
type RadioState uint8

const (
	RadioOff          RadioState = 0
	RadioOn           RadioState = 1
	RadioJamming      RadioState = 2
	RadioReceiving    RadioState = 3
	RadioTransmitting RadioState = 4
)

// Antenna Pattern Type
type AntennaPatternType uint8

const (
	AntennaOmni           AntennaPatternType = 0
	AntennaDirectional    AntennaPatternType = 1
	AntennaHemispherical  AntennaPatternType = 2
)

// Encoding Scheme (Audio)
type EncodingScheme uint8

const (
	EncodingPCM   EncodingScheme = 0
	EncodingCVSD  EncodingScheme = 1
	EncodingADPCM EncodingScheme = 2
	EncodingDNA   EncodingScheme = 3
	EncodingDVI   EncodingScheme = 4
	EncodingSSFF  EncodingScheme = 5
)

// Spread Spectrum
type SpreadSpectrum uint8

const (
	SpreadNone        SpreadSpectrum = 0
	SpreadFHSS        SpreadSpectrum = 1
	SpreadTHSS        SpreadSpectrum = 2
	SpreadPseudoNoise SpreadSpectrum = 3
	SpreadHybrid      SpreadSpectrum = 4
)

// =============================================================================
// CommonEntityTypes - predefined entity type lookups
// =============================================================================

// CommonEntityTypes provides predefined entity types
var CommonEntityTypes = map[string]EntityType{
	// Land
	"M1_Abrams":    {Kind: 0, Domain: 1, Country: 840, Category: 1, Subcategory: 1, Specific: 1},
	"T-80_Tank":    {Kind: 0, Domain: 1, Country: 643, Category: 1, Subcategory: 1, Specific: 1},
	"BMP-2":        {Kind: 0, Domain: 1, Country: 643, Category: 2, Subcategory: 1, Specific: 1},

	// Air
	"F-16":         {Kind: 0, Domain: 2, Country: 840, Category: 1, Subcategory: 1, Specific: 1},
	"F-22":         {Kind: 0, Domain: 2, Country: 840, Category: 1, Subcategory: 2, Specific: 1},
	"MiG-29":       {Kind: 0, Domain: 2, Country: 643, Category: 1, Subcategory: 1, Specific: 1},
	"AH-64_Apache": {Kind: 0, Domain: 2, Country: 840, Category: 5, Subcategory: 1, Specific: 1},

	// Surface
	"Arleigh_Burke": {Kind: 0, Domain: 3, Country: 840, Category: 1, Subcategory: 3, Specific: 1},
	"Ticonderoga":   {Kind: 0, Domain: 3, Country: 840, Category: 1, Subcategory: 2, Specific: 1},

	// Subsurface
	"Los_Angeles": {Kind: 0, Domain: 4, Country: 840, Category: 1, Subcategory: 1, Specific: 1},

	// Munitions
	"AGM-65_Maverick": {Kind: 1, Domain: 2, Country: 840, Category: 6, Subcategory: 1, Specific: 1},
	"AIM-120_AMRAAM":  {Kind: 1, Domain: 2, Country: 840, Category: 10, Subcategory: 1, Specific: 1},
}

// GetEntityType looks up a common entity type by name
func GetEntityType(name string) (EntityType, bool) {
	et, ok := CommonEntityTypes[name]
	return et, ok
}

// =============================================================================
// Utility Functions
// =============================================================================

// DomainToString converts a Domain to a string
func DomainToString(d Domain) string {
	switch d {
	case DomainLand:
		return "Land"
	case DomainAir:
		return "Air"
	case DomainSurface:
		return "Surface"
	case DomainSubsurface:
		return "Subsurface"
	case DomainSpace:
		return "Space"
	default:
		return "Other"
	}
}

// DamageStatusToString converts DamageStatus to a string
func DamageStatusToString(d DamageStatus) string {
	switch d {
	case DamageNo:
		return "No Damage"
	case DamageLight:
		return "Light Damage"
	case DamageModerate:
		return "Moderate Damage"
	case DamageDestroyed:
		return "Destroyed"
	default:
		return "Unknown"
	}
}
