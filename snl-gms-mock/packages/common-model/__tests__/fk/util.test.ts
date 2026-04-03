/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TimeseriesType } from '../../src/ts/channel-segment/types';
import type { FkSpectraCOI } from '../../src/ts/fk/types';
import {
  degreeToKmApproximate,
  getIndexOfReferenceTime,
  kmToDegreesApproximate
} from '../../src/ts/fk/util';

describe('FK Utils', () => {
  describe('km to degree conversions', () => {
    test('kmToDegreesApproximate', () => {
      const km = 125;
      expect(kmToDegreesApproximate(km)).toMatchInlineSnapshot(`1.124152007398413`);
    });

    test('degreeToKmApproximate', () => {
      const degrees = 0.3;
      expect(degreeToKmApproximate(degrees)).toMatchInlineSnapshot(`33.35847799336762`);
    });
  });
  describe('getIndexOfReferenceTime', () => {
    const simpleFkSpectra: FkSpectraCOI = {
      type: TimeseriesType.WAVEFORM,
      startTime: 0,
      endTime: 2000,
      sampleRateHz: 0.001, // one sample per 1000 seconds
      sampleCount: 2,
      samples: [] // not needed for these tests
    };
    it('should return 0 for an instant before the start time', () => {
      expect(getIndexOfReferenceTime(simpleFkSpectra, -1)).toBe(0);
    });

    it('should round to the last index for an instant after the end time', () => {
      expect(getIndexOfReferenceTime(simpleFkSpectra, 2001)).toBe(1);
    });

    it('should return 0 for the start time', () => {
      expect(getIndexOfReferenceTime(simpleFkSpectra, 0)).toBe(0);
    });

    it('should return the last index for the end time', () => {
      expect(getIndexOfReferenceTime(simpleFkSpectra, 2000)).toBe(1);
    });

    it('should return round to a whole number index for a time not matching a spectrum sample reference time', () => {
      expect(getIndexOfReferenceTime(simpleFkSpectra, 1)).toBe(0);
      expect(getIndexOfReferenceTime(simpleFkSpectra, 400)).toBe(0);
      expect(getIndexOfReferenceTime(simpleFkSpectra, 999)).toBe(1);
      expect(getIndexOfReferenceTime(simpleFkSpectra, 1000)).toBe(1);
      expect(getIndexOfReferenceTime(simpleFkSpectra, 1999)).toBe(1);
    });

    it('should handle non-integer step sizes correctly', () => {
      const index = getIndexOfReferenceTime(simpleFkSpectra, 1450);
      expect(index).toBe(1);
    });

    it('should log a warning if the time provided does not align with the spectra reference times', () => {
      const spy = jest.spyOn(console, 'warn');
      getIndexOfReferenceTime(simpleFkSpectra, 1);
      expect(spy).toHaveBeenCalledWith(
        'Invalid reference time. Reference time minus lead must perfectly align with the spectrum step start times. This suggests something is wrong with the time passed in.'
      );
    });
  });
});
