export interface Waveform {
    startTime: number;
    endTime: number;
    sampleRate: number;
    samples: number[];
}
export interface WaveformFilter {
    id: string;
    name: string;
    filterType: 'BANDPASS' | 'HIGHPASS' | 'LOWPASS';
    sampleRate: number;
    lowFrequencyHz?: number;
    highFrequencyHz?: number;
}
export interface ChannelSegment {
    id: string;
    name: string;
    type: ChannelSegmentType;
    channel: ChannelRef;
    timeseries: Timeseries[];
}
export interface ChannelRef {
    name: string;
    type: string;
}
export declare enum ChannelSegmentType {
    RAW = "RAW",
    FILTERED = "FILTERED",
    BEAMED = "BEAMED"
}
export interface Timeseries {
    type: TimeseriesType;
    values: number[];
    startTime: number;
    sampleCount: number;
    sampleRate: number;
}
export declare enum TimeseriesType {
    WAVEFORM = "WAVEFORM",
    DETECTION = "DETECTION"
}
export interface WaveformDisplayProps {
    channelId: string;
    startTime: number;
    endTime: number;
    waveforms: Waveform[];
    filter?: WaveformFilter;
    height?: number;
    showLabels?: boolean;
}
//# sourceMappingURL=waveform.d.ts.map