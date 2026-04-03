import type { ChannelSegmentDescriptor } from '../../../src/ts/channel-segment';
import { CommonTypes, SignalDetectionTypes } from '../../../src/ts/common-model';
import { FilterDefinitionUsage } from '../../../src/ts/filter';
import { pdarPD01Channel } from '../station-definitions';

// TODO: Move this
export const pdarUiChannelSegmentDescriptor: ChannelSegmentDescriptor = {
  channel: {
    name: pdarPD01Channel.name,
    effectiveAt: pdarPD01Channel.effectiveAt
  },
  startTime: 1636503404,
  endTime: 1636503704,
  creationTime: 1636503404
};

// !Signal Detection Hypotheses

// TODO: Update these with actual event beams. These are fk beams with the event replaced.
export const asarEventBeamSignalDetectionHypothesis: SignalDetectionTypes.SignalDetectionHypothesis =
  {
    id: {
      id: '20cc9505-efe3-3068-b7d5-59196f37992c',
      signalDetectionId: '012de1b9-8ae3-3fd4-800d-58665c3152cc'
    },
    parentSignalDetectionHypothesis: null,
    deleted: false,
    station: {
      name: 'ASAR',
      effectiveAt: 123
    },
    monitoringOrganization: 'GMS',
    featureMeasurements: [
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          value: 'INDETERMINATE',
          confidence: undefined,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.LONG_PERIOD_FIRST_MOTION
      },
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        analysisWaveform: {
          waveform: {
            id: {
              channel: {
                name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
                effectiveAt: 1636503404
              },
              startTime: 1636503404,
              endTime: 1636503704,
              creationTime: 1636503404
            }
          },
          filterDefinitionUsage: undefined,
          filterDefinition: undefined
        },
        measurementValue: {
          arrivalTime: {
            value: 1636504404,
            standardDeviation: 1.162
          },
          travelTime: undefined
        },
        snr: {
          value: 8.9939442,
          standardDeviation: undefined,
          units: CommonTypes.Units.DECIBELS
        },
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.ARRIVAL_TIME
      },
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          value: 'P',
          confidence: 50,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.PHASE
      },
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          value: 'INDETERMINATE',
          confidence: undefined,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType:
          SignalDetectionTypes.FeatureMeasurementType.SHORT_PERIOD_FIRST_MOTION
      },
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        analysisWaveform: {
          waveform: {
            id: {
              channel: {
                name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
                effectiveAt: 1636503404
              },
              startTime: 1636503404,
              endTime: 1636503704,
              creationTime: 1636503404
            }
          },
          filterDefinitionUsage: undefined,
          filterDefinition: undefined
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: 90.142121,
            standardDeviation: 2.2089042,
            units: CommonTypes.Units.DEGREES
          }
        },
        snr: undefined,
        featureMeasurementType:
          SignalDetectionTypes.FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH
      },
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: -1,
            standardDeviation: undefined,
            units: CommonTypes.Units.DEGREES
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.EMERGENCE_ANGLE
      },
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: 7.1219535,
            standardDeviation: 0.27,
            units: CommonTypes.Units.SECONDS_PER_DEGREE
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.SLOWNESS
      },
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: -1,
            standardDeviation: undefined,
            units: CommonTypes.Units.UNITLESS
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.RECTILINEARITY
      },
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,event,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          measurementTime: 1636503404,
          measurementWindowDuration: 6,
          clipped: false,
          measurementWindowStart: 1636503404,
          amplitude: 5.0,
          units: CommonTypes.Units.MAGNITUDE,
          period: 0.25
        },
        snr: {
          value: 8.9939442,
          standardDeviation: undefined,
          units: CommonTypes.Units.DECIBELS
        },
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.AMPLITUDE_A5_OVER_2
      }
    ]
  };

// TODO: Can these names be more descriptive
export const asarFkBeamSignalDetectionHypothesis1: SignalDetectionTypes.SignalDetectionHypothesis =
  {
    id: {
      id: '20cc9505-efe3-3068-b7d5-59196f37992c',
      signalDetectionId: '012de1b9-8ae3-3fd4-800d-58665c3152cc'
    },
    parentSignalDetectionHypothesis: null,
    deleted: false,
    station: {
      name: 'ASAR',
      effectiveAt: 123
    },
    monitoringOrganization: 'GMS',
    featureMeasurements: [
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          value: 'INDETERMINATE',
          confidence: undefined,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.LONG_PERIOD_FIRST_MOTION
      },
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        analysisWaveform: {
          waveform: {
            id: {
              channel: {
                name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
                effectiveAt: 1636503404
              },
              startTime: 1636503404,
              endTime: 1636503704,
              creationTime: 1636503404
            }
          },
          filterDefinitionUsage: undefined,
          filterDefinition: undefined
        },
        measurementValue: {
          arrivalTime: {
            value: 1636503404,
            standardDeviation: 1.162
          },
          travelTime: undefined
        },
        snr: {
          value: 8.9939442,
          standardDeviation: undefined,
          units: CommonTypes.Units.DECIBELS
        },
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.ARRIVAL_TIME
      },
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          value: 'P',
          confidence: 50,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.PHASE
      },
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          value: 'INDETERMINATE',
          confidence: undefined,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType:
          SignalDetectionTypes.FeatureMeasurementType.SHORT_PERIOD_FIRST_MOTION
      },
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        analysisWaveform: {
          waveform: {
            id: {
              channel: {
                name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
                effectiveAt: 1636503404
              },
              startTime: 1636503404,
              endTime: 1636503704,
              creationTime: 1636503404
            }
          },
          filterDefinitionUsage: undefined,
          filterDefinition: undefined
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: 90.142121,
            standardDeviation: 2.2089042,
            units: CommonTypes.Units.DEGREES
          }
        },
        snr: undefined,
        featureMeasurementType:
          SignalDetectionTypes.FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH
      },
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: -1,
            standardDeviation: undefined,
            units: CommonTypes.Units.DEGREES
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.EMERGENCE_ANGLE
      },
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: 7.1219535,
            standardDeviation: 0.27,
            units: CommonTypes.Units.SECONDS_PER_DEGREE
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.SLOWNESS
      },
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: -1,
            standardDeviation: undefined,
            units: CommonTypes.Units.UNITLESS
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.RECTILINEARITY
      },
      {
        channel: {
          name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          measurementTime: 1636503404,
          measurementWindowDuration: 6,
          clipped: false,
          measurementWindowStart: 1636503404,
          amplitude: 5.0,
          units: CommonTypes.Units.MAGNITUDE,
          period: 0.25
        },
        snr: {
          value: 8.9939442,
          standardDeviation: undefined,
          units: CommonTypes.Units.DECIBELS
        },
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.AMPLITUDE_A5_OVER_2
      }
    ]
  };

