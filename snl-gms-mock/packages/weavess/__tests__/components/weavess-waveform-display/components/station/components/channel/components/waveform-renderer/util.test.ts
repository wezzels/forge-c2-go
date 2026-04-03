/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { WeavessTypes } from '@gms/weavess-core';

import { doDataSegmentsMatch } from '../../../../../../../../../src/ts/components/weavess-waveform-display/components/station/components/channel/components/waveform-renderer/util';

describe('WaveformRenderer util', () => {
  describe('doDataSegmentsMatch', () => {
    it('should return true for matching claim check data segments', () => {
      const segA = {
        data: {
          id: '123',
          startTimeSecs: 0,
          endTimeSecs: 10,
          sampleRate: 1,
          values: [1, 2, 3],
          domainTimeRange: { start: 0, end: 10 }
        }
      };

      const segB = {
        data: {
          id: '123',
          startTimeSecs: 0,
          endTimeSecs: 10,
          sampleRate: 1,
          values: [4, 5, 6],
          domainTimeRange: { start: 0, end: 10 }
        }
      };

      const result = doDataSegmentsMatch(segA, segB);

      expect(result).toBe(true);
    });

    it('should return false for non-matching claim check data segments', () => {
      const segA = {
        data: {
          id: '123',
          startTimeSecs: 0,
          endTimeSecs: 10,
          sampleRate: 1,
          values: [1, 2, 3],
          domainTimeRange: { start: 0, end: 10 }
        }
      };

      const segB = {
        data: {
          id: '456',
          startTimeSecs: 0,
          endTimeSecs: 10,
          sampleRate: 1,
          values: [4, 5, 6],
          domainTimeRange: { start: 0, end: 10 }
        }
      };

      const result = doDataSegmentsMatch(segA, segB);

      expect(result).toBe(false);
    });

    it('should return true for referentially equal non-claim check data segments', () => {
      const segA = {
        data: {
          values: [1, 2, 3]
        }
      };

      const segB = segA;

      const result = doDataSegmentsMatch(
        segA as WeavessTypes.DataSegment,
        segB as WeavessTypes.DataSegment
      );

      expect(result).toBe(true);
    });

    it('should return false for non-matching non-claim check data segments', () => {
      const segA = {
        data: {
          values: [1, 2, 3]
        }
      };

      const segB = {
        data: {
          values: [4, 5, 6]
        }
      };

      const result = doDataSegmentsMatch(
        segA as WeavessTypes.DataSegment,
        segB as WeavessTypes.DataSegment
      );

      expect(result).toBe(false);
    });
  });
});
