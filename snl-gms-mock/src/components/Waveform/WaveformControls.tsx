import React from 'react';

interface WaveformControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onPanLeft?: () => void;
  onPanRight?: () => void;
  onReset?: () => void;
  onFilter?: () => void;
  onChannelSelect?: (channels: string[]) => void;
  channels: { id: string; name: string }[];
  selectedChannels: string[];
  showRuler?: boolean;
  onToggleRuler?: () => void;
}

export const WaveformControls: React.FC<WaveformControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onPanLeft,
  onPanRight,
  onReset,
  onFilter,
  onChannelSelect,
  channels,
  selectedChannels,
  showRuler = false,
  onToggleRuler
}) => {
  const handleChannelToggle = (channelId: string) => {
    const newSelection = selectedChannels.includes(channelId)
      ? selectedChannels.filter(id => id !== channelId)
      : [...selectedChannels, channelId];
    onChannelSelect?.(newSelection);
  };

  const handleSelectAll = () => {
    onChannelSelect?.(channels.map(c => c.id));
  };

  const handleSelectNone = () => {
    onChannelSelect?.([]);
  };

  return (
    <div className="waveform-controls" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: '#0f0f23',
      borderBottom: '1px solid #333'
    }}>
      {/* Zoom Controls */}
      <div className="zoom-controls" style={{ display: 'flex', gap: '5px' }}>
        <button
          onClick={onZoomIn}
          title="Zoom In"
          style={{
            padding: '6px 12px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          +
        </button>
        <button
          onClick={onZoomOut}
          title="Zoom Out"
          style={{
            padding: '6px 12px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          −
        </button>
        <button
          onClick={onReset}
          title="Reset Zoom"
          style={{
            padding: '6px 12px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ⟲
        </button>
      </div>

      {/* Pan Controls */}
      <div className="pan-controls" style={{ display: 'flex', gap: '5px' }}>
        <button
          onClick={onPanLeft}
          title="Pan Left"
          style={{
            padding: '6px 12px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ◀
        </button>
        <button
          onClick={onPanRight}
          title="Pan Right"
          style={{
            padding: '6px 12px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ▶
        </button>
      </div>

      {/* Ruler Tool */}
      <div className="ruler-control">
        <button
          onClick={onToggleRuler}
          title="Toggle Ruler (Shift+Drag to use)"
          style={{
            padding: '6px 12px',
            backgroundColor: showRuler ? '#ff00ff' : '#333',
            color: showRuler ? '#fff' : '#888',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          📏 {showRuler ? 'ON' : 'Ruler'}
        </button>
      </div>

      {/* Filter Button */}
      <div className="filter-control">
        <button
          onClick={onFilter}
          title="Apply Filter"
          style={{
            padding: '6px 12px',
            backgroundColor: '#006600',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🔍 Filter
        </button>
      </div>

      {/* Channel Selection */}
      <div className="channel-selection" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#888', fontSize: '12px' }}>Channels:</span>
        <button
          onClick={handleSelectAll}
          style={{
            padding: '4px 8px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          All
        </button>
        <button
          onClick={handleSelectNone}
          style={{
            padding: '4px 8px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          None
        </button>
      </div>
    </div>
  );
};

export default WaveformControls;
