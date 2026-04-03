import React, { useState } from 'react';
import type { Station } from '../../models/station';

interface StationDetailModalProps {
  station: Station | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StationDetailModal: React.FC<StationDetailModalProps> = ({
  station,
  isOpen,
  onClose
}) => {
  if (!isOpen || !station) return null;

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
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h2 style={{ color: '#00ff00', marginTop: 0 }}>Station Properties</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Station Name</label>
          <input
            type="text"
            value={station.name}
            disabled
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#0f0f23',
              color: '#888',
              border: '1px solid #333',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Type</label>
          <input
            type="text"
            value={station.type}
            disabled
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#0f0f23',
              color: '#888',
              border: '1px solid #333',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Description</label>
          <input
            type="text"
            value={station.description}
            disabled
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#0f0f23',
              color: '#888',
              border: '1px solid #333',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Latitude</label>
            <input
              type="number"
              step="0.001"
              value={station.location.latitude}
              disabled
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#0f0f23',
                color: '#888',
                border: '1px solid #333',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Longitude</label>
            <input
              type="number"
              step="0.001"
              value={station.location.longitude}
              disabled
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#0f0f23',
                color: '#888',
                border: '1px solid #333',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
          <div>
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Depth (km)</label>
            <input
              type="number"
              step="0.1"
              value={station.location.depthKm}
              disabled
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#0f0f23',
                color: '#888',
                border: '1px solid #333',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Elevation (km)</label>
            <input
              type="number"
              step="0.1"
              value={station.location.elevationKm}
              disabled
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#0f0f23',
                color: '#888',
                border: '1px solid #333',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Channel Groups</label>
          <div style={{
            backgroundColor: '#0f0f23',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #333',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            {station.channelGroups && station.channelGroups.length > 0 ? (
              station.channelGroups.map((group, index) => (
                <div key={index} style={{ padding: '5px', borderBottom: '1px solid #333' }}>
                  {group.name}
                </div>
              ))
            ) : (
              <div style={{ color: '#888' }}>No channel groups defined</div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
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

export default StationDetailModal;
