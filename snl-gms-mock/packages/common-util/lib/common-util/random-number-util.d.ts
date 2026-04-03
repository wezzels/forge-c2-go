/**
 * Returns a random number that is a
 * cryptographically secure random number generation.
 *
 * The number returned will be between 0 - 1.
 *
 * A Cryptographically Secure Pseudo-Random Number Generator.
 * This is what produces unpredictable data that you need for security purposes.
 * use of Math.random throughout codebase is considered high criticality
 * At present, the only required use is a simple random number.
 * If additional functionality is required in the future,
 * a random number library can be created to support more
 * sophisticated usage.
 */
export declare const getSecureRandomNumber: () => number;
/**
 * Random Number Generator (used for Lat/Lon)
 *
 * @param from lower bound
 * @param to upper bound
 * @param fixed decimal places to generate
 * @returns a secure random number
 */
export declare function getRandomInRange(from: number, to: number, fixed: number): number;
/**
 * Returns a random index based on array length
 *
 * @param arrayLength length of array
 */
export declare function getRandomIndexForArray(arrayLength: number): number;
//# sourceMappingURL=random-number-util.d.ts.map