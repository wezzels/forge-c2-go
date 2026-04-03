export declare enum StationType {
    SEISMIC_3_COMPONENT = "SEISMIC_3_COMPONENT",
    SEISMIC_1_COMPONENT = "SEISMIC_1_COMPONENT",
    SEISMIC_ARRAY = "SEISMIC_ARRAY",
    HYDROACOUSTIC = "HYDROACOUSTIC",
    HYDROACOUSTIC_ARRAY = "HYDROACOUSTIC_ARRAY",
    INFRASOUND = "INFRASOUND",
    INFRASOUND_ARRAY = "INFRASOUND_ARRAY",
    WEATHER = "WEATHER",
    UNKNOWN = "UNKNOWN"
}
export interface Location {
    latitude: number;
    longitude: number;
    depthKm: number;
    elevationKm: number;
}
export interface Station {
    name: string;
    type: StationType;
    description: string;
    effectiveAt: number;
    effectiveUntil?: number;
    location: Location;
    channelGroups: ChannelGroup[];
}
export interface ChannelGroup {
    name: string;
    description: string;
    effectiveAt: number;
    effectiveUntil?: number;
    location: Location;
    type: ChannelGroupType;
    channels: Channel[];
}
export declare enum ChannelGroupType {
    PROCESSING_GROUP = "PROCESSING_GROUP",
    SITE_GROUP = "SITE_GROUP",
    PHYSICAL_SITE = "PHYSICAL_SITE"
}
export interface Channel {
    name: string;
    description: string;
    effectiveAt: number;
    effectiveUntil?: number;
    location: Location;
    channelType: string;
    response: Response;
}
export interface Response {
    calibrationFactor: number;
    calibrationPeriodSec: number;
    calibrationTimeShift: number;
    effectiveAt: number;
}
//# sourceMappingURL=station.d.ts.map