/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Units } from '../../../src/ts/common/types';
import type { ResponseTypes } from '../../../src/ts/common-model';
import { CommonTypes } from '../../../src/ts/common-model';

export const responseData: ResponseTypes.Response = {
  id: '5dc3dce4-ae3c-3fb0-84ba-2f83fb5a89d2',
  effectiveAt: 1619199932477,
  effectiveUntil: 1619199932477,
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
  calibration: {
    calibrationPeriodSec: 14.5,
    calibrationTimeShift: 2,
    calibrationFactor: {
      value: 1.2,
      standardDeviation: 0.112,
      units: CommonTypes.Units.SECONDS
    }
  }
};
