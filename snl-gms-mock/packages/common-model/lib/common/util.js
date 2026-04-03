/**
 * Assertion function that throws if value is nullish.
 *
 * @throws if value is nullish
 *
 * @param value a value to validate
 * @param errorMessage The error to throw if value is nullish
 * @param callback optional callback function to call before throwing the error. This may
 * be useful to toast, for example.
 */
export function validateNonNullish(value, errorMessage, callback) {
    if (value == null) {
        if (callback)
            callback();
        throw new Error(errorMessage);
    }
}
/**
 * Asserts that a {@link TimeRange} is NonNullable, and contains valid, numeric, non-null values
 *
 * @throws if timeRange is nullish
 * @throws if startTimeSecs or endTimeSecs are nullish
 * @throws if startTimeSecs or endTimeSecs are non numeric
 *
 * @param timeRange a TimeRange to check
 */
export function validateTimeRange(timeRange) {
    validateNonNullish(timeRange, `Invalid TimeRange. TimeRange must be defined, but it is: ${timeRange}`);
    if (timeRange.startTimeSecs == null || timeRange.endTimeSecs == null) {
        throw new Error(`Invalid TimeRange: ${JSON.stringify(timeRange)}`);
    }
    if (typeof timeRange.startTimeSecs !== 'number' || typeof timeRange.endTimeSecs !== 'number') {
        throw new Error(`Invalid TimeRange. Values are not numeric: ${JSON.stringify(timeRange)}`);
    }
}
/**
 * used for Array.filter to remove any nulls or undefined
 * @param value value to check
 * @returns true if value is not empty false if empty
 */
export function notEmpty(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=util.js.map