import React from 'react';
import { type WaveformApi } from './WaveformDisplay';
import type { ChannelSegment } from '../../models/weavess';
interface Marker {
    time: number;
    channel?: string;
    type: 'arrival' | 'pick' | 'theoretical' | 'selection' | 'uncertainty';
    color?: string;
    label?: string;
}
interface HybridWaveformDisplayProps {
    channelSegments: ChannelSegment[];
    startTime: number;
    endTime: number;
    height?: number;
    showLabels?: boolean;
    showTimeAxis?: boolean;
    showAmplitudeScale?: boolean;
    markers?: Marker[];
    showRuler?: boolean;
    onChannelSelect?: (channelId: string) => void;
    onTimeRangeChange?: (timeRange: {
        startTime: number;
        endTime: number;
    }) => void;
    onWaveformRef?: (api: WaveformApi) => void;
    preferWebGL?: boolean;
}
export declare const HybridWaveformDisplay: React.FC<HybridWaveformDisplayProps>;
export default HybridWaveformDisplay;
//# sourceMappingURL=HybridWaveformDisplay.d.ts.map