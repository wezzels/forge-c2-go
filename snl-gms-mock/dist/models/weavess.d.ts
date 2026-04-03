export interface WeavessInstance {
    destroy: () => void;
    resize: () => void;
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
    setDisplayTime: (startTime: number, endTime: number) => void;
    getDisplayTime: () => {
        startTime: number;
        endTime: number;
    };
    setChannelSegments: (channelSegments: ChannelSegment[]) => void;
    addMarker: (marker: Marker) => void;
    removeMarker: (markerId: string) => void;
    clearMarkers: () => void;
}
export interface WeavessProps {
    channelSegments: ChannelSegment[];
    initialTimeRange: TimeRange;
    stationName: string;
    isStationsShown: boolean;
    areChannelsExpanded: boolean;
    setWeavessInstance: (instance: WeavessInstance) => void;
    onChannelSelect?: (channelId: string) => void;
    onMarkerClick?: (markerId: string) => void;
    onTimeRangeChange?: (startTime: number, endTime: number) => void;
}
export interface ChannelSegment {
    id: string;
    name: string;
    type: ChannelSegmentType;
    channel: Channel;
    timeseries: Timeseries[];
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
export interface Marker {
    id: string;
    type: MarkerType;
    time: number;
    color: string;
    label?: string;
    uncertainty?: number;
}
export declare enum MarkerType {
    SIGNAL_DETECTION = "SIGNAL_DETECTION",
    EVENT = "EVENT",
    THEORETICAL = "THEORETICAL",
    USER = "USER"
}
export interface TimeRange {
    startTime: number;
    endTime: number;
}
export interface Channel {
    name: string;
    type: ChannelType;
    stationName: string;
}
export declare enum ChannelType {
    RAW = "RAW",
    DERIVED = "DERIVED",
    BEAMED = "BEAMED"
}
//# sourceMappingURL=weavess.d.ts.map