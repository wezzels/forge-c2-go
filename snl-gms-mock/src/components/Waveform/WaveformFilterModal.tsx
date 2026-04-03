import React, { useState } from 'react';

interface WaveformFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filter: WaveformFilter) => void;
}

export interface WaveformFilter {
  type: 'bandpass' | 'highpass' | 'lowpass';
  lowFrequency: number;
  highFrequency: number;
}

export const WaveformFilterModal: React.FC<WaveformFilterModalProps> = ({
  isOpen,
  onClose,
  onApply
}) => {
  const [filterType, setFilterType] = useState<'bandpass' | 'highpass' | 'lowpass'>('bandpass');
  const [lowFreq, setLowFreq] = useState(0.1);
  const [highFreq, setHighFreq] = useState(10);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      type: filterType,
      lowFrequency: lowFreq,
      highFrequency: highFreq
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
        minWidth: '400px'
      }}>
        <h2 style={{ color: '#00ff00', marginTop: 0 }}>Waveform Filter</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>Filter Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#0f0f23',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '4px'
            }}
          >
            <option value="bandpass">Bandpass</option>
            <option value="highpass">Highpass</option>
            <option value="lowpass">Lowpass</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>
            Low Frequency (Hz): {lowFreq}
          </label>
          <input
            type="range"
            min="0.01"
            max="100"
            step="0.01"
            value={lowFreq}
            onChange={(e) => setLowFreq(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {filterType === 'bandpass' && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>
              High Frequency (Hz): {highFreq}
            </label>
            <input
              type="range"
              min="0.1"
              max="100"
              step="0.1"
              value={highFreq}
              onChange={(e) => setHighFreq(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
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
            onClick={handleApply}
            style={{
              padding: '8px 16px',
              backgroundColor: '#006600',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaveformFilterModal;
