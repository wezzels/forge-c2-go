import React, { useState } from 'react';

interface EventCreationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (event: any) => void;
}

export const EventCreationForm: React.FC<EventCreationFormProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [formData, setFormData] = useState({
    latitude: 0,
    longitude: 0,
    depth: 0,
    magnitude: 0,
    originTime: Date.now() / 1000
  });

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      id: 'EVT' + Date.now(),
      status: 'IN_PROGRESS',
      hypothesisId: 'HYP' + Date.now(),
      location: {
        latitude: formData.latitude,
        longitude: formData.longitude,
        depthKm: formData.depth,
        elevationKm: 0
      },
      magnitude: formData.magnitude,
      originTime: formData.originTime,
      depth: formData.depth,
      latitude: formData.latitude,
      longitude: formData.longitude,
      isOpen: true
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
        <h2 style={{ color: '#00ff00', marginTop: 0 }}>Create New Event</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Latitude</label>
            <input
              type="number"
              step="0.001"
              value={formData.latitude}
              onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#0f0f23',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '4px'
              }}
              placeholder="Enter latitude"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Longitude</label>
            <input
              type="number"
              step="0.001"
              value={formData.longitude}
              onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#0f0f23',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '4px'
              }}
              placeholder="Enter longitude"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Depth (km)</label>
            <input
              type="number"
              step="0.1"
              value={formData.depth}
              onChange={(e) => handleChange('depth', parseFloat(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#0f0f23',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '4px'
              }}
              placeholder="Enter depth"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Magnitude</label>
            <input
              type="number"
              step="0.1"
              value={formData.magnitude}
              onChange={(e) => handleChange('magnitude', parseFloat(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#0f0f23',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '4px'
              }}
              placeholder="Enter magnitude"
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
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCreationForm;
