import React from 'react';
interface MagnitudePoint {
    timestamp: number;
    magnitude: number;
    type: 'mb' | 'ms' | 'ml' | 'mw';
    station?: string;
}
interface MagnitudeTimeSeriesProps {
    data: MagnitudePoint[];
    width?: number;
    height?: number;
    showLegend?: boolean;
    title?: string;
}
export declare const MagnitudeTimeSeries: React.FC<MagnitudeTimeSeriesProps>;
export default MagnitudeTimeSeries;
//# sourceMappingURL=MagnitudeTimeSeries.d.ts.map