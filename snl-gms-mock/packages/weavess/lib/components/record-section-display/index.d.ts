import React from 'react';
import * as THREE from 'three';
import { RpcProvider } from 'worker-rpc';
import type { RecordSectionState } from './types';
export declare const workerRpc: RpcProvider;
/**
 * RecordSection
 */
export declare class RecordSection extends React.Component<unknown, RecordSectionState> {
    /** Canvas reference */
    canvasRef: HTMLCanvasElement | null;
    /** Three web gl render */
    renderer: THREE.WebGLRenderer;
    /** Three Scene */
    scene: THREE.Scene;
    /** Three.OrthographicCamera */
    camera: THREE.OrthographicCamera;
    private readonly containerStyle;
    private readonly recordSectionStyle;
    private readonly canvasStyle;
    /** Constant for 180 degrees */
    private readonly ONE_HUNDRED_EIGHTY_DEGREES;
    /** Constant for calculating Km to Degrees */
    private readonly KM_TO_DEGREES;
    /** Magic 200 */
    private readonly MAGIC_TWO_HUNDRED;
    /** Magic 400 */
    private readonly MAGIC_FOUR_HUNDRED;
    /** The pixel height of the canvas known to the render/painting, not the height of the actual canvas div. */
    private readonly logicalCanvasHeight;
    /** Each waveform has the Y axis quantized and scaled to fit within 800 logical pixels. */
    private readonly logicalWaveformHeight;
    /** Default camera left */
    private readonly defaultCameraLeft;
    /**  Default camera right */
    private readonly defaultCameraRight;
    /** Web worker */
    private readonly workerRpc;
    /**
     * Kilometers to Degrees
     *
     * @param km kilometer to convert to degrees
     *
     * @returns result of kilometers to degrees
     */
    kilometersToDegrees: (km: number) => number;
    /**
     * Min array returner
     *
     * @param arr input array
     *
     * @returns min value in array
     */
    arrayMin: (arr: number[]) => number;
    /**
     * Max array returner
     *
     * @param arr input array
     *
     * @returns max value of array
     */
    arrayMax: (arr: number[]) => number;
    numericSortAsc: (a: number, b: number) => number;
    /**
     * Constructor
     *
     * @param props RecordSection props
     */
    constructor(props: unknown);
    render(): JSX.Element;
    componentDidMount(): void;
    initialize(): void;
    /**
     * Update the display. If 'clear' is false, then the data in this.state.options.data is painted on the canvas.
     * If 'clear' is true, then the canvas is cleared.
     *
     * @param clear clear flag
     */
    update(clear: boolean): void;
    /**
     * Given an array of integers that correspond to the Y values of a waveform and the degree distance from the origin,
     * convert the original Y values into new record section Y coordinate.
     *
     * @param waveformYArray waveform Y array
     * @param distanceDegrees distance degrees
     *
     * @returns Object {yArr, yMax, yMedian, Ymin}
     */
    convertWaveformYToCanvasY(waveformYArray: number[], distanceDegrees: number): {
        yArr: number[];
        yMax: number;
        yMedian: number;
        yMin: number;
    };
    /**
     * Load data
     *
     * @param waveformArray  data
     */
    loadData(waveformArray: any[]): Promise<void>;
    animate(): void;
    updateSize(): void;
    /**
     * Adds waveform data, used for late arriving data
     *
     * @param options configurations as any[]
     * @param delayed isDelayed as boolean
     */
    addWaveformArray(options: any[], delayed: boolean): void;
    stopRender(): void;
    resumeRender(): void;
}
//# sourceMappingURL=index.d.ts.map