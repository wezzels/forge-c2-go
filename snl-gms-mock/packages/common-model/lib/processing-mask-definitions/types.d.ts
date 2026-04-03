import type { ProcessingMask, ProcessingOperation } from '../channel-segment/types';
import type { QcSegmentCategory, QcSegmentType } from '../qc-segment';
import type { Channel } from '../station-definitions/channel-definitions';
export declare enum TaperFunction {
    BLACKMAN = "BLACKMAN",
    COSINE = "COSINE",
    HAMMING = "HAMMING",
    HANNING = "HANNING",
    PARZEN = "PARZEN",
    WELCH = "WELCH"
}
export interface TaperDefinition {
    taperLengthSamples: number;
    taperFunction: TaperFunction;
}
export interface QcSegmentCategoryAndType {
    category: QcSegmentCategory;
    type?: QcSegmentType;
}
export interface ProcessingMaskDefinition {
    processingOperation: ProcessingOperation;
    appliedQcSegmentCategoryAndTypes: QcSegmentCategoryAndType[];
    maskedSegmentMergeThreshold: number;
    taperDefinition?: TaperDefinition;
}
export interface ProcessingMasksByChannel {
    channel: Channel;
    processingMasks: ProcessingMask[];
}
/**
 * Validates that the object passed in is a  {@link ProcessingMaskDefinition}
 *
 * @throws If the object does not contain the mandatory fields to be a ProcessingMaskDefinition
 */
export declare function isProcessingMaskDefinition(processingDefinition: any): asserts processingDefinition is ProcessingMaskDefinition;
//# sourceMappingURL=types.d.ts.map