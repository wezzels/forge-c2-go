/**
 * This is the Typescript implementation of shared geophysics math algorithms.
 *
 * @see GeoMath.java in /gms-common/java/gms/shared/feature-prediction/feature-prediction-utilities/src/main/java/gms/shared/featureprediction/utilities/math/GeoMath.java
 */
export declare const RADIUS_KM = 6371;
export declare const DEGREES_PER_KM: number;
/**
 * Uses PCALC implementation of angular separation between two lat/lons in degrees, assuming a
 * spherical earth model. Minimizes calls to trig functions for efficiency.
 *
 * @param lat1 latitude of 1st point in degrees [-90, 90]
 * @param lon1 longitude of 1st point in degrees [-180, 180]
 * @param lat2 latitude of 2nd point in degrees [-90, 90]
 * @param lon2 longitude of 2nd point in degrees [-180, 180]
 * @return great circle distance in degrees
 */
export declare function greatCircleAngularSeparation(lat1: number, lon1: number, lat2: number, lon2: number): number;
/**
 * Convert degrees to kilometers
 *
 * @param degrees degree value to convert
 * @return distance in kilometers
 */
export declare function degToKm(degrees: number): number;
/**
 * Compute the azimuth from one point to another on the Earth.
 * This code is adapted for Typescript from the GeoMath.java file
 *
 * @see gms-common/java/gms/shared/feature-prediction/feature-prediction-utilities/src/main/java/gms/shared/featureprediction/utilities/math/GeoMath.java
 *
 * @param latitude1 - latitude of first point
 * @param longitude1 - longitude of first point
 * @param latitude2 - latitude of second point
 * @param longitude2 - longitude of second point
 *
 * @returns the azimuth in degrees
 */
export declare function greatCircleAzimuth(latitude1: number, longitude1: number, latitude2: number, longitude2: number): number;
//# sourceMappingURL=geo-math-util.d.ts.map