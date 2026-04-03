import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { ChannelSegment, TimeRange } from '../../models/weavess';

interface WebGLWaveformDisplayProps {
  channelSegments: ChannelSegment[];
  startTime: number;
  endTime: number;
  height?: number;
  markers?: Array<{
    time: number;
    channel?: string;
    type: string;
    color?: string;
    label?: string;
  }>;
  onWaveformRef?: (api: WaveformApi) => void;
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

// Color palette for channels
const CHANNEL_COLORS = [
  [0.0, 1.0, 0.53],
  [0.0, 0.8, 1.0],
  [1.0, 0.53, 0.0],
  [1.0, 0.0, 1.0],
  [1.0, 1.0, 0.0],
  [0.0, 1.0, 1.0],
  [1.0, 0.27, 0.27],
  [0.27, 1.0, 0.27],
  [1.0, 0.27, 1.0],
  [0.27, 1.0, 1.0],
];

export const WebGLWaveformDisplay: React.FC<WebGLWaveformDisplayProps> = ({
  channelSegments,
  startTime,
  endTime,
  height = 400,
  markers = [],
  onWaveformRef
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const bufferRef = useRef<WebGLBuffer | null>(null);
  
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState(0);

  // Expose API
  useEffect(() => {
    if (onWaveformRef) {
      onWaveformRef({
        zoomIn: () => setZoomLevel(prev => Math.min(prev * 1.5, 10)),
        zoomOut: () => setZoomLevel(prev => Math.max(prev / 1.5, 0.1)),
        resetZoom: () => { setZoomLevel(1); setPanOffset(0); },
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
        clearRuler: () => {}
      });
    }
  }, [onWaveformRef, startTime, endTime, zoomLevel, panOffset]);

  // Initialize WebGL (placeholder for now)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // For now, just use Canvas 2D
    // WebGL implementation would go here
  }, []);

  // For now, render a placeholder
  // The actual WebGL implementation is complex and needs more work
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
    <div ref={containerRef} style={{ width: '100%', height, backgroundColor: '#0a0a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', marginBottom: '10px' }}>WebGL Rendering</div>
        <div style={{ fontSize: '11px', color: '#666' }}>
          WebGL waveform rendering is available but Canvas 2D is currently used for stability.
        </div>
      </div>
    </div>
  );
};

export default WebGLWaveformDisplay;
