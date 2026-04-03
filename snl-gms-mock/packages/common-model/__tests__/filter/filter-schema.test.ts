import type {
  AutoRegressiveFilterDefinition,
  AutoRegressiveFilterDescription,
  AutoRegressiveFilterParameters,
  BaseAutoregressiveFilterParameters,
  BaseFilter,
  CascadeFilterDefinition,
  CascadeFilterDescription,
  CascadeFilterParameters,
  Filter,
  FilterDefinition,
  FilterDescription,
  FilterList,
  FirFilterParameters,
  IirFilterParameters,
  LinearFilterDefinition,
  LinearFilterDescription,
  LinearFilterParameters,
  PhaseMatchFilterDefinition,
  PhaseMatchFilterDescription,
  PhaseMatchFilterParameters,
  TaperDefinition
} from '../../src/ts/filter';
import {
  AutoregressiveFilterType,
  AutoregressiveType,
  BandType,
  FilterDefinitionUsage,
  FilterType,
  LinearFilterType,
  TaperFunction
} from '../../src/ts/filter';
import {
  autoRegressiveFilterDefinitionSchema,
  autoRegressiveFilterDescriptionSchema,
  autoRegressiveFilterParametersSchema,
  baseAutoregressiveFilterParametersSchema,
  baseFilterSchema,
  cascadeFilterDefinitionSchema,
  cascadeFilterDescriptionSchema,
  cascadeFilterParametersSchema,
  filterDefinitionSchema,
  filterDescriptionSchema,
  filterListSchema,
  filterSchema,
  firFilterParametersSchema,
  iirFilterParametersSchema,
  linearFilterDefinitionSchema,
  linearFilterDescriptionSchema,
  linearFilterParametersSchema,
  parametersSchema,
  phaseMatchFilterDefinitionSchema,
  phaseMatchFilterDescriptionSchema,
  phaseMatchFilterParametersSchema,
  taperDefinitionSchema,
  taperFunctionSchema
} from '../../src/ts/filter/schema';

