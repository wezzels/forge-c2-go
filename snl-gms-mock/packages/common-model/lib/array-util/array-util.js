/**
 * Find first element in an array that matches the predicate or throws an error
 */
export const findOrThrow = (arr, predicate) => {
    const result = arr.find(predicate);
    if (result === undefined) {
        throw new Error('No matching element found');
    }
    return result;
};
/**
 * Retrieve the element of an array at the given index, or throw an error if not found.
 * @param index The zero-based index of the desired code unit. A negative index will count back from the last item.
 */
export const atOrThrow = (arr, index) => {
    const result = arr.at(index);
    if (result === undefined) {
        throw new Error('No element found');
    }
    return result;
};
/**
 * Find index of first element in an array that matches the predicate or throws an error
 */
export const findIndexOrThrow = (arr, predicate) => {
    const result = arr.findIndex(predicate);
    if (result < 0)
        throw new Error('No matching element found');
    return result;
};
//# sourceMappingURL=array-util.js.map