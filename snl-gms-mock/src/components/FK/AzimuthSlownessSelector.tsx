import React, { useState } from 'react';

interface AzimuthSlownessSelectorProps {
  slowness?: number;
  azimuth?: number;
  onSlownessChange: (slowness: number) => void;
  onAzimuthChange: (azimuth: number) => void;
  minSlowness?: number;
  maxSlowness?: number;
  slownessStep?: number;
  showPolar?: boolean;
}

/**
 * Azimuth and Slowness Selector Component
 * 
 * Allows users to select azimuth (0-360°) and slowness (s/°) values
 * for beam steering and FK analysis.
 */
export const AzimuthSlownessSelector: React.FC<AzimuthSlownessSelectorProps> = ({
  slowness = 10,
  azimuth = 0,
  onSlownessChange,
  onAzimuthChange,
  minSlowness = 0,
  maxSlowness = 25,
  slownessStep = 0.1,
  showPolar = true
}) => {
  const [localSlowness, setLocalSlowness] = useState(slowness.toString());
  const [localAzimuth, setLocalAzimuth] = useState(azimuth.toString());

  const handleSlownessChange = (value: string) => {
    setLocalSlowness(value);
    const s = parseFloat(value);
    if (!isNaN(s) && s >= minSlowness && s <= maxSlowness) {
      onSlownessChange(s);
    }
  };

  const handleAzimuthChange = (value: string) => {
    setLocalAzimuth(value);
    const a = parseFloat(value);
    if (!isNaN(a) && a >= 0 && a < 360) {
      onAzimuthChange(a);
    }
  };

  // Preset slowness values for common phases
  const presetSlowness = [
    { value: 0, label: 'P vertical' },
    { value: 4.5, label: 'P regional' },
    { value: 8.0, label: 'P teleseismic' },
    { value: 12.0, label: 'S regional' },
    { value: 20.0, label: 'Rg surface' }
  ];

  // Preset azimuths (common directions)
  const presetAzimuths = [
    { value: 0, label: 'N' },
    { value: 45, label: 'NE' },
    { value: 90, label: 'E' },
    { value: 135, label: 'SE' },
    { value: 180, label: 'S' },
    { value: 225, label: 'SW' },
    { value: 270, label: 'W' },
    { value: 315, label: 'NW' }
  ];

  return (
    <div className="azimuth-slowness-selector" style={{
      backgroundColor: '#1a1a2e',
      padding: '15px',
      borderRadius: '8px'
    }}>
      <h3 style={{ color: '#00ff00', marginTop: 0, marginBottom: '15px' }}>
        Azimuth & Slowness
      </h3>

      {/* Slowness Input */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>
          Slowness (s/°)
        </label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="number"
            step={slownessStep}
            min={minSlowness}
            max={maxSlowness}
            value={localSlowness}
            onChange={(e) => handleSlownessChange(e.target.value)}
            style={{
              width: '100px',
              padding: '8px',
              backgroundColor: '#0f0f23',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '4px'
            }}
          />
          <input
            type="range"
            min={minSlowness}
            max={maxSlowness}
            step={slownessStep}
            value={slowness}
            onChange={(e) => {
              setLocalSlowness(e.target.value);
              onSlownessChange(parseFloat(e.target.value));
            }}
            style={{ flex: 1 }}
          />
        </div>
        
        {/* Preset slowness buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
          {presetSlowness.map(preset => (
            <button
              key={preset.value}
              onClick={() => {
                setLocalSlowness(preset.value.toString());
                onSlownessChange(preset.value);
              }}
              style={{
                padding: '4px 8px',
                backgroundColor: Math.abs(slowness - preset.value) < 0.5 ? '#006600' : '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '10px'
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Azimuth Input */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>
          Azimuth (°)
        </label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="number"
            step="1"
            min="0"
            max="359"
            value={localAzimuth}
            onChange={(e) => handleAzimuthChange(e.target.value)}
            style={{
              width: '100px',
              padding: '8px',
              backgroundColor: '#0f0f23',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '4px'
            }}
          />
          <input
            type="range"
            min="0"
            max="359"
            step="1"
            value={azimuth}
            onChange={(e) => {
              setLocalAzimuth(e.target.value);
              onAzimuthChange(parseInt(e.target.value));
            }}
            style={{ flex: 1 }}
          />
        </div>

        {/* Preset azimuth buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
          {presetAzimuths.map(preset => (
            <button
              key={preset.value}
              onClick={() => {
                setLocalAzimuth(preset.value.toString());
                onAzimuthChange(preset.value);
              }}
              style={{
                padding: '4px 8px',
                backgroundColor: azimuth === preset.value ? '#006600' : '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '10px'
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Polar visualization */}
      {showPolar && (
        <div style={{
          width: '100%',
          aspectRatio: '1',
          maxWidth: '200px',
          margin: '0 auto',
          position: 'relative'
        }}>
          <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
            {/* Grid circles */}
            {[5, 10, 15, 20].map(s => (
              <circle
                key={s}
                cx="100"
                cy="100"
                r={s * 4}
                fill="none"
                stroke="#333"
                strokeWidth="0.5"
              />
            ))}
            
            {/* Azimuth lines */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map(az => (
              <line
                key={az}
                x1="100"
                y1="100"
                x2={100 + 80 * Math.cos((az - 90) * Math.PI / 180)}
                y2={100 + 80 * Math.sin((az - 90) * Math.PI / 180)}
                stroke="#333"
                strokeWidth="0.5"
              />
            ))}
            
            {/* Direction labels */}
            {[0, 90, 180, 270].map(az => {
              const x = 100 + 90 * Math.cos((az - 90) * Math.PI / 180);
              const y = 100 + 90 * Math.sin((az - 90) * Math.PI / 180);
              const label = az === 0 ? 'N' : az === 90 ? 'E' : az === 180 ? 'S' : 'W';
              return (
                <text
                  key={'label' + az}
                  x={x}
                  y={y}
                  fill="#888"
                  fontSize="10"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {label}
                </text>
              );
            })}
            
            {/* Selected point */}
            <circle
              cx={100 + (slowness / 20) * 80 * Math.cos((azimuth - 90) * Math.PI / 180)}
              cy={100 + (slowness / 20) * 80 * Math.sin((azimuth - 90) * Math.PI / 180)}
              r="5"
              fill="#00ff00"
            />
            
            {/* Line from center */}
            <line
              x1="100"
              y1="100"
              x2={100 + (slowness / 20) * 80 * Math.cos((azimuth - 90) * Math.PI / 180)}
              y2={100 + (slowness / 20) * 80 * Math.sin((azimuth - 90) * Math.PI / 180)}
              stroke="#00ff00"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          </svg>
        </div>
      )}

      {/* Current values display */}
      <div style={{
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#0f0f23',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-around'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#888', fontSize: '11px' }}>Slowness</div>
          <div style={{ color: '#00ff00', fontSize: '16px', fontWeight: 'bold' }}>
            {slowness.toFixed(1)} s/°
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#888', fontSize: '11px' }}>Azimuth</div>
          <div style={{ color: '#00ff00', fontSize: '16px', fontWeight: 'bold' }}>
            {azimuth.toFixed(0)}°
          </div>
        </div>
      </div>
    </div>
  );
};

export default AzimuthSlownessSelector;
