import React, { useRef, useEffect } from 'react';

interface SpectrogramProps {
  data?: number[][];
  sampleRate?: number;
  windowSize?: number;
  overlap?: number;
  minFreq?: number;
  maxFreq?: number;
  startTime?: number;
  endTime?: number;
  width?: number;
  height?: number;
  colorScale?: 'jet' | 'viridis' | 'hot';
  showAxes?: boolean;
  showColorbar?: boolean;
}

/**
 * Spectrogram Display Component
 * 
 * Displays spectrogram (time-frequency representation) of seismic data.
 * Shows power spectral density as color-coded intensity.
 */
export const SpectrogramDisplay: React.FC<SpectrogramProps> = ({
  data,
  sampleRate = 20,
  windowSize = 256,
  overlap = 0.5,
  minFreq = 0,
  maxFreq = 10,
  startTime = 0,
  endTime = 100,
  width = 600,
  height = 300,
  colorScale = 'jet',
  showAxes = true,
  showColorbar = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Color scale function (Jet colormap)
  const jetColor = (value: number): string => {
    // value: 0 to 1
    const r = Math.min(255, Math.max(0, value < 0.5 ? 0 : (value - 0.5) * 2 * 255));
    const g = Math.min(255, Math.max(0, value < 0.25 ? value * 4 * 255 : (value < 0.75 ? 255 : (1 - value) * 4 * 255)));
    const b = Math.min(255, Math.max(0, value < 0.5 ? 255 : (1 - (value - 0.5) * 2) * 255));
    return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
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
    const margin = { top: 30, right: showColorbar ? 60 : 20, bottom: 50, left: 60 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    // Generate synthetic spectrogram if no data
    const generateSpectrogram = (): number[][] => {
      const numTimeBins = 100;
      const numFreqBins = 50;
      const spectrogram: number[][] = [];

      for (let t = 0; t < numTimeBins; t++) {
        const freqRow: number[] = [];
        for (let f = 0; f < numFreqBins; f++) {
          // Simulate frequency content with time-varying components
          const time = t / numTimeBins;
          const freq = (f / numFreqBins) * maxFreq;

          // Background noise
          let power = 0.1 + Math.random() * 0.1;

          // Add some frequency peaks
          // Low frequency content (background noise)
          if (freq < 2) {
            power += 0.5 * Math.exp(-freq);
          }

          // Time-varying signal (simulated earthquake)
          if (time > 0.3 && time < 0.7) {
            // P-wave arrival (broad frequency)
            if (time < 0.4) {
              power += 0.8 * Math.exp(-Math.pow(freq - 3, 2) / 2);
            }
            // S-wave arrival (lower frequency)
            if (time > 0.4 && time < 0.6) {
              power += 0.9 * Math.exp(-Math.pow(freq - 1.5, 2) / 1);
            }
            // Surface waves (very low frequency)
            if (time > 0.5) {
              power += 0.7 * Math.exp(-Math.pow(freq - 0.5, 2) / 0.5);
            }
          }

          freqRow.push(Math.min(1, power));
        }
        spectrogram.push(freqRow);
      }

      return spectrogram;
    };

    const spectrogramData = data || generateSpectrogram();
    const numTimeBins = spectrogramData.length;
    const numFreqBins = spectrogramData[0]?.length || 0;

    // Draw spectrogram
    const pixelWidth = plotWidth / numTimeBins;
    const pixelHeight = plotHeight / numFreqBins;

    for (let t = 0; t < numTimeBins; t++) {
      for (let f = 0; f < numFreqBins; f++) {
        const power = spectrogramData[t][f];
        ctx.fillStyle = jetColor(power);
        ctx.fillRect(
          margin.left + t * pixelWidth,
          margin.top + (numFreqBins - 1 - f) * pixelHeight,
          pixelWidth + 0.5,
          pixelHeight + 0.5
        );
      }
    }

    // Draw axes
    if (showAxes) {
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1;

      // Time axis
      const numTimeLabels = 5;
      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      for (let i = 0; i <= numTimeLabels; i++) {
        const x = margin.left + (i / numTimeLabels) * plotWidth;
        const timeVal = startTime + (i / numTimeLabels) * (endTime - startTime);
        ctx.beginPath();
        ctx.moveTo(x, margin.top);
        ctx.lineTo(x, height - margin.bottom);
        ctx.stroke();
        ctx.fillText(Math.round(timeVal) + 's', x, height - margin.bottom + 15);
      }

      // Frequency axis
      ctx.textAlign = 'right';
      const numFreqLabels = 5;
      for (let i = 0; i <= numFreqLabels; i++) {
        const y = margin.top + (i / numFreqLabels) * plotHeight;
        const freqVal = maxFreq - (i / numFreqLabels) * (maxFreq - minFreq);
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(width - margin.right, y);
        ctx.stroke();
        ctx.fillText(freqVal.toFixed(1) + ' Hz', margin.left - 5, y + 3);
      }

      // Axis labels
      ctx.fillStyle = '#888';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Time', width / 2, height - 10);
      
      ctx.save();
      ctx.translate(15, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Frequency (Hz)', 0, 0);
      ctx.restore();
    }

    // Draw colorbar
    if (showColorbar) {
      const colorbarX = width - margin.right + 10;
      const colorbarHeight = plotHeight;
      
      for (let i = 0; i < colorbarHeight; i++) {
        const value = 1 - i / colorbarHeight;
        ctx.fillStyle = jetColor(value);
        ctx.fillRect(colorbarX, margin.top + i, 15, 1);
      }

      // Colorbar labels
      ctx.fillStyle = '#888';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('High', colorbarX + 18, margin.top + 10);
      ctx.fillText('Low', colorbarX + 18, margin.top + colorbarHeight - 5);
    }

    // Title
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Spectrogram', margin.left, 18);

    // Add phase labels
    ctx.fillStyle = '#ff8800';
    ctx.font = '10px sans-serif';
    ctx.fillText('P', margin.left + (0.35 * plotWidth), margin.top - 5);
    ctx.fillText('S', margin.left + (0.5 * plotWidth), margin.top - 5);
  }, [data, sampleRate, windowSize, overlap, minFreq, maxFreq, startTime, endTime, width, height, colorScale, showAxes, showColorbar]);

  return (
    <div className="spectrogram-display">
      <canvas ref={canvasRef} style={{ width, height }} />
      
      {/* Legend for phases */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#1a1a2e',
        borderRadius: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#ff4444'
          }} />
          <span style={{ color: '#888', fontSize: '11px' }}>High Power</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#0044ff'
          }} />
          <span style={{ color: '#888', fontSize: '11px' }}>Low Power</span>
        </div>
        <div style={{ color: '#ff8800', fontSize: '11px' }}>
          P-wave, S-wave phases marked
        </div>
      </div>
    </div>
  );
};

export default SpectrogramDisplay;
