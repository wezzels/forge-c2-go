import { Units } from '../../src/ts/common';
import type { EventTypes } from '../../src/ts/event';
import {
  eventHypothesisSchema,
  featurePredictionSchema,
  locationRestraintSchema,
  locationSolutionSchema,
  networkMagnitudeSolutionSchema,
  predictionValueSchema
} from '../../src/ts/event/schema';
import {
  DepthRestraintReason,
  FeaturePredictionComponentType,
  RestrainerType,
  RestraintType,
  ScalingFactorType
} from '../../src/ts/event/types';
import { FeatureMeasurementType } from '../../src/ts/signal-detection';
import { locationSolution } from '../__data__';

describe('event schema', () => {
  describe('locationRestraintSchema', () => {
    it('should validate a valid object', () => {
      expect(
        locationRestraintSchema.safeParse(locationSolution.locationRestraint).success
      ).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      expect(locationRestraintSchema.safeParse({}).success).toBeFalsy();
    });
  });

  describe('event hypothesis', () => {
    const eventHypothesis: EventTypes.EventHypothesis = {
      id: {
        eventId: 'e4da3b7f-bbce-3345-9777-2b0674a318d5',
        hypothesisId: '22c67236-8688-4731-bed9-8d3a512d46e6'
      },
      associatedSignalDetectionHypotheses: [
        {
          id: {
            id: '351c9a2e-10bb-3d92-8a74-4445824a7e1c',
            signalDetectionId: 'a4d2f0d2-3dcc-34ce-983f-f9157f8b7f88'
          }
        },
        {
          id: {
            id: 'a4ed5b7f-4a96-39b7-92af-920aa7f7e8b4',
            signalDetectionId: 'c0560792-e4a3-379e-a2f7-6cbf9fb277dd'
          }
        }
      ],
      deleted: false,
      locationSolutions: [
        {
          featurePredictions: {
            featurePredictions: [
              {
                channel: {
                  effectiveAt: 1730092492.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                predictionValue: {
                  derivativeMap: {
                    DERIVATIVE_WRT_LATITUDE: {
                      units: Units.UNITLESS,
                      value: -0.6153218242923946
                    },
                    DERIVATIVE_WRT_LONGITUDE: {
                      units: Units.UNITLESS,
                      value: -1.0895521013721827
                    },
                    DERIVATIVE_WRT_TIME: {
                      units: Units.DEGREES_PER_SECOND,
                      value: 0
                    }
                  },
                  featureMeasurementType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 5,
                      units: Units.DEGREES,
                      value: 53.19271656571702
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                      value: {
                        units: Units.DEGREES,
                        value: 53.19271656571702
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0,
                  elevationKm: 0.4,
                  latitudeDegrees: 53.108215,
                  longitudeDegrees: 157.69885
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: -11.078559092166564,
                  longitudeDegrees: -62.98237588432701,
                  time: 1730091526.802
                }
              },
              {
                channel: {
                  effectiveAt: 1730092214.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                predictionValue: {
                  derivativeMap: {
                    DERIVATIVE_WRT_LATITUDE: {
                      units: Units.UNITLESS,
                      value: -0.3687680273069783
                    },
                    DERIVATIVE_WRT_LONGITUDE: {
                      units: Units.UNITLESS,
                      value: -0.9365594575326994
                    },
                    DERIVATIVE_WRT_TIME: {
                      units: Units.DEGREES_PER_SECOND,
                      value: 0
                    }
                  },
                  featureMeasurementType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 5,
                      units: Units.DEGREES,
                      value: 129.23413513136327
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                      value: {
                        units: Units.DEGREES,
                        value: 129.23413513136327
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0,
                  elevationKm: 0.1679,
                  latitudeDegrees: 62.49308,
                  longitudeDegrees: -114.6061
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: -11.078559092166564,
                  longitudeDegrees: -62.98237588432701,
                  time: 1730091526.802
                }
              },
              {
                channel: {
                  effectiveAt: 1730092492.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: FeatureMeasurementType.ARRIVAL_TIME,
                predictionValue: {
                  derivativeMap: {
                    DERIVATIVE_WRT_LATITUDE: {
                      units: Units.SECONDS_PER_DEGREE,
                      value: -5459.203081271577
                    },
                    DERIVATIVE_WRT_LONGITUDE: {
                      units: Units.SECONDS_PER_DEGREE,
                      value: 3083.071286742644
                    },
                    DERIVATIVE_WRT_TIME: {
                      units: Units.UNITLESS,
                      value: 1
                    }
                  },
                  featureMeasurementType: FeatureMeasurementType.ARRIVAL_TIME,
                  predictedValue: {
                    arrivalTime: {
                      standardDeviation: -999999,
                      value: 1730092672.732
                    },
                    travelTime: {
                      standardDeviation: -999999,
                      value: 1145.93
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                      value: {
                        standardDeviation: 0,
                        value: 1145.854
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.ELEVATION_CORRECTION,
                      value: {
                        standardDeviation: 0,
                        value: 0.069
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.ELLIPTICITY_CORRECTION,
                      value: {
                        standardDeviation: 0,
                        value: 0.007
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0,
                  elevationKm: 0.4,
                  latitudeDegrees: 53.108215,
                  longitudeDegrees: 157.69885
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: -11.078559092166564,
                  longitudeDegrees: -62.98237588432701,
                  time: 1730091526.802
                }
              },
              {
                channel: {
                  effectiveAt: 1730092214.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: FeatureMeasurementType.ARRIVAL_TIME,
                predictionValue: {
                  derivativeMap: {
                    DERIVATIVE_WRT_LATITUDE: {
                      units: Units.SECONDS_PER_DEGREE,
                      value: -15723.38550116542
                    },
                    DERIVATIVE_WRT_LONGITUDE: {
                      units: Units.SECONDS_PER_DEGREE,
                      value: 6191.045114345527
                    },
                    DERIVATIVE_WRT_TIME: {
                      units: Units.UNITLESS,
                      value: 1
                    }
                  },
                  featureMeasurementType: FeatureMeasurementType.ARRIVAL_TIME,
                  predictedValue: {
                    arrivalTime: {
                      standardDeviation: 1.937,
                      value: 1730092274.99
                    },
                    travelTime: {
                      standardDeviation: 1.937,
                      value: 748.188
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.ELLIPTICITY_CORRECTION,
                      value: {
                        standardDeviation: 0,
                        value: -0.306
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.ELEVATION_CORRECTION,
                      value: {
                        standardDeviation: 0,
                        value: 0.028
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                      value: {
                        standardDeviation: 0,
                        value: 749.461
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: FeaturePredictionComponentType.PATH_CORRECTION,
                      value: {
                        standardDeviation: 0,
                        value: -0.995
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0,
                  elevationKm: 0.1679,
                  latitudeDegrees: 62.49308,
                  longitudeDegrees: -114.6061
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: -11.078559092166564,
                  longitudeDegrees: -62.98237588432701,
                  time: 1730091526.802
                }
              },
              {
                channel: {
                  effectiveAt: 1730092492.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: FeatureMeasurementType.SLOWNESS,
                predictionValue: {
                  derivativeMap: {
                    DERIVATIVE_WRT_LATITUDE: {
                      units: Units.SECONDS_PER_DEGREE,
                      value: 0.002612544137532609
                    },
                    DERIVATIVE_WRT_LONGITUDE: {
                      units: Units.SECONDS_PER_DEGREE,
                      value: -0.00147542776772805
                    },
                    DERIVATIVE_WRT_TIME: {
                      units: Units.ONE_OVER_DEGREE,
                      value: 0
                    }
                  },
                  featureMeasurementType: FeatureMeasurementType.SLOWNESS,
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 0.5,
                      units: Units.SECONDS_PER_DEGREE,
                      value: 1.909837699915181
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                      value: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: 1.909837699915181
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0,
                  elevationKm: 0.4,
                  latitudeDegrees: 53.108215,
                  longitudeDegrees: 157.69885
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: -11.078559092166564,
                  longitudeDegrees: -62.98237588432701,
                  time: 1730091526.802
                }
              },
              {
                channel: {
                  effectiveAt: 1730092214.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: FeatureMeasurementType.SLOWNESS,
                predictionValue: {
                  derivativeMap: {
                    DERIVATIVE_WRT_LATITUDE: {
                      units: Units.SECONDS_PER_DEGREE,
                      value: 0.06632552921495782
                    },
                    DERIVATIVE_WRT_LONGITUDE: {
                      units: Units.SECONDS_PER_DEGREE,
                      value: -0.026115517143061238
                    },
                    DERIVATIVE_WRT_TIME: {
                      units: Units.ONE_OVER_DEGREE,
                      value: 0
                    }
                  },
                  featureMeasurementType: FeatureMeasurementType.SLOWNESS,
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 0.5,
                      units: Units.SECONDS_PER_DEGREE,
                      value: 5.147528697666502
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                      value: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: 5.147528697666502
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0,
                  elevationKm: 0.1679,
                  latitudeDegrees: 62.49308,
                  longitudeDegrees: -114.6061
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: -11.078559092166564,
                  longitudeDegrees: -62.98237588432701,
                  time: 1730091526.802
                }
              }
            ]
          },
          location: {
            depthKm: 0,
            latitudeDegrees: -11.078559092166564,
            longitudeDegrees: -62.98237588432701,
            time: 1730091526.802
          },
          locationBehaviors: [
            {
              defining: true,
              measurement: {
                channel: {
                  effectiveAt: 1730092492.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                },
                featureMeasurementType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                measurementValue: {
                  measuredValue: {
                    standardDeviation: 17.902263,
                    units: Units.DEGREES,
                    value: 108.24585
                  }
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1730092492.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                predictionValue: {
                  derivativeMap: {
                    DERIVATIVE_WRT_LATITUDE: {
                      units: Units.UNITLESS,
                      value: -0.6153218242923946
                    },
                    DERIVATIVE_WRT_LONGITUDE: {
                      units: Units.UNITLESS,
                      value: -1.0895521013721827
                    },
                    DERIVATIVE_WRT_TIME: {
                      units: Units.DEGREES_PER_SECOND,
                      value: 0
                    }
                  },
                  featureMeasurementType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 5,
                      units: Units.DEGREES,
                      value: 53.19271656571702
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                      value: {
                        units: Units.DEGREES,
                        value: 53.19271656571702
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0,
                  elevationKm: 0.4,
                  latitudeDegrees: 53.108215,
                  longitudeDegrees: 157.69885
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: -11.078559092166564,
                  longitudeDegrees: -62.98237588432701,
                  time: 1730091526.802
                }
              },
              requestedDefining: true,
              residual: 55.05313343428305,
              weight: 0.05379991850832199
            },
            {
              defining: false,
              measurement: {
                channel: {
                  effectiveAt: 1730092492.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                },
                featureMeasurementType: FeatureMeasurementType.ARRIVAL_TIME,
                measurementValue: {
                  arrivalTime: {
                    standardDeviation: 1.72,
                    value: 1730092552.375
                  }
                },
                snr: {
                  units: Units.DECIBELS,
                  value: 3.6538372
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1730092492.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: FeatureMeasurementType.ARRIVAL_TIME,
                predictionValue: {
                  derivativeMap: {
                    DERIVATIVE_WRT_LATITUDE: {
                      units: Units.SECONDS_PER_DEGREE,
                      value: -5459.203081271577
                    },
                    DERIVATIVE_WRT_LONGITUDE: {
                      units: Units.SECONDS_PER_DEGREE,
                      value: 3083.071286742644
                    },
                    DERIVATIVE_WRT_TIME: {
                      units: Units.UNITLESS,
                      value: 1
                    }
                  },
                  featureMeasurementType: FeatureMeasurementType.ARRIVAL_TIME,
                  predictedValue: {
                    arrivalTime: {
                      standardDeviation: -999999,
                      value: 1730092672.732
                    },
                    travelTime: {
                      standardDeviation: -999999,
                      value: 1145.93
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                      value: {
                        standardDeviation: 0,
                        value: 1145.854
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.ELEVATION_CORRECTION,
                      value: {
                        standardDeviation: 0,
                        value: 0.069
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.ELLIPTICITY_CORRECTION,
                      value: {
                        standardDeviation: 0,
                        value: 0.007
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0,
                  elevationKm: 0.4,
                  latitudeDegrees: 53.108215,
                  longitudeDegrees: 157.69885
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: -11.078559092166564,
                  longitudeDegrees: -62.98237588432701,
                  time: 1730091526.802
                }
              },
              requestedDefining: true,
              residual: -999999,
              weight: 1
            },
            {
              defining: true,
              measurement: {
                channel: {
                  effectiveAt: 1730092492.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                },
                featureMeasurementType: FeatureMeasurementType.SLOWNESS,
                measurementValue: {
                  measuredValue: {
                    standardDeviation: 4.42,
                    units: Units.SECONDS_PER_DEGREE,
                    value: 14.205898
                  }
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1730092492.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: FeatureMeasurementType.SLOWNESS,
                predictionValue: {
                  derivativeMap: {
                    DERIVATIVE_WRT_LATITUDE: {
                      units: Units.SECONDS_PER_DEGREE,
                      value: 0.002612544137532609
                    },
                    DERIVATIVE_WRT_LONGITUDE: {
                      units: Units.SECONDS_PER_DEGREE,
                      value: -0.00147542776772805
                    },
                    DERIVATIVE_WRT_TIME: {
                      units: Units.ONE_OVER_DEGREE,
                      value: 0
                    }
                  },
                  featureMeasurementType: FeatureMeasurementType.SLOWNESS,
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 0.5,
                      units: Units.SECONDS_PER_DEGREE,
                      value: 1.909837699915181
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                      value: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: 1.909837699915181
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0,
                  elevationKm: 0.4,
                  latitudeDegrees: 53.108215,
                  longitudeDegrees: 157.69885
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: -11.078559092166564,
                  longitudeDegrees: -62.98237588432701,
                  time: 1730091526.802
                }
              },
              requestedDefining: true,
              residual: 12.29606030008482,
              weight: 0.22481050839953104
            },
            {
              defining: true,
              measurement: {
                channel: {
                  effectiveAt: 1730092214.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                },
                featureMeasurementType: FeatureMeasurementType.ARRIVAL_TIME,
                measurementValue: {
                  arrivalTime: {
                    standardDeviation: 1.72,
                    value: 1730092274.975
                  }
                },
                snr: {
                  units: Units.DECIBELS,
                  value: 3.5784304
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1730092214.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: FeatureMeasurementType.ARRIVAL_TIME,
                predictionValue: {
                  derivativeMap: {
                    DERIVATIVE_WRT_LATITUDE: {
                      units: Units.SECONDS_PER_DEGREE,
                      value: -15723.38550116542
                    },
                    DERIVATIVE_WRT_LONGITUDE: {
                      units: Units.SECONDS_PER_DEGREE,
                      value: 6191.045114345527
                    },
                    DERIVATIVE_WRT_TIME: {
                      units: Units.UNITLESS,
                      value: 1
                    }
                  },
                  featureMeasurementType: FeatureMeasurementType.ARRIVAL_TIME,
                  predictedValue: {
                    arrivalTime: {
                      standardDeviation: 1.937,
                      value: 1730092274.99
                    },
                    travelTime: {
                      standardDeviation: 1.937,
                      value: 748.188
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.ELLIPTICITY_CORRECTION,
                      value: {
                        standardDeviation: 0,
                        value: -0.306
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.ELEVATION_CORRECTION,
                      value: {
                        standardDeviation: 0,
                        value: 0.028
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                      value: {
                        standardDeviation: 0,
                        value: 749.461
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: FeaturePredictionComponentType.PATH_CORRECTION,
                      value: {
                        standardDeviation: 0,
                        value: -0.995
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0,
                  elevationKm: 0.1679,
                  latitudeDegrees: 62.49308,
                  longitudeDegrees: -114.6061
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: -11.078559092166564,
                  longitudeDegrees: -62.98237588432701,
                  time: 1730091526.802
                }
              },
              requestedDefining: true,
              residual: -0.014689581635479954,
              weight: 0.38608299735242935
            },
            {
              defining: true,
              measurement: {
                channel: {
                  effectiveAt: 1730092214.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                },
                featureMeasurementType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                measurementValue: {
                  measuredValue: {
                    standardDeviation: 7.626245,
                    units: Units.DEGREES,
                    value: 112.90577
                  }
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1730092214.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                predictionValue: {
                  derivativeMap: {
                    DERIVATIVE_WRT_LATITUDE: {
                      units: Units.UNITLESS,
                      value: -0.3687680273069783
                    },
                    DERIVATIVE_WRT_LONGITUDE: {
                      units: Units.UNITLESS,
                      value: -0.9365594575326994
                    },
                    DERIVATIVE_WRT_TIME: {
                      units: Units.DEGREES_PER_SECOND,
                      value: 0
                    }
                  },
                  featureMeasurementType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 5,
                      units: Units.DEGREES,
                      value: 129.23413513136327
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                      value: {
                        units: Units.DEGREES,
                        value: 129.23413513136327
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0,
                  elevationKm: 0.1679,
                  latitudeDegrees: 62.49308,
                  longitudeDegrees: -114.6061
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: -11.078559092166564,
                  longitudeDegrees: -62.98237588432701,
                  time: 1730091526.802
                }
              },
              requestedDefining: true,
              residual: -16.328365131363295,
              weight: 0.10965887111740245
            },
            {
              defining: true,
              measurement: {
                channel: {
                  effectiveAt: 1730092214.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                },
                featureMeasurementType: FeatureMeasurementType.SLOWNESS,
                measurementValue: {
                  measuredValue: {
                    standardDeviation: 0.72,
                    units: Units.SECONDS_PER_DEGREE,
                    value: 5.4130544
                  }
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1730092214.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: FeatureMeasurementType.SLOWNESS,
                predictionValue: {
                  derivativeMap: {
                    DERIVATIVE_WRT_LATITUDE: {
                      units: Units.SECONDS_PER_DEGREE,
                      value: 0.06632552921495782
                    },
                    DERIVATIVE_WRT_LONGITUDE: {
                      units: Units.SECONDS_PER_DEGREE,
                      value: -0.026115517143061238
                    },
                    DERIVATIVE_WRT_TIME: {
                      units: Units.ONE_OVER_DEGREE,
                      value: 0
                    }
                  },
                  featureMeasurementType: FeatureMeasurementType.SLOWNESS,
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 0.5,
                      units: Units.SECONDS_PER_DEGREE,
                      value: 5.147528697666502
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent:
                        FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                      value: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: 5.147528697666502
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0,
                  elevationKm: 0.1679,
                  latitudeDegrees: 62.49308,
                  longitudeDegrees: -114.6061
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: -11.078559092166564,
                  longitudeDegrees: -62.98237588432701,
                  time: 1730091526.802
                }
              },
              requestedDefining: true,
              residual: 0.2655257023334987,
              weight: 1.1407916189906886
            }
          ],
          locationRestraint: {
            depthRestraintKm: 0,
            depthRestraintReason: DepthRestraintReason.FIXED_AT_SURFACE,
            depthRestraintType: RestraintType.FIXED,
            epicenterRestraintType: RestraintType.UNRESTRAINED,
            restrainer: RestrainerType.FIXED_BY_CONFIGURATION,
            timeRestraintType: RestraintType.UNRESTRAINED
          },
          locationUncertainty: {
            ellipses: [
              {
                aprioriStandardError: 2,
                confidenceLevel: 0.5,
                depthUncertaintyKm: 0,
                kWeight: Infinity,
                scalingFactorType: ScalingFactorType.COVERAGE,
                semiMajorAxisLengthKm: 3338.164273666333,
                semiMajorAxisTrendDeg: 154.9384408276519,
                semiMinorAxisLengthKm: 2110.3716509004116,
                timeUncertainty: 123.575
              },
              {
                aprioriStandardError: 2,
                confidenceLevel: 0.5,
                depthUncertaintyKm: 0,
                kWeight: 0,
                scalingFactorType: ScalingFactorType.CONFIDENCE,
                semiMajorAxisLengthKm: 26392.47027448302,
                semiMajorAxisTrendDeg: 154.9384408276519,
                semiMinorAxisLengthKm: 16685.19476524362,
                timeUncertainty: 851.66
              },
              {
                aprioriStandardError: 2,
                confidenceLevel: 0.5,
                depthUncertaintyKm: 0,
                kWeight: 8,
                scalingFactorType: ScalingFactorType.K_WEIGHTED,
                semiMajorAxisLengthKm: 6503.229176419157,
                semiMajorAxisTrendDeg: 154.9384408276519,
                semiMinorAxisLengthKm: 4111.310698963891,
                timeUncertainty: 233.86
              }
            ],
            ellipsoids: [],
            stdDevTravelTimeResiduals: 0,
            tt: 3975.263262475614,
            xt: 78670.483475492,
            xx: 1659529.6310994194,
            xy: -428427.3366720847,
            xz: 0,
            yt: -34424.79509918726,
            yy: 943675.1613417096,
            yz: 0,
            zt: 0,
            zz: 1
          },
          networkMagnitudeSolutions: [],
          id: 'e8bcc0bc-a9d6-4073-97f7-4c23267ef48f'
        }
      ],
      parentEventHypotheses: [
        {
          id: {
            eventId: 'e4da3b7f-bbce-3345-9777-2b0674a318d5',
            hypothesisId: 'c4fc9dea-7af4-3afb-97a9-392cc51ea60e'
          }
        }
      ],
      preferredLocationSolution: {
        id: 'e8bcc0bc-a9d6-4073-97f7-4c23267ef48f'
      },
      rejected: false
    };

    it('should validate a location solution', () => {
      eventHypothesis.locationSolutions.forEach(ls => {
        ls.networkMagnitudeSolutions.forEach(nMS => {
          networkMagnitudeSolutionSchema.parse(nMS);
          expect(networkMagnitudeSolutionSchema.safeParse(nMS).success).toBeTruthy();
        });

        ls.featurePredictions.featurePredictions.forEach(fp => {
          predictionValueSchema.parse(fp.predictionValue);
          expect(predictionValueSchema.safeParse(fp.predictionValue).success).toBeTruthy();

          featurePredictionSchema.parse(fp);
          expect(featurePredictionSchema.safeParse(fp).success).toBeTruthy();
        });

        locationSolutionSchema.parse(ls);
        expect(locationSolutionSchema.safeParse(ls).success).toBeTruthy();
      });
    });

    it('should validate an event hypothesis', () => {
      eventHypothesisSchema.parse(eventHypothesis);
      expect(eventHypothesisSchema.safeParse(eventHypothesis).success).toBeTruthy();
    });

    it('should parse an invalid event hypothesis', () => {
      const eventHypothesisBad: EventTypes.EventHypothesis = {
        id: {
          eventId: 'e4da3b7f-bbce-3345-9777-2b0674a318d5',
          hypothesisId: '22c67236-8688-4731-bed9-8d3a512d46e6'
        },
        associatedSignalDetectionHypotheses: [
          {
            id: {
              id: '351c9a2e-10bb-3d92-8a74-4445824a7e1c',
              signalDetectionId: 'a4d2f0d2-3dcc-34ce-983f-f9157f8b7f88'
            }
          },
          {
            id: {
              id: 'a4ed5b7f-4a96-39b7-92af-920aa7f7e8b4',
              signalDetectionId: 'c0560792-e4a3-379e-a2f7-6cbf9fb277dd'
            }
          }
        ],
        deleted: false,
        locationSolutions: [
          {
            featurePredictions: {
              featurePredictions: [
                {
                  channel: {
                    effectiveAt: 1730092492.375,
                    name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                  },
                  extrapolated: false,
                  phase: 'P',
                  predictionType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                  predictionValue: {
                    derivativeMap: {
                      DERIVATIVE_WRT_LATITUDE: {
                        units: Units.UNITLESS,
                        value: -0.6153218242923946
                      },
                      DERIVATIVE_WRT_LONGITUDE: {
                        units: Units.UNITLESS,
                        value: -1.0895521013721827
                      },
                      DERIVATIVE_WRT_TIME: {
                        units: Units.DEGREES_PER_SECOND,
                        value: 0
                      }
                    },
                    featureMeasurementType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                    predictedValue: {
                      measuredValue: {
                        standardDeviation: 5,
                        units: Units.DEGREES,
                        value: 53.19271656571702
                      }
                    },
                    featurePredictionComponents: [
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                        value: {
                          units: Units.DEGREES,
                          value: 53.19271656571702
                        }
                      }
                    ]
                  },
                  receiverLocation: {
                    depthKm: 0,
                    elevationKm: 0.4,
                    latitudeDegrees: 53.108215,
                    longitudeDegrees: 157.69885
                  },
                  sourceLocation: {
                    depthKm: 0,
                    latitudeDegrees: -11.078559092166564,
                    longitudeDegrees: -62.98237588432701,
                    time: 1730091526.802
                  }
                },
                {
                  channel: {
                    effectiveAt: 1730092214.975,
                    name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                  },
                  extrapolated: false,
                  phase: 'P',
                  predictionType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                  predictionValue: {
                    derivativeMap: {
                      DERIVATIVE_WRT_LATITUDE: {
                        units: Units.UNITLESS,
                        value: -0.3687680273069783
                      },
                      DERIVATIVE_WRT_LONGITUDE: {
                        units: Units.UNITLESS,
                        value: -0.9365594575326994
                      },
                      DERIVATIVE_WRT_TIME: {
                        units: Units.DEGREES_PER_SECOND,
                        value: 0
                      }
                    },
                    featureMeasurementType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                    predictedValue: {
                      measuredValue: {
                        standardDeviation: 5,
                        units: Units.DEGREES,
                        value: 129.23413513136327
                      }
                    },
                    featurePredictionComponents: [
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                        value: {
                          units: Units.DEGREES,
                          value: 129.23413513136327
                        }
                      }
                    ]
                  },
                  receiverLocation: {
                    depthKm: 0,
                    elevationKm: 0.1679,
                    latitudeDegrees: 62.49308,
                    longitudeDegrees: -114.6061
                  },
                  sourceLocation: {
                    depthKm: 0,
                    latitudeDegrees: -11.078559092166564,
                    longitudeDegrees: -62.98237588432701,
                    time: 1730091526.802
                  }
                },
                {
                  channel: {
                    effectiveAt: 1730092492.375,
                    name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                  },
                  extrapolated: false,
                  phase: 'P',
                  predictionType: FeatureMeasurementType.ARRIVAL_TIME,
                  predictionValue: {
                    derivativeMap: {
                      DERIVATIVE_WRT_LATITUDE: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: -5459.203081271577
                      },
                      DERIVATIVE_WRT_LONGITUDE: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: 3083.071286742644
                      },
                      DERIVATIVE_WRT_TIME: {
                        units: Units.UNITLESS,
                        value: 1
                      }
                    },
                    featureMeasurementType: FeatureMeasurementType.ARRIVAL_TIME,
                    predictedValue: {
                      arrivalTime: {
                        standardDeviation: -999999,
                        value: 1730092672.732
                      },
                      travelTime: {
                        standardDeviation: -999999,
                        value: 1145.93
                      }
                    },
                    featurePredictionComponents: [
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                        value: {
                          standardDeviation: 0,
                          value: 1145.854
                        }
                      },
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.ELEVATION_CORRECTION,
                        value: {
                          standardDeviation: 0,
                          value: 0.069
                        }
                      },
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.ELLIPTICITY_CORRECTION,
                        value: {
                          standardDeviation: 0,
                          value: 0.007
                        }
                      }
                    ]
                  },
                  receiverLocation: {
                    depthKm: 0,
                    elevationKm: 0.4,
                    latitudeDegrees: 53.108215,
                    longitudeDegrees: 157.69885
                  },
                  sourceLocation: {
                    depthKm: 0,
                    latitudeDegrees: -11.078559092166564,
                    longitudeDegrees: -62.98237588432701,
                    time: 1730091526.802
                  }
                },
                {
                  channel: {
                    effectiveAt: 1730092214.975,
                    name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                  },
                  extrapolated: false,
                  phase: 'P',
                  predictionType: FeatureMeasurementType.ARRIVAL_TIME,
                  predictionValue: {
                    derivativeMap: {
                      DERIVATIVE_WRT_LATITUDE: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: -15723.38550116542
                      },
                      DERIVATIVE_WRT_LONGITUDE: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: 6191.045114345527
                      },
                      DERIVATIVE_WRT_TIME: {
                        units: Units.UNITLESS,
                        value: 1
                      }
                    },
                    featureMeasurementType: FeatureMeasurementType.ARRIVAL_TIME,
                    predictedValue: {
                      arrivalTime: {
                        standardDeviation: 1.937,
                        value: 1730092274.99
                      },
                      travelTime: {
                        standardDeviation: 1.937,
                        value: 748.188
                      }
                    },
                    featurePredictionComponents: [
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.ELLIPTICITY_CORRECTION,
                        value: {
                          standardDeviation: 0,
                          value: -0.306
                        }
                      },
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.ELEVATION_CORRECTION,
                        value: {
                          standardDeviation: 0,
                          value: 0.028
                        }
                      },
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                        value: {
                          standardDeviation: 0,
                          value: 749.461
                        }
                      },
                      {
                        extrapolated: false,
                        featurePredictionComponent: FeaturePredictionComponentType.PATH_CORRECTION,
                        value: {
                          standardDeviation: 0,
                          value: -0.995
                        }
                      }
                    ]
                  },
                  receiverLocation: {
                    depthKm: 0,
                    elevationKm: 0.1679,
                    latitudeDegrees: 62.49308,
                    longitudeDegrees: -114.6061
                  },
                  sourceLocation: {
                    depthKm: 0,
                    latitudeDegrees: -11.078559092166564,
                    longitudeDegrees: -62.98237588432701,
                    time: 1730091526.802
                  }
                },
                {
                  channel: {
                    effectiveAt: 1730092492.375,
                    name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                  },
                  extrapolated: false,
                  phase: 'P',
                  predictionType: FeatureMeasurementType.SLOWNESS,
                  predictionValue: {
                    derivativeMap: {
                      DERIVATIVE_WRT_LATITUDE: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: 0.002612544137532609
                      },
                      DERIVATIVE_WRT_LONGITUDE: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: -0.00147542776772805
                      },
                      DERIVATIVE_WRT_TIME: {
                        units: Units.ONE_OVER_DEGREE,
                        value: 0
                      }
                    },
                    featureMeasurementType: FeatureMeasurementType.SLOWNESS,
                    predictedValue: {
                      measuredValue: {
                        standardDeviation: 0.5,
                        units: Units.SECONDS_PER_DEGREE,
                        value: 1.909837699915181
                      }
                    },
                    featurePredictionComponents: [
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                        value: {
                          units: Units.SECONDS_PER_DEGREE,
                          value: 1.909837699915181
                        }
                      }
                    ]
                  },
                  receiverLocation: {
                    depthKm: 0,
                    elevationKm: 0.4,
                    latitudeDegrees: 53.108215,
                    longitudeDegrees: 157.69885
                  },
                  sourceLocation: {
                    depthKm: 0,
                    latitudeDegrees: -11.078559092166564,
                    longitudeDegrees: -62.98237588432701,
                    time: 1730091526.802
                  }
                },
                {
                  channel: {
                    effectiveAt: 1730092214.975,
                    name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                  },
                  extrapolated: false,
                  phase: 'P',
                  predictionType: FeatureMeasurementType.SLOWNESS,
                  predictionValue: {
                    derivativeMap: {
                      DERIVATIVE_WRT_LATITUDE: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: 0.06632552921495782
                      },
                      DERIVATIVE_WRT_LONGITUDE: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: -0.026115517143061238
                      },
                      DERIVATIVE_WRT_TIME: {
                        units: Units.ONE_OVER_DEGREE,
                        value: 0
                      }
                    },
                    featureMeasurementType: FeatureMeasurementType.SLOWNESS,
                    predictedValue: {
                      measuredValue: {
                        standardDeviation: 0.5,
                        units: Units.SECONDS_PER_DEGREE,
                        value: 5.147528697666502
                      }
                    },
                    featurePredictionComponents: [
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                        value: {
                          units: Units.SECONDS_PER_DEGREE,
                          value: 5.147528697666502
                        }
                      }
                    ]
                  },
                  receiverLocation: {
                    depthKm: 0,
                    elevationKm: 0.1679,
                    latitudeDegrees: 62.49308,
                    longitudeDegrees: -114.6061
                  },
                  sourceLocation: {
                    depthKm: 0,
                    latitudeDegrees: -11.078559092166564,
                    longitudeDegrees: -62.98237588432701,
                    time: 1730091526.802
                  }
                }
              ]
            },
            location: {
              depthKm: 0,
              latitudeDegrees: -11.078559092166564,
              longitudeDegrees: -62.98237588432701,
              time: 1730091526.802
            },
            locationBehaviors: [
              {
                defining: true,
                measurement: {
                  channel: {
                    effectiveAt: 1730092492.375,
                    name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                  },
                  featureMeasurementType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                  measurementValue: {
                    measuredValue: {
                      standardDeviation: 17.902263,
                      units: Units.DEGREES,
                      value: 108.24585
                    }
                  }
                },
                prediction: {
                  channel: {
                    effectiveAt: 1730092492.375,
                    name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                  },
                  extrapolated: false,
                  phase: 'P',
                  predictionType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                  predictionValue: {
                    derivativeMap: {
                      DERIVATIVE_WRT_LATITUDE: {
                        units: Units.UNITLESS,
                        value: -0.6153218242923946
                      },
                      DERIVATIVE_WRT_LONGITUDE: {
                        units: Units.UNITLESS,
                        value: -1.0895521013721827
                      },
                      DERIVATIVE_WRT_TIME: {
                        units: Units.DEGREES_PER_SECOND,
                        value: 0
                      }
                    },
                    featureMeasurementType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                    predictedValue: {
                      measuredValue: {
                        standardDeviation: 5,
                        units: Units.DEGREES,
                        value: 53.19271656571702
                      }
                    },
                    featurePredictionComponents: [
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                        value: {
                          units: Units.DEGREES,
                          value: 53.19271656571702
                        }
                      }
                    ]
                  },
                  receiverLocation: {
                    depthKm: 0,
                    elevationKm: 0.4,
                    latitudeDegrees: 53.108215,
                    longitudeDegrees: 157.69885
                  },
                  sourceLocation: {
                    depthKm: 0,
                    latitudeDegrees: -11.078559092166564,
                    longitudeDegrees: -62.98237588432701,
                    time: 1730091526.802
                  }
                },
                requestedDefining: true,
                residual: 55.05313343428305,
                weight: 0.05379991850832199
              },
              {
                defining: false,
                measurement: {
                  channel: {
                    effectiveAt: 1730092492.375,
                    name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                  },
                  featureMeasurementType: FeatureMeasurementType.ARRIVAL_TIME,
                  measurementValue: {
                    arrivalTime: {
                      standardDeviation: 1.72,
                      value: 1730092552.375
                    }
                  },
                  snr: {
                    units: Units.DECIBELS,
                    value: 3.6538372
                  }
                },
                prediction: {
                  channel: {
                    effectiveAt: 1730092492.375,
                    name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                  },
                  extrapolated: false,
                  phase: 'P',
                  predictionType: FeatureMeasurementType.ARRIVAL_TIME,
                  predictionValue: {
                    derivativeMap: {
                      DERIVATIVE_WRT_LATITUDE: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: -5459.203081271577
                      },
                      DERIVATIVE_WRT_LONGITUDE: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: 3083.071286742644
                      },
                      DERIVATIVE_WRT_TIME: {
                        units: Units.UNITLESS,
                        value: 1
                      }
                    },
                    featureMeasurementType: FeatureMeasurementType.ARRIVAL_TIME,
                    predictedValue: {
                      arrivalTime: {
                        standardDeviation: -999999,
                        value: 1730092672.732
                      },
                      travelTime: {
                        standardDeviation: -999999,
                        value: 1145.93
                      }
                    },
                    featurePredictionComponents: [
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                        value: {
                          standardDeviation: 0,
                          value: 1145.854
                        }
                      },
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.ELEVATION_CORRECTION,
                        value: {
                          standardDeviation: 0,
                          value: 0.069
                        }
                      },
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.ELLIPTICITY_CORRECTION,
                        value: {
                          standardDeviation: 0,
                          value: 0.007
                        }
                      }
                    ]
                  },
                  receiverLocation: {
                    depthKm: 0,
                    elevationKm: 0.4,
                    latitudeDegrees: 53.108215,
                    longitudeDegrees: 157.69885
                  },
                  sourceLocation: {
                    depthKm: 0,
                    latitudeDegrees: -11.078559092166564,
                    longitudeDegrees: -62.98237588432701,
                    time: 1730091526.802
                  }
                },
                requestedDefining: true,
                residual: -999999,
                weight: 1
              },
              {
                defining: true,
                measurement: {
                  channel: {
                    effectiveAt: 1730092492.375,
                    name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                  },
                  featureMeasurementType: FeatureMeasurementType.SLOWNESS,
                  measurementValue: {
                    measuredValue: {
                      standardDeviation: 4.42,
                      units: Units.SECONDS_PER_DEGREE,
                      value: 14.205898
                    }
                  }
                },
                prediction: {
                  channel: {
                    effectiveAt: 1730092492.375,
                    name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/f5258adc3f5f4da81c63243568cbf38a266b4e497e7dc26327149cdae4e73fd1'
                  },
                  extrapolated: false,
                  phase: 'P',
                  predictionType: FeatureMeasurementType.SLOWNESS,
                  predictionValue: {
                    derivativeMap: {
                      DERIVATIVE_WRT_LATITUDE: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: 0.002612544137532609
                      },
                      DERIVATIVE_WRT_LONGITUDE: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: -0.00147542776772805
                      },
                      DERIVATIVE_WRT_TIME: {
                        units: Units.ONE_OVER_DEGREE,
                        value: 0
                      }
                    },
                    featureMeasurementType: FeatureMeasurementType.SLOWNESS,
                    predictedValue: {
                      measuredValue: {
                        standardDeviation: 0.5,
                        units: Units.SECONDS_PER_DEGREE,
                        value: 1.909837699915181
                      }
                    },
                    featurePredictionComponents: [
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                        value: {
                          units: Units.SECONDS_PER_DEGREE,
                          value: 1.909837699915181
                        }
                      }
                    ]
                  },
                  receiverLocation: {
                    depthKm: 0,
                    elevationKm: 0.4,
                    latitudeDegrees: 53.108215,
                    longitudeDegrees: 157.69885
                  },
                  sourceLocation: {
                    depthKm: 0,
                    latitudeDegrees: -11.078559092166564,
                    longitudeDegrees: -62.98237588432701,
                    time: 1730091526.802
                  }
                },
                requestedDefining: true,
                residual: 12.29606030008482,
                weight: 0.22481050839953104
              },
              {
                defining: true,
                measurement: {
                  channel: {
                    effectiveAt: 1730092214.975,
                    name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                  },
                  featureMeasurementType: FeatureMeasurementType.ARRIVAL_TIME,
                  measurementValue: {
                    arrivalTime: {
                      standardDeviation: 1.72,
                      value: 1730092274.975
                    }
                  },
                  snr: {
                    units: Units.DECIBELS,
                    value: 3.5784304
                  }
                },
                prediction: {
                  channel: {
                    effectiveAt: 1730092214.975,
                    name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                  },
                  extrapolated: false,
                  phase: 'P',
                  predictionType: FeatureMeasurementType.ARRIVAL_TIME,
                  predictionValue: {
                    derivativeMap: {
                      DERIVATIVE_WRT_LATITUDE: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: -15723.38550116542
                      },
                      DERIVATIVE_WRT_LONGITUDE: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: 6191.045114345527
                      },
                      DERIVATIVE_WRT_TIME: {
                        units: Units.UNITLESS,
                        value: 1
                      }
                    },
                    featureMeasurementType: FeatureMeasurementType.ARRIVAL_TIME,
                    predictedValue: {
                      arrivalTime: {
                        standardDeviation: 1.937,
                        value: 1730092274.99
                      },
                      travelTime: {
                        standardDeviation: 1.937,
                        value: 748.188
                      }
                    },
                    featurePredictionComponents: [
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.ELLIPTICITY_CORRECTION,
                        value: {
                          standardDeviation: 0,
                          value: -0.306
                        }
                      },
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.ELEVATION_CORRECTION,
                        value: {
                          standardDeviation: 0,
                          value: 0.028
                        }
                      },
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                        value: {
                          standardDeviation: 0,
                          value: 749.461
                        }
                      },
                      {
                        extrapolated: false,
                        featurePredictionComponent: FeaturePredictionComponentType.PATH_CORRECTION,
                        value: {
                          standardDeviation: 0,
                          value: -0.995
                        }
                      }
                    ]
                  },
                  receiverLocation: {
                    depthKm: 0,
                    elevationKm: 0.1679,
                    latitudeDegrees: 62.49308,
                    longitudeDegrees: -114.6061
                  },
                  sourceLocation: {
                    depthKm: 0,
                    latitudeDegrees: -11.078559092166564,
                    longitudeDegrees: -62.98237588432701,
                    time: 1730091526.802
                  }
                },
                requestedDefining: true,
                residual: -0.014689581635479954,
                weight: 0.38608299735242935
              },
              {
                defining: true,
                measurement: {
                  channel: {
                    effectiveAt: 1730092214.975,
                    name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                  },
                  featureMeasurementType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                  measurementValue: {
                    measuredValue: {
                      standardDeviation: 7.626245,
                      units: Units.DEGREES,
                      value: 112.90577
                    }
                  }
                },
                prediction: {
                  channel: {
                    effectiveAt: 1730092214.975,
                    name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                  },
                  extrapolated: false,
                  phase: 'P',
                  predictionType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                  predictionValue: {
                    derivativeMap: {
                      DERIVATIVE_WRT_LATITUDE: {
                        units: Units.UNITLESS,
                        value: -0.3687680273069783
                      },
                      DERIVATIVE_WRT_LONGITUDE: {
                        units: Units.UNITLESS,
                        value: -0.9365594575326994
                      },
                      DERIVATIVE_WRT_TIME: {
                        units: Units.DEGREES_PER_SECOND,
                        value: 0
                      }
                    },
                    featureMeasurementType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
                    predictedValue: {
                      measuredValue: {
                        standardDeviation: 5,
                        units: Units.DEGREES,
                        value: 129.23413513136327
                      }
                    },
                    featurePredictionComponents: [
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                        value: {
                          units: Units.DEGREES,
                          value: 129.23413513136327
                        }
                      }
                    ]
                  },
                  receiverLocation: {
                    depthKm: 0,
                    elevationKm: 0.1679,
                    latitudeDegrees: 62.49308,
                    longitudeDegrees: -114.6061
                  },
                  sourceLocation: {
                    depthKm: 0,
                    latitudeDegrees: -11.078559092166564,
                    longitudeDegrees: -62.98237588432701,
                    time: 1730091526.802
                  }
                },
                requestedDefining: true,
                residual: -16.328365131363295,
                weight: 0.10965887111740245
              },
              {
                defining: true,
                measurement: {
                  channel: {
                    effectiveAt: 1730092214.975,
                    name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                  },
                  featureMeasurementType: FeatureMeasurementType.SLOWNESS,
                  measurementValue: {
                    measuredValue: {
                      standardDeviation: 0.72,
                      units: Units.SECONDS_PER_DEGREE,
                      value: 5.4130544
                    }
                  }
                },
                prediction: {
                  channel: {
                    effectiveAt: 1730092214.975,
                    name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/00aed54cb41211ccd8184c1d4df1135b3e849303b929105628db29c97cb798e0'
                  },
                  extrapolated: false,
                  phase: 'P',
                  predictionType: FeatureMeasurementType.SLOWNESS,
                  predictionValue: {
                    derivativeMap: {
                      DERIVATIVE_WRT_LATITUDE: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: 0.06632552921495782
                      },
                      DERIVATIVE_WRT_LONGITUDE: {
                        units: Units.SECONDS_PER_DEGREE,
                        value: -0.026115517143061238
                      },
                      DERIVATIVE_WRT_TIME: {
                        units: Units.ONE_OVER_DEGREE,
                        value: 0
                      }
                    },
                    featureMeasurementType: FeatureMeasurementType.SLOWNESS,
                    predictedValue: {
                      measuredValue: {
                        standardDeviation: 0.5,
                        units: Units.SECONDS_PER_DEGREE,
                        value: 5.147528697666502
                      }
                    },
                    featurePredictionComponents: [
                      {
                        extrapolated: false,
                        featurePredictionComponent:
                          FeaturePredictionComponentType.BASEMODEL_PREDICTION,
                        value: {
                          units: Units.SECONDS_PER_DEGREE,
                          value: 5.147528697666502
                        }
                      }
                    ]
                  },
                  receiverLocation: {
                    depthKm: 0,
                    elevationKm: 0.1679,
                    latitudeDegrees: 62.49308,
                    longitudeDegrees: -114.6061
                  },
                  sourceLocation: {
                    depthKm: 0,
                    latitudeDegrees: -11.078559092166564,
                    longitudeDegrees: -62.98237588432701,
                    time: 1730091526.802
                  }
                },
                requestedDefining: true,
                residual: 0.2655257023334987,
                weight: 1.1407916189906886
              }
            ],
            locationRestraint: {
              depthRestraintKm: -Infinity,
              latitudeRestraintDegrees: -Infinity,
              longitudeRestraintDegrees: -Infinity,
              depthRestraintReason: DepthRestraintReason.FIXED_AT_SURFACE,
              depthRestraintType: RestraintType.FIXED,
              epicenterRestraintType: RestraintType.UNRESTRAINED,
              restrainer: RestrainerType.FIXED_BY_CONFIGURATION,
              timeRestraintType: RestraintType.UNRESTRAINED
            },
            locationUncertainty: {
              ellipses: [
                {
                  aprioriStandardError: -Infinity,
                  confidenceLevel: -Infinity,
                  depthUncertaintyKm: -Infinity,
                  kWeight: -Infinity,
                  scalingFactorType: ScalingFactorType.COVERAGE,
                  semiMajorAxisLengthKm: -Infinity,
                  semiMajorAxisTrendDeg: -Infinity,
                  semiMinorAxisLengthKm: -Infinity,
                  timeUncertainty: -Infinity
                },
                {
                  aprioriStandardError: 2,
                  confidenceLevel: 0.5,
                  depthUncertaintyKm: 0,
                  kWeight: 0,
                  scalingFactorType: ScalingFactorType.CONFIDENCE,
                  semiMajorAxisLengthKm: 26392.47027448302,
                  semiMajorAxisTrendDeg: 154.9384408276519,
                  semiMinorAxisLengthKm: 16685.19476524362,
                  timeUncertainty: 851.66
                },
                {
                  aprioriStandardError: 2,
                  confidenceLevel: 0.5,
                  depthUncertaintyKm: 0,
                  kWeight: 8,
                  scalingFactorType: ScalingFactorType.K_WEIGHTED,
                  semiMajorAxisLengthKm: 6503.229176419157,
                  semiMajorAxisTrendDeg: 154.9384408276519,
                  semiMinorAxisLengthKm: 4111.310698963891,
                  timeUncertainty: 233.86
                }
              ],
              ellipsoids: [
                {
                  aprioriStandardError: -Infinity,
                  confidenceLevel: -Infinity,
                  kWeight: -Infinity,
                  scalingFactorType: ScalingFactorType.COVERAGE,
                  semiMajorAxisLengthKm: -Infinity,
                  semiMajorAxisTrendDeg: -Infinity,
                  semiMinorAxisLengthKm: -Infinity,
                  timeUncertainty: -Infinity,
                  semiIntermediateAxisLengthKm: -Infinity,
                  semiIntermediateAxisPlungeDeg: -Infinity,
                  semiIntermediateAxisTrendDeg: -Infinity,
                  semiMajorAxisPlungeDeg: -Infinity,
                  semiMinorAxisPlungeDeg: -Infinity,
                  semiMinorAxisTrendDeg: -Infinity
                }
              ],
              stdDevTravelTimeResiduals: 0,
              tt: -Infinity,
              xt: -Infinity,
              xx: -Infinity,
              xy: -Infinity,
              xz: -Infinity,
              yt: -Infinity,
              yy: -Infinity,
              yz: -Infinity,
              zt: -Infinity,
              zz: -Infinity
            },
            networkMagnitudeSolutions: [],
            id: 'e8bcc0bc-a9d6-4073-97f7-4c23267ef48f'
          }
        ],
        parentEventHypotheses: [
          {
            id: {
              eventId: 'e4da3b7f-bbce-3345-9777-2b0674a318d5',
              hypothesisId: 'c4fc9dea-7af4-3afb-97a9-392cc51ea60e'
            }
          }
        ],
        preferredLocationSolution: {
          id: 'e8bcc0bc-a9d6-4073-97f7-4c23267ef48f'
        },
        rejected: false
      };
      expect(eventHypothesisSchema.safeParse(eventHypothesisBad).success).toBeFalsy();
    });
  });

  describe('validate relocation response', () => {
    it('validate relocation response', () => {
      const result = [
        {
          id: {
            eventId: 'd09bf415-44a3-365a-86c9-077ebb5e35c3',
            hypothesisId: '77aee7a3-11e5-422a-b57e-8f0c54acffc7'
          },
          associatedSignalDetectionHypotheses: [
            {
              id: {
                id: '0287527e-6436-30ef-a3cf-2af3380549d9',
                signalDetectionId: '590494d5-4ebe-3eda-9858-c48f34e12b51'
              }
            },
            {
              id: {
                id: '16d6c009-5e4a-3c7a-8c80-b800bb87e77f',
                signalDetectionId: '3335881e-06d4-3230-9138-9226225e17c7'
              }
            },
            {
              id: {
                id: 'c7f9d063-f957-4e0c-b847-5e5bdff970ab',
                signalDetectionId: 'b07573f9-db4c-4477-a58d-999ae0b75ea5'
              }
            },
            {
              id: {
                id: 'fa21d361-0083-48a9-9e74-9d41fcd489d5',
                signalDetectionId: '7e889fb7-6e0e-37c1-9733-550f2a6c7a5a'
              }
            }
          ],
          deleted: false,
          locationSolutions: [
            {
              featurePredictions: {
                featurePredictions: [
                  {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'SLOWNESS',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: 0.05771489048511833
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -0.04507658652056352
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'ONE_OVER_DEGREE',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'SLOWNESS',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 0.5,
                          units: 'SECONDS_PER_DEGREE',
                          value: 5.140733247548767
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 5.140733247548767
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 0.5
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.2004,
                      latitudeDegrees: 50.62264,
                      longitudeDegrees: 78.53039
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'SLOWNESS',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -0.031694654417358394
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -0.027998962395594237
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'ONE_OVER_DEGREE',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'SLOWNESS',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 0.5,
                          units: 'SECONDS_PER_DEGREE',
                          value: 9.048508718830956
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 9.048508718830956
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 0.5
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.6273,
                      latitudeDegrees: -23.665134,
                      longitudeDegrees: 133.905261
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'SLOWNESS',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -1.2223911586718288
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -1.3356398562449845
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'ONE_OVER_DEGREE',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'SLOWNESS',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 0.5,
                          units: 'SECONDS_PER_DEGREE',
                          value: 10.091747751098248
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 10.091747751098248
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 0.5
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.3888,
                      latitudeDegrees: -19.9426,
                      longitudeDegrees: 134.3395
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'ARRIVAL_TIME',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: -13300.196801276765
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 10387.743385008433
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'UNITLESS',
                          value: 1.0
                        }
                      },
                      featureMeasurementType: 'ARRIVAL_TIME',
                      predictedValue: {
                        arrivalTime: {
                          standardDeviation: 1.459,
                          value: 1739978910.93
                        },
                        travelTime: {
                          standardDeviation: 1.459,
                          value: 741.232
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELEVATION_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.033
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'PATH_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: -0.709
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.034
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_PATH_DEPENDENT',
                          value: {
                            standardDeviation: 0.0,
                            value: 1.459
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 741.873
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.2004,
                      latitudeDegrees: 50.62264,
                      longitudeDegrees: 78.53039
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739978728.45,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_54.930deg,slow_10.013s_per_deg/477f16d1fdeae7b14749f9279429565c98fa4cdb626b7461046378e42762de20'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'ARRIVAL_TIME',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 22366.902914669547
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 24439.089551379
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'UNITLESS',
                          value: 1.0
                        }
                      },
                      featureMeasurementType: 'ARRIVAL_TIME',
                      predictedValue: {
                        arrivalTime: {
                          standardDeviation: 1.459,
                          value: 1739978470.807
                        },
                        travelTime: {
                          standardDeviation: 1.459,
                          value: 301.109
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'PATH_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: -0.692
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 301.473
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.271
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELEVATION_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.057
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_PATH_DEPENDENT',
                          value: {
                            standardDeviation: 0.0,
                            value: 1.459
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.3888,
                      latitudeDegrees: -19.9426,
                      longitudeDegrees: 134.3395
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'ARRIVAL_TIME',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 22262.02523919923
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 19666.206146760673
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'UNITLESS',
                          value: 1.0
                        }
                      },
                      featureMeasurementType: 'ARRIVAL_TIME',
                      predictedValue: {
                        arrivalTime: {
                          standardDeviation: 1.41,
                          value: 1739978496.477
                        },
                        travelTime: {
                          standardDeviation: 1.41,
                          value: 326.779
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELEVATION_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.095
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.261
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_PATH_DEPENDENT',
                          value: {
                            standardDeviation: 0.0,
                            value: 1.41
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'PATH_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: -0.337
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 326.761
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.6273,
                      latitudeDegrees: -23.665134,
                      longitudeDegrees: 133.905261
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'ARRIVAL_TIME',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 22366.902914669547
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 24439.089551379
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'UNITLESS',
                          value: 1.0
                        }
                      },
                      featureMeasurementType: 'ARRIVAL_TIME',
                      predictedValue: {
                        arrivalTime: {
                          standardDeviation: 1.459,
                          value: 1739978470.807
                        },
                        travelTime: {
                          standardDeviation: 1.459,
                          value: 301.109
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'PATH_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: -0.692
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 301.473
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.271
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELEVATION_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.057
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_PATH_DEPENDENT',
                          value: {
                            standardDeviation: 0.0,
                            value: 1.459
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.3888,
                      latitudeDegrees: -19.9426,
                      longitudeDegrees: 134.3395
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'UNITLESS',
                          value: -0.6196427578961462
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'UNITLESS',
                          value: -0.7933744915569019
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'DEGREES_PER_SECOND',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 5.0,
                          units: 'DEGREES',
                          value: 105.60859573078253
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'DEGREES',
                            value: 105.60859573078253
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'DEGREES',
                            value: 5.0
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.2004,
                      latitudeDegrees: 50.62264,
                      longitudeDegrees: 78.53039
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'UNITLESS',
                          value: -1.518371661744634
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'UNITLESS',
                          value: 1.718787447054786
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'DEGREES_PER_SECOND',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 5.0,
                          units: 'DEGREES',
                          value: 46.02660468986856
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'DEGREES',
                            value: 5.0
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'DEGREES',
                            value: 46.02660468986856
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.6273,
                      latitudeDegrees: -23.665134,
                      longitudeDegrees: 133.905261
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'UNITLESS',
                          value: -1.8802515645082039
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'UNITLESS',
                          value: 1.720825324122498
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'DEGREES_PER_SECOND',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 5.0,
                          units: 'DEGREES',
                          value: 51.40014774313839
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'DEGREES',
                            value: 51.40014774313839
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'DEGREES',
                            value: 5.0
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.3888,
                      latitudeDegrees: -19.9426,
                      longitudeDegrees: 134.3395
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  }
                ]
              },
              location: {
                depthKm: 50.0,
                latitudeDegrees: -4.712128362675294,
                longitudeDegrees: 152.25684917128123,
                time: 1739978169.698
              },
              locationBehaviors: [
                {
                  defining: false,
                  measurement: {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    featureMeasurementType: 'SLOWNESS',
                    measurementValue: {
                      measuredValue: {
                        standardDeviation: 0.38,
                        units: 'SECONDS_PER_DEGREE',
                        value: 4.2945778
                      }
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'SLOWNESS',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: 0.05771489048511833
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -0.04507658652056352
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'ONE_OVER_DEGREE',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'SLOWNESS',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 0.5,
                          units: 'SECONDS_PER_DEGREE',
                          value: 5.140733247548767
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 5.140733247548767
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 0.5
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.2004,
                      latitudeDegrees: 50.62264,
                      longitudeDegrees: 78.53039
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  requestedDefining: false,
                  residual: -0.8461554475487677,
                  weight: 1.5923243882462048
                },
                {
                  defining: false,
                  measurement: {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    featureMeasurementType: 'ARRIVAL_TIME',
                    measurementValue: {
                      arrivalTime: {
                        standardDeviation: 1.149,
                        value: 1739979226.775
                      }
                    },
                    snr: {
                      units: 'DECIBELS',
                      value: 9.1673574
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'ARRIVAL_TIME',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: -13300.196801276765
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 10387.743385008433
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'UNITLESS',
                          value: 1.0
                        }
                      },
                      featureMeasurementType: 'ARRIVAL_TIME',
                      predictedValue: {
                        arrivalTime: {
                          standardDeviation: 1.459,
                          value: 1739978910.93
                        },
                        travelTime: {
                          standardDeviation: 1.459,
                          value: 741.232
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELEVATION_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.033
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'PATH_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: -0.709
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.034
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_PATH_DEPENDENT',
                          value: {
                            standardDeviation: 0.0,
                            value: 1.459
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 741.873
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.2004,
                      latitudeDegrees: 50.62264,
                      longitudeDegrees: 78.53039
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  requestedDefining: true,
                  residual: 315.84529651022467,
                  weight: 0.5384613548528431
                },
                {
                  defining: false,
                  measurement: {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    measurementValue: {
                      measuredValue: {
                        standardDeviation: 5.0855447,
                        units: 'DEGREES',
                        value: 107.89032
                      }
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'UNITLESS',
                          value: -0.6196427578961462
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'UNITLESS',
                          value: -0.7933744915569019
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'DEGREES_PER_SECOND',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 5.0,
                          units: 'DEGREES',
                          value: 105.60859573078253
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'DEGREES',
                            value: 105.60859573078253
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'DEGREES',
                            value: 5.0
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.2004,
                      latitudeDegrees: 50.62264,
                      longitudeDegrees: 78.53039
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  requestedDefining: false,
                  residual: 2.281724269217474,
                  weight: 0.1402167890701162
                },
                {
                  defining: false,
                  measurement: {
                    channel: {
                      effectiveAt: 1739978728.45,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_54.930deg,slow_10.013s_per_deg/477f16d1fdeae7b14749f9279429565c98fa4cdb626b7461046378e42762de20'
                    },
                    featureMeasurementType: 'ARRIVAL_TIME',
                    measurementValue: {
                      arrivalTime: {
                        standardDeviation: 1.0,
                        value: 1739978788.44646
                      }
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739978728.45,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_54.930deg,slow_10.013s_per_deg/477f16d1fdeae7b14749f9279429565c98fa4cdb626b7461046378e42762de20'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'ARRIVAL_TIME',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 22366.902914669547
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 24439.089551379
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'UNITLESS',
                          value: 1.0
                        }
                      },
                      featureMeasurementType: 'ARRIVAL_TIME',
                      predictedValue: {
                        arrivalTime: {
                          standardDeviation: 1.459,
                          value: 1739978470.807
                        },
                        travelTime: {
                          standardDeviation: 1.459,
                          value: 301.109
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'PATH_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: -0.692
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 301.473
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.271
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELEVATION_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.057
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_PATH_DEPENDENT',
                          value: {
                            standardDeviation: 0.0,
                            value: 1.459
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.3888,
                      latitudeDegrees: -19.9426,
                      longitudeDegrees: 134.3395
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  requestedDefining: true,
                  residual: 317.6394120922101,
                  weight: 0.5654671882262039
                },
                {
                  defining: true,
                  measurement: {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    featureMeasurementType: 'SLOWNESS',
                    measurementValue: {
                      measuredValue: {
                        standardDeviation: 0.53,
                        units: 'SECONDS_PER_DEGREE',
                        value: 8.9099588
                      }
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'SLOWNESS',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -0.031694654417358394
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -0.027998962395594237
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'ONE_OVER_DEGREE',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'SLOWNESS',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 0.5,
                          units: 'SECONDS_PER_DEGREE',
                          value: 9.048508718830956
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 9.048508718830956
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 0.5
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.6273,
                      latitudeDegrees: -23.665134,
                      longitudeDegrees: 133.905261
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  requestedDefining: true,
                  residual: -0.13854991883095497,
                  weight: 1.3724408537914388
                },
                {
                  defining: true,
                  measurement: {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    featureMeasurementType: 'ARRIVAL_TIME',
                    measurementValue: {
                      arrivalTime: {
                        standardDeviation: 1.443,
                        value: 1739978497.25
                      }
                    },
                    snr: {
                      units: 'DECIBELS',
                      value: 5.9805093
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'ARRIVAL_TIME',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 22262.02523919923
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 19666.206146760673
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'UNITLESS',
                          value: 1.0
                        }
                      },
                      featureMeasurementType: 'ARRIVAL_TIME',
                      predictedValue: {
                        arrivalTime: {
                          standardDeviation: 1.41,
                          value: 1739978496.477
                        },
                        travelTime: {
                          standardDeviation: 1.41,
                          value: 326.779
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELEVATION_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.095
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.261
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_PATH_DEPENDENT',
                          value: {
                            standardDeviation: 0.0,
                            value: 1.41
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'PATH_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: -0.337
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 326.761
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.6273,
                      latitudeDegrees: -23.665134,
                      longitudeDegrees: 133.905261
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  requestedDefining: true,
                  residual: 0.7727425266039631,
                  weight: 0.4956847711280939
                },
                {
                  defining: true,
                  measurement: {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    measurementValue: {
                      measuredValue: {
                        standardDeviation: 3.3951174,
                        units: 'DEGREES',
                        value: 51.526108
                      }
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'UNITLESS',
                          value: -1.518371661744634
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'UNITLESS',
                          value: 1.718787447054786
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'DEGREES_PER_SECOND',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 5.0,
                          units: 'DEGREES',
                          value: 46.02660468986856
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'DEGREES',
                            value: 5.0
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'DEGREES',
                            value: 46.02660468986856
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.6273,
                      latitudeDegrees: -23.665134,
                      longitudeDegrees: 133.905261
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  requestedDefining: true,
                  residual: 5.499503310131417,
                  weight: 0.16546039429428455
                },
                {
                  defining: true,
                  measurement: {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    measurementValue: {
                      measuredValue: {
                        standardDeviation: 1.0769702,
                        units: 'DEGREES',
                        value: 49.755045
                      }
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'UNITLESS',
                          value: -1.8802515645082039
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'UNITLESS',
                          value: 1.720825324122498
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'DEGREES_PER_SECOND',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 5.0,
                          units: 'DEGREES',
                          value: 51.40014774313839
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'DEGREES',
                            value: 51.40014774313839
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'DEGREES',
                            value: 5.0
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.3888,
                      latitudeDegrees: -19.9426,
                      longitudeDegrees: 134.3395
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  requestedDefining: true,
                  residual: -1.6451027431384035,
                  weight: 0.19551597694083656
                },
                {
                  defining: true,
                  measurement: {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    featureMeasurementType: 'ARRIVAL_TIME',
                    measurementValue: {
                      arrivalTime: {
                        standardDeviation: 1.095,
                        value: 1739978470.175
                      }
                    },
                    snr: {
                      units: 'DECIBELS',
                      value: 9.9056873
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'ARRIVAL_TIME',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 22366.902914669547
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 24439.089551379
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'UNITLESS',
                          value: 1.0
                        }
                      },
                      featureMeasurementType: 'ARRIVAL_TIME',
                      predictedValue: {
                        arrivalTime: {
                          standardDeviation: 1.459,
                          value: 1739978470.807
                        },
                        travelTime: {
                          standardDeviation: 1.459,
                          value: 301.109
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'PATH_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: -0.692
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 301.473
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.271
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELEVATION_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.057
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_PATH_DEPENDENT',
                          value: {
                            standardDeviation: 0.0,
                            value: 1.459
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.3888,
                      latitudeDegrees: -19.9426,
                      longitudeDegrees: 134.3395
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  requestedDefining: true,
                  residual: -0.6315880546557651,
                  weight: 0.5482899808381612
                },
                {
                  defining: true,
                  measurement: {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    featureMeasurementType: 'SLOWNESS',
                    measurementValue: {
                      measuredValue: {
                        standardDeviation: 0.19,
                        units: 'SECONDS_PER_DEGREE',
                        value: 10.066436
                      }
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'SLOWNESS',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -1.2223911586718288
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -1.3356398562449845
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'ONE_OVER_DEGREE',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'SLOWNESS',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 0.5,
                          units: 'SECONDS_PER_DEGREE',
                          value: 10.091747751098248
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 10.091747751098248
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 0.5
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.3888,
                      latitudeDegrees: -19.9426,
                      longitudeDegrees: 134.3395
                    },
                    sourceLocation: {
                      depthKm: 50.0,
                      latitudeDegrees: -4.712128362675294,
                      longitudeDegrees: 152.25684917128123,
                      time: 1739978169.698
                    }
                  },
                  requestedDefining: true,
                  residual: -0.025311751098248497,
                  weight: 1.8695671611766977
                }
              ],
              locationRestraint: {
                depthRestraintKm: 50.0,
                depthRestraintReason: 'FIXED_AT_STANDARD_DEPTH',
                depthRestraintType: 'FIXED',
                epicenterRestraintType: 'UNRESTRAINED',
                restrainer: 'FIXED_BY_CONFIGURATION',
                timeRestraintType: 'UNRESTRAINED'
              },
              locationUncertainty: {
                ellipses: [
                  {
                    aprioriStandardError: 1.0,
                    confidenceLevel: 0.95,
                    depthUncertaintyKm: 0.0,
                    kWeight: 'Infinity',
                    scalingFactorType: 'COVERAGE',
                    semiMajorAxisLengthKm: 377.57382614141943,
                    semiMajorAxisTrendDeg: 138.3419040845846,
                    semiMinorAxisLengthKm: 79.28181782642909,
                    timeUncertainty: 6.311
                  },
                  {
                    aprioriStandardError: 1.0,
                    confidenceLevel: 0.95,
                    depthUncertaintyKm: 0.0,
                    kWeight: 0.0,
                    scalingFactorType: 'CONFIDENCE',
                    semiMajorAxisLengthKm: 432.8481745436868,
                    semiMajorAxisTrendDeg: 138.3419040845846,
                    semiMinorAxisLengthKm: 90.88815946638633,
                    timeUncertainty: 6.579
                  },
                  {
                    aprioriStandardError: 1.0,
                    confidenceLevel: 0.95,
                    depthUncertaintyKm: 0.0,
                    kWeight: 8.0,
                    scalingFactorType: 'K_WEIGHTED',
                    semiMajorAxisLengthKm: 398.9096671450427,
                    semiMajorAxisTrendDeg: 138.3419040845846,
                    semiMinorAxisLengthKm: 83.76185363004794,
                    timeUncertainty: 6.495
                  }
                ],
                ellipsoids: [],
                stdDevTravelTimeResiduals: 0.7021652906298641,
                tt: 10.369545288712164,
                xt: -151.67209043150223,
                xx: 13745.288541614893,
                xy: -11295.251358858952,
                xz: 0.0,
                yt: 12.976080776522792,
                yy: 11097.986362766229,
                yz: 0.0,
                zt: 0.0,
                zz: 0.0
              },
              networkMagnitudeSolutions: [],
              id: '9fa3b571-6bda-4e3e-a565-9e8274762080'
            },
            {
              featurePredictions: {
                featurePredictions: [
                  {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'SLOWNESS',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: 0.05733582196336004
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -0.044886524475793325
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'ONE_OVER_DEGREE',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'SLOWNESS',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 0.5,
                          units: 'SECONDS_PER_DEGREE',
                          value: 5.154341141920615
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 5.154341141920615
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 0.5
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.2004,
                      latitudeDegrees: 50.62264,
                      longitudeDegrees: 78.53039
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'SLOWNESS',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -0.03426298450345534
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -0.030331055804969042
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'ONE_OVER_DEGREE',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'SLOWNESS',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 0.5,
                          units: 'SECONDS_PER_DEGREE',
                          value: 9.04502443860534
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 9.04502443860534
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 0.5
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.6273,
                      latitudeDegrees: -23.665134,
                      longitudeDegrees: 133.905261
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'SLOWNESS',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -2.3250971220449013
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -2.538572904046134
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'ONE_OVER_DEGREE',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'SLOWNESS',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 0.5,
                          units: 'SECONDS_PER_DEGREE',
                          value: 10.078952803330893
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 10.078952803330893
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 0.5
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.3888,
                      latitudeDegrees: -19.9426,
                      longitudeDegrees: 134.3395
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'ARRIVAL_TIME',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: -13323.445661609827
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 10430.532768396102
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'UNITLESS',
                          value: 1.0
                        }
                      },
                      featureMeasurementType: 'ARRIVAL_TIME',
                      predictedValue: {
                        arrivalTime: {
                          standardDeviation: 1.574,
                          value: 1739978908.233
                        },
                        travelTime: {
                          standardDeviation: 1.574,
                          value: 748.215
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELEVATION_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.033
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 748.974
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_PATH_DEPENDENT',
                          value: {
                            standardDeviation: 0.0,
                            value: 1.574
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'PATH_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: -0.841
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.048
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.2004,
                      latitudeDegrees: 50.62264,
                      longitudeDegrees: 78.53039
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739978728.45,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_54.930deg,slow_10.013s_per_deg/477f16d1fdeae7b14749f9279429565c98fa4cdb626b7461046378e42762de20'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'ARRIVAL_TIME',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 22347.798061523234
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 24399.632207270013
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'UNITLESS',
                          value: 1.0
                        }
                      },
                      featureMeasurementType: 'ARRIVAL_TIME',
                      predictedValue: {
                        arrivalTime: {
                          standardDeviation: 1.613,
                          value: 1739978470.868
                        },
                        travelTime: {
                          standardDeviation: 1.613,
                          value: 310.85
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.287
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'PATH_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: -0.87
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_PATH_DEPENDENT',
                          value: {
                            standardDeviation: 0.0,
                            value: 1.613
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELEVATION_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.057
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 311.376
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.3888,
                      latitudeDegrees: -19.9426,
                      longitudeDegrees: 134.3395
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'ARRIVAL_TIME',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 22233.080101910273
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 19681.671140451308
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'UNITLESS',
                          value: 1.0
                        }
                      },
                      featureMeasurementType: 'ARRIVAL_TIME',
                      predictedValue: {
                        arrivalTime: {
                          standardDeviation: 1.537,
                          value: 1739978496.44
                        },
                        travelTime: {
                          standardDeviation: 1.537,
                          value: 336.422
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.275
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_PATH_DEPENDENT',
                          value: {
                            standardDeviation: 0.0,
                            value: 1.537
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 336.549
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELEVATION_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.095
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'PATH_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: -0.497
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.6273,
                      latitudeDegrees: -23.665134,
                      longitudeDegrees: 133.905261
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'ARRIVAL_TIME',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 22347.798061523234
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 24399.632207270013
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'UNITLESS',
                          value: 1.0
                        }
                      },
                      featureMeasurementType: 'ARRIVAL_TIME',
                      predictedValue: {
                        arrivalTime: {
                          standardDeviation: 1.613,
                          value: 1739978470.868
                        },
                        travelTime: {
                          standardDeviation: 1.613,
                          value: 310.85
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.287
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'PATH_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: -0.87
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_PATH_DEPENDENT',
                          value: {
                            standardDeviation: 0.0,
                            value: 1.613
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELEVATION_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.057
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 311.376
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.3888,
                      latitudeDegrees: -19.9426,
                      longitudeDegrees: 134.3395
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'UNITLESS',
                          value: -0.6205890871935225
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'UNITLESS',
                          value: -0.7927097459933837
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'DEGREES_PER_SECOND',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 5.0,
                          units: 'DEGREES',
                          value: 105.23037229442834
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'DEGREES',
                            value: 5.0
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'DEGREES',
                            value: 105.23037229442834
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.2004,
                      latitudeDegrees: 50.62264,
                      longitudeDegrees: 78.53039
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'UNITLESS',
                          value: -1.4999370577856985
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'UNITLESS',
                          value: 1.6943795328961262
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'DEGREES_PER_SECOND',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 5.0,
                          units: 'DEGREES',
                          value: 46.11729694128407
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'DEGREES',
                            value: 46.11729694128407
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'DEGREES',
                            value: 5.0
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.6273,
                      latitudeDegrees: -23.665134,
                      longitudeDegrees: 133.905261
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'UNITLESS',
                          value: -1.8510965137547948
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'UNITLESS',
                          value: 1.6954325676046873
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'DEGREES_PER_SECOND',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 5.0,
                          units: 'DEGREES',
                          value: 51.40060495409547
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'DEGREES',
                            value: 51.40060495409547
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'DEGREES',
                            value: 5.0
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.3888,
                      latitudeDegrees: -19.9426,
                      longitudeDegrees: 134.3395
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  }
                ]
              },
              location: {
                depthKm: 0.0,
                latitudeDegrees: -4.456105315351985,
                longitudeDegrees: 152.5357841096191,
                time: 1739978160.018
              },
              locationBehaviors: [
                {
                  defining: false,
                  measurement: {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    featureMeasurementType: 'SLOWNESS',
                    measurementValue: {
                      measuredValue: {
                        standardDeviation: 0.38,
                        units: 'SECONDS_PER_DEGREE',
                        value: 4.2945778
                      }
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'SLOWNESS',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: 0.05733582196336004
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -0.044886524475793325
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'ONE_OVER_DEGREE',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'SLOWNESS',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 0.5,
                          units: 'SECONDS_PER_DEGREE',
                          value: 5.154341141920615
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 5.154341141920615
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 0.5
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.2004,
                      latitudeDegrees: 50.62264,
                      longitudeDegrees: 78.53039
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  requestedDefining: false,
                  residual: -0.8597633419206157,
                  weight: 1.5923243882462048
                },
                {
                  defining: false,
                  measurement: {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    featureMeasurementType: 'ARRIVAL_TIME',
                    measurementValue: {
                      arrivalTime: {
                        standardDeviation: 1.149,
                        value: 1739979226.775
                      }
                    },
                    snr: {
                      units: 'DECIBELS',
                      value: 9.1673574
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'ARRIVAL_TIME',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: -13323.445661609827
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 10430.532768396102
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'UNITLESS',
                          value: 1.0
                        }
                      },
                      featureMeasurementType: 'ARRIVAL_TIME',
                      predictedValue: {
                        arrivalTime: {
                          standardDeviation: 1.574,
                          value: 1739978908.233
                        },
                        travelTime: {
                          standardDeviation: 1.574,
                          value: 748.215
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELEVATION_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.033
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 748.974
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_PATH_DEPENDENT',
                          value: {
                            standardDeviation: 0.0,
                            value: 1.574
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'PATH_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: -0.841
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.048
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.2004,
                      latitudeDegrees: 50.62264,
                      longitudeDegrees: 78.53039
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  requestedDefining: true,
                  residual: 318.5420699717009,
                  weight: 0.5131542946398174
                },
                {
                  defining: false,
                  measurement: {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    measurementValue: {
                      measuredValue: {
                        standardDeviation: 5.0855447,
                        units: 'DEGREES',
                        value: 107.89032
                      }
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739979166.775,
                      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_107.890deg,slow_4.295s_per_deg/b2347bb7cdfdd83a10ecaecd30f0026859c6e676ee73648486e612c4f13f04ed'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'UNITLESS',
                          value: -0.6205890871935225
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'UNITLESS',
                          value: -0.7927097459933837
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'DEGREES_PER_SECOND',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 5.0,
                          units: 'DEGREES',
                          value: 105.23037229442834
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'DEGREES',
                            value: 5.0
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'DEGREES',
                            value: 105.23037229442834
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.2004,
                      latitudeDegrees: 50.62264,
                      longitudeDegrees: 78.53039
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  requestedDefining: false,
                  residual: 2.659947705571662,
                  weight: 0.1402167890701162
                },
                {
                  defining: false,
                  measurement: {
                    channel: {
                      effectiveAt: 1739978728.45,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_54.930deg,slow_10.013s_per_deg/477f16d1fdeae7b14749f9279429565c98fa4cdb626b7461046378e42762de20'
                    },
                    featureMeasurementType: 'ARRIVAL_TIME',
                    measurementValue: {
                      arrivalTime: {
                        standardDeviation: 1.0,
                        value: 1739978788.44646
                      }
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739978728.45,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_54.930deg,slow_10.013s_per_deg/477f16d1fdeae7b14749f9279429565c98fa4cdb626b7461046378e42762de20'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'ARRIVAL_TIME',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 22347.798061523234
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 24399.632207270013
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'UNITLESS',
                          value: 1.0
                        }
                      },
                      featureMeasurementType: 'ARRIVAL_TIME',
                      predictedValue: {
                        arrivalTime: {
                          standardDeviation: 1.613,
                          value: 1739978470.868
                        },
                        travelTime: {
                          standardDeviation: 1.613,
                          value: 310.85
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.287
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'PATH_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: -0.87
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_PATH_DEPENDENT',
                          value: {
                            standardDeviation: 0.0,
                            value: 1.613
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELEVATION_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.057
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 311.376
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.3888,
                      latitudeDegrees: -19.9426,
                      longitudeDegrees: 134.3395
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  requestedDefining: true,
                  residual: 317.57852739826194,
                  weight: 0.5269466765167922
                },
                {
                  defining: true,
                  measurement: {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    featureMeasurementType: 'SLOWNESS',
                    measurementValue: {
                      measuredValue: {
                        standardDeviation: 0.53,
                        units: 'SECONDS_PER_DEGREE',
                        value: 8.9099588
                      }
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'SLOWNESS',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -0.03426298450345534
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -0.030331055804969042
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'ONE_OVER_DEGREE',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'SLOWNESS',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 0.5,
                          units: 'SECONDS_PER_DEGREE',
                          value: 9.04502443860534
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 9.04502443860534
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 0.5
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.6273,
                      latitudeDegrees: -23.665134,
                      longitudeDegrees: 133.905261
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  requestedDefining: true,
                  residual: -0.13506563860534085,
                  weight: 1.3724408537914388
                },
                {
                  defining: true,
                  measurement: {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    featureMeasurementType: 'ARRIVAL_TIME',
                    measurementValue: {
                      arrivalTime: {
                        standardDeviation: 1.443,
                        value: 1739978497.25
                      }
                    },
                    snr: {
                      units: 'DECIBELS',
                      value: 5.9805093
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'ARRIVAL_TIME',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 22233.080101910273
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 19681.671140451308
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'UNITLESS',
                          value: 1.0
                        }
                      },
                      featureMeasurementType: 'ARRIVAL_TIME',
                      predictedValue: {
                        arrivalTime: {
                          standardDeviation: 1.537,
                          value: 1739978496.44
                        },
                        travelTime: {
                          standardDeviation: 1.537,
                          value: 336.422
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.275
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_PATH_DEPENDENT',
                          value: {
                            standardDeviation: 0.0,
                            value: 1.537
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 336.549
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELEVATION_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.095
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'PATH_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: -0.497
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.6273,
                      latitudeDegrees: -23.665134,
                      longitudeDegrees: 133.905261
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  requestedDefining: true,
                  residual: 0.8100467439350041,
                  weight: 0.4743546171643739
                },
                {
                  defining: true,
                  measurement: {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    measurementValue: {
                      measuredValue: {
                        standardDeviation: 3.3951174,
                        units: 'DEGREES',
                        value: 51.526108
                      }
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739978437.25,
                      name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_51.526deg,slow_8.910s_per_deg/3f4ee5e14f13c2c0c4f4b93937668755807b91cd2e3a4f4c926d8afdf0872da0'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'UNITLESS',
                          value: -1.4999370577856985
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'UNITLESS',
                          value: 1.6943795328961262
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'DEGREES_PER_SECOND',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 5.0,
                          units: 'DEGREES',
                          value: 46.11729694128407
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'DEGREES',
                            value: 46.11729694128407
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'DEGREES',
                            value: 5.0
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.6273,
                      latitudeDegrees: -23.665134,
                      longitudeDegrees: 133.905261
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  requestedDefining: true,
                  residual: 5.408811058715915,
                  weight: 0.16546039429428455
                },
                {
                  defining: true,
                  measurement: {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    measurementValue: {
                      measuredValue: {
                        standardDeviation: 1.0769702,
                        units: 'DEGREES',
                        value: 49.755045
                      }
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'UNITLESS',
                          value: -1.8510965137547948
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'UNITLESS',
                          value: 1.6954325676046873
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'DEGREES_PER_SECOND',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 5.0,
                          units: 'DEGREES',
                          value: 51.40060495409547
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'DEGREES',
                            value: 51.40060495409547
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'DEGREES',
                            value: 5.0
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.3888,
                      latitudeDegrees: -19.9426,
                      longitudeDegrees: 134.3395
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  requestedDefining: true,
                  residual: -1.6455599540954868,
                  weight: 0.19551597694083656
                },
                {
                  defining: true,
                  measurement: {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    featureMeasurementType: 'ARRIVAL_TIME',
                    measurementValue: {
                      arrivalTime: {
                        standardDeviation: 1.095,
                        value: 1739978470.175
                      }
                    },
                    snr: {
                      units: 'DECIBELS',
                      value: 9.9056873
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'ARRIVAL_TIME',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 22347.798061523234
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE',
                          value: 24399.632207270013
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'UNITLESS',
                          value: 1.0
                        }
                      },
                      featureMeasurementType: 'ARRIVAL_TIME',
                      predictedValue: {
                        arrivalTime: {
                          standardDeviation: 1.613,
                          value: 1739978470.868
                        },
                        travelTime: {
                          standardDeviation: 1.613,
                          value: 310.85
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.287
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'PATH_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: -0.87
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_PATH_DEPENDENT',
                          value: {
                            standardDeviation: 0.0,
                            value: 1.613
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'ELEVATION_CORRECTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 0.057
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            standardDeviation: 0.0,
                            value: 311.376
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.3888,
                      latitudeDegrees: -19.9426,
                      longitudeDegrees: 134.3395
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  requestedDefining: true,
                  residual: -0.6924727486039046,
                  weight: 0.5129631217037082
                },
                {
                  defining: true,
                  measurement: {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    featureMeasurementType: 'SLOWNESS',
                    measurementValue: {
                      measuredValue: {
                        standardDeviation: 0.19,
                        units: 'SECONDS_PER_DEGREE',
                        value: 10.066436
                      }
                    }
                  },
                  prediction: {
                    channel: {
                      effectiveAt: 1739978410.175,
                      name: 'WRA.beam.BHZ/beam,fk,coherent/steer,az_49.755deg,slow_10.066s_per_deg/569f49cf35117ae5ff8376ddc17cef216ff9de236c21afc153da8d63fec088ab'
                    },
                    extrapolated: false,
                    phase: 'P',
                    predictionType: 'SLOWNESS',
                    predictionValue: {
                      derivativeMap: {
                        DERIVATIVE_WRT_LATITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -2.3250971220449013
                        },
                        DERIVATIVE_WRT_LONGITUDE: {
                          units: 'SECONDS_PER_DEGREE_SQUARED',
                          value: -2.538572904046134
                        },
                        DERIVATIVE_WRT_TIME: {
                          units: 'ONE_OVER_DEGREE',
                          value: 0.0
                        }
                      },
                      featureMeasurementType: 'SLOWNESS',
                      predictedValue: {
                        measuredValue: {
                          standardDeviation: 0.5,
                          units: 'SECONDS_PER_DEGREE',
                          value: 10.078952803330893
                        }
                      },
                      featurePredictionComponents: [
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'BASEMODEL_PREDICTION',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 10.078952803330893
                          }
                        },
                        {
                          extrapolated: false,
                          featurePredictionComponent: 'UNCERTAINTY_STATION_PHASE_DEPENDENT',
                          value: {
                            units: 'SECONDS_PER_DEGREE',
                            value: 0.5
                          }
                        }
                      ]
                    },
                    receiverLocation: {
                      depthKm: 0.0,
                      elevationKm: 0.3888,
                      latitudeDegrees: -19.9426,
                      longitudeDegrees: 134.3395
                    },
                    sourceLocation: {
                      depthKm: 0.0,
                      latitudeDegrees: -4.456105315351985,
                      longitudeDegrees: 152.5357841096191,
                      time: 1739978160.018
                    }
                  },
                  requestedDefining: true,
                  residual: -0.012516803330891668,
                  weight: 1.8695671611766977
                }
              ],
              locationRestraint: {
                depthRestraintKm: 0.0,
                depthRestraintReason: 'FIXED_AT_SURFACE',
                depthRestraintType: 'FIXED',
                epicenterRestraintType: 'UNRESTRAINED',
                restrainer: 'FIXED_BY_CONFIGURATION',
                timeRestraintType: 'UNRESTRAINED'
              },
              locationUncertainty: {
                ellipses: [
                  {
                    aprioriStandardError: 1.0,
                    confidenceLevel: 0.95,
                    depthUncertaintyKm: 0.0,
                    kWeight: 'Infinity',
                    scalingFactorType: 'COVERAGE',
                    semiMajorAxisLengthKm: 390.28694931813465,
                    semiMajorAxisTrendDeg: 137.70613478685078,
                    semiMinorAxisLengthKm: 42.2615060666011,
                    timeUncertainty: 4.251
                  },
                  {
                    aprioriStandardError: 1.0,
                    confidenceLevel: 0.95,
                    depthUncertaintyKm: 0.0,
                    kWeight: 0.0,
                    scalingFactorType: 'CONFIDENCE',
                    semiMajorAxisLengthKm: 443.18200556139567,
                    semiMajorAxisTrendDeg: 137.70613478685078,
                    semiMinorAxisLengthKm: 47.98915016083296,
                    timeUncertainty: 4.39
                  },
                  {
                    aprioriStandardError: 1.0,
                    confidenceLevel: 0.95,
                    depthUncertaintyKm: 0.0,
                    kWeight: 8.0,
                    scalingFactorType: 'K_WEIGHTED',
                    semiMajorAxisLengthKm: 411.82017229867273,
                    semiMajorAxisTrendDeg: 137.70613478685078,
                    semiMinorAxisLengthKm: 44.593191600066625,
                    timeUncertainty: 4.369
                  }
                ],
                ellipsoids: [],
                stdDevTravelTimeResiduals: 0.7512597462694544,
                tt: 4.704510062146115,
                xt: -96.29353465311127,
                xx: 14045.722433561095,
                xy: -12506.686566791219,
                xz: 0.0,
                yt: 52.92681812165587,
                yy: 11675.858073184647,
                yz: 0.0,
                zt: 0.0,
                zz: 0.0
              },
              networkMagnitudeSolutions: [],
              id: 'c811c105-9f80-495b-8893-85b17aa1dc13'
            }
          ],
          parentEventHypotheses: [
            {
              id: {
                eventId: 'd09bf415-44a3-365a-86c9-077ebb5e35c3',
                hypothesisId: '77971c00-7bc6-3f26-bf41-e9d58cffcab1'
              }
            }
          ],
          preferredLocationSolution: {
            id: 'c811c105-9f80-495b-8893-85b17aa1dc13'
          },
          rejected: false
        }
      ];
      expect(() => {
        eventHypothesisSchema.parse(result[0]);
      }).toThrow();
      expect(eventHypothesisSchema.safeParse(result[0]).success).toBeFalsy();
      expect(eventHypothesisSchema.safeParse(result[0])).toMatchSnapshot();
    });
  });
});
