import type { Nullable } from '../type-util/type-util';
import type { TimeRange } from './types';
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
export declare function validateNonNullish<T>(value: T | null | undefined, errorMessage: string, callback?: () => void): asserts value is NonNullable<T>;
/**
 * Asserts that a {@link TimeRange} is NonNullable, and contains valid, numeric, non-null values
 *
 * @throws if timeRange is nullish
 * @throws if startTimeSecs or endTimeSecs are nullish
 * @throws if startTimeSecs or endTimeSecs are non numeric
 *
 * @param timeRange a TimeRange to check
 */
export declare function validateTimeRange(timeRange: Nullable<TimeRange> | null | undefined): asserts timeRange is NonNullable<TimeRange>;
/**
 * used for Array.filter to remove any nulls or undefined
 * @param value value to check
 * @returns true if value is not empty false if empty
 */
export declare function notEmpty<TValue>(value: TValue | null | undefined): value is TValue;
//# sourceMappingURL=util.d.ts.map