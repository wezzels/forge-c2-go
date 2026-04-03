import React, { useRef, useEffect, useState } from 'react';

interface MagnitudePoint {
  timestamp: number;
  magnitude: number;
  type: 'mb' | 'ms' | 'ml' | 'mw';
  station?: string;
}

interface MagnitudeTimeSeriesProps {
  data: MagnitudePoint[];
  width?: number;
  height?: number;
  showLegend?: boolean;
  title?: string;
}

export const MagnitudeTimeSeries: React.FC<MagnitudeTimeSeriesProps> = ({
  data,
  width = 600,
  height = 300,
  showLegend = true,
  title = 'Magnitude Time Series'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<MagnitudePoint | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');

  const colors = {
    mb: '#00ff88',
    ms: '#00ccff',
    ml: '#ff8800',
    mw: '#ff00ff'
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    // Clear
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    // Margins
    const margin = { top: 40, right: 20, bottom: 50, left: 50 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    // Filter by type
    const filteredData = selectedType === 'all' 
      ? data 
      : data.filter(d => d.type === selectedType);

    if (filteredData.length === 0) {
      ctx.fillStyle = '#666';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No data available', width / 2, height / 2);
      return;
    }

    // Scales
    const timeExtent = [
      Math.min(...filteredData.map(d => d.timestamp)),
      Math.max(...filteredData.map(d => d.timestamp))
    ];
    const magExtent = [
      Math.min(...filteredData.map(d => d.magnitude)),
      Math.max(...filteredData.map(d => d.magnitude))
    ];

    // Add padding to mag extent
    magExtent[0] = Math.max(0, magExtent[0] - 0.5);
    magExtent[1] = Math.min(10, magExtent[1] + 0.5);

    const xScale = (t: number) => margin.left + (t - timeExtent[0]) / (timeExtent[1] - timeExtent[0]) * plotWidth;
    const yScale = (m: number) => margin.top + plotHeight - (m - magExtent[0]) / (magExtent[1] - magExtent[0]) * plotHeight;

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;

    // Horizontal grid (magnitude)
    for (let m = Math.ceil(magExtent[0]); m <= Math.floor(magExtent[1]); m++) {
      const y = yScale(m);
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(width - margin.right, y);
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(m.toString(), margin.left - 5, y + 3);
    }

    // Vertical grid (time)
    const timeLabels = 5;
    for (let i = 0; i < timeLabels; i++) {
      const t = timeExtent[0] + (timeExtent[1] - timeExtent[0]) * i / (timeLabels - 1);
      const x = xScale(t);
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, height - margin.bottom);
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(new Date(t * 1000).toLocaleDateString(), x, height - margin.bottom + 15);
    }

    // Draw title
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(title, margin.left, 20);

    // Draw data points by type
    const types = selectedType === 'all' 
      ? (['mb', 'ms', 'ml', 'mw'] as const)
      : [selectedType as 'mb' | 'ms' | 'ml' | 'mw'];

    for (const type of types) {
      const typeData = filteredData.filter(d => d.type === type);
      if (typeData.length === 0) continue;

      const color = colors[type];

      // Draw points
      ctx.fillStyle = color;
      for (const point of typeData) {
        const x = xScale(point.timestamp);
        const y = yScale(point.magnitude);

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Draw line connecting points
      if (typeData.length > 1) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        const sorted = [...typeData].sort((a, b) => a.timestamp - b.timestamp);
        ctx.moveTo(xScale(sorted[0].timestamp), yScale(sorted[0].magnitude));
        
        for (let i = 1; i < sorted.length; i++) {
          ctx.lineTo(xScale(sorted[i].timestamp), yScale(sorted[i].magnitude));
        }
        ctx.stroke();
      }
    }

    // Draw legend
    if (showLegend) {
      let legendX = width - margin.right - 80;
      let legendY = margin.top + 10;

      for (const type of ['mb', 'ms', 'ml', 'mw'] as const) {
        ctx.fillStyle = colors[type];
        ctx.beginPath();
        ctx.arc(legendX, legendY, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(type.toUpperCase(), legendX + 10, legendY + 3);

        legendY += 15;
      }
    }
  }, [data, width, height, selectedType, showLegend, title]);

  return (
    <div className="magnitude-time-series">
      <canvas
        ref={canvasRef}
        style={{ width, height }}
        onMouseLeave={() => setHoveredPoint(null)}
      />
      
      {/* Type selector */}
      <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
        {['all', 'mb', 'ms', 'ml', 'mw'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: '4px 8px',
              backgroundColor: selectedType === type ? '#006600' : '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {hoveredPoint && (
        <div style={{
          position: 'absolute',
          backgroundColor: '#333',
          padding: '5px',
          borderRadius: '3px',
          fontSize: '11px'
        }}>
          {hoveredPoint.type.toUpperCase()}: {hoveredPoint.magnitude.toFixed(2)}
          {hoveredPoint.station ? ' (' + hoveredPoint.station + ')' : ''}
        </div>
      )}
    </div>
  );
};

export default MagnitudeTimeSeries;
