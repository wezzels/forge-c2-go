import React from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { Station } from '../../models/station';
interface StationPropertiesProps {
    stations: Station[];
    selectedStationIds: string[];
    onStationSelect: (ids: string[]) => void;
    onStationDoubleClick?: (stationName: string) => void;
    onShowOnMap?: (station: Station) => void;
}
export declare const StationProperties: React.FC<StationPropertiesProps>;
export default StationProperties;
//# sourceMappingURL=StationProperties.d.ts.map