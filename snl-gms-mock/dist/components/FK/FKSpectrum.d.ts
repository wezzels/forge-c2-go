import React from 'react';
interface FKPoint {
    slowness: number;
    azimuth: number;
    power: number;
    fstat: number;
}
interface FKSpectrumProps {
    data?: FKPoint[];
    width?: number;
    height?: number;
    minSlowness?: number;
    maxSlowness?: number;
    onSelection?: (slowness: number, azimuth: number) => void;
    selectedSlowness?: number;
    selectedAzimuth?: number;
    colorScale?: 'jet' | 'viridis' | 'hot' | 'cool';
}
/**
 * FK Spectrum Display Component
 *
 * Displays frequency-wavenumber (f-k) analysis results showing
 * power spectral density as a function of slowness and azimuth.
 *
 * Used for array processing to determine back azimuth and slowness
 * of detected signals.
 */
export declare const FKSpectrum: React.FC<FKSpectrumProps>;
export default FKSpectrum;
//# sourceMappingURL=FKSpectrum.d.ts.map