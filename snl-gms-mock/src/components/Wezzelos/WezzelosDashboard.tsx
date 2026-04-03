import React, { useState, useCallback } from 'react';
import { WezzelosEmbed } from './WezzelosEmbed';

interface WezzelosDashboardProps {
  embedUrl?: string;
  token?: string;
}

/**
 * Wezzelos Dashboard Component
 * 
 * Demonstrates iframe embedding of GMS Mock UI in Wezzelos.
 */
export const WezzelosDashboard: React.FC<WezzelosDashboardProps> = ({
  embedUrl = 'http://10.0.0.117:3001',
  token
}) => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [selectedDetection, setSelectedDetection] = useState<string | null>(null);

  const handleEventSelect = useCallback((eventId: string) => {
    setSelectedEvent(eventId);
    console.log('Event selected:', eventId);
  }, []);

  const handleStationSelect = useCallback((stationId: string) => {
    setSelectedStation(stationId);
    console.log('Station selected:', stationId);
  }, []);

  const handleDetectionSelect = useCallback((detectionId: string) => {
    setSelectedDetection(detectionId);
    console.log('Detection selected:', detectionId);
  }, []);

  return (
    <div className="wezzelos-dashboard" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#1a1a2e'
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 20px',
        backgroundColor: '#0f0f23',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ color: '#00ff00', margin: 0, fontSize: '18px' }}>
          Wezzelos GMS Dashboard
        </h1>
        <div style={{ color: '#888', fontSize: '12px' }}>
          {selectedEvent && <span style={{ marginRight: '20px' }}>Event: {selectedEvent}</span>}
          {selectedStation && <span style={{ marginRight: '20px' }}>Station: {selectedStation}</span>}
          {selectedDetection && <span>Detection: {selectedDetection}</span>}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, position: 'relative' }}>
        <WezzelosEmbed
          src={embedUrl}
          token={token}
          onEventSelect={handleEventSelect}
          onStationSelect={handleStationSelect}
          onDetectionSelect={handleDetectionSelect}
        />
      </div>

      {/* Footer */}
      <div style={{
        padding: '5px 20px',
        backgroundColor: '#0f0f23',
        borderTop: '1px solid #333',
        color: '#666',
        fontSize: '11px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>Wezzelos Dashboard v1.0.0</span>
        <span>GMS Mock UI: {embedUrl}</span>
      </div>
    </div>
  );
};

export default WezzelosDashboard;
