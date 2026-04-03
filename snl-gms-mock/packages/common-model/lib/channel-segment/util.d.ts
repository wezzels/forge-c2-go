import type { ChannelSegmentTypes } from '../common-model';
import type { ChannelSegment, ChannelSegmentClaim, ChannelSegmentDescriptor, ClaimCheck, MissingInputsClaimCheck, TimeRangesByChannel, Timeseries, TimeseriesClaimCheck } from './types';
/**
 * Determine if channelSegmentDescriptor is in the selected waveforms list
 *
 * @return returns is in list
 */
export declare function isSelectedWaveform(channelSegmentDescriptor: ChannelSegmentDescriptor, selectedWaveforms: ChannelSegmentDescriptor[]): boolean;
/**
 * Create a unique string
 *
 * @param id ChannelSegmentDescriptor throws an error if undefined
 * @returns unique string representing the ChannelSegmentDescriptor
 */
export declare function createChannelSegmentString(id: ChannelSegmentDescriptor | undefined): string;
/**
 * Checks if the given object is a TimeseriesClaimCheck.
 *
 * @param obj - The object to check.
 * @returns True if the object is a TimeseriesClaimCheck, otherwise false.
 */
export declare function isTimeseriesClaimCheck(obj: any): obj is TimeseriesClaimCheck;
/**
 * Checks if the given object is a MissingInputsClaimCheck.
 *
 * @param obj - The object to check.
 * @returns True if the object is a MissingInputsClaimCheck, otherwise false.
 */
export declare function isMissingInputsClaimCheck(obj: any): obj is MissingInputsClaimCheck;
/**
 * Checks if the given object is a ClaimCheck.
 *
 * @param obj - The object to check.
 * @returns True if the object is a ClaimCheck, otherwise false.
 */
export declare function isClaimCheck(obj: Timeseries | TimeRangesByChannel | ClaimCheck): obj is ClaimCheck;
/**
 * Checks if the given ChannelSegment is a claim.
 *
 * @param cs - The ChannelSegment to check.
 * @returns True if the ChannelSegment is a claim, otherwise false.
 */
export declare function isChannelSegmentClaim<T extends Timeseries>(cs: ChannelSegment<T> | ChannelSegmentClaim<T>): boolean;
/**
 * Asserts that the given ChannelSegment is fully resolved (ie, not a claim check).
 *
 * @param cs - The ChannelSegment to check.
 * @throws If the ChannelSegment is not fully resolved.
 */
export declare function assertIsResolvedChannelSegment<T extends Timeseries>(cs: ChannelSegmentTypes.ChannelSegment<T> | ChannelSegmentTypes.ChannelSegmentClaim<T>): asserts cs is ChannelSegmentTypes.ChannelSegment<T>;
/**
 * Takes a claim check that may have extra data and converts it into a simple timeseries
 * claim check with no extra params. This is useful if the claim check is being serialized,
 * such as for sending to a worker thread, since it reduces the size of the serialized data.
 *
 * @param claimCheck the input claim check
 * @returns a simple TimeseriesClaimCheck (with no extra params)
 */
export declare function makeTimeseriesClaimCheck<T extends TimeseriesClaimCheck>(claimCheck: T): TimeseriesClaimCheck;
//# sourceMappingURL=util.d.ts.map