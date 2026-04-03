import { WebSocketClient, ConnectionState } from './WebSocketClient';
export interface UseWebSocketOptions {
    url?: string;
    autoConnect?: boolean;
    onMessage?: (type: string, payload: any) => void;
    onStateChange?: (state: ConnectionState) => void;
}
export declare function useWebSocket(options?: UseWebSocketOptions): {
    client: WebSocketClient | null;
    connectionState: ConnectionState;
    connect: () => void;
    disconnect: () => void;
    subscribe: (type: string, callback: (data: any) => void) => string;
    unsubscribe: (id: string) => void;
    send: (type: string, payload: any) => void;
    isConnected: boolean;
};
export default useWebSocket;
//# sourceMappingURL=useWebSocket.d.ts.map