export const asarFkBeamSignalDetectionHypothesis2: SignalDetectionTypes.SignalDetectionHypothesis =
  {
    id: {
      id: '20cc9505-efe3-3068-b7d5-59196f37992d',
      signalDetectionId: '012de1b9-8ae3-3fd4-800d-58123c3152cc'
    },
    parentSignalDetectionHypothesis: null,
    deleted: false,
    station: {
      name: 'ASAR',
      effectiveAt: 123
    },
    monitoringOrganization: 'GMS',
    featureMeasurements: [
      {
        channel: {
          name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          value: 'INDETERMINATE',
          confidence: undefined,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.LONG_PERIOD_FIRST_MOTION
      },
      {
        channel: {
          name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        analysisWaveform: {
          waveform: {
            id: {
              channel: {
                name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
                effectiveAt: 1636503404
              },
              startTime: 1636503404,
              endTime: 1636503704,
              creationTime: 1636503404
            }
          },
          filterDefinitionUsage: undefined,
          filterDefinition: undefined
        },
        measurementValue: {
          arrivalTime: {
            value: 1636503420,
            standardDeviation: undefined
          },
          travelTime: undefined
        },
        snr: {
          value: 8.9939442,
          standardDeviation: undefined,
          units: CommonTypes.Units.DECIBELS
        },
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.ARRIVAL_TIME
      },
      {
        channel: {
          name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          value: 'Pg',
          confidence: 50,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.PHASE
      },
      {
        channel: {
          name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          value: 'INDETERMINATE',
          confidence: undefined,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType:
          SignalDetectionTypes.FeatureMeasurementType.SHORT_PERIOD_FIRST_MOTION
      },
      {
        channel: {
          name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        analysisWaveform: {
          waveform: {
            id: {
              channel: {
                name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
                effectiveAt: 1636503404
              },
              startTime: 1636503404,
              endTime: 1636503704,
              creationTime: 1636503404
            }
          },
          filterDefinitionUsage: undefined,
          filterDefinition: undefined
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: 90.142121,
            standardDeviation: 2.2089042,
            units: CommonTypes.Units.DEGREES
          }
        },
        snr: undefined,
        featureMeasurementType:
          SignalDetectionTypes.FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH
      },
      {
        channel: {
          name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: -1,
            standardDeviation: undefined,
            units: CommonTypes.Units.DEGREES
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.EMERGENCE_ANGLE
      },
      {
        channel: {
          name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: 7.1219535,
            standardDeviation: 0.27,
            units: CommonTypes.Units.SECONDS_PER_DEGREE
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.SLOWNESS
      },
      {
        channel: {
          name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: -1,
            standardDeviation: undefined,
            units: CommonTypes.Units.UNITLESS
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.RECTILINEARITY
      },
      {
        channel: {
          name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          measurementTime: 1636503422,
          measurementWindowDuration: 6,
          clipped: false,
          measurementWindowStart: 1636503422,
          amplitude: 5.0,
          units: CommonTypes.Units.MAGNITUDE,
          period: 0.75
        },
        snr: {
          value: 8.9939442,
          standardDeviation: undefined,
          units: CommonTypes.Units.DECIBELS
        },
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.AMPLITUDE_A5_OVER_2
      }
    ]
  };

export const asarFkBeamSignalDetectionHypothesis3: SignalDetectionTypes.SignalDetectionHypothesis =
  {
    id: {
      id: '20cc9505-efe3-3068-b7d5-59196f37992e',
      signalDetectionId: '012de1b9-8ae3-3fd4-800d-58165c3152cc'
    },
    parentSignalDetectionHypothesis: null,
    deleted: false,
    station: {
      name: 'ASAR',
      effectiveAt: 123
    },
    monitoringOrganization: 'GMS',
    featureMeasurements: [
      {
        channel: {
          name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          value: 'INDETERMINATE',
          confidence: undefined,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.LONG_PERIOD_FIRST_MOTION
      },
      {
        channel: {
          name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        analysisWaveform: {
          waveform: {
            id: {
              channel: {
                name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
                effectiveAt: 1636503404
              },
              startTime: 1636503404,
              endTime: 1636503704,
              creationTime: 1636503404
            }
          },
          filterDefinitionUsage: undefined,
          filterDefinition: undefined
        },
        measurementValue: {
          arrivalTime: {
            value: 1636503404,
            standardDeviation: 1.162
          },
          travelTime: undefined
        },
        snr: {
          value: 8.9939442,
          standardDeviation: undefined,
          units: CommonTypes.Units.DECIBELS
        },
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.ARRIVAL_TIME
      },
      {
        channel: {
          name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          value: 'P',
          confidence: 50,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.PHASE
      },
      {
        channel: {
          name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          value: 'INDETERMINATE',
          confidence: undefined,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType:
          SignalDetectionTypes.FeatureMeasurementType.SHORT_PERIOD_FIRST_MOTION
      },
      {
        channel: {
          name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        analysisWaveform: {
          waveform: {
            id: {
              channel: {
                name: 'ASAR.beam.SHZ/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
                effectiveAt: 1636503404
              },
              startTime: 1636503404,
              endTime: 1636503704,
              creationTime: 1636503404
            }
          },
          filterDefinitionUsage: undefined,
          filterDefinition: undefined
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: 90.142121,
            standardDeviation: 2.2089042,
            units: CommonTypes.Units.DEGREES
          }
        },
        snr: undefined,
        featureMeasurementType:
          SignalDetectionTypes.FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH
      },
      {
        channel: {
          name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: -1,
            standardDeviation: undefined,
            units: CommonTypes.Units.DEGREES
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.EMERGENCE_ANGLE
      },
      {
        channel: {
          name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: 7.1219535,
            standardDeviation: 0.27,
            units: CommonTypes.Units.SECONDS_PER_DEGREE
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.SLOWNESS
      },
      {
        channel: {
          name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: -1,
            standardDeviation: undefined,
            units: CommonTypes.Units.UNITLESS
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.RECTILINEARITY
      },
      {
        channel: {
          name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
          effectiveAt: 1636503404
        },
        measuredChannelSegment: {
          id: {
            channel: {
              name: 'ASAR.beam.BHN/beam,fk,coherent/steer,az_90.142deg,slow_7.122s_per_deg/06c0cb24-ab8f-3853-941d-bdf5e73a51b4',
              effectiveAt: 1636503404
            },
            startTime: 1636503404,
            endTime: 1636503704,
            creationTime: 1636503404
          }
        },
        measurementValue: {
          measurementTime: 1636503404,
          measurementWindowDuration: 6,
          clipped: false,
          measurementWindowStart: 1636503404,
          amplitude: 5.0,
          units: CommonTypes.Units.MAGNITUDE,
          period: 1.0
        },
        snr: {
          value: 8.9939442,
          standardDeviation: undefined,
          units: CommonTypes.Units.DECIBELS
        },
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.AMPLITUDE_A5_OVER_2
      }
    ]
  };

/** Faceted {@link asarFkBeamSignalDetectionHypothesis1} */
export const asarFkBeamFacetedSignalDetectionHypothesis1: SignalDetectionTypes.SignalDetectionHypothesisFaceted =
  {
    id: asarFkBeamSignalDetectionHypothesis1.id
  };

/** Faceted {@link asarFkBeamSignalDetectionHypothesis2} */
export const asarFkBeamFacetedSignalDetectionHypothesis2: SignalDetectionTypes.SignalDetectionHypothesisFaceted =
  {
    id: asarFkBeamSignalDetectionHypothesis2.id
  };

export const pdarSignalDetectionHypothesis: SignalDetectionTypes.SignalDetectionHypothesis = {
  id: {
    id: '20cc9505-efe3-3068-b7d5-59196f3799dd',
    signalDetectionId: '012de1b9-8ae3-3fd4-800d-58665c3152dd'
  },
  parentSignalDetectionHypothesis: null,
  deleted: false,
  station: {
    name: 'PDAR',
    effectiveAt: 123
  },
  monitoringOrganization: 'GMS',
  featureMeasurements: [
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      measurementValue: {
        value: 'INDETERMINATE',
        confidence: undefined,
        referenceTime: 1636503404
      },
      snr: undefined,
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.LONG_PERIOD_FIRST_MOTION
    },
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      analysisWaveform: {
        waveform: {
          id: pdarUiChannelSegmentDescriptor
        },
        filterDefinitionUsage: undefined,
        filterDefinition: undefined
      },
      measurementValue: {
        arrivalTime: {
          value: 1636503404,
          standardDeviation: 1.162
        },
        travelTime: undefined
      },
      snr: {
        value: 8.9939442,
        standardDeviation: undefined,
        units: CommonTypes.Units.DECIBELS
      },
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.ARRIVAL_TIME
    },
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      measurementValue: {
        value: 'P',
        confidence: 50,
        referenceTime: 1636503404
      },
      snr: undefined,
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.PHASE
    },
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      measurementValue: {
        value: 'INDETERMINATE',
        confidence: undefined,
        referenceTime: 1636503404
      },
      snr: undefined,
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.SHORT_PERIOD_FIRST_MOTION
    },
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      analysisWaveform: {
        waveform: {
          id: pdarUiChannelSegmentDescriptor
        },
        filterDefinitionUsage: undefined,
        filterDefinition: undefined
      },
      measurementValue: {
        referenceTime: undefined,
        measuredValue: {
          value: 90.142121,
          standardDeviation: 2.2089042,
          units: CommonTypes.Units.DEGREES
        }
      },
      snr: undefined,
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH
    },
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      measurementValue: {
        referenceTime: undefined,
        measuredValue: {
          value: -1,
          standardDeviation: undefined,
          units: CommonTypes.Units.DEGREES
        }
      },
      snr: undefined,
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.EMERGENCE_ANGLE
    },
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      measurementValue: {
        referenceTime: undefined,
        measuredValue: {
          value: 7.1219535,
          standardDeviation: 0.27,
          units: CommonTypes.Units.SECONDS_PER_DEGREE
        }
      },
      snr: undefined,
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.SLOWNESS
    },
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      measurementValue: {
        referenceTime: undefined,
        measuredValue: {
          value: -1,
          standardDeviation: undefined,
          units: CommonTypes.Units.UNITLESS
        }
      },
      snr: undefined,
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.RECTILINEARITY
    },
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      measurementValue: {
        measurementTime: 1636503404,
        measurementWindowDuration: 6,
        clipped: false,
        measurementWindowStart: 1636503404,
        amplitude: 5.0,
        units: CommonTypes.Units.MAGNITUDE,
        period: 0.25
      },
      snr: {
        value: 8.9939442,
        standardDeviation: undefined,
        units: CommonTypes.Units.DECIBELS
      },
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.AMPLITUDE_A5_OVER_2
    }
  ]
};

export const pdarAcceptedSignalDetectionHypothesis: SignalDetectionTypes.SignalDetectionHypothesis =
  {
    ...pdarSignalDetectionHypothesis,
    featureMeasurements: pdarSignalDetectionHypothesis.featureMeasurements.map(fm => {
      if (fm.featureMeasurementType !== SignalDetectionTypes.FeatureMeasurementType.SLOWNESS)
        return fm;
      return {
        ...fm,
        measurementValue: {
          ...fm.measurementValue,
          referenceTime: 1636503404
        }
      };
    })
  };

/** PDAR signal detection hypothesis with an ALR/2 measurement type */
export const pdarALR2SignalDetectionHypothesis: SignalDetectionTypes.SignalDetectionHypothesis = {
  id: {
    id: '6a936e7b-6ecc-4fde-99d8-9a838efc3118',
    signalDetectionId: '3379d111-5928-4277-a929-a8c011135846'
  },
  parentSignalDetectionHypothesis: null,
  deleted: false,
  station: {
    name: 'PDAR',
    effectiveAt: 123
  },
  monitoringOrganization: 'GMS',
  featureMeasurements: [
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      measurementValue: {
        value: 'INDETERMINATE',
        confidence: undefined,
        referenceTime: 1636503404
      },
      snr: undefined,
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.LONG_PERIOD_FIRST_MOTION
    },
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      analysisWaveform: {
        waveform: {
          id: pdarUiChannelSegmentDescriptor
        },
        filterDefinitionUsage: undefined,
        filterDefinition: undefined
      },
      measurementValue: {
        arrivalTime: {
          value: 1636503404,
          standardDeviation: 1.162
        },
        travelTime: undefined
      },
      snr: {
        value: 8.9939442,
        standardDeviation: undefined,
        units: CommonTypes.Units.DECIBELS
      },
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.ARRIVAL_TIME
    },
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      measurementValue: {
        value: 'S',
        confidence: 50,
        referenceTime: 1636503404
      },
      snr: undefined,
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.PHASE
    },
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      measurementValue: {
        value: 'INDETERMINATE',
        confidence: undefined,
        referenceTime: 1636503404
      },
      snr: undefined,
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.SHORT_PERIOD_FIRST_MOTION
    },
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      analysisWaveform: {
        waveform: {
          id: pdarUiChannelSegmentDescriptor
        },
        filterDefinitionUsage: undefined,
        filterDefinition: undefined
      },
      measurementValue: {
        referenceTime: undefined,
        measuredValue: {
          value: 90.142121,
          standardDeviation: 2.2089042,
          units: CommonTypes.Units.DEGREES
        }
      },
      snr: undefined,
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH
    },
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      measurementValue: {
        referenceTime: undefined,
        measuredValue: {
          value: -1,
          standardDeviation: undefined,
          units: CommonTypes.Units.DEGREES
        }
      },
      snr: undefined,
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.EMERGENCE_ANGLE
    },
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      measurementValue: {
        referenceTime: undefined,
        measuredValue: {
          value: 7.1219535,
          standardDeviation: 0.27,
          units: CommonTypes.Units.SECONDS_PER_DEGREE
        }
      },
      snr: undefined,
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.SLOWNESS
    },
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      measurementValue: {
        referenceTime: undefined,
        measuredValue: {
          value: -1,
          standardDeviation: undefined,
          units: CommonTypes.Units.UNITLESS
        }
      },
      snr: undefined,
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.RECTILINEARITY
    },
    {
      channel: {
        name: pdarUiChannelSegmentDescriptor.channel.name,
        effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
      },
      measuredChannelSegment: {
        id: pdarUiChannelSegmentDescriptor
      },
      measurementValue: {
        measurementTime: 1636503404,
        measurementWindowDuration: 6,
        clipped: false,
        measurementWindowStart: 1636503404,
        amplitude: 5.0,
        units: CommonTypes.Units.MAGNITUDE,
        period: 0.25
      },
      snr: {
        value: 8.9939442,
        standardDeviation: undefined,
        units: CommonTypes.Units.DECIBELS
      },
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.AMPLITUDE_ALR_OVER_2
    }
  ]
};

