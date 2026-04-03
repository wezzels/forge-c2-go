import React, { useRef, useEffect, useState } from 'react';

interface FKPoint {
  slowness: number;
  azimuth: number;
  power: number;
  fstat: number;
}

interface FKSpectrumProps {
  data?: FKPoint[];
  width?: number;
  height?: number;
  minSlowness?: number;
  maxSlowness?: number;
  onSelection?: (slowness: number, azimuth: number) => void;
  selectedSlowness?: number;
  selectedAzimuth?: number;
  colorScale?: 'jet' | 'viridis' | 'hot' | 'cool';
}

/**
 * FK Spectrum Display Component
 * 
 * Displays frequency-wavenumber (f-k) analysis results showing
 * power spectral density as a function of slowness and azimuth.
 * 
 * Used for array processing to determine back azimuth and slowness
 * of detected signals.
 */
export const FKSpectrum: React.FC<FKSpectrumProps> = ({
  data,
  width = 400,
  height = 400,
  minSlowness = 0,
  maxSlowness = 20,
  onSelection,
  selectedSlowness,
  selectedAzimuth,
  colorScale = 'jet'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ slowness: number; azimuth: number; power: number } | null>(null);

  // Color scale functions
  const jetColor = (value: number): string => {
    // value: 0 to 1
    const r = Math.min(255, Math.max(0, value < 0.5 ? 0 : (value - 0.5) * 2 * 255));
    const g = Math.min(255, Math.max(0, value < 0.25 ? value * 4 * 255 : (value < 0.75 ? 255 : (1 - value) * 4 * 255)));
    const b = Math.min(255, Math.max(0, value < 0.5 ? 255 : (1 - (value - 0.5) * 2) * 255));
    return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
  };

  const getColor = (value: number): string => {
    switch (colorScale) {
      case 'jet':
        return jetColor(value);
      default:
        return jetColor(value);
    }
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

    // Center and radius for polar plot
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    // Draw grid circles (slowness contours)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    
    const slownessSteps = [5, 10, 15, 20];
    for (const s of slownessSteps) {
      if (s <= maxSlowness) {
        const r = (s / maxSlowness) * radius;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        ctx.stroke();

        // Label
        ctx.fillStyle = '#888';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(s + ' s/°', centerX, centerY - r - 3);
      }
    }

    // Draw azimuth lines (every 30°)
    for (let az = 0; az < 360; az += 30) {
      const angle = (az - 90) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
      ctx.stroke();

      // Label
      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const labelR = radius + 15;
      ctx.fillText(az + '°', centerX + labelR * Math.cos(angle), centerY + labelR * Math.sin(angle));
    }

    // Draw FK data (if provided)
    if (data && data.length > 0) {
      // Find power range
      const powers = data.map(d => d.power);
      const minPower = Math.min(...powers);
      const maxPower = Math.max(...powers);
      const powerRange = maxPower - minPower || 1;

      for (const point of data) {
        const r = (point.slowness / maxSlowness) * radius;
        const angle = (point.azimuth - 90) * Math.PI / 180;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);

        const normalizedPower = (point.power - minPower) / powerRange;
        ctx.fillStyle = getColor(normalizedPower);
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    } else {
      // Draw sample FK pattern (Gaussian peak)
      const drawSampleFK = () => {
        // Simulate a detection at specific slowness/azimuth
        const peakSlowness = selectedSlowness || 10;
        const peakAzimuth = selectedAzimuth || 45;

        for (let az = 0; az < 360; az += 2) {
          for (let slow = 0; slow <= maxSlowness; slow += 0.5) {
            // Gaussian response
            const azDiff = Math.min(Math.abs(az - peakAzimuth), 360 - Math.abs(az - peakAzimuth));
            const slowDiff = Math.abs(slow - peakSlowness);
            const power = Math.exp(-(azDiff * azDiff / 100 + slowDiff * slowDiff / 50));

            const r = (slow / maxSlowness) * radius;
            const angle = (az - 90) * Math.PI / 180;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);

            ctx.fillStyle = getColor(power);
            ctx.fillRect(x - 1, y - 1, 3, 3);
          }
        }
      };
      drawSampleFK();
    }

    // Draw selection point
    if (selectedSlowness !== undefined && selectedAzimuth !== undefined) {
      const r = (selectedSlowness / maxSlowness) * radius;
      const angle = (selectedAzimuth - 90) * Math.PI / 180;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);

      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x - 12, y);
      ctx.lineTo(x + 12, y);
      ctx.moveTo(x, y - 12);
      ctx.lineTo(x, y + 12);
      ctx.stroke();
    }

    // Draw title
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('FK Spectrum', 10, 20);

    // Draw colorbar
    const colorbarX = width - 30;
    const colorbarHeight = 100;
    for (let i = 0; i < colorbarHeight; i++) {
      const value = 1 - i / colorbarHeight;
      ctx.fillStyle = getColor(value);
      ctx.fillRect(colorbarX, 40 + i, 15, 1);
    }
    ctx.fillStyle = '#fff';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('High', colorbarX - 2, 48);
    ctx.fillText('Low', colorbarX - 2, 40 + colorbarHeight);
  }, [data, width, height, maxSlowness, selectedSlowness, selectedAzimuth, colorScale]);

  // Handle click for selection
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSelection) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= radius) {
      const slowness = (distance / radius) * maxSlowness;
      let azimuth = Math.atan2(dx, dy) * 180 / Math.PI + 90;
      if (azimuth < 0) azimuth += 360;

      onSelection(slowness, azimuth);
    }
  };

  // Handle mouse move for hover
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= radius) {
      const slowness = (distance / radius) * maxSlowness;
      let azimuth = Math.atan2(dx, dy) * 180 / Math.PI + 90;
      if (azimuth < 0) azimuth += 360;

      setHoveredPoint({ slowness, azimuth, power: 0 });
    } else {
      setHoveredPoint(null);
    }
  };

  return (
    <div className="fk-spectrum">
      <canvas
        ref={canvasRef}
        style={{ width, height, cursor: onSelection ? 'crosshair' : 'default' }}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredPoint(null)}
      />
      
      {hoveredPoint && (
        <div style={{
          position: 'absolute',
          backgroundColor: '#333',
          padding: '5px 10px',
          borderRadius: '3px',
          fontSize: '11px',
          color: '#fff',
          pointerEvents: 'none'
        }}>
          S: {hoveredPoint.slowness.toFixed(1)} s/°, Az: {hoveredPoint.azimuth.toFixed(0)}°
        </div>
      )}

      {selectedSlowness !== undefined && selectedAzimuth !== undefined && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#1a1a2e',
          borderRadius: '4px'
        }}>
          <div style={{ color: '#888', fontSize: '11px' }}>Selected</div>
          <div style={{ color: '#00ff00', fontSize: '14px' }}>
            Slowness: {selectedSlowness.toFixed(2)} s/°
          </div>
          <div style={{ color: '#00ff00', fontSize: '14px' }}>
            Azimuth: {selectedAzimuth.toFixed(0)}°
          </div>
        </div>
      )}
    </div>
  );
};

export default FKSpectrum;
