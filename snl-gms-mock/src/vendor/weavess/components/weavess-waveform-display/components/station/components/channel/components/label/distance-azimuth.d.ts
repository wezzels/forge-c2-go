import { WeavessTypes } from '@gms/weavess-core';
import React from 'react';
/**
 * The type of the props for the {@link DistanceAzimuth} component
 */
export interface DistanceAzimuthProps {
    /** Distance */
    distance: number;
    /** Distance units */
    distanceUnits: WeavessTypes.DistanceUnits;
    /** Azimuth */
    azimuth: number;
}
/**
 * Creates a distance/azimuth value for the label with wrapped tooltips and classes for
 * styling. Use km vs degree ('\u00B0') symbol depending on distanceUnits enum from props
 *
 */
export declare function InternalDistanceAzimuth(props: DistanceAzimuthProps): React.JSX.Element;
export declare const DistanceAzimuth: React.MemoExoticComponent<typeof InternalDistanceAzimuth>;
//# sourceMappingURL=distance-azimuth.d.ts.map