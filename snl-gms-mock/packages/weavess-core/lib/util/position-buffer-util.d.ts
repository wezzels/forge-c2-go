import type { TypedArray } from 'd3';
import type { DataBySampleRate, TimeRange, TimeValuePair } from '../types';
/**
 * Input required to create the position buffer
 */
export interface CreatePositionBufferBySampleRateParams {
    /** Minimum GL value */
    glMin: number;
    /** Maximum GL value */
    glMax: number;
    /** Array containing the vertices */
    values: number[];
    /** Start Time Seconds formatted for display */
    displayStartTimeSecs: number;
    /** End Time Seconds formatted for display */
    displayEndTimeSecs: number;
    /** Start Time in seconds */
    startTimeSecs: number;
    /** End Time in seconds */
    endTimeSecs: number;
    /** End Time in seconds */
    sampleRate: number;
}
/**
 * Input required to create the position buffer
 */
export interface CreatePositionBufferByTimeParams {
    /** Minimum GL value */
    glMin: number;
    /** Maximum GL value */
    glMax: number;
    values: TimeValuePair[];
    /** Start Time Seconds formatted for display */
    displayStartTimeSecs: number;
    /** End Time Seconds formatted for display */
    displayEndTimeSecs: number;
}
/**
 * Convert data in the dataBySampleRate format into a TypedArray or number[] position buffer of the format: [x,y,x,y,...]
 *
 * @param dataBySampleRate the data to convert
 * @param domain the visible domain in Epoch Seconds, in the form [startTimeSec, endTimeSec]
 * @param glMin Gl unit scale range minimum
 * @param glMax Gl unit scale range maximum
 * @param ArrayConstructor The constructor for the output array desired Float32Array, Float64Array, Array, etc.
 *
 * @throws an error if the dataBySampleRate or its values are undefined
 *
 * @returns A TypedArray or number[] of vertices
 */
export declare const toPositionBuffer: <T extends number[] | TypedArray>(dataBySampleRate: DataBySampleRate, domain: TimeRange, glMin: number, glMax: number, ArrayConstructor: any) => T;
/**
 * Convert {time,value}[] to a TypedArray or number[] position buffer of [x,y,x,y,...].
 *
 * @param params
 * @param ArrayConstructor The constructor for the output array desired Float32Array, Float64Array, Array, etc.
 *
 * @returns A TypedArray or number[] of vertices
 */
export declare const positionBufferForDataByTime: <T extends number[] | TypedArray>(params: CreatePositionBufferByTimeParams, ArrayConstructor: any) => T;
/**
 * Convert data in the dataBySampleRate format into a Float32Array position buffer of the format: [x,y,x,y,...]
 *
 * @param dataBySampleRate the data to convert
 * @param domain the visible domain in Epoch Seconds, in the form [startTimeSec, endTimeSec]
 *
 * @throws an error if the dataBySampleRate or its values are undefined
 *
 * @returns A promise of a Float32Array of vertices
 */
export declare const convertToPositionBuffer: (dataBySampleRate: DataBySampleRate, domain: TimeRange, glMin?: number, glMax?: number) => Float32Array;
/**
 * Calculate the min, max for the provided position buffer.
 *
 * @param data formatted buffer of the format x y x y x y x y...
 * @param startIndex inclusive
 * @param endIndex inclusive
 * @returns the min and max values y in the positionBuffer
 */
export declare const getBoundsForPositionBuffer: (data: Float32Array | Float64Array, startIndex?: number, endIndex?: number) => {
    max: number;
    maxSecs: number;
    min: number;
    minSecs: number;
    mean: number;
};
/**
 * Convert number[] + startTime + sample rate into a 2D position buffer of [x,y,x,y,...].
 *
 * @param params [[ CreatePositionBufferParams ]]
 *
 * @returns A Float32Array of vertices
 */
export declare const createPositionBufferForDataBySampleRate: ({ values, displayStartTimeSecs, displayEndTimeSecs, startTimeSecs, endTimeSecs, sampleRate, glMin, glMax }: CreatePositionBufferBySampleRateParams) => Float32Array;
/**
 * Convert {time,value}[] to position buffer of [x,y,x,y,...].
 *
 * @param data the data by time
 * @param params
 * @returns A Float32Array of vertices
 */
export declare const createPositionBufferForDataByTime: (params: CreatePositionBufferByTimeParams) => Float32Array;
//# sourceMappingURL=position-buffer-util.d.ts.map