/** PDAR signal detection hypothesis with no waveform */
export const pdarNoWaveFormSignalDetectionHypothesis: SignalDetectionTypes.SignalDetectionHypothesis =
  {
    id: {
      id: 'da5496d7-d371-4032-9e26-f88ee2db3d5f',
      signalDetectionId: '2216ad55-69c2-406d-9759-6be53c9590a0'
    },
    parentSignalDetectionHypothesis: null,
    deleted: false,
    station: {
      name: 'PDAR',
      effectiveAt: 123
    },
    monitoringOrganization: 'GMS',
    featureMeasurements: [
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: undefined,

        analysisWaveform: undefined,
        measurementValue: {
          value: 'INDETERMINATE',
          confidence: undefined,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.LONG_PERIOD_FIRST_MOTION
      },
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: undefined,

        analysisWaveform: undefined,
        measurementValue: {
          arrivalTime: {
            value: 1636503404,
            standardDeviation: 1.162
          },
          travelTime: undefined
        },
        snr: {
          value: 8.9939442,
          standardDeviation: undefined,
          units: CommonTypes.Units.DECIBELS
        },
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.ARRIVAL_TIME
      },
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: undefined,

        analysisWaveform: undefined,
        measurementValue: {
          value: 'P',
          confidence: 50,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.PHASE
      },
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: undefined,

        analysisWaveform: undefined,
        measurementValue: {
          value: 'INDETERMINATE',
          confidence: undefined,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType:
          SignalDetectionTypes.FeatureMeasurementType.SHORT_PERIOD_FIRST_MOTION
      },
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: undefined,

        analysisWaveform: undefined,
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: 90.142121,
            standardDeviation: 2.2089042,
            units: CommonTypes.Units.DEGREES
          }
        },
        snr: undefined,
        featureMeasurementType:
          SignalDetectionTypes.FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH
      },
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: undefined,

        analysisWaveform: undefined,
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: -1,
            standardDeviation: undefined,
            units: CommonTypes.Units.DEGREES
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.EMERGENCE_ANGLE
      },
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: undefined,

        analysisWaveform: undefined,
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: 7.1219535,
            standardDeviation: 0.27,
            units: CommonTypes.Units.SECONDS_PER_DEGREE
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.SLOWNESS
      },
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: undefined,

        analysisWaveform: undefined,
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: -1,
            standardDeviation: undefined,
            units: CommonTypes.Units.UNITLESS
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.RECTILINEARITY
      },
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: undefined,

        analysisWaveform: undefined,
        measurementValue: {
          measurementTime: 1636503404,
          measurementWindowDuration: 6,
          clipped: false,
          measurementWindowStart: 1636503404,
          amplitude: 5.0,
          units: CommonTypes.Units.MAGNITUDE,
          period: 0.25
        },
        snr: {
          value: 8.9939442,
          standardDeviation: undefined,
          units: CommonTypes.Units.DECIBELS
        },
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.AMPLITUDE_A5_OVER_2
      }
    ]
  };

