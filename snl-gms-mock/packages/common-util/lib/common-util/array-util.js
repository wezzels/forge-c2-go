import uniq from 'lodash/uniq';
/**
 * @returns whether the list is unique
 */
export const isUnique = (a) => a && uniq(a).length === a.length;
/** Gets a list the items that are duplicates */
export const getDuplicates = (arr) => arr.filter((val, i, iteratee) => iteratee.includes(val, i + 1));
/**
 * Utility function used to merge two typed arrays objects.
 * @param a the first typed array
 * @param b the second typed array
 * @returns the merged type array of {@link a} and {@link b}
 */
export function mergeTypedArrays(a, b) {
    // checks for truthy values on both arrays
    if (!a && !b)
        return undefined;
    // checks for truthy values or empty arrays on each argument
    // to avoid the unnecessary construction of a new array and the type comparison
    if (!b || b.length === 0)
        return a;
    if (!a || a.length === 0)
        return b;
    // make sure that both typed arrays are of the same type
    if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
        throw new Error('The types of the two arguments passed for parameters do not match.');
    }
    const c = new a.constructor(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
}
//# sourceMappingURL=array-util.js.map