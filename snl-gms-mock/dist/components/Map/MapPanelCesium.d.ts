import React from 'react';
import type { Station } from '../../models/station';
import type { Event } from '../../models/event';
interface MapPanelCesiumProps {
    stations: Station[];
    events: Event[];
    selectedStationIds?: string[];
    selectedEventIds?: string[];
    onStationClick?: (stationId: string) => void;
    onEventClick?: (eventId: string) => void;
}
export declare const MapPanelCesium: React.FC<MapPanelCesiumProps>;
export default MapPanelCesium;
//# sourceMappingURL=MapPanelCesium.d.ts.map