import type { ChannelSegment, DataBySampleRate, DataByTime, DataClaimCheck, DataSegment, DataType, TimeValuePair } from './types';
/**
 * Return true if the data has an ID.
 *
 * @param data some kind of DataSegment data
 * @returns whether this data matches the DataClaimCheck interface
 */
export declare const isDataClaimCheck: (data: DataType) => data is DataClaimCheck;
/**
 * Return true if all of the data segments are DataClaimChecks.
 *
 * @param dataSegments DataSegment list containing some kind of data
 * @returns whether this data matches the DataClaimCheck interface for all data segments
 */
export declare const areDataSegmentsAllClaimChecks: (dataSegments: DataSegment[]) => boolean;
/**
 * Return true if all of the channel segments' data segments are DataClaimChecks.
 *
 * @param channelSegments each contains a list of data segments to check
 * @returns whether each channel segment's dataSegments matches the DataClaimCheck interface
 */
export declare const areAllChannelSegmentsDataSegmentsClaimChecks: (channelSegments: ChannelSegment[]) => boolean;
/**
 * Returns true if the data is of type Float32Array
 *
 * @param values the data to check
 */
export declare const isFloat32Array: (values: Float64Array | Float32Array | number[] | {
    timeSecs: number;
    value: number;
}[] | undefined) => values is Float32Array;
/**
 * Returns true if the values array is of type TimeValuePair[]
 *
 * @param values the array to check
 */
export declare const isTimeValuePairArray: (values: Float64Array | Float32Array | number[] | TimeValuePair[] | undefined) => values is TimeValuePair[];
/**
 * Returns true if the data is by sample rate and casts the data appropriately.
 *
 * @param data the data to check
 */
export declare const isDataBySampleRate: (data: DataType) => data is DataBySampleRate;
/**
 * Returns true if the data is by time and casts the data appropriately.
 *
 * @param data the data to check
 */
export declare const isDataByTime: (data: DataType) => data is DataByTime;
//# sourceMappingURL=type-guards.d.ts.map