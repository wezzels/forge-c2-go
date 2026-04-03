import React, { useState } from 'react';
import type { Station } from '../../models/station';

interface CreateSignalDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (detection: any) => void;
  stations: Station[];
}

export const CreateSignalDetectionModal: React.FC<CreateSignalDetectionModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  stations
}) => {
  const [formData, setFormData] = useState({
    stationName: '',
    phase: 'P',
    arrivalTime: Date.now() / 1000,
    slowness: 0,
    azimuth: 0,
    amplitude: 0
  });

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      id: 'SD' + Date.now(),
      ...formData
    });
    onClose();
  };

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
        minWidth: '500px'
      }}>
        <h2 style={{ color: '#00ff00', marginTop: 0 }}>Create Signal Detection</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Station</label>
            <select
              value={formData.stationName}
              onChange={(e) => handleChange('stationName', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#0f0f23',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '4px'
              }}
              required
            >
              <option value="">-- Select Station --</option>
              {stations.map(station => (
                <option key={station.name} value={station.name}>
                  {station.name} ({station.type})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Phase</label>
            <select
              value={formData.phase}
              onChange={(e) => handleChange('phase', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#0f0f23',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '4px'
              }}
            >
              <option value="P">P</option>
              <option value="S">S</option>
              <option value="Pn">Pn</option>
              <option value="Pg">Pg</option>
              <option value="Sn">Sn</option>
              <option value="Sg">Sg</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Slowness (s/°)</label>
            <input
              type="number"
              step="0.01"
              value={formData.slowness}
              onChange={(e) => handleChange('slowness', parseFloat(e.target.value))}
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
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Azimuth (°)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="360"
              value={formData.azimuth}
              onChange={(e) => handleChange('azimuth', parseFloat(e.target.value))}
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
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Amplitude</label>
            <input
              type="number"
              step="0.01"
              value={formData.amplitude}
              onChange={(e) => handleChange('amplitude', parseFloat(e.target.value))}
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

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
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
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#006600',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Create Detection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSignalDetectionModal;
