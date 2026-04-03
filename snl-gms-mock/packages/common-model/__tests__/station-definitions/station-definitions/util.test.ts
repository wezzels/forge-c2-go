import { StationType } from '../../../src/ts/station-definitions/station-definitions';
import { isArrayStation } from '../../../src/ts/station-definitions/station-definitions/util';
import { pdar } from '../../__data__/station-definitions/station-definitions';

describe('StationDefinitions Util', () => {
  describe('isArrayStation', () => {
    it('is array station', () => {
      expect(isArrayStation(pdar)).toBe(true);
      expect(
        isArrayStation({
          ...pdar,
          type: StationType.HYDROACOUSTIC_ARRAY
        })
      ).toBe(true);
      expect(
        isArrayStation({
          ...pdar,
          type: StationType.INFRASOUND_ARRAY
        })
      ).toBe(true);
    });

    it('is not array station', () => {
      expect(
        isArrayStation({
          ...pdar,
          type: StationType.HYDROACOUSTIC
        })
      ).toBe(false);
      expect(
        isArrayStation({
          ...pdar,
          type: StationType.INFRASOUND
        })
      ).toBe(false);
      expect(
        isArrayStation({
          ...pdar,
          type: StationType.SEISMIC_1_COMPONENT
        })
      ).toBe(false);
    });
  });
});
