/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Units } from '../../../src/ts/common/types';
import type {
  Calibration,
  FrequencyAmplitudePhase,
  Response
} from '../../../src/ts/station-definitions';
import {
  calibrationSchema,
  frequencyAmplitudePhaseSchema,
  responseSchema
} from '../../../src/ts/station-definitions/response-definitions/schema';

describe('response-definitions-schema', () => {
  describe('frequencyAmplitudePhaseSchema', () => {
    it('should validate a valid FrequencyAmplitudePhase object', () => {
      const validData: FrequencyAmplitudePhase = {
        id: 'df1203d8-0039-4e36-ab2a-dbb436d8e9ab',
        frequencies: [0.001],
        amplitudePhaseResponses: [
          {
            amplitude: { value: 0.000014254, standardDeviation: 0, units: Units.DEGREES },
            phase: { value: 350.140599, standardDeviation: 0, units: Units.DEGREES }
          }
        ],
        nominalCalibration: {
          calibrationFactor: { value: 0, standardDeviation: 0, units: Units.UNITLESS },
          calibrationPeriodSec: 0,
          calibrationTimeShift: 0
        },
        nominalSampleRateHz: 0
      };

      expect(frequencyAmplitudePhaseSchema.safeParse(validData).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidData = {
        frequencies: [1, 10, 100],
        amplitudeResponseUnits: [Units.DECIBELS, Units.DECIBELS, Units.DECIBELS],
        amplitudeResponse: [0.1, 0.2, 0.3],
        // Missing amplitudeResponseStdDev
        phaseResponseUnits: [Units.RADIANS, Units.RADIANS, Units.RADIANS],
        phaseResponse: [0.1, 0.2, 0.3],
        phaseResponseStdDev: [0.01, 0.02, 0.03],
        id: 'response1'
      };

      expect(frequencyAmplitudePhaseSchema.safeParse(invalidData).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidData = {
        frequencies: [1, 10, 100],
        amplitudeResponseUnits: [Units.DECIBELS, Units.DECIBELS, Units.DECIBELS],
        amplitudeResponse: [0.1, 0.2, 0.3],
        amplitudeResponseStdDev: [0.01, 0.02, 0.03],
        phaseResponseUnits: [Units.RADIANS, Units.RADIANS, Units.RADIANS],
        phaseResponse: [0.1, 0.2, 0.3],
        phaseResponseStdDev: [0.01, 0.02, 0.03],
        id: 123 // id should be a string
      };

      expect(frequencyAmplitudePhaseSchema.safeParse(invalidData).success).toBeFalsy();
    });

    it('should validate an object without optional fields', () => {
      const validData: FrequencyAmplitudePhase = {
        id: 'df1203d8-0039-4e36-ab2a-dbb436d8e9ab',
        frequencies: [0.001],
        amplitudePhaseResponses: [
          {
            amplitude: { value: 0.000014254, standardDeviation: 0, units: Units.DEGREES },
            phase: { value: 350.140599, standardDeviation: 0, units: Units.DEGREES }
          }
        ],
        nominalCalibration: {
          calibrationFactor: { value: 0, standardDeviation: 0, units: Units.UNITLESS },
          calibrationPeriodSec: 0,
          calibrationTimeShift: 0
        },
        nominalSampleRateHz: 0
      };

      expect(frequencyAmplitudePhaseSchema.safeParse(validData).success).toBeTruthy();
    });
  });

  describe('calibrationSchema', () => {
    it('should validate a valid Calibration object', () => {
      const validCalibration: Calibration = {
        calibrationPeriodSec: 10,
        calibrationTimeShift: 5,
        calibrationFactor: {
          value: 1.23,
          standardDeviation: 0.01,
          units: Units.SECONDS
        }
      };

      expect(calibrationSchema.safeParse(validCalibration).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidCalibration = {
        calibrationPeriodSec: 10,
        // Missing calibrationTimeShift
        calibrationFactor: {
          value: 1.23,
          standardDeviation: 0.01,
          units: Units.SECONDS
        }
      };

      expect(calibrationSchema.safeParse(invalidCalibration).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidCalibration = {
        calibrationPeriodSec: 10,
        calibrationTimeShift: '5', // calibrationTimeShift should be a number
        calibrationFactor: {
          value: 1.23,
          standardDeviation: 0.01
        }
      };

      expect(calibrationSchema.safeParse(invalidCalibration).success).toBeFalsy();
    });

    it('should validate an object without optional fields', () => {
      const validCalibration = {
        calibrationPeriodSec: 10,
        calibrationTimeShift: 5,
        calibrationFactor: {
          value: 1.23,
          units: Units.SECONDS
        }
      };

      expect(calibrationSchema.safeParse(validCalibration).success).toBeTruthy();
    });
  });
  describe('responseSchema', () => {
    it('should validate a valid Response object', () => {
      const validResponse: Response = {
        calibration: {
          calibrationPeriodSec: 10,
          calibrationTimeShift: 5,
          calibrationFactor: {
            value: 1.23,
            standardDeviation: 0.01,
            units: Units.SECONDS
          }
        },
        effectiveAt: 1627849200,
        effectiveUntil: 1627849300,
        fapResponse: {
          id: 'df1203d8-0039-4e36-ab2a-dbb436d8e9ab',
          frequencies: [0.001],
          amplitudePhaseResponses: [
            {
              amplitude: { value: 0.000014254, standardDeviation: 0, units: Units.DEGREES },
              phase: { value: 350.140599, standardDeviation: 0, units: Units.DEGREES }
            }
          ],
          nominalCalibration: {
            calibrationFactor: { value: 0, standardDeviation: 0, units: Units.UNITLESS },
            calibrationPeriodSec: 0,
            calibrationTimeShift: 0
          },
          nominalSampleRateHz: 0
        },
        id: 'response1'
      };

      expect(responseSchema.safeParse(validResponse).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidResponse = {
        calibration: {
          calibrationPeriodSec: 10,
          calibrationTimeShift: 5,
          calibrationFactor: {
            value: 1.23,
            standardDeviation: 0.01,
            units: Units.SECONDS
          }
        },
        effectiveAt: 1627849200,
        // Missing effectiveUntil
        fapResponse: {
          frequencies: [1, 10, 100],
          amplitudeResponseUnits: [Units.DECIBELS, Units.DECIBELS, Units.DECIBELS],
          amplitudeResponse: [0.1, 0.2, 0.3],
          amplitudeResponseStdDev: [0.01, 0.02, 0.03],
          phaseResponseUnits: [Units.RADIANS, Units.RADIANS, Units.RADIANS],
          phaseResponse: [0.1, 0.2, 0.3],
          phaseResponseStdDev: [0.01, 0.02, 0.03],
          id: 'response1'
        },
        id: 'response1'
      };

      expect(responseSchema.safeParse(invalidResponse).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidResponse = {
        calibration: {
          calibrationPeriodSec: 10,
          calibrationTimeShift: 5,
          calibrationFactor: {
            value: 1.23,
            standardDeviation: 0.01,
            units: Units.SECONDS
          }
        },
        effectiveAt: 1627849200,
        effectiveUntil: '1627849300', // effectiveUntil should be a number
        fapResponse: {
          frequencies: [1, 10, 100],
          amplitudeResponseUnits: [Units.DECIBELS, Units.DECIBELS, Units.DECIBELS],
          amplitudeResponse: [0.1, 0.2, 0.3],
          amplitudeResponseStdDev: [0.01, 0.02, 0.03],
          phaseResponseUnits: [Units.RADIANS, Units.RADIANS, Units.RADIANS],
          phaseResponse: [0.1, 0.2, 0.3],
          phaseResponseStdDev: [0.01, 0.02, 0.03],
          id: 'response1'
        },
        id: 'response1'
      };

      expect(responseSchema.safeParse(invalidResponse).success).toBeFalsy();
    });
  });
});
