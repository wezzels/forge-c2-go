/**
 * WebSocket Client for real-time updates
 * 
 * Provides real-time communication with GMS Simulator
 * for events, detections, and waveform updates.
 */

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
}

export interface WebSocketSubscription {
  id: string;
  type: string;
  callback: (data: any) => void;
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private subscriptions: Map<string, WebSocketSubscription> = new Map();
  private messageQueue: WebSocketMessage[] = [];
  private connectionState: ConnectionState = 'disconnected';
  private onStateChange?: (state: ConnectionState) => void;

  constructor(url: string) {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connectionState = 'connecting';
      this.onStateChange?.(this.connectionState);

      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          this.connectionState = 'connected';
          this.reconnectAttempts = 0;
          this.onStateChange?.(this.connectionState);
          
          // Send queued messages
          while (this.messageQueue.length > 0) {
            const msg = this.messageQueue.shift();
            this.send(msg!);
          }
          
          // Resubscribe to all subscriptions
          this.subscriptions.forEach((sub) => {
            this.subscribe(sub.type, sub.callback);
          });
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          this.connectionState = 'error';
          this.onStateChange?.(this.connectionState);
          reject(error);
        };

        this.ws.onclose = () => {
          this.connectionState = 'disconnected';
          this.onStateChange?.(this.connectionState);
          this.attemptReconnect();
        };
      } catch (error) {
        this.connectionState = 'error';
        this.onStateChange?.(this.connectionState);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connectionState = 'disconnected';
    this.onStateChange?.(this.connectionState);
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(console.error);
    }, delay);
  }

  private handleMessage(message: WebSocketMessage): void {
    // Dispatch to subscribers
    this.subscriptions.forEach((sub) => {
      if (sub.type === message.type || sub.type === '*') {
        sub.callback(message.payload);
      }
    });
  }

  send(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue message for later
      this.messageQueue.push(message);
    }
  }

  subscribe(type: string, callback: (data: any) => void): string {
    const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const subscription: WebSocketSubscription = {
      id,
      type,
      callback
    };
    
    this.subscriptions.set(id, subscription);
    
    // Send subscription message to server
    this.send({
      type: 'subscribe',
      payload: { type },
      timestamp: Date.now()
    });
    
    return id;
  }

  unsubscribe(id: string): void {
    const sub = this.subscriptions.get(id);
    if (sub) {
      // Send unsubscription message to server
      this.send({
        type: 'unsubscribe',
        payload: { type: sub.type },
        timestamp: Date.now()
      });
      
      this.subscriptions.delete(id);
    }
  }

  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  setOnStateChange(callback: (state: ConnectionState) => void): void {
    this.onStateChange = callback;
  }

  // Convenience methods for common message types

  subscribeToEvents(callback: (event: any) => void): string {
    return this.subscribe('event_update', callback);
  }

  subscribeToDetections(callback: (detection: any) => void): string {
    return this.subscribe('detection_update', callback);
  }

  subscribeToWaveforms(callback: (waveform: any) => void): string {
    return this.subscribe('waveform_update', callback);
  }

  subscribeToStations(callback: (station: any) => void): string {
    return this.subscribe('station_update', callback);
  }

  // Request methods

  requestEvents(startTime: number, endTime: number): void {
    this.send({
      type: 'request_events',
      payload: { startTime, endTime },
      timestamp: Date.now()
    });
  }

  requestWaveform(stationId: string, channelId: string, startTime: number, endTime: number): void {
    this.send({
      type: 'request_waveform',
      payload: { stationId, channelId, startTime, endTime },
      timestamp: Date.now()
    });
  }
}

// Singleton instance
let wsClient: WebSocketClient | null = null;

export function getWebSocketClient(): WebSocketClient {
  if (!wsClient) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    const port = process.env.WS_PORT || '3000';
    const url = `${protocol}//${host}:${port}/ws`;
    wsClient = new WebSocketClient(url);
  }
  return wsClient;
}

export default WebSocketClient;
