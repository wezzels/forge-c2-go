import type { TypedArray } from 'fast-equals';
/**
 * @returns whether the list is unique
 */
export declare const isUnique: (a: unknown[] | undefined) => boolean | undefined;
/** Gets a list the items that are duplicates */
export declare const getDuplicates: (arr: string[]) => string[];
/**
 * Utility function used to merge two typed arrays objects.
 * @param a the first typed array
 * @param b the second typed array
 * @returns the merged type array of {@link a} and {@link b}
 */
export declare function mergeTypedArrays<T extends TypedArray>(a: T | undefined, b: T | undefined): T | undefined;
//# sourceMappingURL=array-util.d.ts.map