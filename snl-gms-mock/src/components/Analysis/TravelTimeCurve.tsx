import React, { useRef, useEffect } from 'react';

interface TravelTimeData {
  distance: number;
  pTime?: number;
  sTime?: number;
  pKm?: number;
  sKm?: number;
}

interface TravelTimeCurveProps {
  depth?: number;
  model?: 'iasp91' | 'ak135' | 'prem';
  width?: number;
  height?: number;
  showPhases?: ('P' | 'S')[];
}

export const TravelTimeCurve: React.FC<TravelTimeCurveProps> = ({
  depth = 0,
  model = 'iasp91',
  width = 500,
  height = 400,
  showPhases = ['P', 'S']
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const calculateTravelTimes = (): TravelTimeData[] => {
    const data: TravelTimeData[] = [];
    
    for (let dist = 0; dist <= 180; dist += 2) {
      const point: TravelTimeData = { distance: dist };
      
      const pVelocity = 8.1;
      const distKm = dist * 111.2;
      
      if (showPhases.includes('P')) {
        point.pTime = distKm / pVelocity + depth / 8.0;
        point.pKm = distKm;
      }
      
      const sVelocity = 4.5;
      if (showPhases.includes('S')) {
        point.sTime = distKm / sVelocity + depth / 4.5;
        point.sKm = distKm;
      }
      
      data.push(point);
    }
    
    return data;
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

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    const margin = { top: 40, right: 20, bottom: 50, left: 60 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const data = calculateTravelTimes();

    const xScale = (d: number) => margin.left + (d / 180) * plotWidth;
    const yScale = (t: number) => margin.top + plotHeight - (t / 2000) * plotHeight;

    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Travel Time Curve (depth: ' + depth + ' km)', margin.left, 25);

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;

    for (let t = 0; t <= 2000; t += 200) {
      const y = yScale(t);
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(width - margin.right, y);
      ctx.stroke();

      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(t + 's', margin.left - 5, y + 3);
    }

    for (let d = 0; d <= 180; d += 30) {
      const x = xScale(d);
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, height - margin.bottom);
      ctx.stroke();

      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d + '°', x, height - margin.bottom + 15);
    }

    ctx.fillStyle = '#888';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Distance (degrees)', width / 2, height - 10);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Travel Time (s)', 0, 0);
    ctx.restore();

    if (showPhases.includes('P')) {
      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      let started = false;
      for (const point of data) {
        if (point.pTime !== undefined) {
          const x = xScale(point.distance);
          const y = yScale(point.pTime);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
    }

    if (showPhases.includes('S')) {
      ctx.strokeStyle = '#44ff44';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      let started = false;
      for (const point of data) {
        if (point.sTime !== undefined) {
          const x = xScale(point.distance);
          const y = yScale(point.sTime);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
    }

    let legendY = margin.top + 10;
    const legendX = width - margin.right - 60;

    if (showPhases.includes('P')) {
      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(legendX, legendY);
      ctx.lineTo(legendX + 20, legendY);
      ctx.stroke();
      
      ctx.fillStyle = '#fff';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('P', legendX + 25, legendY + 3);
      legendY += 15;
    }

    if (showPhases.includes('S')) {
      ctx.strokeStyle = '#44ff44';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(legendX, legendY);
      ctx.lineTo(legendX + 20, legendY);
      ctx.stroke();
      
      ctx.fillStyle = '#fff';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('S', legendX + 25, legendY + 3);
    }
  }, [depth, model, width, height, showPhases]);

  return (
    <div className="travel-time-curve">
      <canvas ref={canvasRef} style={{ width, height }} />
      <div style={{ color: '#888', fontSize: '11px', marginTop: '5px', textAlign: 'center' }}>
        Model: {model.toUpperCase()}
      </div>
    </div>
  );
};

export default TravelTimeCurve;
