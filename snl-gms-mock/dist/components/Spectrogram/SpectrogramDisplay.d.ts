import React from 'react';
interface SpectrogramProps {
    data?: number[][];
    sampleRate?: number;
    windowSize?: number;
    overlap?: number;
    minFreq?: number;
    maxFreq?: number;
    startTime?: number;
    endTime?: number;
    width?: number;
    height?: number;
    colorScale?: 'jet' | 'viridis' | 'hot';
    showAxes?: boolean;
    showColorbar?: boolean;
}
/**
 * Spectrogram Display Component
 *
 * Displays spectrogram (time-frequency representation) of seismic data.
 * Shows power spectral density as color-coded intensity.
 */
export declare const SpectrogramDisplay: React.FC<SpectrogramProps>;
export default SpectrogramDisplay;
//# sourceMappingURL=SpectrogramDisplay.d.ts.map