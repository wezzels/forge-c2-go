import React, { useRef, useEffect } from 'react';

interface BeamParams {
  slowness: number;
  azimuth: number;
  startTime: number;
  endTime: number;
}

interface BeamVisualizationProps {
  waveformCount?: number;
  sampleRate?: number;
  beamParams?: BeamParams;
  width?: number;
  height?: number;
  showGrid?: boolean;
}

/**
 * Beam Visualization Component
 * 
 * Displays beam-formed waveforms showing the result of stacking
 * array data with time shifts to enhance signal-to-noise ratio.
 */
export const BeamVisualization: React.FC<BeamVisualizationProps> = ({
  waveformCount = 10,
  sampleRate = 20,
  beamParams,
  width = 600,
  height = 300,
  showGrid = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    const margin = { top: 30, right: 20, bottom: 40, left: 60 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 0.5;

      // Vertical grid (time)
      for (let t = 0; t <= 10; t++) {
        const x = margin.left + (t / 10) * plotWidth;
        ctx.beginPath();
        ctx.moveTo(x, margin.top);
        ctx.lineTo(x, height - margin.bottom);
        ctx.stroke();
      }

      // Horizontal grid (amplitude)
      for (let a = 0; a <= 4; a++) {
        const y = margin.top + (a / 4) * plotHeight;
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(width - margin.right, y);
        ctx.stroke();
      }
    }

    // Generate beam waveforms (simulated)
    const numSamples = 200;
    const numWaveforms = waveformCount;

    for (let w = 0; w < numWaveforms; w++) {
      const y = margin.top + (w / numWaveforms) * plotHeight;
      const amplitude = plotHeight / (numWaveforms * 2.5);

      ctx.strokeStyle = w === numWaveforms - 1 ? '#00ff00' : '#00ff88';
      ctx.lineWidth = w === numWaveforms - 1 ? 2 : 1;
      ctx.beginPath();

      for (let i = 0; i < numSamples; i++) {
        const x = margin.left + (i / numSamples) * plotWidth;
        
        // Generate synthetic waveform with time shift based on slowness
        const timeShift = beamParams 
          ? beamParams.slowness * (w / numWaveforms) * 0.5 * Math.cos((beamParams.azimuth - 90) * Math.PI / 180)
          : 0;
        
        // Synthetic signal (sine wave with noise)
        const frequency = 2 + w * 0.1;
        const phase = (i / numSamples) * Math.PI * 2 * frequency + timeShift;
        const signal = Math.sin(phase) * 0.8 + Math.random() * 0.2 - 0.1;
        
        const yVal = y - signal * amplitude;

        if (i === 0) {
          ctx.moveTo(x, yVal);
        } else {
          ctx.lineTo(x, yVal);
        }
      }
      ctx.stroke();

      // Waveform label
      if (w === numWaveforms - 1) {
        ctx.fillStyle = '#00ff00';
      } else {
        ctx.fillStyle = '#666';
      }
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('CH' + (w + 1), margin.left - 5, y + 3);
    }

    // Draw beam (bottom waveform - stacked)
    const beamY = height - margin.bottom - 20;
    ctx.strokeStyle = '#ff8800';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < numSamples; i++) {
      const x = margin.left + (i / numSamples) * plotWidth;
      
      // Stacked signal (enhanced SNR)
      let stackedSignal = 0;
      for (let w = 0; w < numWaveforms; w++) {
        const frequency = 2 + w * 0.1;
        const phase = (i / numSamples) * Math.PI * 2 * frequency;
        stackedSignal += Math.sin(phase) * 0.8;
      }
      stackedSignal /= numWaveforms;

      const yVal = beamY - stackedSignal * 30;

      if (i === 0) {
        ctx.moveTo(x, yVal);
      } else {
        ctx.lineTo(x, yVal);
      }
    }
    ctx.stroke();

    // Beam label
    ctx.fillStyle = '#ff8800';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('BEAM', margin.left - 5, beamY + 4);

    // Time axis
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    for (let t = 0; t <= 10; t++) {
      const x = margin.left + (t / 10) * plotWidth;
      ctx.fillText((t * 10) + 's', x, height - margin.bottom + 15);
    }
    ctx.fillText('Time', width / 2, height - 5);

    // Title
    if (beamParams) {
      ctx.fillStyle = '#00ff00';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        'Beam: S=' + beamParams.slowness.toFixed(1) + ' s/°, Az=' + beamParams.azimuth.toFixed(0) + '°',
        margin.left, 18
      );
    }
  }, [waveformCount, sampleRate, beamParams, width, height, showGrid]);

  return (
    <div className="beam-visualization">
      <canvas ref={canvasRef} style={{ width, height }} />
      {beamParams && (
        <div style={{
          display: 'flex',
          gap: '20px',
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#1a1a2e',
          borderRadius: '4px'
        }}>
          <div>
            <div style={{ color: '#888', fontSize: '11px' }}>Slowness</div>
            <div style={{ color: '#00ff00', fontSize: '14px' }}>
              {beamParams.slowness.toFixed(2)} s/°
            </div>
          </div>
          <div>
            <div style={{ color: '#888', fontSize: '11px' }}>Azimuth</div>
            <div style={{ color: '#00ff00', fontSize: '14px' }}>
              {beamParams.azimuth.toFixed(0)}°
            </div>
          </div>
          <div>
            <div style={{ color: '#888', fontSize: '11px' }}>Channels</div>
            <div style={{ color: '#00ff00', fontSize: '14px' }}>
              {waveformCount}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeamVisualization;
