import React from 'react';
import type { ChannelSegment, TimeRange } from '../../models/weavess';
interface SelectionWindow {
    startTime: number;
    endTime: number;
    color?: string;
    label?: string;
}
interface Marker {
    time: number;
    channel?: string;
    type: 'arrival' | 'pick' | 'theoretical' | 'selection' | 'uncertainty';
    color?: string;
    uncertainty?: number;
    label?: string;
}
interface WaveformDisplayProps {
    channelSegments: ChannelSegment[];
    startTime: number;
    endTime: number;
    height?: number;
    showLabels?: boolean;
    showTimeAxis?: boolean;
    showAmplitudeScale?: boolean;
    markers?: Marker[];
    selectionWindow?: SelectionWindow;
    showRuler?: boolean;
    onChannelSelect?: (channelId: string) => void;
    onMarkerClick?: (marker: Marker) => void;
    onTimeRangeChange?: (timeRange: TimeRange) => void;
    onSelectionChange?: (selection: SelectionWindow | null) => void;
    onWaveformRef?: (api: WaveformApi) => void;
    useWebGL?: boolean;
}
export interface WaveformApi {
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
    panLeft: () => void;
    panRight: () => void;
    setZoomLevel: (level: number) => void;
    setPanOffset: (offset: number) => void;
    setTimeRange: (start: number, end: number) => void;
    clearRuler: () => void;
}
export declare const WaveformDisplay: React.FC<WaveformDisplayProps>;
export default WaveformDisplay;
//# sourceMappingURL=WaveformDisplay.d.ts.map