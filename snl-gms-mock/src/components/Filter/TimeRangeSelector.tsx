import React from 'react';

interface TimeRangeSelectorProps {
  startTime: number;
  endTime: number;
  onChange: (startTime: number, endTime: number) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  startTime,
  endTime,
  onChange
}) => {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(new Date(e.target.value).getTime() / 1000, endTime);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(startTime, new Date(e.target.value).getTime() / 1000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toISOString().slice(0, 16);
  };

  return (
    <div className="time-range-selector" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <div>
        <label style={{
          color: '#888',
          display: 'block',
          marginBottom: '5px',
          fontSize: '12px'
        }}>
          Start Time
        </label>
        <input
          type="datetime-local"
          value={formatDate(startTime)}
          onChange={handleStartChange}
          style={{
            padding: '8px',
            backgroundColor: '#0f0f23',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '4px'
          }}
        />
      </div>
      <div>
        <label style={{
          color: '#888',
          display: 'block',
          marginBottom: '5px',
          fontSize: '12px'
        }}>
          End Time
        </label>
        <input
          type="datetime-local"
          value={formatDate(endTime)}
          onChange={handleEndChange}
          style={{
            padding: '8px',
            backgroundColor: '#0f0f23',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '4px'
          }}
        />
      </div>
    </div>
  );
};

export default TimeRangeSelector;
