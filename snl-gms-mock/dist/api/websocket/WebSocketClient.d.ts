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
export declare class WebSocketClient {
    private ws;
    private url;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private reconnectDelay;
    private subscriptions;
    private messageQueue;
    private connectionState;
    private onStateChange?;
    constructor(url: string);
    connect(): Promise<void>;
    disconnect(): void;
    private attemptReconnect;
    private handleMessage;
    send(message: WebSocketMessage): void;
    subscribe(type: string, callback: (data: any) => void): string;
    unsubscribe(id: string): void;
    getConnectionState(): ConnectionState;
    setOnStateChange(callback: (state: ConnectionState) => void): void;
    subscribeToEvents(callback: (event: any) => void): string;
    subscribeToDetections(callback: (detection: any) => void): string;
    subscribeToWaveforms(callback: (waveform: any) => void): string;
    subscribeToStations(callback: (station: any) => void): string;
    requestEvents(startTime: number, endTime: number): void;
    requestWaveform(stationId: string, channelId: string, startTime: number, endTime: number): void;
}
export declare function getWebSocketClient(): WebSocketClient;
export default WebSocketClient;
//# sourceMappingURL=WebSocketClient.d.ts.map