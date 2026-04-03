import React from 'react';
import type { Station } from '../../models/station';
import type { Event } from '../../models/event';
interface MapPanelProps {
    stations: Station[];
    events: Event[];
    selectedStationIds: string[];
    selectedEventIds: string[];
    onStationClick?: (stationId: string) => void;
    onEventClick?: (eventId: string) => void;
}
export declare const MapPanel: React.FC<MapPanelProps>;
export default MapPanel;
//# sourceMappingURL=MapPanel.d.ts.map