import React from 'react';

interface ToolbarProps {
  onRefresh?: () => void;
  onCreateEvent?: () => void;
  onFilter?: () => void;
  onExport?: () => void;
  title: string;
  count?: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onRefresh,
  onCreateEvent,
  onFilter,
  onExport,
  title,
  count
}) => {
  return (
    <div className="toolbar" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: '#0f0f23',
      borderBottom: '1px solid #333'
    }}>
      <div className="toolbar-title" style={{ color: '#00ff00', fontSize: '14px' }}>
        {title} {count !== undefined && `(${count})`}
      </div>
      <div className="toolbar-actions" style={{ display: 'flex', gap: '10px' }}>
        {onCreateEvent && (
          <button
            onClick={onCreateEvent}
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
            + Create
          </button>
        )}
        {onFilter && (
          <button
            onClick={onFilter}
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
            🔍 Filter
          </button>
        )}
        {onRefresh && (
          <button
            onClick={onRefresh}
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
            ↻ Refresh
          </button>
        )}
        {onExport && (
          <button
            onClick={onExport}
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
            ↓ Export
          </button>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
