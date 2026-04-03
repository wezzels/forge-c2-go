import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { Event } from '../../models/event';

interface EventsTableProps {
  events: Event[];
  selectedEventIds: string[];
  onEventSelect: (ids: string[]) => void;
  onEventDoubleClick: (eventId: string) => void;
}

interface ColumnConfig {
  field: string;
  headerName: string;
  visible: boolean;
  width?: number;
}

export const EventsTable: React.FC<EventsTableProps> = ({
  events,
  selectedEventIds,
  onEventSelect,
  onEventDoubleClick
}) => {
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>([
    { field: 'id', headerName: 'ID', visible: true, width: 80 },
    { field: 'status', headerName: 'Status', visible: true, width: 100 },
    { field: 'magnitude', headerName: 'Mag', visible: true, width: 60 },
    { field: 'latitude', headerName: 'Lat', visible: true, width: 80 },
    { field: 'longitude', headerName: 'Lon', visible: true, width: 80 },
    { field: 'depth', headerName: 'Depth', visible: true, width: 60 },
    { field: 'originTime', headerName: 'Origin Time', visible: true, width: 150 }
  ]);

  const getRowStyle = (params: any): any => {
    const row = params.data;
    if (row.status === 'COMPLETE') {
      return { backgroundColor: '#1a3d1a' };
    } else if (row.status === 'IN_PROGRESS') {
      return { backgroundColor: '#3d3d1a' };
    } else if (row.status === 'NOT_STARTED') {
      return { backgroundColor: '#3d1a1a' };
    }
    return {};
  };

  const handleColumnToggle = (field: string) => {
    setColumnConfigs(prev =>
      prev.map(c => c.field === field ? { ...c, visible: !c.visible } : c)
    );
  };

  const rowData = events.map(event => ({
    id: event.id,
    status: event.status,
    magnitude: event.magnitude,
    latitude: event.latitude,
    longitude: event.longitude,
    depth: event.depth,
    originTime: event.originTime
  }));

  const columnDefs: any[] = columnConfigs
    .filter(c => c.visible)
    .map(col => ({
      field: col.field,
      headerName: col.headerName,
      width: col.width,
      sortable: true,
      filter: true,
      valueFormatter: (params: any) => {
        if (col.field === 'originTime') {
          return new Date(params.value * 1000).toISOString();
        }
        if (col.field === 'magnitude' || col.field === 'latitude' || col.field === 'longitude') {
          return params.value?.toFixed(2) || '';
        }
        if (col.field === 'depth') {
          return params.value?.toFixed(1) || '';
        }
        return params.value;
      }
    }));

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: 5,
        right: 5,
        zIndex: 10
      }}>
        <button
          onClick={() => setShowColumnConfig(!showColumnConfig)}
          style={{
            padding: '4px 8px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          ⚙ Columns
        </button>
      </div>

      {showColumnConfig && (
        <div style={{
          position: 'absolute',
          top: 30,
          right: 5,
          backgroundColor: '#1a1a2e',
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #333',
          zIndex: 20,
          minWidth: '150px'
        }}>
          <div style={{ color: '#00ff00', marginBottom: '10px', fontSize: '12px' }}>
            Column Visibility
          </div>
          {columnConfigs.map(col => (
            <label key={col.field} style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '5px',
              color: '#888',
              fontSize: '11px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={col.visible}
                onChange={() => handleColumnToggle(col.field)}
                style={{ marginRight: '8px' }}
              />
              {col.headerName}
            </label>
          ))}
        </div>
      )}

      <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection="multiple"
          onRowClicked={(e: any) => onEventSelect([e.data.id])}
          onRowDoubleClicked={(e: any) => onEventDoubleClick(e.data.id)}
          getRowStyle={getRowStyle}
          suppressRowClickSelection={false}
          rowMultiSelectWithClick={true}
        />
      </div>
    </div>
  );
};

export default EventsTable;
