/**
 * Input to create a line for record section display
 */
export interface CreateRecordSectionLineParams {
    /** Array representing data. */
    data: number[];
    /** Displacement of waveform */
    distance: number;
    /** Range of x values for camera */
    cameraXRange: number;
    /** Left value of camera */
    defaultCameraLeft: number;
}
/**
 * Creates a record section position buffer
 *
 * @param params
 */
export declare const createRecordSectionPositionBuffer: (params: CreateRecordSectionLineParams) => Float32Array;
//# sourceMappingURL=create-record-section-line.d.ts.map