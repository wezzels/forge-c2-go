import type { WeavessTypes } from '@gms/weavess-core';
import type { Float32ArrayData } from './types';
/**
 * @param processedSegments A record mapping channel names to a map of data segments mapped to processed Float32ArrayData
 * @returns true if the processedSegments contain any waveforms
 */
export declare const doProcessedSegmentsHaveWaveformData: (processedSegments: Record<string, Map<WeavessTypes.DataSegment, Float32ArrayData>>) => boolean;
/**
 * Check if data segments are the same. For claim checks, this means comparing the id.
 * For non claim check data segments, this is a simple referential
 * comparison.
 *
 * @param segA the first DataSegment to check
 * @param segB the second DataSegment to check
 * @returns true if these are the same data segment
 */
export declare const doDataSegmentsMatch: (segA: WeavessTypes.DataSegment, segB: WeavessTypes.DataSegment) => boolean;
//# sourceMappingURL=util.d.ts.map