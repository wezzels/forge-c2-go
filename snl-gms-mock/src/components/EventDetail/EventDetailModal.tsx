import React, { useState, useEffect } from 'react';
import type { Event, EventStatus } from '../../models/event';
import { LocationEditor } from '../Location/LocationEditor';
import { MagnitudeEditor } from '../Magnitude/MagnitudeEditor';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onSave
}) => {
  const [editedEvent, setEditedEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'location' | 'magnitude' | 'hypotheses'>('general');

  useEffect(() => {
    if (event) {
      setEditedEvent({ ...event });
    }
  }, [event]);

  const handleLocationChange = (lat: number, lon: number, depth: number) => {
    if (!editedEvent) return;
    setEditedEvent({
      ...editedEvent,
      latitude: lat,
      longitude: lon,
      depth
    });
  };

  const handleMagnitudeChange = (type: string, value: number) => {
    if (!editedEvent) return;
    // For now, just update magnitude field
    setEditedEvent({
      ...editedEvent,
      magnitude: value
    });
  };

  const handleStatusChange = (status: EventStatus) => {
    if (!editedEvent) return;
    setEditedEvent({
      ...editedEvent,
      status
    });
  };

  const handleSave = () => {
    if (editedEvent) {
      onSave(editedEvent);
    }
    onClose();
  };

  if (!isOpen || !event) return null;

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'location', label: 'Location' },
    { id: 'magnitude', label: 'Magnitude' },
    { id: 'hypotheses', label: 'Hypotheses' }
  ];

  const statusOptions: { value: EventStatus; label: string }[] = [
    { value: 'IN_PROGRESS' as EventStatus, label: 'In Progress' },
    { value: 'COMPLETE' as EventStatus, label: 'Complete' },
    { value: 'NOT_STARTED' as EventStatus, label: 'Not Started' }
  ];

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
        minWidth: '600px',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2 style={{ color: '#00ff00', marginTop: 0, marginBottom: '15px' }}>
          Event Details: {event.id}
        </h2>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '8px 16px',
                backgroundColor: activeTab === tab.id ? '#006600' : '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Tab */}
        {activeTab === 'general' && editedEvent && (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Status</label>
              <select
                value={editedEvent.status}
                onChange={(e) => handleStatusChange(e.target.value as EventStatus)}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#0f0f23',
                  color: '#fff',
                  border: '1px solid #333',
                  borderRadius: '4px'
                }}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Event ID</label>
              <input
                type="text"
                value={event.id}
                readOnly
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#0f0f23',
                  color: '#666',
                  border: '1px solid #333',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Origin Time</label>
              <input
                type="text"
                value={new Date(event.originTime * 1000).toISOString()}
                readOnly
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#0f0f23',
                  color: '#666',
                  border: '1px solid #333',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
        )}

        {/* Location Tab */}
        {activeTab === 'location' && editedEvent && (
          <LocationEditor
            latitude={editedEvent.latitude}
            longitude={editedEvent.longitude}
            depth={editedEvent.depth}
            onLocationChange={handleLocationChange}
            onSave={handleSave}
          />
        )}

        {/* Magnitude Tab */}
        {activeTab === 'magnitude' && editedEvent && (
          <MagnitudeEditor
            magnitudes={{
              mb: editedEvent.magnitude,
              ms: undefined,
              ml: undefined,
              mw: undefined
            }}
            onMagnitudeChange={handleMagnitudeChange}
            onSave={handleSave}
          />
        )}

        {/* Hypotheses Tab */}
        {activeTab === 'hypotheses' && (
          <div style={{ color: '#888', padding: '20px' }}>
            <p>Event hypotheses are managed by the signal detection association system.</p>
            <p>Hypothesis management coming in a future update.</p>
          </div>
        )}

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
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              backgroundColor: '#006600',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
