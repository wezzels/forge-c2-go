export declare const gatewayClient: import("axios").AxiosInstance;
export declare const healthCheck: () => Promise<any>;
export declare const getStations: (startTime: number, endTime: number) => Promise<any>;
export declare const getEvents: (startTime: number, endTime: number) => Promise<any>;
export declare const getEventStatus: (stageId: string, eventIds: string[]) => Promise<any>;
export declare const getSignalDetections: (startTime: number, endTime: number, stationIds: string[]) => Promise<any>;
export declare const getChannelSegments: (channelIds: string[], startTime: number, endTime: number) => Promise<any>;
export declare const getStageIntervals: (stageIds: string[], startTime: number, endTime: number) => Promise<any>;
//# sourceMappingURL=gateway.d.ts.map