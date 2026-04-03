export declare enum FilterDefinitionUsage {
    DETECTION = "DETECTION",
    FK = "FK",
    ONSET = "ONSET",
    AMPLITUDE = "AMPLITUDE"
}
export interface FilterList {
    name: string;
    defaultFilterIndex: number;
    filters: Filter[];
}
export interface Filter {
    id: string;
    name: string;
    description?: string;
    filterType: FilterType;
    sampleRate: number;
    lowFrequencyHz?: number;
    highFrequencyHz?: number;
    order?: number;
    passBandType?: PassBandType;
}
export declare enum FilterType {
    BANDPASS = "BANDPASS",
    HIGHPASS = "HIGHPASS",
    LOWPASS = "LOWPASS"
}
export declare enum PassBandType {
    BUTTERWORTH = "BUTTERWORTH",
    CHEBYSHEV = "CHEBYSHEV",
    BESSEL = "BESSEL"
}
export interface FilterDefinition {
    id: string;
    name: string;
    description: string;
    filterType: FilterType;
    sampleRate: number;
    lowFrequencyHz?: number;
    highFrequencyHz?: number;
    order: number;
    passBandType: PassBandType;
}
//# sourceMappingURL=filter.d.ts.map