import React, { useState } from 'react';
import { CesiumMap } from '../CesiumMap';
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

export const MapPanelCesium: React.FC<MapPanelCesiumProps> = ({
  stations,
  events,
  selectedStationIds = [],
  selectedEventIds = [],
  onStationClick,
  onEventClick
}) => {
  const [useCesium, setUseCesium] = useState(true);

  // Convert stations to map format
  const mapStations = stations.map(s => ({
    name: s.name,
    latitude: s.location.latitude,
    longitude: s.location.longitude,
    type: s.type
  }));

  // Convert events to map format
  const mapEvents = events.map(e => ({
    id: e.id,
    latitude: e.latitude,
    longitude: e.longitude,
    magnitude: e.magnitude,
    depth: e.depth
  }));

  if (!useCesium) {
    // Fallback to canvas-based map
    return (
      <div style={{ height: '100%', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: 5,
          right: 5,
          zIndex: 10
        }}>
          <button
            onClick={() => setUseCesium(true)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#006600',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            Use 3D Globe
          </button>
        </div>
        <div style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a1a',
          color: '#888'
        }}>
          Map temporarily unavailable
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <CesiumMap
        stations={mapStations}
        events={mapEvents}
        selectedStationIds={selectedStationIds}
        selectedEventIds={selectedEventIds}
        onStationClick={onStationClick}
        onEventClick={onEventClick}
        height={350}
      />
    </div>
  );
};

export default MapPanelCesium;
