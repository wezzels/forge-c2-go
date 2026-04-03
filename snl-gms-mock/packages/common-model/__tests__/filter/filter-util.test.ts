import { TimeseriesType } from '../../src/ts/channel-segment';
import {
  assertIsFilterDefinitionRealization,
  assertNyquistFrequency,
  getFilterName,
  isFilterDefinitionRealization,
  isFilterError,
  isPhaseMatchFilterParameters,
  isPreDesignableFilter
} from '../../src/ts/filter/filter-util';
import type {
  AutoRegressiveFilterDefinition,
  CascadeFilterDefinition,
  FilterDefinition,
  PhaseMatchFilterDefinition
} from '../../src/ts/filter/types';
import {
  AutoregressiveFilterType,
  AutoregressiveType,
  FilterError,
  FilterType,
  TaperFunction,
  UNFILTERED,
  UNFILTERED_FILTER
} from '../../src/ts/filter/types';
import type { Waveform } from '../../src/ts/waveform/types';
import {
  cascadeFilterDefinition,
  linearFilterDefinition,
  linearFilterDescription
} from '../__data__';

const phaseMatchFilterDefinition: PhaseMatchFilterDefinition = {
  filterDescription: {
    filterType: FilterType.PHASE_MATCH,
    phase: 'P',
    dispersionModelName: 'laske/LR',
    lowFrequencyHz: 0.1,
    lowFrequencyTaperWidthHz: 0,
    highFrequencyHz: 9,
    highFrequencyTaperWidthHz: 0,
    numFrequencies: 10,
    referencePeriod: 60,
    frequencyTaperFunction: TaperFunction.COSINE,
    causal: true,
    correctGroupDelay: false,
    parameters: {
      receiverLocation: {
        latitudeDegrees: 46,
        longitudeDegrees: 91,
        elevationKm: 0.1,
        depthKm: 0
      },
      sourceLocation: {
        latitudeDegrees: 45,
        longitudeDegrees: 90,
        depthKm: 0,
        time: 1732730228
      }
    }
  },
  name: 'Test Filter 8',
  comments: 'Phase Match Filter'
};

const autoRegressiveFilterDefinition: AutoRegressiveFilterDefinition = {
  filterDescription: {
    filterType: FilterType.AUTOREGRESSIVE,
    causal: true,
    correctGroupDelay: false,
    order: 5,
    noiseWindowDuration: 10,
    noiseWindowOffset: 0,
    signalWindowDuration: 120,
    signalWindowOffset: 0,
    autoregressiveType: AutoregressiveType.N,
    autoregressiveFilterType: AutoregressiveFilterType.ADAPTIVE,
    parameters: {
      sampleRateHz: 40,
      sampleRateToleranceHz: 0.001
    }
  },
  name: 'Test Filter 7',
  comments: 'Simple AR Filter'
};

const cascadeFilterDefinitionWithPhaseMatch: CascadeFilterDefinition = {
  ...cascadeFilterDefinition,
  filterDescription: {
    ...cascadeFilterDefinition.filterDescription,
    filterDescriptions: [
      ...cascadeFilterDefinition.filterDescription.filterDescriptions,
      phaseMatchFilterDefinition.filterDescription
    ]
  }
};

const cascadeFilterDefinitionWithAutoregressive: CascadeFilterDefinition = {
  ...cascadeFilterDefinition,
  filterDescription: {
    ...cascadeFilterDefinition.filterDescription,
    filterDescriptions: [
      ...cascadeFilterDefinition.filterDescription.filterDescriptions,
      autoRegressiveFilterDefinition.filterDescription
    ]
  }
};

