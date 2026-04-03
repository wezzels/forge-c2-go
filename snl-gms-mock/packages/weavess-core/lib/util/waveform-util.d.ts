import type { ChannelSegment, DataSegment, DisplayType, Station } from '../types';
/**
 * Creates a flat line data segment.
 *
 * @param startTimeSecs the start time in seconds
 * @param endTimeSecs the end time in seconds
 * @param amplitude the amplitude of the flat segment
 * @param color? (optional) the color of the segment
 * @param displayType? (optional) the display type of the segment
 * @param pointSize? (optional) the point size of the segment
 * @param sampleRate (optional) the sample rate (default 1 hz)
 */
export declare function createFlatLineDataSegment(startTimeSecs: number, endTimeSecs: number, amplitude: number, color?: string, displayType?: DisplayType[], pointSize?: number, sampleRate?: number): DataSegment;
interface CreateFlatLineChannelSegment {
    configuredInputName: string;
    channelName: string;
    startTimeSecs: number;
    endTimeSecs: number;
    amplitude: number;
    color?: string;
    sampleRate?: number;
    displayType?: DisplayType[];
    pointSize?: number;
    description?: string;
    descriptionLabelColor?: string;
    wfFilterId: string;
}
/**
 * Creates a flat line channel segment.
 *
 * @param channelName
 * @param startTimeSecs the start time in seconds
 * @param endTimeSecs the endtime in seconds
 * @param amplitude the amplitude of the flat segment
 * @param color? (optional) the color of the segment
 * @param sampleRate? (optional) the sample rate (default 1 hz)
 * @param displayType? (optional) the display type of the segment
 * @param pointSize? (optional) the point size of the segment
 * @param description? (optional) the description of the segment
 * @param descriptionLabelColor? (optional) the description color of the segment
 * @param wfFilterId
 */
export declare function createFlatLineChannelSegment({ configuredInputName, channelName, startTimeSecs, endTimeSecs, amplitude, color, sampleRate, displayType, pointSize, description, descriptionLabelColor, wfFilterId }: CreateFlatLineChannelSegment): ChannelSegment;
/**
 * Creates a dummy Station data
 *
 * @param startTimeSecs start of the data, waveforms will start here
 * @param endTimeSecs end of the data, waveforms will end here
 * @param sampleRate how much data
 * @param eventAmplitude the const y value of the waveforms
 * @param noiseAmplitude percentage that calculates and effects the waveforms amplitude
 * @param hasSignalDetection true if signal detections should be created
 * @param hasTheoreticalPhaseWindows true if theoretical phase windows should be created
 *
 * @returns StationConfig dummy data generated station config
 */
export declare function createDummyWaveform({ channelName, startTimeSecs, endTimeSecs, sampleRate, eventAmplitude, noiseAmplitude, hasSignalDetections, hasTheoreticalPhaseWindows, wfFilterId }: {
    channelName: string;
    startTimeSecs: number;
    endTimeSecs: number;
    sampleRate: number;
    eventAmplitude: number;
    noiseAmplitude: number;
    hasSignalDetections: boolean;
    hasTheoreticalPhaseWindows: boolean;
    wfFilterId: string;
}): Station;
export {};
//# sourceMappingURL=waveform-util.d.ts.map