import { INDIVIDUAL_CHANNEL_TOKEN } from '../station-definitions/channel-definitions';
/**
 * TypeGuard to check type of a Timeseries to see if it is a {@link Waveform}.
 *
 * @param maybeWaveform a Timeseries to check if it is a Waveform timeseries and assert the type
 */
export function isWaveformTimeseries(maybeWaveform) {
    return (maybeWaveform.samples != null ||
        maybeWaveform._uiClaimCheckId != null);
}
/**
 * Gets a unique id for the individual channel from a {@link ChannelSegmentTypes.ChannelSegmentDescriptor}
 *
 * @param station the parent station to the channel segment
 * @param channelSegment the channel segment to be rendered in the split channel
 * @returns a unique string id for the split channel
 */
export function createIndividualChannelIdFromChannelSegmentDescriptor(channelSegmentDescriptor) {
    return `${channelSegmentDescriptor.channel.name}.${INDIVIDUAL_CHANNEL_TOKEN}.${channelSegmentDescriptor.startTime}${channelSegmentDescriptor.endTime}`;
}
/**
 * Derives the sample count from the start and end time, and sample rate hz.
 *
 * @param startTime the start time of the waveform
 * @param endTime the end time of the waveform
 * @param sampleRateHz the sample rate of the waveform
 * @returns the number of samples that should be in the waveform
 */
export function calculateSampleCount(startTime, endTime, sampleRateHz) {
    return Math.round((endTime - startTime) * sampleRateHz) + 1;
}
//# sourceMappingURL=util.js.map