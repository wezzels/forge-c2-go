import React from 'react';
interface BeamParams {
    slowness: number;
    azimuth: number;
    startTime: number;
    endTime: number;
}
interface BeamVisualizationProps {
    waveformCount?: number;
    sampleRate?: number;
    beamParams?: BeamParams;
    width?: number;
    height?: number;
    showGrid?: boolean;
}
/**
 * Beam Visualization Component
 *
 * Displays beam-formed waveforms showing the result of stacking
 * array data with time shifts to enhance signal-to-noise ratio.
 */
export declare const BeamVisualization: React.FC<BeamVisualizationProps>;
export default BeamVisualization;
//# sourceMappingURL=BeamVisualization.d.ts.map