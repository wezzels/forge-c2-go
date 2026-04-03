export interface WebSocketMessage {
    type: string;
    data: any;
}
export declare class WebSocketClient {
    private ws;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private reconnectDelay;
    private messageHandlers;
    connect(): Promise<void>;
    private reconnect;
    subscribe(messageType: string, handler: (data: any) => void): void;
    unsubscribe(messageType: string): void;
    send(message: WebSocketMessage): void;
    disconnect(): void;
}
export declare const wsClient: WebSocketClient;
//# sourceMappingURL=websocket.d.ts.map