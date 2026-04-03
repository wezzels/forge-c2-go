import { isDataClaimCheck } from '@gms/weavess-core/lib/types';
/**
 * @param processedSegments A record mapping channel names to a map of data segments mapped to processed Float32ArrayData
 * @returns true if the processedSegments contain any waveforms
 */
export const doProcessedSegmentsHaveWaveformData = (processedSegments) => Object.values(processedSegments).some(dataSegFloat32ArrayMap => Array.from(dataSegFloat32ArrayMap.values()).some(float32ArrayData => float32ArrayData.float32Array.length > 0));
/**
 * Check if data segments are the same. For claim checks, this means comparing the id.
 * For non claim check data segments, this is a simple referential
 * comparison.
 *
 * @param segA the first DataSegment to check
 * @param segB the second DataSegment to check
 * @returns true if these are the same data segment
 */
export const doDataSegmentsMatch = (segA, segB) => {
    if (isDataClaimCheck(segA.data) && isDataClaimCheck(segB.data)) {
        return segA.data.id === segB.data.id;
    }
    return segA.data === segB.data;
};
//# sourceMappingURL=util.js.map