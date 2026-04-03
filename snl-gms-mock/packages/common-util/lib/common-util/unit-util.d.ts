export declare const QUARTER_CIRCLE_DEGREES = 90;
export declare const HALF_CIRCLE_DEGREES = 180;
export declare const THREE_QUARTER_CIRCLE_DEGREES = 270;
export declare const FULL_CIRCLE_DEGREES = 360;
/**
 * @param degrees a number of degrees to convert into radians
 * @returns the degrees converted to radians
 */
export declare function toRadians(degrees: number): number;
/**
 * @param radians a number of radians to convert into degrees
 * @returns the radians converted to degrees
 */
export declare function toDegrees(radians: number): number;
/**
 * Return the angular distance in degrees between two unit vectors.
 *
 * @param v0 a 3 component unit vector
 * @param v1 a 3 component unit vector
 * @return angular distance in degrees.
 */
export declare function angleDegrees(v0: number[], v1: number[]): number;
//# sourceMappingURL=unit-util.d.ts.map