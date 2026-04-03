import { deepEqual } from 'fast-equals';
/**
 * Determine if channelSegmentDescriptor is in the selected waveforms list
 *
 * @return returns is in list
 */
export function isSelectedWaveform(channelSegmentDescriptor, selectedWaveforms) {
    return (!!selectedWaveforms?.length &&
        selectedWaveforms.some(selectedCSD => deepEqual(selectedCSD, channelSegmentDescriptor)));
}
/**
 * Create a unique string
 *
 * @param id ChannelSegmentDescriptor throws an error if undefined
 * @returns unique string representing the ChannelSegmentDescriptor
 */
export function createChannelSegmentString(id) {
    if (!id)
        throw new Error('Cannot build channel segment id for undefined');
    return `${id.channel.name}.${id.channel.effectiveAt}.${id.creationTime}.${id.startTime}.${id.endTime}`;
}
/**
 * Checks if the given object is a TimeseriesClaimCheck.
 *
 * @param obj - The object to check.
 * @returns True if the object is a TimeseriesClaimCheck, otherwise false.
 */
export function isTimeseriesClaimCheck(obj) {
    return obj.claimCheckType === 'timeseries';
}
/**
 * Checks if the given object is a MissingInputsClaimCheck.
 *
 * @param obj - The object to check.
 * @returns True if the object is a MissingInputsClaimCheck, otherwise false.
 */
export function isMissingInputsClaimCheck(obj) {
    return obj.claimCheckType === 'missingInputChannels';
}
/**
 * Checks if the given object is a ClaimCheck.
 *
 * @param obj - The object to check.
 * @returns True if the object is a ClaimCheck, otherwise false.
 */
export function isClaimCheck(obj) {
    return isTimeseriesClaimCheck(obj) || isMissingInputsClaimCheck(obj);
}
/**
 * Checks if the given ChannelSegment is a claim.
 *
 * @param cs - The ChannelSegment to check.
 * @returns True if the ChannelSegment is a claim, otherwise false.
 */
export function isChannelSegmentClaim(cs) {
    return (isTimeseriesClaimCheck(cs.timeseries) || isMissingInputsClaimCheck(cs.missingInputChannels));
}
/**
 * Asserts that the given ChannelSegment is fully resolved (ie, not a claim check).
 *
 * @param cs - The ChannelSegment to check.
 * @throws If the ChannelSegment is not fully resolved.
 */
export function assertIsResolvedChannelSegment(cs) {
    if (isChannelSegmentClaim(cs)) {
        throw new Error('Channel segment is not fully resolved—it has an unexpected claim check');
    }
}
/**
 * Takes a claim check that may have extra data and converts it into a simple timeseries
 * claim check with no extra params. This is useful if the claim check is being serialized,
 * such as for sending to a worker thread, since it reduces the size of the serialized data.
 *
 * @param claimCheck the input claim check
 * @returns a simple TimeseriesClaimCheck (with no extra params)
 */
export function makeTimeseriesClaimCheck(claimCheck) {
    return { id: claimCheck.id, claimCheckType: claimCheck.claimCheckType };
}
//# sourceMappingURL=util.js.map