describe('Filter schema', () => {
  describe('linearFilterParametersSchema', () => {
    it('should validate a valid LinearFilterParameters object', () => {
      const validParams: LinearFilterParameters = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1,
        groupDelaySec: 0.01
      };

      expect(linearFilterParametersSchema.safeParse(validParams).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidParams = {
        sampleRateHz: 100
        // Missing sampleRateToleranceHz and groupDelaySec
      };

      expect(linearFilterParametersSchema.safeParse(invalidParams).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidParams = {
        sampleRateHz: 100,
        sampleRateToleranceHz: '0.1', // sampleRateToleranceHz should be a number
        groupDelaySec: 0.01
      };

      expect(linearFilterParametersSchema.safeParse(invalidParams).success).toBeFalsy();
    });
  });

  describe('iirFilterParametersSchema', () => {
    it('should validate a valid IirFilterParameters object', () => {
      const validParams: IirFilterParameters = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1,
        groupDelaySec: 0.01,
        sosNumeratorCoefficients: [1, 2, 3],
        sosDenominatorCoefficients: [1, 2, 3]
      };

      expect(iirFilterParametersSchema.safeParse(validParams).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidParams = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1,
        groupDelaySec: 0.01
        // Missing sosNumeratorCoefficients and sosDenominatorCoefficients
      };

      expect(iirFilterParametersSchema.safeParse(invalidParams).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidParams = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1,
        groupDelaySec: 0.01,
        sosNumeratorCoefficients: [1, 2, '3'], // sosNumeratorCoefficients should be an array of numbers
        sosDenominatorCoefficients: [1, 2, 3]
      };

      expect(iirFilterParametersSchema.safeParse(invalidParams).success).toBeFalsy();
    });
  });

  describe('firFilterParametersSchema', () => {
    it('should validate a valid FirFilterParameters object', () => {
      const validParams: FirFilterParameters = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1,
        groupDelaySec: 0.01,
        transferFunctionBCoefficients: [1, 2, 3]
      };

      expect(firFilterParametersSchema.safeParse(validParams).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidParams = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1,
        groupDelaySec: 0.01
        // Missing transferFunctionBCoefficients
      };

      expect(firFilterParametersSchema.safeParse(invalidParams).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidParams = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1,
        groupDelaySec: 0.01,
        transferFunctionBCoefficients: [1, 2, '3'] // transferFunctionBCoefficients should be an array of numbers
      };

      expect(firFilterParametersSchema.safeParse(invalidParams).success).toBeFalsy();
    });
  });

  describe('cascadeFilterParametersSchema', () => {
    it('should validate a valid CascadeFilterParameters object', () => {
      const validParams: CascadeFilterParameters = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1,
        groupDelaySec: 0.01
      };

      expect(cascadeFilterParametersSchema.safeParse(validParams).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidParams = {
        sampleRateHz: 100
        // Missing sampleRateToleranceHz
      };

      expect(cascadeFilterParametersSchema.safeParse(invalidParams).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidParams = {
        sampleRateHz: 100,
        sampleRateToleranceHz: '0.1', // sampleRateToleranceHz should be a number
        groupDelaySec: 0.01
      };

      expect(cascadeFilterParametersSchema.safeParse(invalidParams).success).toBeFalsy();
    });
  });

  describe('baseAutoregressiveFilterParametersSchema', () => {
    it('should validate a valid BaseAutoregressiveFilterParameters object', () => {
      const validParams: BaseAutoregressiveFilterParameters = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1
      };

      expect(baseAutoregressiveFilterParametersSchema.safeParse(validParams).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidParams = {
        sampleRateHz: 100
        // Missing sampleRateToleranceHz
      };

      expect(baseAutoregressiveFilterParametersSchema.safeParse(invalidParams).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidParams = {
        sampleRateHz: 100,
        sampleRateToleranceHz: '0.1' // sampleRateToleranceHz should be a number
      };

      expect(baseAutoregressiveFilterParametersSchema.safeParse(invalidParams).success).toBeFalsy();
    });
  });

  describe('autoRegressiveFilterParametersSchema', () => {
    it('should validate a valid AutoRegressiveFilterParameters object', () => {
      const validParams: AutoRegressiveFilterParameters = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1,
        coefficients: [1, 2, 3],
        noiseWindow: {
          channel: {
            name: 'Channel1',
            effectiveAt: 1627849200
          },
          startTime: 1627849200,
          endTime: 1627849300,
          creationTime: 1627849400
        }
      };

      expect(autoRegressiveFilterParametersSchema.safeParse(validParams).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidParams = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1
        // Missing coefficients and noiseWindow
      };

      expect(autoRegressiveFilterParametersSchema.safeParse(invalidParams).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidParams = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1,
        coefficients: [1, 2, '3'], // coefficients should be an array of numbers
        noiseWindow: {
          channel: {
            name: 'Channel1',
            effectiveAt: 1627849200
          },
          startTime: 1627849200,
          endTime: 1627849300,
          creationTime: '1627849400' // creationTime should be a number
        }
      };

      expect(autoRegressiveFilterParametersSchema.safeParse(invalidParams).success).toBeFalsy();
    });
  });

  describe('phaseMatchFilterParametersSchema', () => {
    it('should validate a valid PhaseMatchFilterParameters object', () => {
      const validParams: PhaseMatchFilterParameters = {
        receiverLocation: {
          latitudeDegrees: 0.1234,
          longitudeDegrees: -0.1234,
          elevationKm: 0.01,
          depthKm: 0.02
        },
        sourceLocation: {
          latitudeDegrees: 34,
          longitudeDegrees: -118,
          time: 0.01,
          depthKm: 0.02
        }
      };

      expect(phaseMatchFilterParametersSchema.safeParse(validParams).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidParams = {
        receiverLocation: {
          latitudeDegrees: 0.1234,
          longitudeDegrees: -4.321,
          elevationKm: 0.01,
          depthKm: 0.02
        }
        // Missing sourceLocation
      };

      expect(phaseMatchFilterParametersSchema.safeParse(invalidParams).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidParams = {
        receiverLocation: {
          latitudeDegrees: 0.1234,
          longitudeDegrees: 1.2345,
          elevationKm: 0.01,
          depthKm: 0.02
        },
        sourceLocation: {
          latitudeDegrees: 0.1234,
          longitudeDegrees: -0.1234,
          time: '0.01', // elevationKm should be a number
          depthKm: 0.02
        }
      };

      expect(phaseMatchFilterParametersSchema.safeParse(invalidParams).success).toBeFalsy();
    });
  });

  describe('parametersSchema', () => {
    it('should validate a valid Parameters object for linear filter', () => {
      const validParams = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1,
        groupDelaySec: 0.01
      };

      expect(parametersSchema.safeParse(validParams).success).toBeTruthy();
    });

    it('should validate a valid Parameters object for IIR filter', () => {
      const validParams = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1,
        groupDelaySec: 0.01,
        sosNumeratorCoefficients: [1, 2, 3],
        sosDenominatorCoefficients: [1, 2, 3]
      };

      expect(parametersSchema.safeParse(validParams).success).toBeTruthy();
    });

    it('should validate a valid Parameters object for FIR filter', () => {
      const validParams = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1,
        groupDelaySec: 0.01,
        transferFunctionBCoefficients: [1, 2, 3]
      };

      expect(parametersSchema.safeParse(validParams).success).toBeTruthy();
    });

    it('should validate a valid Parameters object for autoregressive filter', () => {
      const validParams = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1,
        coefficients: [1, 2, 3],
        noiseWindow: {
          channel: {
            name: 'Channel1',
            effectiveAt: 1627849200
          },
          startTime: 1627849200,
          endTime: 1627849300,
          creationTime: 1627849400
        }
      };

      expect(parametersSchema.safeParse(validParams).success).toBeTruthy();
    });

    it('should validate a valid Parameters object for phase match filter', () => {
      const validParams = {
        receiverLocation: {
          latitudeDegrees: 0.1234,
          longitudeDegrees: 1.2345,
          elevationKm: 0.01,
          depthKm: 0.02
        },
        sourceLocation: {
          latitudeDegrees: 0.1234,
          longitudeDegrees: -118.1234,
          time: 0.01,
          depthKm: 0.02
        }
      };

      expect(parametersSchema.safeParse(validParams).success).toBeTruthy();
    });

    it('should validate a valid Parameters object for cascade filter', () => {
      const validParams = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1,
        groupDelaySec: 0.01
      };

      expect(parametersSchema.safeParse(validParams).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidParams = {
        sampleRateHz: 100
        // Missing sampleRateToleranceHz and groupDelaySec
      };

      expect(parametersSchema.safeParse(invalidParams).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidParams = {
        sampleRateHz: 100,
        sampleRateToleranceHz: '0.1', // sampleRateToleranceHz should be a number
        groupDelaySec: 0.01
      };

      expect(parametersSchema.safeParse(invalidParams).success).toBeFalsy();
    });
  });

  describe('filterDescriptionSchema', () => {
    it('should validate a valid FilterDescription object', () => {
      const validDescription: FilterDescription = {
        filterType: FilterType.LINEAR,
        causal: true,
        correctGroupDelay: false
      };

      expect(filterDescriptionSchema.safeParse(validDescription).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidDescription = {
        filterType: FilterType.LINEAR
        // Missing causal
      };

      expect(filterDescriptionSchema.safeParse(invalidDescription).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidDescription = {
        filterType: FilterType.LINEAR,
        causal: 'true' // causal should be a boolean
      };

      expect(filterDescriptionSchema.safeParse(invalidDescription).success).toBeFalsy();
    });
  });

  describe('linearFilterDescriptionSchema', () => {
    it('should validate a valid LinearFilterDescription object', () => {
      const validDescription: LinearFilterDescription = {
        filterType: FilterType.LINEAR,
        causal: true,
        correctGroupDelay: false,
        order: 4,
        zeroPhase: true,
        passBandType: BandType.BAND_PASS,
        linearFilterType: LinearFilterType.IIR_BUTTERWORTH
      };

      expect(linearFilterDescriptionSchema.safeParse(validDescription).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidDescription = {
        filterType: FilterType.LINEAR,
        causal: true
        // Missing order, zeroPhase, passBandType, and linearFilterType
      };

      expect(linearFilterDescriptionSchema.safeParse(invalidDescription).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidDescription = {
        filterType: FilterType.LINEAR,
        causal: true,
        correctGroupDelay: false,
        order: '4', // order should be a number
        zeroPhase: true,
        passBandType: BandType.BAND_REJECT,
        linearFilterType: LinearFilterType.IIR_OTHER
      };

      expect(linearFilterDescriptionSchema.safeParse(invalidDescription).success).toBeFalsy();
    });

    it('should throw when given a LinearFilterDescription object with invalid params', () => {
      const invalidParams = {
        sampleRateHz: 100,
        sampleRateToleranceHz: 0.1,
        groupDelaySec: 0.01,
        transferFunctionBCoefficients: [1, 2, 3],
        receiverLocation: {
          anything: true
        },
        sourceLocation: {
          thisWorks: true
        },
        thisAlsoWorks: true
      };
      const invalidDescription: LinearFilterDescription = {
        filterType: FilterType.LINEAR,
        causal: true,
        correctGroupDelay: false,
        order: 4,
        zeroPhase: true,
        passBandType: BandType.BAND_PASS,
        linearFilterType: LinearFilterType.IIR_BUTTERWORTH,
        parameters: invalidParams
      };

      expect(linearFilterDescriptionSchema.safeParse(invalidDescription).success).toBeFalsy();
    });

    it('should invalidate when the low frequency is greater than the high frequency', () => {
      const validDescription: LinearFilterDescription = {
        filterType: FilterType.LINEAR,
        causal: true,
        correctGroupDelay: false,
        order: 4,
        zeroPhase: true,
        passBandType: BandType.BAND_PASS,
        highFrequencyHz: 0.1,
        lowFrequencyHz: 1,
        linearFilterType: LinearFilterType.IIR_BUTTERWORTH
      };

      expect(linearFilterDescriptionSchema.safeParse(validDescription).success).toBeFalsy();
      expect(() => linearFilterDescriptionSchema.parse(validDescription))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "highFrequencyHz is not greater than lowFrequencyHz",
            "path": [
              "highFrequencyHz"
            ]
          }
        ]"
      `);
    });

    it('should invalidate when the high frequency is not positive', () => {
      const validDescription: LinearFilterDescription = {
        filterType: FilterType.LINEAR,
        causal: true,
        correctGroupDelay: false,
        order: 4,
        zeroPhase: true,
        passBandType: BandType.BAND_PASS,
        highFrequencyHz: 0,
        linearFilterType: LinearFilterType.IIR_BUTTERWORTH
      };

      expect(linearFilterDescriptionSchema.safeParse(validDescription).success).toBeFalsy();
      expect(() => linearFilterDescriptionSchema.parse(validDescription))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "highFrequencyHz is not a positive number. Received 0",
            "path": [
              "highFrequencyHz"
            ]
          }
        ]"
      `);
    });

    it('should invalidate when the low frequency is not positive', () => {
      const validDescription: LinearFilterDescription = {
        filterType: FilterType.LINEAR,
        causal: true,
        correctGroupDelay: false,
        order: 4,
        zeroPhase: true,
        passBandType: BandType.BAND_PASS,
        lowFrequencyHz: 0,
        linearFilterType: LinearFilterType.IIR_BUTTERWORTH
      };

      expect(linearFilterDescriptionSchema.safeParse(validDescription).success).toBeFalsy();
      expect(() => linearFilterDescriptionSchema.parse(validDescription))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "lowFrequencyHz is not a positive number. Received 0",
            "path": []
          }
        ]"
      `);
    });

    it('should invalidate when the order is greater than 10', () => {
      const validDescription: LinearFilterDescription = {
        filterType: FilterType.LINEAR,
        causal: true,
        correctGroupDelay: false,
        order: 11,
        zeroPhase: true,
        passBandType: BandType.BAND_PASS,
        highFrequencyHz: 1,
        lowFrequencyHz: 0.1,
        linearFilterType: LinearFilterType.IIR_BUTTERWORTH
      };

      expect(linearFilterDescriptionSchema.safeParse(validDescription).success).toBeFalsy();
      expect(() => linearFilterDescriptionSchema.parse(validDescription))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "order must be an integer between 1 and 10, but received 11",
            "path": []
          }
        ]"
      `);
    });

    it('should invalidate when the order is floating point', () => {
      const validDescription: LinearFilterDescription = {
        filterType: FilterType.LINEAR,
        causal: true,
        correctGroupDelay: false,
        order: 9.99,
        zeroPhase: true,
        passBandType: BandType.BAND_PASS,
        highFrequencyHz: 1,
        lowFrequencyHz: 0.1,
        linearFilterType: LinearFilterType.IIR_BUTTERWORTH
      };

      expect(linearFilterDescriptionSchema.safeParse(validDescription).success).toBeFalsy();
      expect(() => linearFilterDescriptionSchema.parse(validDescription))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "order must be an integer between 1 and 10, but received 9.99",
            "path": []
          }
        ]"
      `);
    });

    it('should invalidate when the order too low', () => {
      const validDescription: LinearFilterDescription = {
        filterType: FilterType.LINEAR,
        causal: true,
        correctGroupDelay: false,
        order: 0,
        zeroPhase: true,
        passBandType: BandType.BAND_PASS,
        highFrequencyHz: 1,
        lowFrequencyHz: 0.1,
        linearFilterType: LinearFilterType.IIR_BUTTERWORTH
      };

      expect(linearFilterDescriptionSchema.safeParse(validDescription).success).toBeFalsy();
      expect(() => linearFilterDescriptionSchema.parse(validDescription))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "order must be an integer between 1 and 10, but received 0",
            "path": []
          }
        ]"
      `);
    });
  });

  describe('autoRegressiveFilterDescriptionSchema', () => {
    it('should validate a valid AutoRegressiveFilterDescription object', () => {
      const validDescription: AutoRegressiveFilterDescription = {
        filterType: FilterType.AUTOREGRESSIVE,
        causal: true,
        correctGroupDelay: false,
        order: 4,
        noiseWindowDuration: 10,
        noiseWindowOffset: 5,
        signalWindowOffset: 5,
        autoregressiveType: AutoregressiveType.N,
        autoregressiveFilterType: AutoregressiveFilterType.ADAPTIVE
      };

      expect(
        autoRegressiveFilterDescriptionSchema.safeParse(validDescription).success
      ).toBeTruthy();
    });

    it('should invalidate an AutoRegressiveFilterDescription object when the order is too low', () => {
      const validDescription: AutoRegressiveFilterDescription = {
        filterType: FilterType.AUTOREGRESSIVE,
        causal: true,
        correctGroupDelay: false,
        order: 0,
        noiseWindowDuration: 10,
        noiseWindowOffset: 5,
        signalWindowOffset: 5,
        autoregressiveType: AutoregressiveType.N,
        autoregressiveFilterType: AutoregressiveFilterType.ADAPTIVE
      };

      expect(autoRegressiveFilterDescriptionSchema.safeParse(validDescription).success).toBeFalsy();
      expect(() => autoRegressiveFilterDescriptionSchema.parse(validDescription))
        .toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "order must be an integer between 1 and 10, but received 0",
              "path": []
            }
          ]"
        `);
    });

    it('should invalidate an AutoRegressiveFilterDescription object when the order is too high', () => {
      const validDescription: AutoRegressiveFilterDescription = {
        filterType: FilterType.AUTOREGRESSIVE,
        causal: true,
        correctGroupDelay: false,
        order: 11,
        noiseWindowDuration: 10,
        noiseWindowOffset: 5,
        signalWindowOffset: 5,
        autoregressiveType: AutoregressiveType.N,
        autoregressiveFilterType: AutoregressiveFilterType.ADAPTIVE
      };

      expect(autoRegressiveFilterDescriptionSchema.safeParse(validDescription).success).toBeFalsy();
      expect(() => autoRegressiveFilterDescriptionSchema.parse(validDescription))
        .toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "order must be an integer between 1 and 10, but received 11",
              "path": []
            }
          ]"
        `);
    });

    it('should invalidate an AutoRegressiveFilterDescription object when the order is not an integer', () => {
      const validDescription: AutoRegressiveFilterDescription = {
        filterType: FilterType.AUTOREGRESSIVE,
        causal: true,
        correctGroupDelay: false,
        order: 0.25,
        noiseWindowDuration: 10,
        noiseWindowOffset: 5,
        signalWindowOffset: 5,
        autoregressiveType: AutoregressiveType.N,
        autoregressiveFilterType: AutoregressiveFilterType.ADAPTIVE
      };

      expect(autoRegressiveFilterDescriptionSchema.safeParse(validDescription).success).toBeFalsy();
      expect(() => autoRegressiveFilterDescriptionSchema.parse(validDescription))
        .toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "order must be an integer between 1 and 10, but received 0.25",
              "path": []
            }
          ]"
        `);
    });

    it('should invalidate an AutoRegressiveFilterDescription object when the noiseWindowDuration is too low', () => {
      const validDescription: AutoRegressiveFilterDescription = {
        filterType: FilterType.AUTOREGRESSIVE,
        causal: true,
        correctGroupDelay: false,
        order: 1,
        noiseWindowDuration: -1,
        noiseWindowOffset: 5,
        signalWindowOffset: 5,
        autoregressiveType: AutoregressiveType.N,
        autoregressiveFilterType: AutoregressiveFilterType.ADAPTIVE
      };

      expect(autoRegressiveFilterDescriptionSchema.safeParse(validDescription).success).toBeFalsy();
      expect(() => autoRegressiveFilterDescriptionSchema.parse(validDescription))
        .toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "Noise window duration is not a positive number. Received -1",
              "path": []
            }
          ]"
        `);
    });

    it('should invalidate an AutoRegressiveFilterDescription object when the noiseWindowOffset is too low', () => {
      const validDescription: AutoRegressiveFilterDescription = {
        filterType: FilterType.AUTOREGRESSIVE,
        causal: true,
        correctGroupDelay: false,
        order: 1,
        noiseWindowDuration: 60,
        noiseWindowOffset: -1,
        signalWindowOffset: 5,
        autoregressiveType: AutoregressiveType.N,
        autoregressiveFilterType: AutoregressiveFilterType.ADAPTIVE
      };

      expect(autoRegressiveFilterDescriptionSchema.safeParse(validDescription).success).toBeFalsy();
      expect(() => autoRegressiveFilterDescriptionSchema.parse(validDescription))
        .toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "Noise window offset must be a non-negative number. Received -1",
              "path": []
            }
          ]"
        `);
    });

    it('should invalidate an AutoRegressiveFilterDescription object when the signalWindowDuration is too low', () => {
      const validDescription: AutoRegressiveFilterDescription = {
        filterType: FilterType.AUTOREGRESSIVE,
        causal: true,
        correctGroupDelay: false,
        order: 1,
        noiseWindowDuration: 1,
        noiseWindowOffset: 1,
        signalWindowDuration: 0,
        signalWindowOffset: 1,
        autoregressiveType: AutoregressiveType.N,
        autoregressiveFilterType: AutoregressiveFilterType.ADAPTIVE
      };

      expect(autoRegressiveFilterDescriptionSchema.safeParse(validDescription).success).toBeFalsy();
      expect(() => autoRegressiveFilterDescriptionSchema.parse(validDescription))
        .toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "Signal window duration is not a positive number. Received 0",
              "path": []
            }
          ]"
        `);
    });

    it('should invalidate an AutoRegressiveFilterDescription object when the signalWindowOffset is too low', () => {
      const validDescription: AutoRegressiveFilterDescription = {
        filterType: FilterType.AUTOREGRESSIVE,
        causal: true,
        correctGroupDelay: false,
        order: 1,
        noiseWindowDuration: 60,
        noiseWindowOffset: 1,
        signalWindowOffset: -1,
        autoregressiveType: AutoregressiveType.N,
        autoregressiveFilterType: AutoregressiveFilterType.ADAPTIVE
      };

      expect(autoRegressiveFilterDescriptionSchema.safeParse(validDescription).success).toBeFalsy();
      expect(() => autoRegressiveFilterDescriptionSchema.parse(validDescription))
        .toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "Signal window offset must be a non-negative number. Received -1",
              "path": []
            }
          ]"
        `);
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidDescription = {
        filterType: FilterType.AUTOREGRESSIVE,
        causal: true
        // Missing order, noiseWindowDuration, noiseWindowOffset, signalWindowOffset, autoregressiveType, and autoregressiveFilterType
      };

      expect(
        autoRegressiveFilterDescriptionSchema.safeParse(invalidDescription).success
      ).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidDescription = {
        filterType: FilterType.AUTOREGRESSIVE,
        causal: true,
        correctGroupDelay: false,
        order: '4', // order should be a number
        noiseWindowDuration: 10,
        noiseWindowOffset: 5,
        signalWindowOffset: 5,
        autoregressiveType: AutoregressiveType.N_SQUARED,
        autoregressiveFilterType: AutoregressiveFilterType.NON_ADAPTIVE
      };

      expect(
        autoRegressiveFilterDescriptionSchema.safeParse(invalidDescription).success
      ).toBeFalsy();
    });
  });

  describe('taperDefinitionSchema', () => {
    it('should validate a valid TaperDefinition object', () => {
      const validDefinition: TaperDefinition = {
        taperDuration: 10
      };

      expect(taperDefinitionSchema.safeParse(validDefinition).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidDefinition = {
        // Missing taperDuration
      };

      expect(taperDefinitionSchema.safeParse(invalidDefinition).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidDefinition = {
        taperDuration: '10' // taperDuration should be a number
      };

      expect(taperDefinitionSchema.safeParse(invalidDefinition).success).toBeFalsy();
    });
  });
  describe('TaperFunction', () => {
    it('accepts taper enum values', () => {
      const validTaperFunctions: TaperFunction[] = Object.values(TaperFunction);
      validTaperFunctions.forEach(taperFunction => {
        expect(taperFunctionSchema.safeParse(taperFunction).success).toBeTruthy();
      });
    });
  });

  describe('phaseMatchFilterDescriptionSchema', () => {
    it('should validate a valid PhaseMatchFilterDescription object', () => {
      const validDescription: PhaseMatchFilterDescription = {
        filterType: FilterType.PHASE_MATCH,
        causal: true,
        correctGroupDelay: false,
        phase: 'LR',
        dispersionModelName: 'Model1',
        lowFrequencyHz: 0.1,
        lowFrequencyTaperWidthHz: 0.01,
        highFrequencyHz: 10,
        highFrequencyTaperWidthHz: 0.1,
        numFrequencies: 100,
        referencePeriod: 1,
        frequencyTaperFunction: TaperFunction.COSINE,
        parameters: {
          receiverLocation: {
            latitudeDegrees: 0.1234,
            longitudeDegrees: -4.321,
            elevationKm: 0.01,
            depthKm: 0.02
          },
          sourceLocation: {
            latitudeDegrees: 1.2345,
            longitudeDegrees: 0.1234,
            time: 0.01,
            depthKm: 0.02
          }
        }
      };

      expect(phaseMatchFilterDescriptionSchema.safeParse(validDescription).success).toBeTruthy();
    });

    it('should invalidate a PhaseMatchFilterDescription object with a phase other than LR or LQ', () => {
      const invalidDescription: PhaseMatchFilterDescription = {
        filterType: FilterType.PHASE_MATCH,
        causal: true,
        correctGroupDelay: false,
        phase: 'P',
        dispersionModelName: 'Model1',
        lowFrequencyHz: 0.1,
        lowFrequencyTaperWidthHz: 0.01,
        highFrequencyHz: 10,
        highFrequencyTaperWidthHz: 0.1,
        numFrequencies: 100,
        referencePeriod: 1,
        frequencyTaperFunction: TaperFunction.COSINE,
        parameters: {
          receiverLocation: {
            latitudeDegrees: 0.1234,
            longitudeDegrees: -4.321,
            elevationKm: 0.01,
            depthKm: 0.02
          },
          sourceLocation: {
            latitudeDegrees: 1.2345,
            longitudeDegrees: 0.1234,
            time: 0.01,
            depthKm: 0.02
          }
        }
      };

      expect(phaseMatchFilterDescriptionSchema.safeParse(invalidDescription).success).toBeFalsy();
      expect(() => phaseMatchFilterDescriptionSchema.parse(invalidDescription))
        .toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "Phase must be LR or LQ for phase match filters. Received P",
              "path": []
            }
          ]"
        `);
    });

    it('should invalidate an object with a non-positive reference period', () => {
      const invalidDescription: PhaseMatchFilterDescription = {
        filterType: FilterType.PHASE_MATCH,
        causal: true,
        correctGroupDelay: false,
        phase: 'LR',
        dispersionModelName: 'Model1',
        lowFrequencyHz: 0.1,
        lowFrequencyTaperWidthHz: 0.01,
        highFrequencyHz: 10,
        highFrequencyTaperWidthHz: 0.1,
        numFrequencies: 100,
        referencePeriod: 0,
        frequencyTaperFunction: TaperFunction.COSINE,
        parameters: {
          receiverLocation: {
            latitudeDegrees: 0.1234,
            longitudeDegrees: -4.321,
            elevationKm: 0.01,
            depthKm: 0.02
          },
          sourceLocation: {
            latitudeDegrees: 1.2345,
            longitudeDegrees: 0.1234,
            time: 0.01,
            depthKm: 0.02
          }
        }
      };

      expect(phaseMatchFilterDescriptionSchema.safeParse(invalidDescription).success).toBeFalsy();
      expect(() => phaseMatchFilterDescriptionSchema.parse(invalidDescription))
        .toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "Reference period must be a positive number. Received 0",
              "path": []
            }
          ]"
        `);
    });

    it('should invalidate an object with a non-positive low frequency', () => {
      const invalidDescription: PhaseMatchFilterDescription = {
        filterType: FilterType.PHASE_MATCH,
        causal: true,
        correctGroupDelay: false,
        phase: 'LR',
        dispersionModelName: 'Model1',
        lowFrequencyHz: -0.1, // invalid low frequency
        lowFrequencyTaperWidthHz: 0.01,
        highFrequencyHz: 10,
        highFrequencyTaperWidthHz: 0.1,
        numFrequencies: 100,
        referencePeriod: 10,
        frequencyTaperFunction: TaperFunction.COSINE,
        parameters: {
          receiverLocation: {
            latitudeDegrees: 0.1234,
            longitudeDegrees: -4.321,
            elevationKm: 0.01,
            depthKm: 0.02
          },
          sourceLocation: {
            latitudeDegrees: 1.2345,
            longitudeDegrees: 0.1234,
            time: 0.01,
            depthKm: 0.02
          }
        }
      };

      expect(phaseMatchFilterDescriptionSchema.safeParse(invalidDescription).success).toBeFalsy();
      expect(() => phaseMatchFilterDescriptionSchema.parse(invalidDescription))
        .toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "Low frequency must be a positive number. Received -0.1",
              "path": []
            }
          ]"
        `);
    });

    it('should invalidate an object with a non-positive high frequency', () => {
      const invalidDescription: PhaseMatchFilterDescription = {
        filterType: FilterType.PHASE_MATCH,
        causal: true,
        correctGroupDelay: false,
        phase: 'LR',
        dispersionModelName: 'Model1',
        lowFrequencyHz: 0.1,
        lowFrequencyTaperWidthHz: 0.01,
        highFrequencyHz: -10, // invalid high frequency
        highFrequencyTaperWidthHz: 0.1,
        numFrequencies: 100,
        referencePeriod: 10,
        frequencyTaperFunction: TaperFunction.COSINE,
        parameters: {
          receiverLocation: {
            latitudeDegrees: 0.1234,
            longitudeDegrees: -4.321,
            elevationKm: 0.01,
            depthKm: 0.02
          },
          sourceLocation: {
            latitudeDegrees: 1.2345,
            longitudeDegrees: 0.1234,
            time: 0.01,
            depthKm: 0.02
          }
        }
      };

      expect(phaseMatchFilterDescriptionSchema.safeParse(invalidDescription).success).toBeFalsy();
      expect(() => phaseMatchFilterDescriptionSchema.parse(invalidDescription))
        .toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "High frequency must be a positive number. Received -10",
              "path": []
            }
          ]"
        `);
    });

    it('should invalidate an object with a non-positive integer number of frequencies', () => {
      const invalidDescription: PhaseMatchFilterDescription = {
        filterType: FilterType.PHASE_MATCH,
        causal: true,
        correctGroupDelay: false,
        phase: 'LR',
        dispersionModelName: 'Model1',
        lowFrequencyHz: 0.1,
        lowFrequencyTaperWidthHz: 0.01,
        highFrequencyHz: 10,
        highFrequencyTaperWidthHz: 0.1,
        numFrequencies: 10.1, // invalid number of frequencies
        referencePeriod: 10,
        frequencyTaperFunction: TaperFunction.COSINE,
        parameters: {
          receiverLocation: {
            latitudeDegrees: 0.1234,
            longitudeDegrees: -4.321,
            elevationKm: 0.01,
            depthKm: 0.02
          },
          sourceLocation: {
            latitudeDegrees: 1.2345,
            longitudeDegrees: 0.1234,
            time: 0.01,
            depthKm: 0.02
          }
        }
      };

      expect(phaseMatchFilterDescriptionSchema.safeParse(invalidDescription).success).toBeFalsy();
      expect(() => phaseMatchFilterDescriptionSchema.parse(invalidDescription))
        .toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "The number of frequencies must be a positive integer. Received 10.1",
              "path": []
            }
          ]"
        `);
    });

    it('should invalidate an object with a negative low frequency taper width', () => {
      const invalidDescription: PhaseMatchFilterDescription = {
        filterType: FilterType.PHASE_MATCH,
        causal: true,
        correctGroupDelay: false,
        phase: 'LR',
        dispersionModelName: 'Model1',
        lowFrequencyHz: 0.1,
        lowFrequencyTaperWidthHz: -0.01, // invalid low-frequency taper width
        highFrequencyHz: 10,
        highFrequencyTaperWidthHz: 0.1,
        numFrequencies: 100,
        referencePeriod: 10,
        frequencyTaperFunction: TaperFunction.COSINE,
        parameters: {
          receiverLocation: {
            latitudeDegrees: 0.1234,
            longitudeDegrees: -4.321,
            elevationKm: 0.01,
            depthKm: 0.02
          },
          sourceLocation: {
            latitudeDegrees: 1.2345,
            longitudeDegrees: 0.1234,
            time: 0.01,
            depthKm: 0.02
          }
        }
      };

      expect(phaseMatchFilterDescriptionSchema.safeParse(invalidDescription).success).toBeFalsy();
      expect(() => phaseMatchFilterDescriptionSchema.parse(invalidDescription))
        .toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "Low frequency taper width must be a non-negative number. Received -0.01",
              "path": []
            }
          ]"
        `);
    });

    it('should invalidate an object with a negative high frequency taper width', () => {
      const invalidDescription: PhaseMatchFilterDescription = {
        filterType: FilterType.PHASE_MATCH,
        causal: true,
        correctGroupDelay: false,
        phase: 'LR',
        dispersionModelName: 'Model1',
        lowFrequencyHz: 0.1,
        lowFrequencyTaperWidthHz: 0.01,
        highFrequencyHz: 10,
        highFrequencyTaperWidthHz: -10.1, // invalid high-frequency taper width
        numFrequencies: 100,
        referencePeriod: 10,
        frequencyTaperFunction: TaperFunction.COSINE,
        parameters: {
          receiverLocation: {
            latitudeDegrees: 0.1234,
            longitudeDegrees: -4.321,
            elevationKm: 0.01,
            depthKm: 0.02
          },
          sourceLocation: {
            latitudeDegrees: 1.2345,
            longitudeDegrees: 0.1234,
            time: 0.01,
            depthKm: 0.02
          }
        }
      };

      expect(phaseMatchFilterDescriptionSchema.safeParse(invalidDescription).success).toBeFalsy();
      expect(() => phaseMatchFilterDescriptionSchema.parse(invalidDescription))
        .toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "High frequency taper width must be a non-negative number. Received -10.1",
              "path": []
            }
          ]"
        `);
    });
    it('should invalidate an object with missing required fields', () => {
      const invalidDescription = {
        filterType: FilterType.PHASE_MATCH,
        causal: true,
        correctGroupDelay: false,
        phase: 'P',
        dispersionModelName: 'Model1',
        lowFrequencyHz: 0.1,
        lowFrequencyTaperWidthHz: 0.01,
        highFrequencyHz: 10,
        highFrequencyTaperWidthHz: 0.1,
        numFrequencies: 100,
        referencePeriod: 1
        // Missing frequencyTaperFunction
      };

      expect(phaseMatchFilterDescriptionSchema.safeParse(invalidDescription).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidDescription = {
        filterType: FilterType.PHASE_MATCH,
        causal: true,
        correctGroupDelay: false,
        phase: 'P',
        dispersionModelName: 'Model1',
        lowFrequencyHz: 0.1,
        lowFrequencyTaperWidthHz: '0.01', // should be a number
        highFrequencyHz: 10,
        highFrequencyTaperWidthHz: 0.1,
        numFrequencies: 100,
        referencePeriod: 1,
        frequencyTaperFunction: TaperFunction.HAMMING,
        parameters: {
          receiverLocation: {
            latitudeDegrees: 0.1234,
            longitudeDegrees: -74.006,
            elevationKm: 0.01,
            depthKm: 0.02
          },
          sourceLocation: {
            latitudeDegrees: 34.0522,
            longitudeDegrees: -118.2437,
            time: 0.01,
            depthKm: 0.02
          }
        }
      };

      expect(phaseMatchFilterDescriptionSchema.safeParse(invalidDescription).success).toBeFalsy();
    });

    it('should invalidate a filter with an improperly formatted taper definition', () => {
      const validFilter: PhaseMatchFilterDefinition = {
        name: 'Test Blackman',
        filterDescription: {
          filterType: FilterType.PHASE_MATCH,
          causal: true,
          correctGroupDelay: false,
          dispersionModelName: 'LP-TT LR 10° grid',
          frequencyTaperFunction: 'Blackman' as TaperFunction,
          highFrequencyHz: 0.1,
          highFrequencyTaperWidthHz: 20,
          lowFrequencyHz: 0.05,
          lowFrequencyTaperWidthHz: 20,
          numFrequencies: 60,
          phase: 'LR',
          referencePeriod: 300
        }
      };
      expect(phaseMatchFilterDescriptionSchema.safeParse(validFilter).success).toBeFalsy();
    });
  });

  describe('cascadeFilterDescriptionSchema', () => {
    it('should validate a valid CascadeFilterDescription object', () => {
      const validDescription: CascadeFilterDescription = {
        filterType: FilterType.CASCADE,
        causal: true,
        correctGroupDelay: false,
        filterDescriptions: [
          {
            filterType: FilterType.LINEAR,
            causal: true,
            correctGroupDelay: false,
            order: 4,
            zeroPhase: true,
            passBandType: BandType.BAND_PASS,
            linearFilterType: LinearFilterType.IIR_BUTTERWORTH
          },
          {
            filterType: FilterType.LINEAR,
            causal: true,
            correctGroupDelay: false,
            order: 4,
            zeroPhase: true,
            passBandType: BandType.HIGH_PASS,
            linearFilterType: LinearFilterType.IIR_BUTTERWORTH
          }
        ]
      };

      expect(cascadeFilterDescriptionSchema.safeParse(validDescription).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidDescription = {
        filterType: FilterType.CASCADE,
        causal: true
        // Missing filterDescriptions
      };

      expect(cascadeFilterDescriptionSchema.safeParse(invalidDescription).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidDescription = {
        filterType: FilterType.CASCADE,
        causal: true,
        correctGroupDelay: false,
        filterDescriptions: [
          {
            filterType: FilterType.LINEAR,
            causal: true,
            correctGroupDelay: false,
            order: '4', // order should be a number
            zeroPhase: true,
            passBandType: BandType.LOW_PASS,
            linearFilterType: LinearFilterType.FIR_OTHER
          }
        ]
      };

      expect(cascadeFilterDescriptionSchema.safeParse(invalidDescription).success).toBeFalsy();
    });
  });

  describe('filterDefinitionSchema', () => {
    it('should validate a valid FilterDefinition object', () => {
      const validDefinition: FilterDefinition = {
        name: 'Filter1',
        filterDescription: {
          filterType: FilterType.LINEAR,
          causal: false,
          correctGroupDelay: false,
          order: 4,
          zeroPhase: true,
          passBandType: BandType.HIGH_PASS,
          linearFilterType: LinearFilterType.IIR_BUTTERWORTH
        }
      };

      expect(filterDefinitionSchema.safeParse(validDefinition).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidDefinition = {
        // Missing name and filterDescription
      };

      expect(filterDefinitionSchema.safeParse(invalidDefinition).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidDefinition = {
        name: 'Filter1',
        filterDescription: {
          filterType: FilterType.LINEAR,
          causal: 'true' // causal should be a boolean
        }
      };

      expect(filterDefinitionSchema.safeParse(invalidDefinition).success).toBeFalsy();
    });
  });

  describe('linearFilterDefinitionSchema', () => {
    it('should validate a valid LinearFilterDefinition object', () => {
      const validDefinition: LinearFilterDefinition = {
        name: 'LinearFilter1',
        filterDescription: {
          filterType: FilterType.LINEAR,
          causal: true,
          correctGroupDelay: false,
          order: 4,
          zeroPhase: true,
          passBandType: BandType.HIGH_PASS,
          linearFilterType: LinearFilterType.IIR_BUTTERWORTH
        }
      };

      expect(linearFilterDefinitionSchema.safeParse(validDefinition).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidDefinition = {
        name: 'LinearFilter1'
        // Missing filterDescription
      };

      expect(linearFilterDefinitionSchema.safeParse(invalidDefinition).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidDefinition = {
        name: 'LinearFilter1',
        filterDescription: {
          filterType: FilterType.LINEAR,
          causal: true,
          correctGroupDelay: false,
          order: '4', // order should be a number
          zeroPhase: true,
          passBandType: BandType.LOW_PASS,
          linearFilterType: LinearFilterType.IIR_OTHER
        }
      };

      expect(linearFilterDefinitionSchema.safeParse(invalidDefinition).success).toBeFalsy();
    });

    it('should invalidate when the low frequency is greater than the high frequency', () => {
      const invalidFilterDefinition: LinearFilterDefinition = {
        name: 'Invalid band reject',
        comments: 'highFrequencyHz is lower than lowFrequencyHz... 💣',
        filterDescription: {
          filterType: FilterType.LINEAR,
          lowFrequencyHz: 1,
          highFrequencyHz: 0.1,
          order: 3,
          zeroPhase: false,
          passBandType: BandType.BAND_REJECT,
          linearFilterType: LinearFilterType.IIR_BUTTERWORTH,
          causal: true,
          correctGroupDelay: false,
          comments: 'highFrequencyHz is lower than lowFrequencyHz... 💣'
        }
      };

      expect(linearFilterDefinitionSchema.safeParse(invalidFilterDefinition).success).toBeFalsy();
      expect(() => linearFilterDefinitionSchema.parse(invalidFilterDefinition))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "highFrequencyHz is not greater than lowFrequencyHz",
            "path": [
              "filterDescription",
              "highFrequencyHz"
            ]
          }
        ]"
      `);
    });
  });

  describe('autoRegressiveFilterDefinitionSchema', () => {
    it('should validate a valid AutoRegressiveFilterDefinition object', () => {
      const validDefinition: AutoRegressiveFilterDefinition = {
        name: 'AutoRegressiveFilter1',
        filterDescription: {
          filterType: FilterType.AUTOREGRESSIVE,
          causal: true,
          correctGroupDelay: false,
          order: 4,
          noiseWindowDuration: 10,
          noiseWindowOffset: 5,
          signalWindowOffset: 5,
          autoregressiveType: AutoregressiveType.N,
          autoregressiveFilterType: AutoregressiveFilterType.NON_ADAPTIVE
        }
      };

      expect(autoRegressiveFilterDefinitionSchema.safeParse(validDefinition).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidDefinition = {
        name: 'AutoRegressiveFilter1'
        // Missing filterDescription
      };

      expect(autoRegressiveFilterDefinitionSchema.safeParse(invalidDefinition).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidDefinition = {
        name: 'AutoRegressiveFilter1',
        filterDescription: {
          filterType: FilterType.AUTOREGRESSIVE,
          causal: true,
          correctGroupDelay: false,
          order: '4', // order should be a number
          noiseWindowDuration: 10,
          noiseWindowOffset: 5,
          signalWindowOffset: 5,
          autoregressiveType: AutoregressiveType.N_SQUARED,
          autoregressiveFilterType: AutoregressiveFilterType.ADAPTIVE
        }
      };

      expect(autoRegressiveFilterDefinitionSchema.safeParse(invalidDefinition).success).toBeFalsy();
    });
  });

  describe('phaseMatchFilterDefinitionSchema', () => {
    it('should validate a valid PhaseMatchFilterDefinition object', () => {
      const validDefinition: PhaseMatchFilterDefinition = {
        name: 'PhaseMatchFilter1',
        filterDescription: {
          filterType: FilterType.PHASE_MATCH,
          causal: true,
          correctGroupDelay: false,
          phase: 'LR',
          dispersionModelName: 'Model1',
          lowFrequencyHz: 0.1,
          lowFrequencyTaperWidthHz: 0.01,
          highFrequencyHz: 10,
          highFrequencyTaperWidthHz: 0.1,
          numFrequencies: 100,
          referencePeriod: 1,
          frequencyTaperFunction: TaperFunction.COSINE,
          parameters: {
            receiverLocation: {
              latitudeDegrees: 0.0,
              longitudeDegrees: -160.0,
              elevationKm: 0.01,
              depthKm: 0.02
            },
            sourceLocation: {
              latitudeDegrees: 0.0,
              longitudeDegrees: -140.0,
              time: 0.01,
              depthKm: 0.02
            }
          }
        }
      };
      expect(phaseMatchFilterDefinitionSchema.safeParse(validDefinition).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidDefinition = {
        name: 'PhaseMatchFilter1'
        // Missing filterDescription
      };

      expect(phaseMatchFilterDefinitionSchema.safeParse(invalidDefinition).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidDefinition = {
        name: 'PhaseMatchFilter1',
        filterDescription: {
          filterType: FilterType.PHASE_MATCH,
          causal: true,
          correctGroupDelay: false,
          phase: 'P',
          dispersionModelName: 'Model1',
          lowFrequencyHz: 0.1,
          lowFrequencyTaperWidthHz: 0.01,
          highFrequencyHz: 10,
          highFrequencyTaperWidthHz: 0.1,
          numFrequencies: 100,
          referencePeriod: 1,
          frequencyTaperFunction: TaperFunction.COSINE,
          parameters: {
            receiverLocation: {
              latitudeDegrees: 0.0,
              longitudeDegrees: -160.0,
              elevationKm: 0.01,
              depthKm: 0.02
            },
            sourceLocation: {
              latitudeDegrees: 0.0,
              longitudeDegrees: -140.0,
              time: '0.01', // elevationKm should be a number
              depthKm: 0.02
            }
          }
        }
      };

      expect(phaseMatchFilterDefinitionSchema.safeParse(invalidDefinition).success).toBeFalsy();
    });
  });

  describe('cascadeFilterDefinitionSchema', () => {
    it('should validate a valid CascadeFilterDefinition object', () => {
      const validDefinition: CascadeFilterDefinition = {
        name: 'CascadeFilter1',
        filterDescription: {
          filterType: FilterType.CASCADE,
          causal: true,
          correctGroupDelay: false,
          filterDescriptions: [
            {
              filterType: FilterType.LINEAR,
              causal: true,
              correctGroupDelay: false,
              order: 4,
              zeroPhase: true,
              passBandType: BandType.HIGH_PASS,
              linearFilterType: LinearFilterType.FIR_HAMMING
            }
          ]
        }
      };

      expect(cascadeFilterDefinitionSchema.safeParse(validDefinition).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidDefinition = {
        name: 'CascadeFilter1'
        // Missing filterDescription
      };

      expect(cascadeFilterDefinitionSchema.safeParse(invalidDefinition).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidDefinition = {
        name: 'CascadeFilter1',
        filterDescription: {
          filterType: FilterType.CASCADE,
          causal: true,
          filterDescriptions: [
            {
              filterType: FilterType.LINEAR,
              causal: true,
              order: '4', // order should be a number
              zeroPhase: true,
              passBandType: BandType.BAND_PASS,
              linearFilterType: LinearFilterType.FIR_OTHER
            }
          ]
        }
      };

      expect(cascadeFilterDefinitionSchema.safeParse(invalidDefinition).success).toBeFalsy();
    });
  });

  describe('baseFilterSchema', () => {
    it('should validate a valid BaseFilter object', () => {
      const validBaseFilter: BaseFilter = {
        withinHotKeyCycle: true
      };

      expect(baseFilterSchema.safeParse(validBaseFilter).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidBaseFilter = {
        // Missing withinHotKeyCycle
      };

      expect(baseFilterSchema.safeParse(invalidBaseFilter).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidBaseFilter = {
        withinHotKeyCycle: 'true' // withinHotKeyCycle should be a boolean
      };

      expect(baseFilterSchema.safeParse(invalidBaseFilter).success).toBeFalsy();
    });
  });

  describe('filterSchema', () => {
    it('should validate a valid Filter object with unfiltered', () => {
      const validFilter: Filter = {
        withinHotKeyCycle: true,
        unfiltered: true
      };

      filterSchema.parse(validFilter);
      expect(filterSchema.safeParse(validFilter).success).toBeTruthy();
    });

    it('should validate a valid Filter object with namedFilter', () => {
      const validFilter = {
        withinHotKeyCycle: true,
        namedFilter: FilterDefinitionUsage.DETECTION
      };

      expect(filterSchema.safeParse(validFilter).success).toBeTruthy();
    });

    it('should validate a valid Filter object with filterDefinition', () => {
      const validFilter = {
        withinHotKeyCycle: true,
        filterDefinition: {
          name: 'Filter1',
          filterDescription: {
            filterType: FilterType.LINEAR,
            causal: false,
            correctGroupDelay: false,
            order: 4,
            zeroPhase: true,
            passBandType: BandType.HIGH_PASS,
            linearFilterType: LinearFilterType.IIR_BUTTERWORTH
          }
        }
      };

      expect(filterSchema.safeParse(validFilter).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidFilter = {
        // Missing withinHotKeyCycle and filter details
      };

      expect(filterSchema.safeParse(invalidFilter).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidFilter = {
        withinHotKeyCycle: 'true', // withinHotKeyCycle should be a boolean
        unfiltered: true
      };

      expect(filterSchema.safeParse(invalidFilter).success).toBeFalsy();
    });

    it('should invalidate when the low frequency is greater than the high frequency', () => {
      const invalidFilter: Filter = {
        _uiIsError: false,
        filterDefinition: {
          name: 'Invalid band reject',
          comments: 'highFrequencyHz is lower than lowFrequencyHz... 💣',
          filterDescription: {
            filterType: FilterType.LINEAR,
            lowFrequencyHz: 1,
            highFrequencyHz: 0.1,
            order: 3,
            zeroPhase: false,
            passBandType: BandType.BAND_REJECT,
            linearFilterType: LinearFilterType.IIR_BUTTERWORTH,
            causal: true,
            correctGroupDelay: false,
            comments: 'highFrequencyHz is lower than lowFrequencyHz... 💣'
          }
        },
        withinHotKeyCycle: false
      };

      expect(filterSchema.safeParse(invalidFilter).success).toBeFalsy();
      expect(() => filterSchema.parse(invalidFilter)).toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "highFrequencyHz is not greater than lowFrequencyHz",
            "path": [
              "filterDefinition",
              "filterDescription",
              "highFrequencyHz"
            ]
          }
        ]"
      `);
    });
  });

  describe('filterListSchema', () => {
    it('should validate a valid FilterList object', () => {
      const validFilterList: FilterList = {
        name: 'FilterList1',
        defaultFilterIndex: 0,
        filters: [
          {
            withinHotKeyCycle: true,
            unfiltered: true
          }
        ]
      };

      expect(filterListSchema.safeParse(validFilterList).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidFilterList = {
        name: 'FilterList1'
        // Missing defaultFilterIndex and filters
      };

      expect(filterListSchema.safeParse(invalidFilterList).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidFilterList = {
        name: 'FilterList1',
        defaultFilterIndex: '0', // defaultFilterIndex should be a number
        filters: [
          {
            withinHotKeyCycle: true,
            unfiltered: true
          }
        ]
      };

      expect(filterListSchema.safeParse(invalidFilterList).success).toBeFalsy();
    });
  });
});
