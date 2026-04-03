import React from 'react';
interface UncertaintyEllipseProps {
    latitude: number;
    longitude: number;
    uncertainty: {
        latitude: number;
        longitude: number;
        depth: number;
    };
    depth?: number;
    color?: string;
    opacity?: number;
    onMap?: any;
}
/**
 * Uncertainty Ellipse Component
 *
 * Displays uncertainty ellipse on Cesium globe showing the confidence
 * region for earthquake location.
 */
export declare const UncertaintyEllipse: React.FC<UncertaintyEllipseProps>;
export default UncertaintyEllipse;
//# sourceMappingURL=UncertaintyEllipse.d.ts.map