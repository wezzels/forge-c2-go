import React, { useState } from 'react';
import type { Event } from '../../models/event';

interface AssociateDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssociate: (eventId: string) => void;
  events: Event[];
  detectionId: string;
}

export const AssociateDetectionModal: React.FC<AssociateDetectionModalProps> = ({
  isOpen,
  onClose,
  onAssociate,
  events,
  detectionId
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  if (!isOpen) return null;

  const handleAssociate = () => {
    if (selectedEventId) {
      onAssociate(selectedEventId);
      onClose();
    }
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
        minWidth: '400px'
      }}>
        <h2 style={{ color: '#00ff00', marginTop: 0 }}>Associate Detection to Event</h2>
        
        <p style={{ color: '#888', marginBottom: '15px' }}>
          Select an event to associate detection <strong style={{ color: '#00ff00' }}>{detectionId}</strong>:
        </p>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Event</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#0f0f23',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '4px'
            }}
          >
            <option value="">-- Select Event --</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.id} - M{event.magnitude.toFixed(1)} @ {event.latitude.toFixed(2)}, {event.longitude.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
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
            Cancel
          </button>
          <button
            onClick={handleAssociate}
            disabled={!selectedEventId}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedEventId ? '#006600' : '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedEventId ? 'pointer' : 'not-allowed'
            }}
          >
            Associate
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssociateDetectionModal;
