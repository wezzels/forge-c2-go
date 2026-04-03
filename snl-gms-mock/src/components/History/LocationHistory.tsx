import React, { useState } from 'react';

interface LocationUpdate {
  timestamp: number;
  latitude: number;
  longitude: number;
  depth: number;
  magnitude?: number;
  source: string;
}

interface LocationHistoryProps {
  history: LocationUpdate[];
  onRevert?: (index: number) => void;
  onCompare?: (indices: number[]) => void;
}

export const LocationHistory: React.FC<LocationHistoryProps> = ({
  history,
  onRevert,
  onCompare
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIndices, setCompareIndices] = useState<Set<number>>(new Set());

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const toggleCompare = (index: number) => {
    const newSet = new Set(compareIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setCompareIndices(newSet);
  };

  const handleCompare = () => {
    if (onCompare && compareIndices.size === 2) {
      onCompare(Array.from(compareIndices));
    }
  };

  return (
    <div className="location-history" style={{
      backgroundColor: '#1a1a2e',
      padding: '15px',
      borderRadius: '8px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ color: '#00ff00', margin: 0 }}>Location History</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setCompareMode(!compareMode)}
            style={{
              padding: '6px 12px',
              backgroundColor: compareMode ? '#006600' : '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {compareMode ? 'Cancel' : 'Compare'}
          </button>
          {compareMode && compareIndices.size === 2 && (
            <button
              onClick={handleCompare}
              style={{
                padding: '6px 12px',
                backgroundColor: '#0066ff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Compare Selected
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
          No location history available
        </div>
      ) : (
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {history.slice().reverse().map((update, index) => {
            const originalIndex = history.length - 1 - index;
            const isSelected = selectedIndex === originalIndex;
            const isCompareSelected = compareIndices.has(originalIndex);

            return (
              <div
                key={originalIndex}
                onClick={() => compareMode ? toggleCompare(originalIndex) : setSelectedIndex(originalIndex)}
                style={{
                  padding: '10px',
                  marginBottom: '5px',
                  backgroundColor: isCompareSelected ? '#0f3f0f' : isSelected ? '#333' : '#0f0f23',
                  border: isCompareSelected ? '1px solid #00ff00' : isSelected ? '1px solid #00ff00' : '1px solid #222',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ color: '#888', fontSize: '11px' }}>
                    {formatTime(update.timestamp)}
                  </span>
                  <span style={{ color: '#666', fontSize: '11px' }}>
                    {update.source}
                  </span>
                </div>
                <div style={{ color: '#fff', fontSize: '12px' }}>
                  <span>{update.latitude.toFixed(4)}°, {update.longitude.toFixed(4)}°</span>
                  <span style={{ color: '#888', marginLeft: '10px' }}>
                    {update.depth.toFixed(1)} km
                  </span>
                  {update.magnitude !== undefined && (
                    <span style={{ color: '#ff8800', marginLeft: '10px' }}>
                      M{update.magnitude.toFixed(1)}
                    </span>
                  )}
                </div>
                {onRevert && originalIndex < history.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRevert(originalIndex);
                    }}
                    style={{
                      marginTop: '5px',
                      padding: '4px 8px',
                      backgroundColor: '#333',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '10px'
                    }}
                  >
                    Revert to this
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LocationHistory;
