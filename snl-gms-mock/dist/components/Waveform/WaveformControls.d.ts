import React from 'react';
interface WaveformControlsProps {
    onZoomIn?: () => void;
    onZoomOut?: () => void;
    onPanLeft?: () => void;
    onPanRight?: () => void;
    onReset?: () => void;
    onFilter?: () => void;
    onChannelSelect?: (channels: string[]) => void;
    channels: {
        id: string;
        name: string;
    }[];
    selectedChannels: string[];
    showRuler?: boolean;
    onToggleRuler?: () => void;
}
export declare const WaveformControls: React.FC<WaveformControlsProps>;
export default WaveformControls;
//# sourceMappingURL=WaveformControls.d.ts.map