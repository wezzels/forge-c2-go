import React from 'react';
import type { SignalDetection } from '../../models/detection';

interface DetectionDetailModalProps {
  detection: SignalDetection | null;
  isOpen: boolean;
  onClose: () => void;
  onAssociate?: (detectionId: string) => void;
  onCreateDetection?: () => void;
}

export const DetectionDetailModal: React.FC<DetectionDetailModalProps> = ({
  detection,
  isOpen,
  onClose,
  onAssociate,
  onCreateDetection
}) => {
  if (!isOpen || !detection) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: '#1a1a2e',
        padding: '20px',
        borderRadius: '8px',
        minWidth: '500px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ color: '#00ff00', marginTop: 0, marginBottom: '20px' }}>
          Signal Detection Details
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Detection ID</label>
          <input
            type="text"
            value={detection.id}
            readOnly
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#0f0f23',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Station</label>
          <input
            type="text"
            value={detection.station?.name || 'Unknown'}
            readOnly
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#0f0f23',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Phase</label>
          <input
            type="text"
            value={detection.phase}
            readOnly
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#0f0f23',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Arrival Time</label>
          <input
            type="text"
            value={new Date(detection.arrivalTime * 1000).toISOString()}
            readOnly
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#0f0f23',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Slowness (s/°)</label>
            <input
              type="text"
              value={detection.slowness?.toFixed(2) || 'N/A'}
              readOnly
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#0f0f23',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '4px'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Azimuth (°)</label>
            <input
              type="text"
              value={detection.azimuth?.toFixed(1) || 'N/A'}
              readOnly
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#0f0f23',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Amplitude</label>
          <input
            type="text"
            value={detection.amplitude?.toFixed(2) || 'N/A'}
            readOnly
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#0f0f23',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '4px'
            }}
          />
        </div>

        {detection.signalToNoise && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Signal-to-Noise Ratio</label>
            <input
              type="text"
              value={detection.signalToNoise.toFixed(2)}
              readOnly
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#0f0f23',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '4px'
              }}
            />
          </div>
        )}

        {detection.eventHypothesisId && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Associated Event</label>
            <input
              type="text"
              value={detection.eventHypothesisId}
              readOnly
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#0f0f23',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '4px'
              }}
            />
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {onAssociate && (
              <button
                onClick={() => onAssociate(detection.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#006600',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Associate to Event
              </button>
            )}
            {onCreateDetection && (
              <button
                onClick={onCreateDetection}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#0066cc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Signal Detection
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetectionDetailModal;