/** PDAR signal detection hypothesis that has been deleted */
export const pdarDeletedSignalDetectionHypothesis: SignalDetectionTypes.SignalDetectionHypothesis =
  {
    id: {
      id: '22f27f0d-c201-4b00-8538-a4620baf6f62',
      signalDetectionId: '64e0f8a5-4a41-48ff-9490-03281e64e7f3'
    },
    parentSignalDetectionHypothesis: null,
    deleted: true,
    station: {
      name: 'PDAR',
      effectiveAt: 123
    },
    monitoringOrganization: 'GMS',
    featureMeasurements: [
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: {
          id: pdarUiChannelSegmentDescriptor
        },
        measurementValue: {
          value: 'INDETERMINATE',
          confidence: undefined,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.LONG_PERIOD_FIRST_MOTION
      },
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: {
          id: pdarUiChannelSegmentDescriptor
        },
        analysisWaveform: {
          waveform: {
            id: pdarUiChannelSegmentDescriptor
          },
          filterDefinitionUsage: undefined,
          filterDefinition: undefined
        },
        measurementValue: {
          arrivalTime: {
            value: 1636503404,
            standardDeviation: 1.162
          },
          travelTime: undefined
        },
        snr: {
          value: 8.9939442,
          standardDeviation: undefined,
          units: CommonTypes.Units.DECIBELS
        },
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.ARRIVAL_TIME
      },
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: {
          id: pdarUiChannelSegmentDescriptor
        },
        measurementValue: {
          value: 'P',
          confidence: 50,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.PHASE
      },
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: {
          id: pdarUiChannelSegmentDescriptor
        },
        measurementValue: {
          value: 'INDETERMINATE',
          confidence: undefined,
          referenceTime: 1636503404
        },
        snr: undefined,
        featureMeasurementType:
          SignalDetectionTypes.FeatureMeasurementType.SHORT_PERIOD_FIRST_MOTION
      },
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: {
          id: pdarUiChannelSegmentDescriptor
        },
        analysisWaveform: {
          waveform: {
            id: pdarUiChannelSegmentDescriptor
          },
          filterDefinitionUsage: undefined,
          filterDefinition: undefined
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: 90.142121,
            standardDeviation: 2.2089042,
            units: CommonTypes.Units.DEGREES
          }
        },
        snr: undefined,
        featureMeasurementType:
          SignalDetectionTypes.FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH
      },
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: {
          id: pdarUiChannelSegmentDescriptor
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: -1,
            standardDeviation: undefined,
            units: CommonTypes.Units.DEGREES
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.EMERGENCE_ANGLE
      },
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: {
          id: pdarUiChannelSegmentDescriptor
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: 7.1219535,
            standardDeviation: 0.27,
            units: CommonTypes.Units.SECONDS_PER_DEGREE
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.SLOWNESS
      },
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: {
          id: pdarUiChannelSegmentDescriptor
        },
        measurementValue: {
          referenceTime: undefined,
          measuredValue: {
            value: -1,
            standardDeviation: undefined,
            units: CommonTypes.Units.UNITLESS
          }
        },
        snr: undefined,
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.RECTILINEARITY
      },
      {
        channel: {
          name: pdarUiChannelSegmentDescriptor.channel.name,
          effectiveAt: pdarUiChannelSegmentDescriptor.channel.effectiveAt
        },
        measuredChannelSegment: {
          id: pdarUiChannelSegmentDescriptor
        },
        measurementValue: {
          measurementTime: 1636503404,
          measurementWindowDuration: 6,
          clipped: false,
          measurementWindowStart: 1636503404,
          amplitude: 5.0,
          units: CommonTypes.Units.MAGNITUDE,
          period: 0.25
        },
        snr: {
          value: 8.9939442,
          standardDeviation: undefined,
          units: CommonTypes.Units.DECIBELS
        },
        featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.AMPLITUDE_A5_OVER_2
      }
    ]
  };

