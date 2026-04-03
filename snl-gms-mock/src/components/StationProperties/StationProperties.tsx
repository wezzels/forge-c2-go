import React from 'react';
import { AgGridReact } from 'ag-grid-react';
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

export const StationProperties: React.FC<StationPropertiesProps> = ({
  stations,
  selectedStationIds,
  onStationSelect,
  onStationDoubleClick,
  onShowOnMap
}) => {
  const columnDefs: any[] = [
    { field: 'name', headerName: 'Station', width: 80, sortable: true, filter: true },
    { field: 'type', headerName: 'Type', width: 80, sortable: true, filter: true },
    { 
      field: 'latitude', 
      headerName: 'Lat', 
      width: 80,
      valueFormatter: (params: any) => params.value?.toFixed(2) || ''
    },
    { 
      field: 'longitude', 
      headerName: 'Lon', 
      width: 80,
      valueFormatter: (params: any) => params.value?.toFixed(2) || ''
    },
    {
      headerName: 'Actions',
      width: 80,
      cellRenderer: (params: any) => {
        return '<button style="padding: 2px 6px; background: #006600; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 10px;">📍 Map</button>';
      },
      onCellClicked: (params: any) => {
        const station = stations.find(s => s.name === params.data.name);
        if (station && onShowOnMap) {
          onShowOnMap(station);
        }
      }
    }
  ];

  const rowData = stations.map(station => ({
    name: station.name,
    type: station.type,
    latitude: station.location.latitude,
    longitude: station.location.longitude
  }));

  return (
    <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        rowSelection="multiple"
        onRowClicked={(e: any) => onStationSelect([e.data.name])}
        onRowDoubleClicked={(e: any) => {
          if (onStationDoubleClick) onStationDoubleClick(e.data.name);
        }}
        suppressRowClickSelection={false}
        rowMultiSelectWithClick={true}
      />
    </div>
  );
};

export default StationProperties;
