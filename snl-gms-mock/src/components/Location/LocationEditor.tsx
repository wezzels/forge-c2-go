import React, { useState, useCallback } from 'react';

interface LocationEditorProps {
  latitude: number;
  longitude: number;
  depth: number;
  uncertainty?: {
    latitude: number;
    longitude: number;
    depth: number;
  };
  onLocationChange: (lat: number, lon: number, depth: number) => void;
  onRecalculate?: () => void;
  onSave?: () => void;
  readOnly?: boolean;
}

export const LocationEditor: React.FC<LocationEditorProps> = ({
  latitude,
  longitude,
  depth,
  uncertainty,
  onLocationChange,
  onRecalculate,
  onSave,
  readOnly = false
}) => {
  const [localLat, setLocalLat] = useState(latitude.toFixed(4));
  const [localLon, setLocalLon] = useState(longitude.toFixed(4));
  const [localDepth, setLocalDepth] = useState(depth.toFixed(2));

  const handleLatChange = (value: string) => {
    setLocalLat(value);
    const lat = parseFloat(value);
    if (!isNaN(lat) && lat >= -90 && lat <= 90) {
      onLocationChange(lat, parseFloat(localLon), parseFloat(localDepth));
    }
  };

  const handleLonChange = (value: string) => {
    setLocalLon(value);
    const lon = parseFloat(value);
    if (!isNaN(lon) && lon >= -180 && lon <= 180) {
      onLocationChange(parseFloat(localLat), lon, parseFloat(localDepth));
    }
  };

  const handleDepthChange = (value: string) => {
    setLocalDepth(value);
    const d = parseFloat(value);
    if (!isNaN(d) && d >= 0) {
      onLocationChange(parseFloat(localLat), parseFloat(localLon), d);
    }
  };

  const formatValue = (value: number, decimals: number): string => {
    return value.toFixed(decimals);
  };

  return (
    <div className="location-editor" style={{
      backgroundColor: '#1a1a2e',
      padding: '15px',
      borderRadius: '8px',
      minWidth: '300px'
    }}>
      <h3 style={{ color: '#00ff00', marginTop: 0, marginBottom: '15px' }}>
        Location
      </h3>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>
          Latitude (°)
        </label>
        <input
          type="number"
          step="0.0001"
          min="-90"
          max="90"
          value={localLat}
          onChange={(e) => handleLatChange(e.target.value)}
          disabled={readOnly}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#0f0f23',
            color: readOnly ? '#666' : '#fff',
            border: '1px solid #333',
            borderRadius: '4px'
          }}
        />
        {uncertainty && (
          <span style={{ color: '#666', fontSize: '11px' }}>
            ±{formatValue(uncertainty.latitude, 4)}°
          </span>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>
          Longitude (°)
        </label>
        <input
          type="number"
          step="0.0001"
          min="-180"
          max="180"
          value={localLon}
          onChange={(e) => handleLonChange(e.target.value)}
          disabled={readOnly}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#0f0f23',
            color: readOnly ? '#666' : '#fff',
            border: '1px solid #333',
            borderRadius: '4px'
          }}
        />
        {uncertainty && (
          <span style={{ color: '#666', fontSize: '11px' }}>
            ±{formatValue(uncertainty.longitude, 4)}°
          </span>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>
          Depth (km)
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          value={localDepth}
          onChange={(e) => handleDepthChange(e.target.value)}
          disabled={readOnly}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#0f0f23',
            color: readOnly ? '#666' : '#fff',
            border: '1px solid #333',
            borderRadius: '4px'
          }}
        />
        {uncertainty && (
          <span style={{ color: '#666', fontSize: '11px' }}>
            ±{formatValue(uncertainty.depth, 2)} km
          </span>
        )}
      </div>

      {!readOnly && (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          {onRecalculate && (
            <button
              onClick={onRecalculate}
              style={{
                padding: '8px 16px',
                backgroundColor: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Recalculate
            </button>
          )}
          {onSave && (
            <button
              onClick={onSave}
              style={{
                padding: '8px 16px',
                backgroundColor: '#006600',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationEditor;