describe('Filter Util', () => {
  describe('getFilterName', () => {
    it('returns `unfiltered` if unfiltered filter is provided', () => {
      expect(getFilterName(UNFILTERED_FILTER)).toBe(UNFILTERED);
    });
    it('returns `unfiltered` if undefined filter is provided', () => {
      expect(getFilterName(undefined)).toBe(UNFILTERED);
    });
    it('returns the filter name if the filter has one', () => {
      expect(getFilterName({ filterDefinition: { name: 'filter name' } as any } as any)).toBe(
        'filter name'
      );
    });
    it('returns the named filter filter name if the filter is a named filter', () => {
      expect(getFilterName({ namedFilter: 'named' } as any)).toBe('named');
    });
  });
  describe('FilterError', () => {
    it('isFilterError identifies FilterErrors', () => {
      expect(
        isFilterError(new FilterError('Test‽', 'FilterName', 'ChannelName', ['ABC', 'MTV']))
      ).toBe(true);
      expect(isFilterError(new FilterError('Test‽', 'FilterName', 'ChannelName', 'XYZ'))).toBe(
        true
      );
      expect(isFilterError(new FilterError('Test‽', 'FilterName', 'ChannelName'))).toBe(true);
    });
    it('isFilterError does not call generic Errors FilterErrors', () => {
      expect(isFilterError(new Error('Not a FilterError'))).toBe(false);
    });
  });

  describe('isFilterDefinitionRealization', () => {
    it('identifies types that match FilterDefinitionRealization', () => {
      expect(isFilterDefinitionRealization(linearFilterDefinition)).toBe(true);
      expect(isFilterDefinitionRealization(cascadeFilterDefinition)).toBe(true);
    });
  });

  describe('assertIsFilterDefinitionRealization', () => {
    it('asserts that the object is a FilterDefinitionRealization', () => {
      const junk = {
        name: 'Test',
        filterDescription: undefined
      };
      expect(() => {
        assertIsFilterDefinitionRealization(linearFilterDefinition);
      }).not.toThrow();
      expect(() => {
        assertIsFilterDefinitionRealization(cascadeFilterDefinition);
      }).not.toThrow();
      expect(() => {
        assertIsFilterDefinitionRealization(junk as unknown as FilterDefinition);
      }).toThrow();
    });
  });

  describe('isPhaseMatchFilterParameters', () => {
    it('is true if the parameters match phase match filter parameters', () => {
      expect(
        isPhaseMatchFilterParameters(linearFilterDefinition.filterDescription.parameters)
      ).toBeFalsy();
      expect(
        isPhaseMatchFilterParameters(cascadeFilterDefinition.filterDescription.parameters)
      ).toBeFalsy();
      expect(
        isPhaseMatchFilterParameters(autoRegressiveFilterDefinition.filterDescription.parameters)
      ).toBeFalsy();
      expect(
        isPhaseMatchFilterParameters(phaseMatchFilterDefinition.filterDescription.parameters)
      ).toBeTruthy();
    });
  });

  describe('isPreDesignableFilter', () => {
    it('is true if a filter can be pre-designed in middleware', () => {
      expect(isPreDesignableFilter(linearFilterDefinition)).toBeTruthy();
      expect(isPreDesignableFilter(cascadeFilterDefinition)).toBeTruthy();
      expect(isPreDesignableFilter(phaseMatchFilterDefinition)).toBeFalsy();
      expect(isPreDesignableFilter(autoRegressiveFilterDefinition)).toBeFalsy();
      expect(isPreDesignableFilter(cascadeFilterDefinitionWithPhaseMatch)).toBeFalsy();
      expect(isPreDesignableFilter(cascadeFilterDefinitionWithAutoregressive)).toBeFalsy();
    });
  });

  describe('assertNyquistFrequency', () => {
    it('Throws an error if the nyquist frequency is lower then the low frequency with a linear filter', () => {
      const testFilterDescription = {
        ...linearFilterDescription,
        lowFrequencyHz: 50,
        highFrequencyHz: 100
      };
      const waveform: Waveform = {
        _uiClaimCheckId: 'test',
        type: TimeseriesType.WAVEFORM,
        startTime: 0,
        endTime: 0,
        sampleRateHz: 40,
        sampleCount: 3000
      };
      expect(() => assertNyquistFrequency(testFilterDescription, waveform)).toThrow(
        'High frequency 100 Hz or low frequency 50 Hz must be less than or equal to the Nyquist frequency 20 Hz.'
      );
    });

    it('Throws an error if the nyquist frequency is lower then the high frequency with a linear filter', () => {
      const testFilterDescription = {
        ...linearFilterDescription,
        highFrequencyHz: 100
      };
      const waveform: Waveform = {
        _uiClaimCheckId: 'test',
        type: TimeseriesType.WAVEFORM,
        startTime: 0,
        endTime: 0,
        sampleRateHz: 40,
        sampleCount: 3000
      };
      expect(() => assertNyquistFrequency(testFilterDescription, waveform)).toThrow(
        'High frequency 100 Hz or low frequency 0.3 Hz must be less than or equal to the Nyquist frequency 20 Hz.'
      );
    });

    it('Throws an error if the nyquist frequency is lower then the low frequency with a cascade filter', () => {
      const testFilterDescription = {
        ...cascadeFilterDefinition.filterDescription,
        filterDescriptions: [
          ...cascadeFilterDefinition.filterDescription.filterDescriptions,
          {
            ...linearFilterDescription,
            lowFrequencyHz: 50,
            highFrequencyHz: 100
          }
        ]
      };
      const waveform: Waveform = {
        _uiClaimCheckId: 'test',
        type: TimeseriesType.WAVEFORM,
        startTime: 0,
        endTime: 0,
        sampleRateHz: 40,
        sampleCount: 3000
      };
      expect(() => assertNyquistFrequency(testFilterDescription, waveform)).toThrow(
        'High frequency 100 Hz or low frequency 50 Hz must be less than or equal to the Nyquist frequency 20 Hz.'
      );
    });

    it('Throws an error if the nyquist frequency is lower then the high frequency with a cascade filter', () => {
      const testFilterDescription = {
        ...cascadeFilterDefinition.filterDescription,
        filterDescriptions: [
          ...cascadeFilterDefinition.filterDescription.filterDescriptions,
          {
            ...linearFilterDescription,
            highFrequencyHz: 100
          }
        ]
      };
      const waveform: Waveform = {
        _uiClaimCheckId: 'test',
        type: TimeseriesType.WAVEFORM,
        startTime: 0,
        endTime: 0,
        sampleRateHz: 40,
        sampleCount: 3000
      };
      expect(() => assertNyquistFrequency(testFilterDescription, waveform)).toThrow(
        'High frequency 100 Hz or low frequency 0.3 Hz must be less than or equal to the Nyquist frequency 20 Hz.'
      );
    });

    it('Will not throw an error if the nyquist frequency is compatible with a linear filter', () => {
      const testFilterDescription = {
        ...linearFilterDescription,
        highFrequencyHz: 20
      };
      const waveform: Waveform = {
        _uiClaimCheckId: 'test',
        type: TimeseriesType.WAVEFORM,
        startTime: 0,
        endTime: 0,
        sampleRateHz: 40,
        sampleCount: 3000
      };
      expect(() => assertNyquistFrequency(testFilterDescription, waveform)).not.toThrow();
    });

    it('Will not throw an error if the nyquist frequency is compatible with a cascade filter', () => {
      const testFilterDescription = {
        ...cascadeFilterDefinition.filterDescription,
        filterDescriptions: [
          ...cascadeFilterDefinition.filterDescription.filterDescriptions,
          {
            ...linearFilterDescription,
            highFrequencyHz: 20
          }
        ]
      };
      const waveform: Waveform = {
        _uiClaimCheckId: 'test',
        type: TimeseriesType.WAVEFORM,
        startTime: 0,
        endTime: 0,
        sampleRateHz: 40,
        sampleCount: 3000
      };
      expect(() => assertNyquistFrequency(testFilterDescription, waveform)).not.toThrow();
    });
  });
});
