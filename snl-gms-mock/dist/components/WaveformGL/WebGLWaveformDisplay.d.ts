import React from 'react';
import type { ChannelSegment } from '../../models/weavess';
interface WebGLWaveformDisplayProps {
    channelSegments: ChannelSegment[];
    startTime: number;
    endTime: number;
    height?: number;
    markers?: Array<{
        time: number;
        channel?: string;
        type: string;
        color?: string;
        label?: string;
    }>;
    onWaveformRef?: (api: WaveformApi) => void;
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
export declare const WebGLWaveformDisplay: React.FC<WebGLWaveformDisplayProps>;
export default WebGLWaveformDisplay;
//# sourceMappingURL=WebGLWaveformDisplay.d.ts.map