import React from 'react';
interface LocationUpdate {
    timestamp: number;
    latitude: number;
    longitude: number;
    depth: number;
    magnitude?: number;
    source: string;
}
interface LocationHistoryProps {
    history: LocationUpdate[];
    onRevert?: (index: number) => void;
    onCompare?: (indices: number[]) => void;
}
export declare const LocationHistory: React.FC<LocationHistoryProps>;
export default LocationHistory;
//# sourceMappingURL=LocationHistory.d.ts.map