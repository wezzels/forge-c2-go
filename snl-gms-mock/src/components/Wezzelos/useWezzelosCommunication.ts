import { useEffect, useCallback } from 'react';

export interface WezzelosMessage {
  type: string;
  payload: any;
}

/**
 * Hook for communicating with Wezzelos parent window
 * 
 * Use this in GMS Mock UI to receive commands from Wezzelos.
 */
export function useWezzelosCommunication(options: {
  onEventSelect?: (eventId: string) => void;
  onStationSelect?: (stationId: string) => void;
  onDetectionSelect?: (detectionId: string) => void;
  onTimeRangeUpdate?: (startTime: number, endTime: number) => void;
  onRefresh?: () => void;
} = {}) {
  // Notify parent that we're ready
  useEffect(() => {
    // Send ready message to parent
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'READY', payload: {} }, '*');
    }
  }, []);

  // Handle messages from parent
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Validate origin if needed
      // For now, accept all messages (for development)
      
      const { type, payload } = event.data || {};

      switch (type) {
        case 'SELECT_EVENT':
          options.onEventSelect?.(payload.eventId);
          break;

        case 'SELECT_STATION':
          options.onStationSelect?.(payload.stationId);
          break;

        case 'SELECT_DETECTION':
          options.onDetectionSelect?.(payload.detectionId);
          break;

        case 'UPDATE_TIME_RANGE':
          options.onTimeRangeUpdate?.(payload.startTime, payload.endTime);
          break;

        case 'REFRESH':
          options.onRefresh?.();
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [options]);

  // Send message to parent
  const sendMessage = useCallback((type: string, payload: any) => {
    if (window.parent !== window) {
      window.parent.postMessage({ type, payload }, '*');
    }
  }, []);

  // Notify parent of event selection
  const notifyEventSelected = useCallback((eventId: string) => {
    sendMessage('EVENT_SELECTED', { eventId });
  }, [sendMessage]);

  // Notify parent of station selection
  const notifyStationSelected = useCallback((stationId: string) => {
    sendMessage('STATION_SELECTED', { stationId });
  }, [sendMessage]);

  // Notify parent of detection selection
  const notifyDetectionSelected = useCallback((detectionId: string) => {
    sendMessage('DETECTION_SELECTED', { detectionId });
  }, [sendMessage]);

  // Notify parent of any state change
  const notifyStateChange = useCallback((state: any) => {
    sendMessage('STATE_CHANGE', state);
  }, [sendMessage]);

  return {
    sendMessage,
    notifyEventSelected,
    notifyStationSelected,
    notifyDetectionSelected,
    notifyStateChange
  };
}

export default useWezzelosCommunication;
