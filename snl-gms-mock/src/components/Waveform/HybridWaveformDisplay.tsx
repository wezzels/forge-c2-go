import React, { useState, useEffect } from 'react';
import { WaveformDisplay, type WaveformApi } from './WaveformDisplay';
import { WebGLWaveformDisplay } from '../WaveformGL/WebGLWaveformDisplay';
import type { ChannelSegment } from '../../models/weavess';

interface Marker {
  time: number;
  channel?: string;
  type: 'arrival' | 'pick' | 'theoretical' | 'selection' | 'uncertainty';
  color?: string;
  label?: string;
}

interface HybridWaveformDisplayProps {
  channelSegments: ChannelSegment[];
  startTime: number;
  endTime: number;
  height?: number;
  showLabels?: boolean;
  showTimeAxis?: boolean;
  showAmplitudeScale?: boolean;
  markers?: Marker[];
  showRuler?: boolean;
  onChannelSelect?: (channelId: string) => void;
  onTimeRangeChange?: (timeRange: { startTime: number; endTime: number }) => void;
  onWaveformRef?: (api: WaveformApi) => void;
  preferWebGL?: boolean;
}

export const HybridWaveformDisplay: React.FC<HybridWaveformDisplayProps> = ({
  channelSegments,
  startTime,
  endTime,
  height = 400,
  showLabels = true,
  showTimeAxis = true,
  showAmplitudeScale = true,
  markers = [],
  showRuler = false,
  onChannelSelect,
  onTimeRangeChange,
  onWaveformRef,
  preferWebGL = true
}) => {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setHasWebGL(!!gl);
  }, []);

  // Loading state
  if (hasWebGL === null) {
    return (
      <div style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a1a',
        color: '#888'
      }}>
        Checking WebGL support...
      </div>
    );
  }

  // Use WebGL if available and preferred (but Canvas 2D is more stable for now)
  // TODO: Enable WebGL when fully tested
  if (hasWebGL && preferWebGL && false) { // Disabled until fully tested
    return (
      <WebGLWaveformDisplay
        channelSegments={channelSegments}
        startTime={startTime}
        endTime={endTime}
        height={height}
        markers={markers}
        onWaveformRef={onWaveformRef}
      />
    );
  }

  // Fallback to Canvas 2D (currently always used)
  return (
    <WaveformDisplay
      channelSegments={channelSegments}
      startTime={startTime}
      endTime={endTime}
      height={height}
      showLabels={showLabels}
      showTimeAxis={showTimeAxis}
      showAmplitudeScale={showAmplitudeScale}
      markers={markers}
      showRuler={showRuler}
      onChannelSelect={onChannelSelect}
      onTimeRangeChange={onTimeRangeChange}
      onWaveformRef={onWaveformRef}
    />
  );
};

export default HybridWaveformDisplay;
