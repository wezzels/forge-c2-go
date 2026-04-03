import React, { useRef, useEffect, useState, useCallback } from 'react';

interface WezzelosEmbedProps {
  src?: string;
  width?: string;
  height?: string;
  onMessage?: (event: MessageEvent) => void;
  onEventSelect?: (eventId: string) => void;
  onStationSelect?: (stationId: string) => void;
  onDetectionSelect?: (detectionId: string) => void;
  token?: string;
  className?: string;
}

/**
 * Wezzelos Embed Component
 * 
 * Embeds GMS Mock UI within Wezzelos dashboard using iframe.
 * Provides communication between parent and iframe via postMessage API.
 */
export const WezzelosEmbed: React.FC<WezzelosEmbedProps> = ({
  src = 'http://10.0.0.117:3001',
  width = '100%',
  height = '100%',
  onMessage,
  onEventSelect,
  onStationSelect,
  onDetectionSelect,
  token,
  className
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Construct URL with token if provided
  const embedUrl = token ? `${src}?token=${token}` : src;

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Only accept messages from expected origin
      const expectedOrigin = new URL(src).origin;
      if (event.origin !== expectedOrigin) {
        return;
      }

      // Handle different message types
      const { type, payload } = event.data || {};

      switch (type) {
        case 'READY':
          setIsReady(true);
          setIsLoading(false);
          break;

        case 'EVENT_SELECTED':
          onEventSelect?.(payload.eventId);
          break;

        case 'STATION_SELECTED':
          onStationSelect?.(payload.stationId);
          break;

        case 'DETECTION_SELECTED':
          onDetectionSelect?.(payload.detectionId);
          break;

        default:
          onMessage?.(event);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [src, onMessage, onEventSelect, onStationSelect, onDetectionSelect]);

  // Send command to iframe
  const sendCommand = useCallback((type: string, payload: any) => {
    if (iframeRef.current?.contentWindow) {
      const expectedOrigin = new URL(src).origin;
      iframeRef.current.contentWindow.postMessage({ type, payload }, expectedOrigin);
    }
  }, [src]);

  // Public API methods
  const selectEvent = useCallback((eventId: string) => {
    sendCommand('SELECT_EVENT', { eventId });
  }, [sendCommand]);

  const selectStation = useCallback((stationId: string) => {
    sendCommand('SELECT_STATION', { stationId });
  }, [sendCommand]);

  const selectDetection = useCallback((detectionId: string) => {
    sendCommand('SELECT_DETECTION', { detectionId });
  }, [sendCommand]);

  const updateTimeRange = useCallback((startTime: number, endTime: number) => {
    sendCommand('UPDATE_TIME_RANGE', { startTime, endTime });
  }, [sendCommand]);

  const refresh = useCallback(() => {
    sendCommand('REFRESH', {});
  }, [sendCommand]);

  return (
    <div className={`wezzelos-embed ${className || ''}`} style={{ width, height, position: 'relative' }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#888',
          fontSize: '14px'
        }}>
          Loading GMS Mock UI...
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: isLoading ? 'none' : 'block'
        }}
        title="GMS Mock UI"
        allow="geolocation; microphone; camera"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
};

export default WezzelosEmbed;
