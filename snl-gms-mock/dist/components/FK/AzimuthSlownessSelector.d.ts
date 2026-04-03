import React from 'react';
interface AzimuthSlownessSelectorProps {
    slowness?: number;
    azimuth?: number;
    onSlownessChange: (slowness: number) => void;
    onAzimuthChange: (azimuth: number) => void;
    minSlowness?: number;
    maxSlowness?: number;
    slownessStep?: number;
    showPolar?: boolean;
}
/**
 * Azimuth and Slowness Selector Component
 *
 * Allows users to select azimuth (0-360°) and slowness (s/°) values
 * for beam steering and FK analysis.
 */
export declare const AzimuthSlownessSelector: React.FC<AzimuthSlownessSelectorProps>;
export default AzimuthSlownessSelector;
//# sourceMappingURL=AzimuthSlownessSelector.d.ts.map