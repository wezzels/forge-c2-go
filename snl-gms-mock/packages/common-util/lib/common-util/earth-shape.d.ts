declare class EarthShape {
    /**
     * True for EarthShapes that assume that the Earth has constant radius for purposes of converting
     * between radius and depth.
     */
    constantRadius: boolean;
    /** The radius of the earth at the equator. */
    equatorialRadius: number;
    /** flattening equals [ 1 - b/a ] where a is equatorial radius and b is the polar radius */
    flattening: number;
    /** [ 1./flattening ] */
    inverseFlattening: number;
    /**
     * Eccentricity squared.
     *
     * <p>Equals [ flattening * (2. - flattening) ]
     *
     * <p>Also equals [ 1 - sqr(b)/sqr(a) ] where a is the equatorial radius and b is the polar
     * radius.
     */
    eccentricitySqr: number;
    /** Equals [ 1 - eccentricitySqr ] */
    e1: number;
    /** Equals [ eccentricitySqr / (1 - eccentricitySqr) ] */
    e2: number;
    /**
     * constructor
     *
     * @param inverseFlattening
     * @param equatorialRadius in km
     */
    constructor(inverseFlattening: number, equatorialRadius: number);
    /**
     * Convert geographicLat in radians to geocentricLat in radians.
     *
     * @param geographicLat
     * @return geocentricLat in radians.
     */
    getGeocentricLat(geographicLat: number): number;
    /**
     * Get a unit vector corresponding to a point on the Earth with the specified latitude and
     * longitude.
     *
     * @param lat the geographic latitude, in radians.
     * @param lon the geographic longitude, in radians.
     */
    getVector(lat: number, lon: number): [number, number, number];
    /**
     * Get a unit vector corresponding to a point on the Earth with the specified latitude and
     * longitude.
     *
     * @param lat the geographic latitude, in degrees.
     * @param lon the geographic longitude, in degrees.
     * @return The returned unit vector.
     */
    getVectorDegrees(lat: number, lon: number): number[];
}
export declare const EarthShapes: {
    /** The Earth is assumed to be a sphere of radius 6371 km. */
    SPHERE: EarthShape;
    /**
     * The Earth is assumed to be an ellipsoid whose shape is defined by the GRS80 ellipsoid
     * specification.
     */
    GRS80: EarthShape;
    /**
     * A hybrid coordinate system where latitudes are converted between geodetic and geocentric values
     * using the GRS80 ellipsoid, but conversions between depth and radius assume that the Earth has
     * constant radius of 6371 km.
     */
    GRS80_RCONST: EarthShape;
    /**
     * The Earth is assumed to be an ellipsoid whose shape is defined by the WGS84 ellipsoid
     * specification.
     */
    WGS84: EarthShape;
    /**
     * A hybrid coordinate system where latitudes are converted between geodetic and geocentric values
     * using the WGS84 ellipsoid, but conversions between depth and radius assume that the Earth has
     * constant radius of 6371 km.
     */
    WGS84_RCONST: EarthShape;
    /**
     * The Earth is assumed to be an ellipsoid whose shape is defined by the IERS ellipsoid
     * specification.
     */
    IERS2003: EarthShape;
    /**
     * A hybrid coordinate system where latitudes are converted between geodetic and geocentric values
     * using the IERS ellipsoid, but conversions between depth and radius assume that the Earth has
     * constant radius of 6371 km.
     */
    IERS2003_RCONST: EarthShape;
};
export {};
//# sourceMappingURL=earth-shape.d.ts.map