import type { Timeseries } from '../channel-segment';
import type { ChannelSegmentTypes } from '../common-model';
import type { Waveform } from './types';
/**
 * TypeGuard to check type of a Timeseries to see if it is a {@link Waveform}.
 *
 * @param maybeWaveform a Timeseries to check if it is a Waveform timeseries and assert the type
 */
export declare function isWaveformTimeseries(maybeWaveform: Timeseries): maybeWaveform is Waveform;
/**
 * Gets a unique id for the individual channel from a {@link ChannelSegmentTypes.ChannelSegmentDescriptor}
 *
 * @param station the parent station to the channel segment
 * @param channelSegment the channel segment to be rendered in the split channel
 * @returns a unique string id for the split channel
 */
export declare function createIndividualChannelIdFromChannelSegmentDescriptor(channelSegmentDescriptor: ChannelSegmentTypes.ChannelSegmentDescriptor): string;
/**
 * Derives the sample count from the start and end time, and sample rate hz.
 *
 * @param startTime the start time of the waveform
 * @param endTime the end time of the waveform
 * @param sampleRateHz the sample rate of the waveform
 * @returns the number of samples that should be in the waveform
 */
export declare function calculateSampleCount(startTime: number, endTime: number, sampleRateHz: number): number;
//# sourceMappingURL=util.d.ts.map