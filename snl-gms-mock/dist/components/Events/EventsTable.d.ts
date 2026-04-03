import React from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { Event } from '../../models/event';
interface EventsTableProps {
    events: Event[];
    selectedEventIds: string[];
    onEventSelect: (ids: string[]) => void;
    onEventDoubleClick: (eventId: string) => void;
}
export declare const EventsTable: React.FC<EventsTableProps>;
export default EventsTable;
//# sourceMappingURL=EventsTable.d.ts.map