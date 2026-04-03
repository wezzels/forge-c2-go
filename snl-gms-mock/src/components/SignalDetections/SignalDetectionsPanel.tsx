import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { SignalDetection, SignalDetectionRowData } from '../../models/detection';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface SignalDetectionsPanelProps {
  detections: SignalDetection[];
  selectedDetectionIds: string[];
  onDetectionSelect: (detectionIds: string[]) => void;
  onDetectionDoubleClick: (detectionId: string) => void;
}

export const SignalDetectionsPanel: React.FC<SignalDetectionsPanelProps> = ({
  detections,
  selectedDetectionIds,
  onDetectionSelect,
  onDetectionDoubleClick
}) => {
  const columnDefs: any[] = [
    { field: 'station', headerName: 'Station', width: 100 },
    { field: 'phase', headerName: 'Phase', width: 80 },
    { field: 'arrivalTime', headerName: 'Arrival Time', width: 180 },
    { field: 'slowness', headerName: 'Slowness', width: 100 },
    { field: 'azimuth', headerName: 'Azimuth', width: 100 },
    { field: 'amplitude', headerName: 'Amplitude', width: 100 },
    { field: 'status', headerName: 'Status', width: 100 }
  ];

  const rowData: SignalDetectionRowData[] = detections.map(detection => ({
    id: detection.id,
    station: detection.station.name,
    phase: detection.phase,
    arrivalTime: detection.arrivalTime,
    slowness: detection.slowness,
    azimuth: detection.azimuth,
    amplitude: detection.amplitude,
    status: detection.status,
    eventHypothesisId: detection.eventHypothesisId
  }));

  return (
    <div className="signal-detections-panel" style={{ height: '100%', width: '100%' }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        rowSelection="multiple"
        rowClassRules={{
          'row-open': (params: any) => params.data?.status === 'OPEN',
          'row-complete': (params: any) => params.data?.status === 'COMPLETE',
          'row-in-progress': (params: any) => params.data?.status === 'IN_PROGRESS'
        }}
        onSelectionChanged={(event: any) => {
          const selectedRows = event.api.getSelectedRows();
          onDetectionSelect(selectedRows.map((row: any) => row.id));
        }}
        onRowDoubleClicked={(event: any) => {
          if (event.data) {
            onDetectionDoubleClick(event.data.id);
          }
        }}
      />
    </div>
  );
};

export default SignalDetectionsPanel;
