import React, { useEffect, useRef } from 'react';
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

export const MapPanel: React.FC<MapPanelProps> = ({
  stations,
  events,
  selectedStationIds,
  selectedEventIds,
  onStationClick,
  onEventClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw world map outline
    drawWorldMap(ctx, canvas.width, canvas.height);

    // Draw stations
    stations.forEach(station => {
      const isSelected = selectedStationIds.includes(station.name);
      drawStation(ctx, station, isSelected);
    });

    // Draw events
    events.forEach(event => {
      const isSelected = selectedEventIds.includes(event.id);
      drawEvent(ctx, event, isSelected);
    });
  }, [stations, events, selectedStationIds, selectedEventIds]);

  const drawWorldMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    // Draw latitude lines
    for (let lat = -90; lat <= 90; lat += 30) {
      const y = ((90 - lat) / 180) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw longitude lines
    for (let lon = -180; lon <= 180; lon += 30) {
      const x = ((lon + 180) / 360) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  };

  const drawStation = (ctx: CanvasRenderingContext2D, station: Station, isSelected: boolean) => {
    const x = ((station.location.longitude + 180) / 360) * 1200;
    const y = ((90 - station.location.latitude) / 180) * 600;

    ctx.beginPath();
    ctx.fillStyle = isSelected ? '#00ff00' : '#ffff00';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Draw station name
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.fillText(station.name, x + 8, y + 3);
  };

  const drawEvent = (ctx: CanvasRenderingContext2D, event: Event, isSelected: boolean) => {
    const x = ((event.longitude + 180) / 360) * 1200;
    const y = ((90 - event.latitude) / 180) * 600;

    // Draw star shape for event
    ctx.beginPath();
    ctx.fillStyle = isSelected ? '#ff0000' : '#ff6600';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;

    const size = 8;
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  return (
    <div className="map-panel" style={{ height: '100%', width: '100%' }}>
      <canvas
        ref={canvasRef}
        width={1200}
        height={600}
        style={{ border: '1px solid #333' }}
      />
    </div>
  );
};

export default MapPanel;