/** AKASG signal detection hypothesis on a temporary channel */
export const akasgTempSignalDetectionHypothesis: SignalDetectionTypes.SignalDetectionHypothesis = {
  id: {
    id: 'db4395a2-3cd1-4290-bd57-37a52ff8c6cf',
    signalDetectionId: '05225367-657c-4fd4-b09e-b47091f16f2b'
  },
  monitoringOrganization: 'GMS',
  deleted: false,
  station: {
    name: 'AKASG',
    effectiveAt: 1690318421.344
  },
  featureMeasurements: [
    {
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.ARRIVAL_TIME,
      measurementValue: {
        arrivalTime: {
          value: 1690934720.1581028,
          standardDeviation: 1
        }
      },
      channel: {
        name: 'AKASG.temp.---/c7f4439e0ba81a2509302fbcc65164e083d36c57f0d2d8f51649a0b99b76b34e',
        effectiveAt: 1690318421.344
      }
    },
    {
      featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.PHASE,
      measurementValue: {
        value: 'P',
        referenceTime: 1690934720.1581028
      },
      channel: {
        name: 'AKASG.temp.---/c7f4439e0ba81a2509302fbcc65164e083d36c57f0d2d8f51649a0b99b76b34e',
        effectiveAt: 1690318421.344
      }
    }
  ],
  parentSignalDetectionHypothesis: null
};

// !Signal Detections

/** TODO: This is an FK beam with the event replaced */
export const asarEventBeamSignalDetection: SignalDetectionTypes.SignalDetection = {
  id: '012de1b9-8ae3-3fd4-800d-58665c3152cc',
  monitoringOrganization: 'GMS',
  signalDetectionHypotheses: [asarEventBeamSignalDetectionHypothesis],
  station: {
    name: 'ASAR'
  }
};

// TODO: Can these be better named?
export const asarFkBeamSignalDetection1: SignalDetectionTypes.SignalDetection = {
  id: '012de1b9-8ae3-3fd4-800d-58665c3152cc',
  monitoringOrganization: 'GMS',
  signalDetectionHypotheses: [asarFkBeamSignalDetectionHypothesis1],
  station: {
    name: 'ASAR'
  }
};
export const asarFkBeamSignalDetection2: SignalDetectionTypes.SignalDetection = {
  id: '012de1b9-8ae3-3fd4-800d-58123c3152cc',
  monitoringOrganization: 'GMS',
  signalDetectionHypotheses: [asarFkBeamSignalDetectionHypothesis2],
  station: {
    name: 'ASAR'
  }
};
export const asarFkBeamSignalDetection3: SignalDetectionTypes.SignalDetection = {
  id: '012de1b9-8ae3-3fd4-800d-58165c3152cc',
  monitoringOrganization: 'GMS',
  signalDetectionHypotheses: [asarFkBeamSignalDetectionHypothesis3],
  station: {
    name: 'ASAR'
  }
};

export const pdarSignalDetection: SignalDetectionTypes.SignalDetection = {
  id: '012de1b9-8ae3-3fd4-800d-58665c3152dd',
  monitoringOrganization: 'GMS',
  signalDetectionHypotheses: [pdarSignalDetectionHypothesis],
  station: {
    name: 'PDAR'
  }
};
/** A pdar signal detection with an ALR/2 amplitude measurement type */
export const pdarALR2SignalDetection: SignalDetectionTypes.SignalDetection = {
  id: '3379d111-5928-4277-a929-a8c011135846',
  monitoringOrganization: 'GMS',
  signalDetectionHypotheses: [pdarALR2SignalDetectionHypothesis],
  station: {
    name: 'PDAR'
  }
};

/** PDAR signal detection with no waveform */
export const pdarNoWaveformSignalDetection: SignalDetectionTypes.SignalDetection = {
  id: '2216ad55-69c2-406d-9759-6be53c9590a0',
  monitoringOrganization: 'GMS',
  signalDetectionHypotheses: [pdarNoWaveFormSignalDetectionHypothesis],
  station: {
    name: 'PDAR'
  }
};

/** PDAR signal detection with only a deleted hypothesis */
export const pdarDeletedSignalDetection: SignalDetectionTypes.SignalDetection = {
  id: '64e0f8a5-4a41-48ff-9490-03281e64e7f3',
  monitoringOrganization: 'GMS',
  signalDetectionHypotheses: [pdarDeletedSignalDetectionHypothesis],
  station: {
    name: 'PDAR'
  }
};

/** AKASG signal detection on a temporary channel */
export const akasgTempSignalDetection: SignalDetectionTypes.SignalDetection = {
  id: '05225367-657c-4fd4-b09e-b47091f16f2b',
  monitoringOrganization: 'GMS',
  station: {
    name: 'AKASG'
  },
  signalDetectionHypotheses: [akasgTempSignalDetectionHypothesis],
  _uiHasUnsavedChanges: 1691016901.903
};

