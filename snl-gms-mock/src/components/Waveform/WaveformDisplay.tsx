import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { ChannelSegment, TimeRange } from '../../models/weavess';

interface SelectionWindow {
  startTime: number;
  endTime: number;
  color?: string;
  label?: string;
}

interface Marker {
  time: number;
  channel?: string;
  type: 'arrival' | 'pick' | 'theoretical' | 'selection' | 'uncertainty';
  color?: string;
  uncertainty?: number;
  label?: string;
}

interface WaveformDisplayProps {
  channelSegments: ChannelSegment[];
  startTime: number;
  endTime: number;
  height?: number;
  showLabels?: boolean;
  showTimeAxis?: boolean;
  showAmplitudeScale?: boolean;
  markers?: Marker[];
  selectionWindow?: SelectionWindow;
  showRuler?: boolean;
  onChannelSelect?: (channelId: string) => void;
  onMarkerClick?: (marker: Marker) => void;
  onTimeRangeChange?: (timeRange: TimeRange) => void;
  onSelectionChange?: (selection: SelectionWindow | null) => void;
  onWaveformRef?: (api: WaveformApi) => void;
  useWebGL?: boolean;
}

export interface WaveformApi {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  panLeft: () => void;
  panRight: () => void;
  setZoomLevel: (level: number) => void;
  setPanOffset: (offset: number) => void;
  setTimeRange: (start: number, end: number) => void;
  clearRuler: () => void;
}

