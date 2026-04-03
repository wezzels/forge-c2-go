const hasId = (data) => Object.prototype.hasOwnProperty.call(data, 'id');
/**
 * Return true if the data has an ID.
 *
 * @param data some kind of DataSegment data
 * @returns whether this data matches the DataClaimCheck interface
 */
export const isDataClaimCheck = (data) => {
    return hasId(data) && typeof data.id === 'string' && !!data.id;
};
/**
 * Return true if all of the data segments are DataClaimChecks.
 *
 * @param dataSegments DataSegment list containing some kind of data
 * @returns whether this data matches the DataClaimCheck interface for all data segments
 */
export const areDataSegmentsAllClaimChecks = (dataSegments) => {
    return dataSegments.every(ds => {
        return isDataClaimCheck(ds.data);
    });
};
/**
 * Return true if all of the channel segments' data segments are DataClaimChecks.
 *
 * @param channelSegments each contains a list of data segments to check
 * @returns whether each channel segment's dataSegments matches the DataClaimCheck interface
 */
export const areAllChannelSegmentsDataSegmentsClaimChecks = (channelSegments) => {
    return channelSegments.every(cs => areDataSegmentsAllClaimChecks(cs.dataSegments));
};
/**
 * Returns true if the data is of type Float32Array
 *
 * @param values the data to check
 */
export const isFloat32Array = (values) => !!values && ArrayBuffer.isView(values) && values instanceof Float32Array;
/**
 * Returns true if the values array is of type TimeValuePair[]
 *
 * @param values the array to check
 */
export const isTimeValuePairArray = (values) => values != null &&
    values.length > 0 &&
    values[0].timeSecs !== undefined &&
    values[0].value !== undefined;
/**
 * Returns true if the data is by sample rate and casts the data appropriately.
 *
 * @param data the data to check
 */
export const isDataBySampleRate = (data) => data.startTimeSecs !== undefined &&
    data.sampleRate !== undefined &&
    data.values !== undefined;
/**
 * Returns true if the data is by time and casts the data appropriately.
 *
 * @param data the data to check
 */
export const isDataByTime = (data) => !isDataBySampleRate(data) && data.values !== undefined;
//# sourceMappingURL=type-guards.js.map