import { StationType, Units } from '../../src/ts/common';
import { SignalDetectionTypes } from '../../src/ts/common-model';
import type { FeatureMeasurement } from '../../src/ts/signal-detection';
import {
  featureMeasurementSchema,
  FeatureMeasurementType,
  signalDetectionHypothesisSchema,
  signalDetectionSchema
} from '../../src/ts/signal-detection';
import { stationSchema } from '../../src/ts/station-definitions';
import {
  ChannelBandType,
  ChannelDataType,
  ChannelGroupType,
  ChannelInstrumentType,
  ChannelOrientationType
} from '../../src/ts/station-definitions/channel-definitions';

describe('signal detection schema', () => {
  describe('signal detection hypothesis schema', () => {
    const signalDetectionHypothesis: SignalDetectionTypes.SignalDetectionHypothesis = {
      deleted: false,
      featureMeasurements: [
        {
          channel: {
            effectiveAt: 1729840214.975,
            name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2c9a516b2edbb0ec9cb7271f2f3daad7754d5a7faaf2dac87239fd0fe7fe0347'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.PHASE,
          measurementValue: {
            value: 'P'
          }
        },
        {
          channel: {
            effectiveAt: 1729840214.975,
            name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2c9a516b2edbb0ec9cb7271f2f3daad7754d5a7faaf2dac87239fd0fe7fe0347'
          },
          featureMeasurementType:
            SignalDetectionTypes.FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
          measurementValue: {
            measuredValue: {
              standardDeviation: 7.626245,
              units: Units.DEGREES,
              value: 112.90577
            }
          }
        },
        {
          channel: {
            effectiveAt: 1729840214.975,
            name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2c9a516b2edbb0ec9cb7271f2f3daad7754d5a7faaf2dac87239fd0fe7fe0347'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.SLOWNESS,
          measurementValue: {
            measuredValue: {
              standardDeviation: 0.72,
              units: Units.SECONDS_PER_DEGREE,
              value: 5.4130544
            }
          }
        },
        {
          channel: {
            effectiveAt: 1729840214.975,
            name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2c9a516b2edbb0ec9cb7271f2f3daad7754d5a7faaf2dac87239fd0fe7fe0347'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.ARRIVAL_TIME,
          measurementValue: {
            arrivalTime: {
              standardDeviation: 1.72,
              value: 1729840274.975
            }
          },
          snr: {
            units: Units.DECIBELS,
            value: 3.5784304
          }
        }
      ],
      monitoringOrganization: 'GMS',
      parentSignalDetectionHypothesis: {
        id: {
          id: '79deb8cd-147d-3e51-b0e4-82a378357b0a',
          signalDetectionId: 'a9b7ba70-783b-317e-9998-dc4dd82eb3c5'
        }
      },
      station: {
        allRawChannels: [
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAB0.SHZ'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAB1.SHZ'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAB2.SHZ'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAB3.SHZ'
          },
          {
            effectiveAt: 1729698293.614,
            name: 'YKA.YKAB4.SHZ'
          },
          {
            effectiveAt: 1729698293.614,
            name: 'YKA.YKAB6.SHZ'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAB7.SHZ'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAB8.SHZ'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAB9.SHZ'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAR1.SHZ'
          },
          {
            effectiveAt: 1729698293.614,
            name: 'YKA.YKAR2.SHZ'
          },
          {
            effectiveAt: 1729698293.614,
            name: 'YKA.YKAR3.SHZ'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAR4.SHZ'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAR5.SHZ'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAR6.SHZ'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAR7.SHZ'
          },
          {
            effectiveAt: 1729698293.614,
            name: 'YKA.YKAR8.SHZ'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAR9.SHZ'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAW1.BHE'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAW1.BHN'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAW1.BHZ'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAW3.BHE'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAW3.BHN'
          },
          {
            effectiveAt: 1729717200,
            name: 'YKA.YKAW3.BHZ'
          }
        ],
        channelGroups: [
          {
            channels: [
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAB0.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1961,
              latitudeDegrees: 62.605918,
              longitudeDegrees: -114.60601
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAB0'
          },
          {
            channels: [
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAB1.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1464,
              latitudeDegrees: 62.402336,
              longitudeDegrees: -114.60626
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAB1'
          },
          {
            channels: [
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAB2.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1518,
              latitudeDegrees: 62.424675,
              longitudeDegrees: -114.60637
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAB2'
          },
          {
            channels: [
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAB3.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1595,
              latitudeDegrees: 62.448491,
              longitudeDegrees: -114.60606
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAB3'
          },
          {
            channels: [
              {
                effectiveAt: 1729698293.614,
                name: 'YKA.YKAB4.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1648,
              latitudeDegrees: 62.470925,
              longitudeDegrees: -114.60574
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAB4'
          },
          {
            channels: [
              {
                effectiveAt: 1729698293.614,
                name: 'YKA.YKAB6.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1746,
              latitudeDegrees: 62.516408,
              longitudeDegrees: -114.60572
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAB6'
          },
          {
            channels: [
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAB7.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1779,
              latitudeDegrees: 62.538932,
              longitudeDegrees: -114.60605
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAB7'
          },
          {
            channels: [
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAB8.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1715,
              latitudeDegrees: 62.561431,
              longitudeDegrees: -114.60544
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAB8'
          },
          {
            channels: [
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAB9.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1883,
              latitudeDegrees: 62.582921,
              longitudeDegrees: -114.60465
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAB9'
          },
          {
            channels: [
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAR1.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1421,
              latitudeDegrees: 62.492826,
              longitudeDegrees: -114.94446
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAR1'
          },
          {
            channels: [
              {
                effectiveAt: 1729698293.614,
                name: 'YKA.YKAR2.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1462,
              latitudeDegrees: 62.492806,
              longitudeDegrees: -114.8959
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAR2'
          },
          {
            channels: [
              {
                effectiveAt: 1729698293.614,
                name: 'YKA.YKAR3.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1476,
              latitudeDegrees: 62.492924,
              longitudeDegrees: -114.84766
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAR3'
          },
          {
            channels: [
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAR4.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1501,
              latitudeDegrees: 62.492656,
              longitudeDegrees: -114.7997
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAR4'
          },
          {
            channels: [
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAR5.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1553,
              latitudeDegrees: 62.493142,
              longitudeDegrees: -114.75035
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAR5'
          },
          {
            channels: [
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAR6.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1621,
              latitudeDegrees: 62.493157,
              longitudeDegrees: -114.70193
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAR6'
          },
          {
            channels: [
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAR7.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1685,
              latitudeDegrees: 62.493204,
              longitudeDegrees: -114.65443
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAR7'
          },
          {
            channels: [
              {
                effectiveAt: 1729698293.614,
                name: 'YKA.YKAR8.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1679,
              latitudeDegrees: 62.49308,
              longitudeDegrees: -114.6061
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAR8'
          },
          {
            channels: [
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAR9.SHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1726,
              latitudeDegrees: 62.493042,
              longitudeDegrees: -114.55641
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAR9'
          },
          {
            channels: [
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAW1.BHE'
              },
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAW1.BHN'
              },
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAW1.BHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1707,
              latitudeDegrees: 62.4822,
              longitudeDegrees: -114.4843
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAW1'
          },
          {
            channels: [
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAW3.BHE'
              },
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAW3.BHN'
              },
              {
                effectiveAt: 1729717200,
                name: 'YKA.YKAW3.BHZ'
              }
            ],
            description: 'Yellowknife,_N.W.T.',
            location: {
              depthKm: 0,
              elevationKm: 0.1703,
              latitudeDegrees: 62.5616,
              longitudeDegrees: -114.6099
            },
            type: ChannelGroupType.PHYSICAL_SITE,
            effectiveAt: 1729695600,
            name: 'YKAW3'
          }
        ],
        description: 'Yellowknife,_N.W.T.',
        location: {
          depthKm: 0,
          elevationKm: 0.1679,
          latitudeDegrees: 62.49308,
          longitudeDegrees: -114.6061
        },
        relativePositionChannelPairs: [
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAB0.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: 0.0046,
              northDisplacementKm: 12.5954,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAB1.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: -0.0083,
              northDisplacementKm: -10.129,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAB2.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: -0.014,
              northDisplacementKm: -7.6355,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAB3.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: 0.0021,
              northDisplacementKm: -4.9771,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729698293.614,
              name: 'YKA.YKAB4.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: 0.0186,
              northDisplacementKm: -2.473,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729698293.614,
              name: 'YKA.YKAB6.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: 0.0196,
              northDisplacementKm: 2.6039,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAB7.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: 0.0026,
              northDisplacementKm: 5.1181,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAB8.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: 0.034,
              northDisplacementKm: 7.6296,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAB9.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: 0.0746,
              northDisplacementKm: 10.0284,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAR1.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: -17.4688,
              northDisplacementKm: 0.0173,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729698293.614,
              name: 'YKA.YKAR2.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: -14.9618,
              northDisplacementKm: 0.0029,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729698293.614,
              name: 'YKA.YKAR3.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: -12.4712,
              northDisplacementKm: 0.0059,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAR4.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: -9.9953,
              northDisplacementKm: -0.0324,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAR5.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: -7.4473,
              northDisplacementKm: 0.0152,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAR6.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: -4.9475,
              northDisplacementKm: 0.0123,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAR7.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: -2.4952,
              northDisplacementKm: 0.0148,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729698293.614,
              name: 'YKA.YKAR8.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: 0,
              northDisplacementKm: 0,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAR9.SHZ'
            },
            relativePosition: {
              eastDisplacementKm: 2.5654,
              northDisplacementKm: -0.0033,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAW1.BHE'
            },
            relativePosition: {
              eastDisplacementKm: 6.2905,
              northDisplacementKm: -1.2085,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAW1.BHN'
            },
            relativePosition: {
              eastDisplacementKm: 6.2905,
              northDisplacementKm: -1.2085,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAW1.BHZ'
            },
            relativePosition: {
              eastDisplacementKm: 6.2905,
              northDisplacementKm: -1.2085,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAW3.BHE'
            },
            relativePosition: {
              eastDisplacementKm: -0.1957,
              northDisplacementKm: 7.6484,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAW3.BHN'
            },
            relativePosition: {
              eastDisplacementKm: -0.1957,
              northDisplacementKm: 7.6484,
              verticalDisplacementKm: 0
            }
          },
          {
            channel: {
              effectiveAt: 1729717200,
              name: 'YKA.YKAW3.BHZ'
            },
            relativePosition: {
              eastDisplacementKm: -0.1957,
              northDisplacementKm: 7.6484,
              verticalDisplacementKm: 0
            }
          }
        ],
        type: StationType.SEISMIC_ARRAY,
        effectiveAt: 1729695600,
        name: 'YKA',
        effectiveUntil: 1729881531.119
      },
      id: {
        id: '4615d552-fe9c-3512-bbe8-80e434955cb7',
        signalDetectionId: 'a9b7ba70-783b-317e-9998-dc4dd82eb3c5'
      }
    };

    it('should parse signal detection hypothesis - station', () => {
      stationSchema.parse(signalDetectionHypothesis.station);
      expect(stationSchema.safeParse(signalDetectionHypothesis.station).success).toBeTruthy();
    });

    it('should parse signal detection hypothesis', () => {
      signalDetectionHypothesisSchema.parse(signalDetectionHypothesis);
      expect(
        signalDetectionHypothesisSchema.safeParse(signalDetectionHypothesis).success
      ).toBeTruthy();
    });

    it('should parse signal detection', () => {
      const signalDetectionNoHypothesis: SignalDetectionTypes.SignalDetection = {
        id: 'temp',
        station: {
          name: 'station'
        },
        monitoringOrganization: 'org',
        signalDetectionHypotheses: []
      };
      expect(signalDetectionSchema.safeParse(signalDetectionNoHypothesis).success).toBeFalsy();

      const signalDetection: SignalDetectionTypes.SignalDetection = {
        id: 'temp',
        station: {
          name: 'station'
        },
        monitoringOrganization: 'org',
        signalDetectionHypotheses: [signalDetectionHypothesis]
      };
      signalDetectionSchema.parse(signalDetection);
      expect(signalDetectionSchema.safeParse(signalDetection).success).toBeTruthy();
    });
  });

  it('can parse feature measurements', () => {
    const featureMeasurements: FeatureMeasurement[] = [
      {
        channel: {
          effectiveAt: 1730147126.329,
          name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_215.318deg,slow_10.599s_per_deg/17ae3364e80cd4f26dab76afe94f699a56b2bd3df181167c134763206094dfa4'
        },
        featureMeasurementType: FeatureMeasurementType.ARRIVAL_TIME,
        measurementValue: {
          arrivalTime: {
            standardDeviation: 1.72,
            value: 1730147186.329
          }
        },
        snr: {
          units: Units.DECIBELS,
          value: 3.7446418
        }
      },
      {
        channel: {
          effectiveAt: 1730147126.329,
          name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_215.318deg,slow_10.599s_per_deg/17ae3364e80cd4f26dab76afe94f699a56b2bd3df181167c134763206094dfa4'
        },
        featureMeasurementType: FeatureMeasurementType.SLOWNESS,
        measurementValue: {
          measuredValue: {
            standardDeviation: 2.05,
            units: Units.SECONDS_PER_DEGREE,
            value: 10.599385
          }
        }
      },
      {
        channel: {
          canonicalName:
            'YKA.beam.SHZ/beam,fk,coherent/steer,az_215.318deg,slow_10.599s_per_deg/17ae3364e80cd4f26dab76afe94f699a56b2bd3df181167c134763206094dfa4',
          channelBandType: ChannelBandType.SHORT_PERIOD,
          channelDataType: ChannelDataType.SEISMIC,
          channelInstrumentType: ChannelInstrumentType.HIGH_GAIN_SEISMOMETER,
          channelOrientationCode: 'Z',
          channelOrientationType: ChannelOrientationType.VERTICAL,
          configuredInputs: [],
          description: 'YKA/SHZ fk beam',
          effectiveUntil: 1730147426.304,
          location: {
            depthKm: 0.05,
            elevationKm: 0.2294,
            latitudeDegrees: 53.948051,
            longitudeDegrees: 84.818784
          },
          nominalSampleRateHz: 40,
          orientationAngles: {
            horizontalAngleDeg: -1,
            verticalAngleDeg: 0
          },
          processingDefinition: {
            BEAM_SUMMATION: 'B',
            STEERING_BACK_AZIMUTH: 215.31803,
            STEERING_SLOWNESS: 10.59938
          },
          processingMetadata: {
            BRIDGED: '/bridged,ARID:8224',
            CHANNEL_GROUP: 'beam',
            STEERING_BACK_AZIMUTH: 215.31803,
            STEERING_SLOWNESS: 10.59938,
            BEAM_SUMMATION: 'B',
            BEAM_TYPE: 'FK'
          },
          station: {
            effectiveAt: 1729900800,
            name: 'YKA'
          },
          units: Units.NANOMETERS,
          effectiveAt: 1730147126.329,
          name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_215.318deg,slow_10.599s_per_deg/17ae3364e80cd4f26dab76afe94f699a56b2bd3df181167c134763206094dfa4'
        },
        featureMeasurementType: FeatureMeasurementType.PHASE,
        measurementValue: {
          value: 'P',
          referenceTime: 1730147186.329
        }
      },
      {
        channel: {
          effectiveAt: 1730147126.329,
          name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_215.318deg,slow_10.599s_per_deg/17ae3364e80cd4f26dab76afe94f699a56b2bd3df181167c134763206094dfa4'
        },
        featureMeasurementType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
        measurementValue: {
          measuredValue: {
            standardDeviation: 11.084586,
            units: Units.DEGREES,
            value: 215.31803
          }
        }
      }
    ];

    featureMeasurements.forEach(fm => {
      featureMeasurementSchema.parse(fm);
      expect(featureMeasurementSchema.safeParse(fm).success).toBeTruthy();
    });
  });
});