export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  channelSegments,
  startTime,
  endTime,
  height = 400,
  showLabels = true,
  showTimeAxis = true,
  showAmplitudeScale = true,
  markers = [],
  selectionWindow,
  showRuler = false,
  onChannelSelect,
  onMarkerClick,
  onTimeRangeChange,
  onSelectionChange,
  onWaveformRef,
  useWebGL = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Zoom and pan state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState(0);
  
  // Ruler state
  const [rulerActive, setRulerActive] = useState(false);
  const [rulerStart, setRulerStart] = useState<{ x: number; y: number } | null>(null);
  const [rulerEnd, setRulerEnd] = useState<{ x: number; y: number } | null>(null);
  const [rulerDuration, setRulerDuration] = useState<number | null>(null);

  // Expose zoom/pan methods via callback
  useEffect(() => {
    if (onWaveformRef) {
      onWaveformRef({
        zoomIn: () => setZoomLevel(prev => Math.min(prev * 1.5, 10)),
        zoomOut: () => setZoomLevel(prev => Math.max(prev / 1.5, 0.1)),
        resetZoom: () => { setZoomLevel(1); setPanOffset(0); setRulerStart(null); setRulerEnd(null); },
        panLeft: () => {
          const timeRange = (endTime - startTime) / zoomLevel;
          setPanOffset(prev => Math.max(prev - timeRange * 0.2, -timeRange * 0.5));
        },
        panRight: () => {
          const timeRange = (endTime - startTime) / zoomLevel;
          setPanOffset(prev => Math.min(prev + timeRange * 0.2, timeRange * 0.5));
        },
        setZoomLevel: (level) => setZoomLevel(Math.max(0.1, Math.min(10, level))),
        setPanOffset: (offset) => setPanOffset(offset),
        setTimeRange: (start, end) => {
          const duration = end - start;
          setPanOffset(start - startTime);
          setZoomLevel((endTime - startTime) / duration);
        },
        clearRuler: () => { setRulerStart(null); setRulerEnd(null); setRulerDuration(null); }
      });
    }
  }, [onWaveformRef, startTime, endTime, zoomLevel, panOffset]);

  // Color palette for channels
  const getChannelColor = (index: number): string => {
    const colors = [
      '#00ff88', // Bright green
      '#00ccff', // Cyan
      '#ff8800', // Orange
      '#ff00ff', // Magenta
      '#ffff00', // Yellow
      '#00ffff', // Aqua
      '#ff4444', // Red
      '#44ff44', // Light green
      '#ff44ff', // Pink
      '#44ffff', // Light cyan
    ];
    return colors[index % colors.length];
  };

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || channelSegments.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const actualHeight = rect.height;
    
    // Calculate time range with zoom and pan
    const totalDuration = endTime - startTime;
    const zoomedDuration = totalDuration / zoomLevel;
    const effectiveStart = startTime + panOffset;
    const effectiveEnd = effectiveStart + zoomedDuration;

    // Calculate channel height
    const timeAxisHeight = showTimeAxis ? 30 : 0;
    const channelHeight = (actualHeight - timeAxisHeight) / channelSegments.length;

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, actualHeight);

    // Draw selection window (background)
    if (selectionWindow) {
      const x1 = ((selectionWindow.startTime - effectiveStart) / zoomedDuration) * width;
      const x2 = ((selectionWindow.endTime - effectiveStart) / zoomedDuration) * width;
      
      ctx.fillStyle = selectionWindow.color || 'rgba(0, 255, 0, 0.1)';
      ctx.fillRect(x1, 0, x2 - x1, actualHeight - timeAxisHeight);
      
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(x1, 0, x2 - x1, actualHeight - timeAxisHeight);
      ctx.setLineDash([]);
      
      if (selectionWindow.label) {
        ctx.fillStyle = '#00ff00';
        ctx.font = '11px monospace';
        ctx.fillText(selectionWindow.label, x1 + 5, 15);
      }
    }

    // Draw each channel with gradient fill
    channelSegments.forEach((segment, index) => {
      const yStart = index * channelHeight;
      const channelColor = getChannelColor(index);
      
      // Draw channel background with gradient
      const gradient = ctx.createLinearGradient(0, yStart, 0, yStart + channelHeight);
      gradient.addColorStop(0, index % 2 === 0 ? '#0f1523' : '#151a28');
      gradient.addColorStop(1, index % 2 === 0 ? '#0a1020' : '#101520');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, yStart, width, channelHeight);

      // Draw channel separator
      ctx.strokeStyle = '#2a3a4a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, yStart + channelHeight);
      ctx.lineTo(width, yStart + channelHeight);
      ctx.stroke();

      // Draw channel label
      if (showLabels) {
        ctx.fillStyle = channelColor;
        ctx.font = 'bold 11px monospace';
        ctx.fillText(segment.name, 5, yStart + 14);
      }

      // Draw waveform
      if (segment.timeseries && segment.timeseries.length > 0) {
        const ts = segment.timeseries[0];
        const values = ts.values;
        const sampleRate = ts.sampleRate;
        const tsStartTime = ts.startTime;
        
        if (values && values.length > 0) {
          // Calculate points for the waveform
          const points: { x: number; y: number }[] = [];
          
          for (let i = 0; i < values.length; i++) {
            const sampleTime = tsStartTime + (i / sampleRate);
            if (sampleTime < effectiveStart || sampleTime > effectiveEnd) continue;

            const x = ((sampleTime - effectiveStart) / zoomedDuration) * width;
            const y = yStart + channelHeight / 2 - (values[i] * channelHeight * 0.35);
            points.push({ x, y });
          }

          if (points.length > 1) {
            // Draw filled area under waveform
            ctx.beginPath();
            ctx.moveTo(points[0].x, yStart + channelHeight / 2);
            points.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.lineTo(points[points.length - 1].x, yStart + channelHeight / 2);
            ctx.closePath();
            
            const fillGradient = ctx.createLinearGradient(0, yStart, 0, yStart + channelHeight);
            fillGradient.addColorStop(0, 'transparent');
            fillGradient.addColorStop(0.4, channelColor + '20');
            fillGradient.addColorStop(0.6, channelColor + '20');
            fillGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = fillGradient;
            ctx.fill();
            
            // Draw waveform line
            ctx.beginPath();
            ctx.strokeStyle = channelColor;
            ctx.lineWidth = 1.5;
            points.forEach((p, i) => {
              if (i === 0) ctx.moveTo(p.x, p.y);
              else ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
            
            // Draw glow effect
            ctx.beginPath();
            ctx.strokeStyle = channelColor + '40';
            ctx.lineWidth = 4;
            ctx.filter = 'blur(2px)';
            points.forEach((p, i) => {
              if (i === 0) ctx.moveTo(p.x, p.y);
              else ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
            ctx.filter = 'none';
          }
        }
      }

      // Draw markers for this channel
      const channelMarkers = markers.filter(m => 
        m.channel === segment.name || m.channel === segment.id || !m.channel
      );
      
      channelMarkers.forEach(marker => {
        if (marker.time < effectiveStart || marker.time > effectiveEnd) return;
        
        const x = ((marker.time - effectiveStart) / zoomedDuration) * width;
        
        // Draw uncertainty range if present
        if (marker.uncertainty && marker.type === 'uncertainty') {
          const halfWidth = (marker.uncertainty / zoomedDuration) * width;
          ctx.fillStyle = 'rgba(255, 165, 0, 0.2)';
          ctx.fillRect(x - halfWidth, yStart, halfWidth * 2, channelHeight);
        }
        
        // Draw marker line
        ctx.beginPath();
        ctx.strokeStyle = marker.color || '#ff0000';
        ctx.lineWidth = 2;
        ctx.moveTo(x, yStart);
        ctx.lineTo(x, yStart + channelHeight);
        ctx.stroke();
        
        // Draw marker label
        if (marker.label) {
          ctx.fillStyle = marker.color || '#ff0000';
          ctx.font = '9px monospace';
          ctx.fillText(marker.label, x + 2, yStart + 12);
        }
      });
    });

    // Draw ruler if active
    if (rulerActive && rulerStart && rulerEnd) {
      ctx.strokeStyle = '#ff00ff';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(rulerStart.x, rulerStart.y);
      ctx.lineTo(rulerEnd.x, rulerEnd.y);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Calculate duration
      const duration = Math.abs(rulerEnd.x - rulerStart.x) / width * zoomedDuration;
      
      // Draw duration label
      ctx.fillStyle = '#ff00ff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('Duration: ' + duration.toFixed(3) + 's', rulerEnd.x + 5, rulerEnd.y);
      
      // Draw start/end times
      const startTimeAtX = effectiveStart + (rulerStart.x / width) * zoomedDuration;
      const endTimeAtX = effectiveStart + (rulerEnd.x / width) * zoomedDuration;
      const startStr = new Date(startTimeAtX * 1000).toISOString().slice(11, 19);
      const endStr = new Date(endTimeAtX * 1000).toISOString().slice(11, 19);
      ctx.fillText(startStr + ' - ' + endStr, rulerEnd.x + 5, rulerEnd.y + 15);
    }

    // Draw time axis
    if (showTimeAxis) {
      const axisY = actualHeight - timeAxisHeight;
      
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, axisY, width, timeAxisHeight);
      
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, axisY);
      ctx.lineTo(width, axisY);
      ctx.stroke();

      // Time ticks
      const timeStep = Math.max(1, Math.ceil(zoomedDuration / 10));
      ctx.fillStyle = '#888';
      ctx.font = '10px monospace';
      
      for (let t = Math.ceil(effectiveStart); t < effectiveEnd; t += timeStep) {
        const x = ((t - effectiveStart) / zoomedDuration) * width;
        
        ctx.beginPath();
        ctx.moveTo(x, axisY);
        ctx.lineTo(x, axisY + 5);
        ctx.stroke();
        
        if (timeStep <= 60) {
          const timeStr = new Date(t * 1000).toISOString().slice(11, 19);
          ctx.fillText(timeStr, x + 2, axisY + 18);
        }
      }
    }

    // Draw amplitude scale
    if (showAmplitudeScale) {
      ctx.fillStyle = '#888';
      ctx.font = '10px monospace';
      ctx.fillText('Amp', 5, 15);
      
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(5, 20);
      ctx.lineTo(5, 40);
      ctx.stroke();
      
      ctx.fillText('+1', 10, 25);
      ctx.fillText('0', 10, 33);
      ctx.fillText('-1', 10, 40);
    }

    // Draw zoom info
    ctx.fillStyle = '#888';
    ctx.font = '11px monospace';
    ctx.fillText('Zoom: ' + zoomLevel.toFixed(1) + 'x', 5, actualHeight - timeAxisHeight - 5);
    
    const startStr = new Date(effectiveStart * 1000).toISOString().slice(11, 19);
    const endStr = new Date(effectiveEnd * 1000).toISOString().slice(11, 19);
    ctx.fillText('Time: ' + startStr + ' - ' + endStr, 80, actualHeight - timeAxisHeight - 5);

    // Draw ruler indicator if enabled
    if (showRuler) {
      ctx.fillStyle = rulerActive ? '#ff00ff' : '#888';
      ctx.font = '11px monospace';
      ctx.fillText('[Shift+Drag for Ruler]', width - 150, actualHeight - timeAxisHeight - 5);
    }

    // Draw ruler result if available
    if (rulerDuration !== null && !rulerActive) {
      ctx.fillStyle = '#ff00ff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('Last: ' + rulerDuration.toFixed(3) + 's', width - 120, 20);
    }

    if (onTimeRangeChange) {
      onTimeRangeChange({ startTime: effectiveStart, endTime: effectiveEnd });
    }
  }, [channelSegments, startTime, endTime, zoomLevel, panOffset, height, showLabels, showTimeAxis, showAmplitudeScale, markers, selectionWindow, rulerActive, rulerStart, rulerEnd, rulerDuration, showRuler, onTimeRangeChange]);

  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  useEffect(() => {
    const handleResize = () => drawWaveform();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawWaveform]);

  // Handle mouse events for ruler
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (showRuler && e.shiftKey) {
      setRulerActive(true);
      setRulerStart({ x, y });
      setRulerEnd(null);
      setRulerDuration(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!rulerActive || !rulerStart) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRulerEnd({ x, y });
    
    // Calculate duration in real-time
    const width = rect.width;
    const totalDuration = endTime - startTime;
    const zoomedDuration = totalDuration / zoomLevel;
    const duration = Math.abs(x - rulerStart.x) / width * zoomedDuration;
    setRulerDuration(duration);
  };

  const handleMouseUp = () => {
    if (rulerActive && rulerStart && rulerEnd) {
      // Keep ruler displayed after mouse up
      const width = canvasRef.current?.getBoundingClientRect().width || 1;
      const totalDuration = endTime - startTime;
      const zoomedDuration = totalDuration / zoomLevel;
      const duration = Math.abs(rulerEnd.x - rulerStart.x) / width * zoomedDuration;
      setRulerDuration(duration);
    }
    setRulerActive(false);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (rulerActive) return;
    
    const canvas = canvasRef.current;
    if (!canvas || !onChannelSelect) return;

    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    const timeAxisHeight = showTimeAxis ? 30 : 0;
    const channelHeight = (canvas.height - timeAxisHeight) / channelSegments.length;
    const channelIndex = Math.floor(y / channelHeight);
    
    if (channelIndex >= 0 && channelIndex < channelSegments.length) {
      onChannelSelect(channelSegments[channelIndex].id);
    }
  };

  if (channelSegments.length === 0) {
    return (
      <div style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a1a',
        color: '#888'
      }}>
        No waveform data available
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height, position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

export default WaveformDisplay;
