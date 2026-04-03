/**
 * Defines a simple Range with a start and end value.
 */
export interface Range {
    start: number;
    end: number;
}
/**
 * Merges any overlapping of the provided ranges.
 * For example,
 * `mergeRanges([3-5, 2-7, 1-2, 9-10]) would return [1-7, 9-10]`.
 *
 * @param ranges the ranges to merge
 * @returns the merged ranges
 */
export declare const mergeRanges: (ranges: Range[] | undefined) => Range[];
/**
 * Determines the excluded ranges for the provided range.
 * For the provided `range`, determine any new ranges that are not contained within the
 * provided `ranges`. For example,
 * `determineExcludedRanges([3-5, 5-7], [1-9]) would return [1-3, 7-9]`.
 *
 * @param ranges the ranges to compare `range` to when determine any excluded ranges
 * @param range the range to check
 * @returns any excluded ranges contained by `range`
 */
export declare const determineExcludedRanges: (ranges: Range[] | undefined | null, range: Range | undefined | null) => Range[];
/**
 * Chunks up a range (start and end) into multiple small ranges where
 * each range is no larger than the maximum size.
 *
 * @param range the range to chunk
 * @param maxSize the maximum range size to return (the chunk size)
 * @returns an array of ranges where the size is <= the maximum size
 */
export declare const chunkRange: (range: Range | undefined, maxSize: number) => Range[];
/**
 * Chunks up the ranges into multiple small ranges where
 * each range is no larger than the maximum size.
 *
 * @param ranges the ranges to chunk
 * @param maxSize the maximum range size to return (the chunk size)
 * @returns an array of ranges where the size is <= the maximum size
 */
export declare const chunkRanges: (ranges: Range[] | undefined, maxSize: number) => Range[];
/**
 * Determines if the two {@link Range} overlap.
 *
 * @param rangeA the first {@link Range}
 * @param rangeB the second {@link Range}
 * @returns true if two {@link Range}s overlap
 */
export declare function doRangesOverlap(rangeA: Range, rangeB: Range): boolean;
//# sourceMappingURL=range-util.d.ts.map