import { useEffect, useState, useCallback } from 'react';
import { WebSocketClient, ConnectionState } from './WebSocketClient';

export interface UseWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
  onMessage?: (type: string, payload: any) => void;
  onStateChange?: (state: ConnectionState) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { url, autoConnect = true, onMessage, onStateChange } = options;
  
  const [client, setClient] = useState<WebSocketClient | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');

  const connect = useCallback(() => {
    if (client) {
      client.connect();
    }
  }, [client]);

  const disconnect = useCallback(() => {
    if (client) {
      client.disconnect();
    }
  }, [client]);

  const subscribe = useCallback((type: string, callback: (data: any) => void) => {
    if (client) {
      return client.subscribe(type, callback);
    }
    return '';
  }, [client]);

  const unsubscribe = useCallback((id: string) => {
    if (client) {
      client.unsubscribe(id);
    }
  }, [client]);

  const send = useCallback((type: string, payload: any) => {
    if (client) {
      client.send({ type, payload, timestamp: Date.now() });
    }
  }, [client]);

  useEffect(() => {
    const wsUrl = url || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:3000/ws`;
    const ws = new WebSocketClient(wsUrl);
    
    ws.setOnStateChange((state) => {
      setConnectionState(state);
      onStateChange?.(state);
    });
    
    if (autoConnect) {
      ws.connect().catch(console.error);
    }
    
    setClient(ws);
    
    return () => {
      ws.disconnect();
    };
  }, [url, autoConnect, onStateChange]);

  return {
    client,
    connectionState,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    send,
    isConnected: connectionState === 'connected'
  };
}

export default useWebSocket;