/** ULM signal detection on a raw BHZ channel */
export const ulmRawBHZSignalDetection: SignalDetectionTypes.SignalDetection = {
  id: '28c8b008-dadd-3ec9-902c-12888885cc99',
  station: {
    name: 'ULM'
  },
  signalDetectionHypotheses: [
    {
      id: {
        signalDetectionId: '28c8b008-dadd-3ec9-902c-12888885cc99',
        id: '12a3cdd4-588f-3de4-b239-9d5f91d9adb9'
      },
      deleted: false,
      station: {
        effectiveAt: 1691070904.728,
        name: 'ULM'
      },
      monitoringOrganization: 'GMS',
      featureMeasurements: [
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType:
            SignalDetectionTypes.FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
          measurementValue: {
            measuredValue: {
              value: 301.48032,
              standardDeviation: 29.267124,
              units: CommonTypes.Units.DEGREES
            }
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType:
            SignalDetectionTypes.FeatureMeasurementType.LONG_PERIOD_FIRST_MOTION,
          measurementValue: {
            value: 'INDETERMINATE',
            referenceTime: 1691070904.728
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.PHASE,
          measurementValue: {
            value: 'P',
            referenceTime: 1691070904.728
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType:
            SignalDetectionTypes.FeatureMeasurementType.SHORT_PERIOD_FIRST_MOTION,
          measurementValue: {
            value: 'INDETERMINATE',
            referenceTime: 1691070904.728
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.AMPLITUDE_A5_OVER_2,
          measurementValue: {
            measurementTime: 1691070905.153,
            measurementWindowDuration: 6,
            clipped: false,
            measurementWindowStart: 1691070904.228,
            amplitude: 1.7716597,
            units: CommonTypes.Units.UNITLESS,
            period: 0.89955441
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            },
            filterDefinitionUsage: FilterDefinitionUsage.FK
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.ARRIVAL_TIME,
          measurementValue: {
            arrivalTime: {
              value: 1691070904.728,
              standardDeviation: 1.72
            }
          },
          snr: {
            value: 3.612304,
            units: CommonTypes.Units.DECIBELS
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.RECTILINEARITY,
          measurementValue: {
            measuredValue: {
              value: 0.91412965,
              units: CommonTypes.Units.UNITLESS
            }
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.EMERGENCE_ANGLE,
          measurementValue: {
            measuredValue: {
              value: 16.242087,
              units: CommonTypes.Units.DEGREES
            }
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.SLOWNESS,
          measurementValue: {
            measuredValue: {
              value: 4.560016,
              standardDeviation: 2.3,
              units: CommonTypes.Units.SECONDS_PER_DEGREE
            }
          }
        }
      ]
    },
    {
      id: {
        signalDetectionId: '28c8b008-dadd-3ec9-902c-12888885cc99',
        id: 'a704f2b1-da77-33fd-8758-1157cfe9d180'
      },
      parentSignalDetectionHypothesis: {
        id: {
          signalDetectionId: '28c8b008-dadd-3ec9-902c-12888885cc99',
          id: '12a3cdd4-588f-3de4-b239-9d5f91d9adb9'
        }
      },
      deleted: false,
      station: {
        effectiveAt: 1691070904.728,
        name: 'ULM'
      },
      monitoringOrganization: 'GMS',
      featureMeasurements: [
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType:
            SignalDetectionTypes.FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
          measurementValue: {
            measuredValue: {
              value: 301.48032,
              standardDeviation: 29.267124,
              units: CommonTypes.Units.DEGREES
            }
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType:
            SignalDetectionTypes.FeatureMeasurementType.LONG_PERIOD_FIRST_MOTION,
          measurementValue: {
            value: 'INDETERMINATE',
            referenceTime: 1691070904.728
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType:
            SignalDetectionTypes.FeatureMeasurementType.SHORT_PERIOD_FIRST_MOTION,
          measurementValue: {
            value: 'INDETERMINATE',
            referenceTime: 1691070904.728
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.PHASE,
          measurementValue: {
            value: 'Pn'
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.AMPLITUDE_A5_OVER_2,
          measurementValue: {
            measurementTime: 1691070905.153,
            measurementWindowDuration: 6,
            clipped: false,
            measurementWindowStart: 1691070904.228,
            amplitude: 1.7716597,
            units: CommonTypes.Units.UNITLESS,
            period: 0.89955441
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            },
            filterDefinitionUsage: FilterDefinitionUsage.FK
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.ARRIVAL_TIME,
          measurementValue: {
            arrivalTime: {
              value: 1691070904.728,
              standardDeviation: 1.72
            }
          },
          snr: {
            value: 3.612304,
            units: CommonTypes.Units.DECIBELS
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.RECTILINEARITY,
          measurementValue: {
            measuredValue: {
              value: 0.91412965,
              units: CommonTypes.Units.UNITLESS
            }
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.EMERGENCE_ANGLE,
          measurementValue: {
            measuredValue: {
              value: 16.242087,
              units: CommonTypes.Units.DEGREES
            }
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHZ'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHZ'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.SLOWNESS,
          measurementValue: {
            measuredValue: {
              value: 4.560016,
              standardDeviation: 2.3,
              units: CommonTypes.Units.SECONDS_PER_DEGREE
            }
          }
        }
      ]
    }
  ],
  monitoringOrganization: 'GMS'
};

/** ULM signal detection on a raw BHN channel */
export const ulmRawBHNSignalDetection: SignalDetectionTypes.SignalDetection = {
  id: '28c8b008-dadd-3ec9-902c-12888885cc99',
  station: {
    name: 'ULM'
  },
  signalDetectionHypotheses: [
    {
      id: {
        signalDetectionId: '28c8b008-dadd-3ec9-902c-12888885cc99',
        id: '12a3cdd4-588f-3de4-b239-9d5f91d9adb9'
      },
      deleted: false,
      station: {
        effectiveAt: 1691070904.728,
        name: 'ULM'
      },
      monitoringOrganization: 'GMS',
      featureMeasurements: [
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType:
            SignalDetectionTypes.FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
          measurementValue: {
            measuredValue: {
              value: 301.48032,
              standardDeviation: 29.267124,
              units: CommonTypes.Units.DEGREES
            }
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType:
            SignalDetectionTypes.FeatureMeasurementType.LONG_PERIOD_FIRST_MOTION,
          measurementValue: {
            value: 'INDETERMINATE',
            referenceTime: 1691070904.728
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.PHASE,
          measurementValue: {
            value: 'P',
            referenceTime: 1691070904.728
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType:
            SignalDetectionTypes.FeatureMeasurementType.SHORT_PERIOD_FIRST_MOTION,
          measurementValue: {
            value: 'INDETERMINATE',
            referenceTime: 1691070904.728
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.AMPLITUDE_A5_OVER_2,
          measurementValue: {
            measurementTime: 1691070905.153,
            measurementWindowDuration: 6,
            clipped: false,
            measurementWindowStart: 1691070904.228,
            amplitude: 1.7716597,
            units: CommonTypes.Units.UNITLESS,
            period: 0.89955441
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            },
            filterDefinitionUsage: FilterDefinitionUsage.FK
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.ARRIVAL_TIME,
          measurementValue: {
            arrivalTime: {
              value: 1691070904.728,
              standardDeviation: 1.72
            }
          },
          snr: {
            value: 3.612304,
            units: CommonTypes.Units.DECIBELS
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.RECTILINEARITY,
          measurementValue: {
            measuredValue: {
              value: 0.91412965,
              units: CommonTypes.Units.UNITLESS
            }
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.EMERGENCE_ANGLE,
          measurementValue: {
            measuredValue: {
              value: 16.242087,
              units: CommonTypes.Units.DEGREES
            }
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.SLOWNESS,
          measurementValue: {
            measuredValue: {
              value: 4.560016,
              standardDeviation: 2.3,
              units: CommonTypes.Units.SECONDS_PER_DEGREE
            }
          }
        }
      ]
    },
    {
      id: {
        signalDetectionId: '28c8b008-dadd-3ec9-902c-12888885cc99',
        id: 'a704f2b1-da77-33fd-8758-1157cfe9d180'
      },
      parentSignalDetectionHypothesis: {
        id: {
          signalDetectionId: '28c8b008-dadd-3ec9-902c-12888885cc99',
          id: '12a3cdd4-588f-3de4-b239-9d5f91d9adb9'
        }
      },
      deleted: false,
      station: {
        effectiveAt: 1691070904.728,
        name: 'ULM'
      },
      monitoringOrganization: 'GMS',
      featureMeasurements: [
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType:
            SignalDetectionTypes.FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH,
          measurementValue: {
            measuredValue: {
              value: 301.48032,
              standardDeviation: 29.267124,
              units: CommonTypes.Units.DEGREES
            }
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType:
            SignalDetectionTypes.FeatureMeasurementType.LONG_PERIOD_FIRST_MOTION,
          measurementValue: {
            value: 'INDETERMINATE',
            referenceTime: 1691070904.728
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType:
            SignalDetectionTypes.FeatureMeasurementType.SHORT_PERIOD_FIRST_MOTION,
          measurementValue: {
            value: 'INDETERMINATE',
            referenceTime: 1691070904.728
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.PHASE,
          measurementValue: {
            value: 'Pn'
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.AMPLITUDE_A5_OVER_2,
          measurementValue: {
            measurementTime: 1691070905.153,
            measurementWindowDuration: 6,
            clipped: false,
            measurementWindowStart: 1691070904.228,
            amplitude: 1.7716597,
            units: CommonTypes.Units.UNITLESS,
            period: 0.89955441
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            },
            filterDefinitionUsage: FilterDefinitionUsage.FK
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.ARRIVAL_TIME,
          measurementValue: {
            arrivalTime: {
              value: 1691070904.728,
              standardDeviation: 1.72
            }
          },
          snr: {
            value: 3.612304,
            units: CommonTypes.Units.DECIBELS
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.RECTILINEARITY,
          measurementValue: {
            measuredValue: {
              value: 0.91412965,
              units: CommonTypes.Units.UNITLESS
            }
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.EMERGENCE_ANGLE,
          measurementValue: {
            measuredValue: {
              value: 16.242087,
              units: CommonTypes.Units.DEGREES
            }
          }
        },
        {
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  effectiveAt: 1690318421.344,
                  name: 'ULM.ULM.BHN'
                },
                startTime: 1691070844.728,
                endTime: 1691071144.703,
                creationTime: 1691070844.728
              }
            }
          },
          channel: {
            effectiveAt: 1690318421.344,
            name: 'ULM.ULM.BHN'
          },
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.SLOWNESS,
          measurementValue: {
            measuredValue: {
              value: 4.560016,
              standardDeviation: 2.3,
              units: CommonTypes.Units.SECONDS_PER_DEGREE
            }
          }
        }
      ]
    }
  ],
  monitoringOrganization: 'GMS'
};

/** ASAR signal detection on AS01.SHZ channel */
export const asarAs01SHZSignalDetection: SignalDetectionTypes.SignalDetection = {
  id: '7fad9f1a-b73c-466d-a5d9-10ad3a6e4fb9',
  monitoringOrganization: 'GMS',
  station: {
    name: 'ASAR'
  },
  signalDetectionHypotheses: [
    {
      id: {
        id: '428b672f-e6eb-4728-9ddc-c13146c0da12',
        signalDetectionId: '7fad9f1a-b73c-466d-a5d9-10ad3a6e4fb9'
      },
      monitoringOrganization: 'GMS',
      deleted: false,
      station: {
        name: 'ASAR',
        effectiveAt: 1690315200
      },
      featureMeasurements: [
        {
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.ARRIVAL_TIME,
          measurementValue: {
            arrivalTime: {
              value: 1691073508.575804,
              standardDeviation: 1
            }
          },
          channel: {
            name: 'ASAR.AS01.SHZ',
            effectiveAt: 1690336800
          },
          measuredChannelSegment: {
            id: {
              channel: {
                effectiveAt: 1690336800,
                name: 'ASAR.AS01.SHZ'
              },
              startTime: 1691070300,
              endTime: 1691075700,
              creationTime: 1691070300
            }
          },
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  name: 'ASAR.AS01.SHZ',
                  effectiveAt: 1690336800
                },
                startTime: 1691070300,
                endTime: 1691075700,
                creationTime: 1691070300
              }
            }
          }
        },
        {
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.PHASE,
          measurementValue: {
            value: 'P',
            referenceTime: 1691073508.575804
          },
          channel: {
            name: 'ASAR.AS01.SHZ',
            effectiveAt: 1690336800
          },
          measuredChannelSegment: {
            id: {
              channel: {
                effectiveAt: 1690336800,
                name: 'ASAR.AS01.SHZ'
              },
              startTime: 1691070300,
              endTime: 1691075700,
              creationTime: 1691070300
            }
          },
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  name: 'ASAR.AS01.SHZ',
                  effectiveAt: 1690336800
                },
                startTime: 1691070300,
                endTime: 1691075700,
                creationTime: 1691070300
              }
            }
          }
        }
      ],
      parentSignalDetectionHypothesis: null
    }
  ]
};
/** ASAR signal detection on AS02.SHZ channel */
export const asarAs02SHZSignalDetection: SignalDetectionTypes.SignalDetection = {
  id: '4b9e5358-22e5-4a59-bb6d-48f4b12979da',
  monitoringOrganization: 'GMS',
  station: {
    name: 'ASAR'
  },
  signalDetectionHypotheses: [
    {
      id: {
        id: 'c77e310b-ddbf-421b-9ec6-4c4efd384673',
        signalDetectionId: '4b9e5358-22e5-4a59-bb6d-48f4b12979da'
      },
      monitoringOrganization: 'GMS',
      deleted: false,
      station: {
        name: 'ASAR',
        effectiveAt: 1690315200
      },
      featureMeasurements: [
        {
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.ARRIVAL_TIME,
          measurementValue: {
            arrivalTime: {
              value: 1691073583.0015314,
              standardDeviation: 1
            }
          },
          channel: {
            name: 'ASAR.AS02.SHZ',
            effectiveAt: 1690336800
          },
          measuredChannelSegment: {
            id: {
              channel: {
                effectiveAt: 1690336800,
                name: 'ASAR.AS02.SHZ'
              },
              startTime: 1691070300,
              endTime: 1691075700,
              creationTime: 1691070300
            }
          },
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  name: 'ASAR.AS02.SHZ',
                  effectiveAt: 1690336800
                },
                startTime: 1691070300,
                endTime: 1691075700,
                creationTime: 1691070300
              }
            }
          }
        },
        {
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.PHASE,
          measurementValue: {
            value: 'P',
            referenceTime: 1691073583.0015314
          },
          channel: {
            name: 'ASAR.AS02.SHZ',
            effectiveAt: 1690336800
          },
          measuredChannelSegment: {
            id: {
              channel: {
                effectiveAt: 1690336800,
                name: 'ASAR.AS02.SHZ'
              },
              startTime: 1691070300,
              endTime: 1691075700,
              creationTime: 1691070300
            }
          },
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  name: 'ASAR.AS02.SHZ',
                  effectiveAt: 1690336800
                },
                startTime: 1691070300,
                endTime: 1691075700,
                creationTime: 1691070300
              }
            }
          }
        }
      ],
      parentSignalDetectionHypothesis: null
    }
  ],
  _uiHasUnsavedChanges: 1691081398.148
};

/** ASAR signal detection on AS31.BHZ channel */
export const asarAs31BHZSignalDetection: SignalDetectionTypes.SignalDetection = {
  id: 'f0352c75-b25a-4716-9f9e-78529a433b23',
  monitoringOrganization: 'GMS',
  station: {
    name: 'ASAR'
  },
  signalDetectionHypotheses: [
    {
      id: {
        id: '9176c87c-2a2e-49de-a83c-0cc6b74a78ba',
        signalDetectionId: 'f0352c75-b25a-4716-9f9e-78529a433b23'
      },
      monitoringOrganization: 'GMS',
      deleted: false,
      station: {
        name: 'ASAR',
        effectiveAt: 1690315200
      },
      featureMeasurements: [
        {
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.ARRIVAL_TIME,
          measurementValue: {
            arrivalTime: {
              value: 1691073649.1577334,
              standardDeviation: 1
            }
          },
          channel: {
            name: 'ASAR.AS31.BHZ',
            effectiveAt: 1690318421.344
          },
          measuredChannelSegment: {
            id: {
              channel: {
                effectiveAt: 1690318421.344,
                name: 'ASAR.AS31.BHZ'
              },
              startTime: 1691070300,
              endTime: 1691075700,
              creationTime: 1691070300
            }
          },
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  name: 'ASAR.AS31.BHZ',
                  effectiveAt: 1690318421.344
                },
                startTime: 1691070300,
                endTime: 1691075700,
                creationTime: 1691070300
              }
            }
          }
        },
        {
          featureMeasurementType: SignalDetectionTypes.FeatureMeasurementType.PHASE,
          measurementValue: {
            value: 'P',
            referenceTime: 1691073649.1577334
          },
          channel: {
            name: 'ASAR.AS31.BHZ',
            effectiveAt: 1690318421.344
          },
          measuredChannelSegment: {
            id: {
              channel: {
                effectiveAt: 1690318421.344,
                name: 'ASAR.AS31.BHZ'
              },
              startTime: 1691070300,
              endTime: 1691075700,
              creationTime: 1691070300
            }
          },
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  name: 'ASAR.AS31.BHZ',
                  effectiveAt: 1690318421.344
                },
                startTime: 1691070300,
                endTime: 1691075700,
                creationTime: 1691070300
              }
            }
          }
        }
      ],
      parentSignalDetectionHypothesis: null
    }
  ],
  _uiHasUnsavedChanges: 1691081513.058
};

