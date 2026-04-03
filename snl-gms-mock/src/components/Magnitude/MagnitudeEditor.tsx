import React, { useState } from 'react';

interface MagnitudeEditorProps {
  magnitudes: {
    mb?: number;
    ms?: number;
    ml?: number;
    mw?: number;
  };
  networkMagnitude?: number;
  onMagnitudeChange: (type: string, value: number) => void;
  onRecalculate?: () => void;
  onSave?: () => void;
  readOnly?: boolean;
}

export const MagnitudeEditor: React.FC<MagnitudeEditorProps> = ({
  magnitudes,
  networkMagnitude,
  onMagnitudeChange,
  onRecalculate,
  onSave,
  readOnly = false
}) => {
  const [selectedType, setSelectedType] = useState<string>('mb');

  const magnitudeTypes = [
    { key: 'mb', label: 'Mb (Body Wave)', description: 'Measured from P-waves' },
    { key: 'ms', label: 'Ms (Surface Wave)', description: 'Measured from surface waves' },
    { key: 'ml', label: 'ML (Local)', description: 'Local magnitude scale' },
    { key: 'mw', label: 'Mw (Moment)', description: 'Moment magnitude' }
  ];

  const handleValueChange = (type: string, value: string) => {
    const mag = parseFloat(value);
    if (!isNaN(mag) && mag >= 0 && mag <= 10) {
      onMagnitudeChange(type, mag);
    }
  };

  const formatMagnitude = (value: number | undefined): string => {
    if (value === undefined || value === null) return '—';
    return value.toFixed(2);
  };

  const getMagnitudeColor = (value: number | undefined): string => {
    if (value === undefined) return '#888';
    if (value >= 7) return '#ff0000';
    if (value >= 6) return '#ff8800';
    if (value >= 5) return '#ffff00';
    if (value >= 4) return '#00ff00';
    return '#00ffff';
  };

  return (
    <div className="magnitude-editor" style={{
      backgroundColor: '#1a1a2e',
      padding: '15px',
      borderRadius: '8px',
      minWidth: '300px'
    }}>
      <h3 style={{ color: '#00ff00', marginTop: 0, marginBottom: '15px' }}>
        Magnitude
      </h3>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>
          Magnitude Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          disabled={readOnly}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#0f0f23',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '4px'
          }}
        >
          {magnitudeTypes.map(type => (
            <option key={type.key} value={type.key}>
              {type.label}
            </option>
          ))}
        </select>
        <div style={{ color: '#666', fontSize: '11px', marginTop: '5px' }}>
          {magnitudeTypes.find(t => t.key === selectedType)?.description}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>
          Value
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="10"
          value={magnitudes[selectedType as keyof typeof magnitudes] || ''}
          onChange={(e) => handleValueChange(selectedType, e.target.value)}
          disabled={readOnly}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#0f0f23',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '4px',
            fontSize: '24px',
            fontWeight: 'bold'
          }}
        />
        <div style={{
          color: getMagnitudeColor(magnitudes[selectedType as keyof typeof magnitudes]),
          fontSize: '12px',
          marginTop: '5px'
        }}>
          {formatMagnitude(magnitudes[selectedType as keyof typeof magnitudes])}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ color: '#888', display: 'block', marginBottom: '10px' }}>
          All Magnitudes
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {magnitudeTypes.map(type => (
            <div
              key={type.key}
              style={{
                padding: '8px',
                backgroundColor: selectedType === type.key ? '#0f3f0f' : '#0f0f23',
                border: selectedType === type.key ? '1px solid #00ff00' : '1px solid #333',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedType(type.key)}
            >
              <div style={{ color: '#fff', fontWeight: 'bold' }}>
                {type.label.split(' ')[0]}
              </div>
              <div style={{
                color: getMagnitudeColor(magnitudes[type.key as keyof typeof magnitudes]),
                fontSize: '14px'
              }}>
                {formatMagnitude(magnitudes[type.key as keyof typeof magnitudes])}
              </div>
            </div>
          ))}
        </div>
      </div>

      {networkMagnitude !== undefined && (
        <div style={{
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#0f3f0f',
          border: '1px solid #00ff00',
          borderRadius: '4px'
        }}>
          <div style={{ color: '#888', fontSize: '12px' }}>Network Magnitude</div>
          <div style={{
            color: getMagnitudeColor(networkMagnitude),
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            {formatMagnitude(networkMagnitude)}
          </div>
        </div>
      )}

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

export default MagnitudeEditor;
