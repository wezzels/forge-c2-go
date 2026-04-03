export const QUARTER_CIRCLE_DEGREES = 90;
export const HALF_CIRCLE_DEGREES = 180;
export const THREE_QUARTER_CIRCLE_DEGREES = 270;
export const FULL_CIRCLE_DEGREES = 360;
/**
 * @param degrees a number of degrees to convert into radians
 * @returns the degrees converted to radians
 */
export function toRadians(degrees) {
    return degrees * (Math.PI / HALF_CIRCLE_DEGREES);
}
/**
 * @param radians a number of radians to convert into degrees
 * @returns the radians converted to degrees
 */
export function toDegrees(radians) {
    return radians * (HALF_CIRCLE_DEGREES / Math.PI);
}
/**
 * Return the angular distance in degrees between two unit vectors.
 *
 * @param v0 a 3 component unit vector
 * @param v1 a 3 component unit vector
 * @return angular distance in degrees.
 */
export function angleDegrees(v0, v1) {
    const dot = v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
    if (dot >= 1) {
        return 0;
    }
    if (dot <= -1) {
        return HALF_CIRCLE_DEGREES;
    }
    return toDegrees(Math.acos(dot));
}
//# sourceMappingURL=unit-util.js.map