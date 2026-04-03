/**
 * Assertion function that throws if value is nullish.
 *
 * @throws if value is nullish
 *
 * @param value - A value to validate
 * @param errorMessage - The error to throw if value is nullish
 * @param callback - Optional callback function to call before throwing the error. This may be useful for displaying a toast, for example.
 */
export declare function validateNonNullish<T>(value: T | null | undefined, errorMessage: string, callback?: () => void): asserts value is NonNullable<T>;
//# sourceMappingURL=type-util.d.ts.map