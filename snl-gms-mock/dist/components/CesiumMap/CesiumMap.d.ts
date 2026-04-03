import React from 'react';
import 'cesium/Build/Cesium/Widgets/widgets.css';
interface CesiumMapProps {
    stations: Array<{
        name: string;
        latitude: number;
        longitude: number;
        type?: string;
    }>;
    events: Array<{
        id: string;
        latitude: number;
        longitude: number;
        magnitude: number;
        depth: number;
    }>;
    selectedStationIds?: string[];
    selectedEventIds?: string[];
    onStationClick?: (stationId: string) => void;
    onEventClick?: (eventId: string) => void;
    height?: number;
}
export declare const CesiumMap: React.FC<CesiumMapProps>;
export default CesiumMap;
//# sourceMappingURL=CesiumMap.d.ts.map