// !Signal Detection collections

/** Array of asar fk beam detections */
export const signalDetectionAsarFkBeams: SignalDetectionTypes.SignalDetection[] = [
  asarFkBeamSignalDetection1,
  asarFkBeamSignalDetection2,
  asarFkBeamSignalDetection3
];

/** Record of all signal detection test data */
export const signalDetectionsRecordAll = {
  [akasgTempSignalDetection.id]: akasgTempSignalDetection,
  [asarAs01SHZSignalDetection.id]: asarAs01SHZSignalDetection,
  [asarAs02SHZSignalDetection.id]: asarAs02SHZSignalDetection,
  [asarAs31BHZSignalDetection.id]: asarAs31BHZSignalDetection,
  [asarFkBeamSignalDetection1.id]: asarFkBeamSignalDetection1,
  [asarFkBeamSignalDetection2.id]: asarFkBeamSignalDetection2,
  [asarFkBeamSignalDetection3.id]: asarFkBeamSignalDetection3,
  [asarEventBeamSignalDetection.id]: asarEventBeamSignalDetection,
  [pdarSignalDetection.id]: pdarSignalDetection,
  [pdarALR2SignalDetection.id]: pdarSignalDetection,
  [pdarDeletedSignalDetection.id]: pdarDeletedSignalDetection,
  [ulmRawBHNSignalDetection.id]: ulmRawBHNSignalDetection,
  [ulmRawBHZSignalDetection.id]: ulmRawBHZSignalDetection
};

// TODO: Probably should use all sd record but keeping this to keep tests from breaking
/** Signal detections record containing asar and pdar detections */
export const signalDetectionsRecord = {
  [asarAs01SHZSignalDetection.id]: asarAs01SHZSignalDetection,
  [asarAs02SHZSignalDetection.id]: asarAs02SHZSignalDetection,
  [asarAs31BHZSignalDetection.id]: asarAs31BHZSignalDetection,
  [pdarSignalDetection.id]: pdarSignalDetection,
  [asarEventBeamSignalDetection.id]: asarEventBeamSignalDetection
};

/** Array of ASAR fk beam signal detections and a single pdar signal detection */
export const signalDetectionsData: SignalDetectionTypes.SignalDetection[] = [
  ...signalDetectionAsarFkBeams,
  pdarSignalDetection
];
