export interface WezzelosMessage {
    type: string;
    payload: any;
}
/**
 * Hook for communicating with Wezzelos parent window
 *
 * Use this in GMS Mock UI to receive commands from Wezzelos.
 */
export declare function useWezzelosCommunication(options?: {
    onEventSelect?: (eventId: string) => void;
    onStationSelect?: (stationId: string) => void;
    onDetectionSelect?: (detectionId: string) => void;
    onTimeRangeUpdate?: (startTime: number, endTime: number) => void;
    onRefresh?: () => void;
}): {
    sendMessage: (type: string, payload: any) => void;
    notifyEventSelected: (eventId: string) => void;
    notifyStationSelected: (stationId: string) => void;
    notifyDetectionSelected: (detectionId: string) => void;
    notifyStateChange: (state: any) => void;
};
export default useWezzelosCommunication;
//# sourceMappingURL=useWezzelosCommunication.d.ts.map