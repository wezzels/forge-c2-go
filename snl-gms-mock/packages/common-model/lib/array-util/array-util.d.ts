/**
 * Find first element in an array that matches the predicate or throws an error
 */
export declare const findOrThrow: <T>(arr: T[], predicate: (value: T) => boolean) => T;
/**
 * Retrieve the element of an array at the given index, or throw an error if not found.
 * @param index The zero-based index of the desired code unit. A negative index will count back from the last item.
 */
export declare const atOrThrow: <T>(arr: T[], index: number) => T;
/**
 * Find index of first element in an array that matches the predicate or throws an error
 */
export declare const findIndexOrThrow: <T>(arr: T[], predicate: (value: T) => boolean) => number;
//# sourceMappingURL=array-util.d.ts.map