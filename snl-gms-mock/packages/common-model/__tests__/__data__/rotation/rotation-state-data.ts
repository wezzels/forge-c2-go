/* eslint-disable @typescript-eslint/no-magic-numbers */

/**
 * Channels
 */
export const KURK_UNFILTERED_CHANNEL_BHR = {
  channelBandType: 'BROADBAND',
  canonicalName:
    'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
  channelOrientationCode: 'R',
  configuredInputs: [
    {
      name: 'KURK.KURBB.BH2',
      effectiveAt: 1713816000
    },
    {
      name: 'KURK.KURBB.BH1',
      effectiveAt: 1713795384.824
    }
  ],
  channelDataType: 'SEISMIC',
  description: 'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086.',
  effectiveAt: 1713816000,
  effectiveForRequestTime: null,
  effectiveUntil: null,
  channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
  location: {
    latitudeDegrees: 50.62264,
    longitudeDegrees: 78.53039,
    depthKm: 0.042,
    elevationKm: 0.2004
  },
  name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
  nominalSampleRateHz: 40,
  orientationAngles: {
    horizontalAngleDeg: 441.08642783670933,
    verticalAngleDeg: 90
  },
  channelOrientationType: 'RADIAL',
  processingDefinition: {
    phaseType: 'S',
    samplingType: 'Nearest sample',
    twoDimensional: true,
    location: {
      latitudeDegrees: 50.62264,
      longitudeDegrees: 78.53039,
      depthKm: 0.042,
      elevationKm: 0.2004
    },
    locationToleranceKm: 0.12,
    orientationAngles: {
      horizontalAngleDeg: 441.08642783670933,
      verticalAngleDeg: 90
    },
    orientationAngleToleranceDeg: 0.12,
    receiverToSourceAzimuthDeg: 261.08642783670933,
    sampleRateHz: 40,
    sampleRateToleranceHz: 0.12
  },
  processingMetadata: {
    CHANNEL_GROUP: 'KURBB',
    STEERING_BACK_AZIMUTH: 261.08642783670933
  },
  station: {
    name: 'KURK'
  },
  units: 'NANOMETERS'
};

export const KURK_UNFILTERED_CHANNEL_BHT = {
  channelBandType: 'BROADBAND',
  canonicalName:
    'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
  channelOrientationCode: 'T',
  configuredInputs: [
    {
      name: 'KURK.KURBB.BH2',
      effectiveAt: 1713816000
    },
    {
      name: 'KURK.KURBB.BH1',
      effectiveAt: 1713795384.824
    }
  ],
  channelDataType: 'SEISMIC',
  description: 'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086.',
  effectiveAt: 1713816000,
  effectiveForRequestTime: null,
  effectiveUntil: null,
  channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
  location: {
    latitudeDegrees: 50.62264,
    longitudeDegrees: 78.53039,
    depthKm: 0.042,
    elevationKm: 0.2004
  },
  name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
  nominalSampleRateHz: 40,
  orientationAngles: {
    horizontalAngleDeg: 531.0864278367094,
    verticalAngleDeg: 90
  },
  channelOrientationType: 'TRANSVERSE',
  processingDefinition: {
    phaseType: 'S',
    samplingType: 'Nearest sample',
    twoDimensional: true,
    location: {
      latitudeDegrees: 50.62264,
      longitudeDegrees: 78.53039,
      depthKm: 0.042,
      elevationKm: 0.2004
    },
    locationToleranceKm: 0.12,
    orientationAngles: {
      horizontalAngleDeg: 531.0864278367094,
      verticalAngleDeg: 90
    },
    orientationAngleToleranceDeg: 0.12,
    receiverToSourceAzimuthDeg: 261.08642783670933,
    sampleRateHz: 40,
    sampleRateToleranceHz: 0.12
  },
  processingMetadata: {
    CHANNEL_GROUP: 'KURBB',
    STEERING_BACK_AZIMUTH: 261.08642783670933
  },
  station: {
    name: 'KURK'
  },
  units: 'NANOMETERS'
};

export const KURK_UNFILTERED_CHANNEL_BEAM = {
  canonicalName:
    'KURK.beam.BHZ/beam,event,coherent/steer,az_349.252deg,slow_1.915s_per_deg/49756ca70076e54f0b397b5b68b987f299ee30718f3081f6e90689027536a1d5',
  channelBandType: 'BROADBAND',
  channelDataType: 'SEISMIC',
  channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
  channelOrientationCode: 'Z',
  channelOrientationType: 'VERTICAL',
  configuredInputs: [
    {
      effectiveAt: 1713795384.824,
      name: 'KURK.KUR01.BHZ'
    }
  ],
  description:
    'broadband_vertical;EVENT beamed for event 28dd2c79-55ce-3264-9624-0b2ff0100bde, at location /Location{latitudeDegrees=50.62264, longitudeDegrees=78.53039, depthKm=0.0, elevationKm=0.2004}P,back azimuth 349.2516deg,slowness 1.91509sec/deg,COHERENT,true',
  location: {
    depthKm: 0.025,
    elevationKm: 0.1629,
    latitudeDegrees: 50.72161,
    longitudeDegrees: 78.56336
  },
  nominalSampleRateHz: 50,
  orientationAngles: {},
  processingDefinition: {
    beamDescription: {
      beamSummation: 'COHERENT',
      beamType: 'EVENT',
      phase: 'P',
      samplingType: 'NEAREST_SAMPLE',
      twoDimensional: true
    },
    beamParameters: {
      eventHypothesis: {
        id: {
          eventId: '28dd2c79-55ce-3264-9624-0b2ff0100bde',
          hypothesisId: 'd1f47912-f054-3526-9310-c5d4f200b2ec'
        }
      },
      location: {
        depthKm: 0,
        elevationKm: 0.2004,
        latitudeDegrees: 50.62264,
        longitudeDegrees: 78.53039
      },
      minWaveformsToBeam: 2,
      orientationAngleToleranceDeg: 5,
      orientationAngles: {},
      receiverToSourceAzimuthDeg: 349.2516,
      sampleRateHz: 50,
      sampleRateToleranceHz: 0.5,
      slownessSecPerDeg: 1.91509
    }
  },
  processingMetadata: {
    BRIDGED: '/bridged,EVID:77',
    CHANNEL_GROUP: 'beam',
    STEERING_BACK_AZIMUTH: 349.2516,
    STEERING_SLOWNESS: 1.91509,
    BEAM_SUMMATION: 'B',
    BEAM_TYPE: 'EVENT',
    BEAM_LOCATION: {
      depthKm: 0,
      elevationKm: 0.2004,
      latitudeDegrees: 50.62264,
      longitudeDegrees: 78.53039
    },
    BEAM_PHASE: 'P',
    BEAM_EVENT_HYPOTHESIS_ID: {
      eventId: '28dd2c79-55ce-3264-9624-0b2ff0100bde',
      hypothesisId: 'd1f47912-f054-3526-9310-c5d4f200b2ec'
    }
  },
  station: {
    effectiveAt: 1713794400,
    name: 'KURK'
  },
  units: 'NANOMETERS',
  effectiveAt: 1713816000,
  name: 'KURK.beam.BHZ/beam,event,coherent/steer,az_349.252deg,slow_1.915s_per_deg/49756ca70076e54f0b397b5b68b987f299ee30718f3081f6e90689027536a1d5'
};

export const KURK_FILTERED_CHANNEL_BEAM_DETECTION = {
  channelBandType: 'BROADBAND',
  canonicalName:
    'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.5 4.0 3 BP causal/929b9ff1814e740f6baffbf6c548b72bf412a65b94226072f2a2b8347f884886',
  channelOrientationCode: 'Z',
  configuredInputs: [
    {
      effectiveAt: 1713961472.35,
      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/8c83f7aba668b8ef6e652ebebe5b4ee8b753c0f7b2061a662afb3cd03521dc20'
    }
  ],
  channelDataType: 'SEISMIC',
  description: 'KURK/BHZ fk beam Filtered using a 0.5 4.0 3 BP causal filter.',
  effectiveAt: 1713961472.35,
  effectiveUntil: 1713961772.325,
  channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
  location: {
    depthKm: 0.03,
    elevationKm: 0.2004,
    latitudeDegrees: 50.62264,
    longitudeDegrees: 78.53039
  },
  name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.5 4.0 3 BP causal/929b9ff1814e740f6baffbf6c548b72bf412a65b94226072f2a2b8347f884886',
  nominalSampleRateHz: 40,
  orientationAngles: {
    horizontalAngleDeg: -1,
    verticalAngleDeg: 0
  },
  channelOrientationType: 'VERTICAL',
  processingDefinition: {
    comments: 'Butterworth IIR band-pass 0.5-4.0 Hz, order 3, causal',
    filterDescription: {
      causal: true,
      comments: '0.5 4.0 3 BP causal',
      filterType: 'LINEAR',
      highFrequencyHz: 4,
      linearFilterType: 'IIR_BUTTERWORTH',
      lowFrequencyHz: 0.5,
      order: 3,
      parameters: {
        groupDelaySec: 'P0D',
        sampleRateHz: 40,
        sampleRateToleranceHz: 0.01,
        sosDenominatorCoefficients: [
          1, -1.520697975242203, 0.560026908474077, 1, -1.929342750422624, 0.9358330515843435, 1,
          -1.3382070277433393, 0.6258908523061232
        ],
        sosNumeratorCoefficients: [
          0.21998654576296148, 0, -0.21998654576296148, 0.2760021441526437, 0, -0.2760021441526437,
          0.21165851497548066, 0, -0.21165851497548066
        ]
      },
      passBandType: 'BAND_PASS',
      zeroPhase: false
    },
    name: '0.5 4.0 3 BP causal'
  },
  processingMetadata: {
    BRIDGED: '/bridged,ARID:4402',
    CHANNEL_GROUP: 'beam',
    STEERING_BACK_AZIMUTH: 206.43622,
    STEERING_SLOWNESS: 10.85453,
    BEAM_SUMMATION: 'B',
    BEAM_TYPE: 'FK',
    FILTER_TYPE: 'LINEAR',
    FILTER_CAUSALITY: true
  },
  station: {
    name: 'KURK'
  },
  units: 'NANOMETERS'
};

export const KURK_FILTERED_CHANNEL_BHR_DETECTION = {
  channelBandType: 'BROADBAND',
  canonicalName:
    'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
  channelOrientationCode: 'R',
  configuredInputs: [
    {
      effectiveAt: 1713816000,
      name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3'
    }
  ],
  channelDataType: 'SEISMIC',
  description:
    'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086. Filtered using a 2.0 5.0 3 BP causal filter.',
  effectiveAt: 1713816000,
  effectiveForRequestTime: null,
  effectiveUntil: null,
  channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
  location: {
    latitudeDegrees: 50.62264,
    longitudeDegrees: 78.53039,
    depthKm: 0.042,
    elevationKm: 0.2004
  },
  name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
  nominalSampleRateHz: 40,
  orientationAngles: {
    horizontalAngleDeg: 441.08642783670933,
    verticalAngleDeg: 90
  },
  channelOrientationType: 'RADIAL',
  processingDefinition: {
    comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
    filterDescription: {
      causal: true,
      comments: '2.0 5.0 3 BP causal',
      filterType: 'LINEAR',
      highFrequencyHz: 5,
      linearFilterType: 'IIR_BUTTERWORTH',
      lowFrequencyHz: 2,
      order: 3,
      parameters: {
        groupDelaySec: 'P0D',
        sampleRateHz: 40.00018518518519,
        sampleRateToleranceHz: 0.01,
        sosDenominatorCoefficients: [
          1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044, 0.8623084548971981, 1,
          -1.2654002658879997, 0.7305963984206739
        ],
        sosNumeratorCoefficients: [
          0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0, -0.23179019381611632,
          0.19161476207701855, 0, -0.19161476207701855
        ]
      },
      passBandType: 'BAND_PASS',
      zeroPhase: false
    },
    name: '2.0 5.0 3 BP causal'
  },
  processingMetadata: {
    CHANNEL_GROUP: 'KURBB',
    STEERING_BACK_AZIMUTH: 261.08642783670933,
    FILTER_TYPE: 'LINEAR',
    FILTER_CAUSALITY: true
  },
  station: {
    name: 'KURK'
  },
  units: 'NANOMETERS'
};

export const KURK_FILTERED_CHANNEL_BHT_DETECTION = {
  channelBandType: 'BROADBAND',
  canonicalName:
    'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52',
  channelOrientationCode: 'T',
  configuredInputs: [
    {
      effectiveAt: 1713816000,
      name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3'
    }
  ],
  channelDataType: 'SEISMIC',
  description:
    'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086. Filtered using a 2.0 5.0 3 BP causal filter.',
  effectiveAt: 1713816000,
  effectiveForRequestTime: null,
  effectiveUntil: null,
  channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
  location: {
    latitudeDegrees: 50.62264,
    longitudeDegrees: 78.53039,
    depthKm: 0.042,
    elevationKm: 0.2004
  },
  name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52',
  nominalSampleRateHz: 40,
  orientationAngles: {
    horizontalAngleDeg: 531.0864278367094,
    verticalAngleDeg: 90
  },
  channelOrientationType: 'TRANSVERSE',
  processingDefinition: {
    comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
    filterDescription: {
      causal: true,
      comments: '2.0 5.0 3 BP causal',
      filterType: 'LINEAR',
      highFrequencyHz: 5,
      linearFilterType: 'IIR_BUTTERWORTH',
      lowFrequencyHz: 2,
      order: 3,
      parameters: {
        groupDelaySec: 'P0D',
        sampleRateHz: 40.00018518518519,
        sampleRateToleranceHz: 0.01,
        sosDenominatorCoefficients: [
          1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044, 0.8623084548971981, 1,
          -1.2654002658879997, 0.7305963984206739
        ],
        sosNumeratorCoefficients: [
          0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0, -0.23179019381611632,
          0.19161476207701855, 0, -0.19161476207701855
        ]
      },
      passBandType: 'BAND_PASS',
      zeroPhase: false
    },
    name: '2.0 5.0 3 BP causal'
  },
  processingMetadata: {
    CHANNEL_GROUP: 'KURBB',
    STEERING_BACK_AZIMUTH: 261.08642783670933,
    FILTER_TYPE: 'LINEAR',
    FILTER_CAUSALITY: true
  },
  station: {
    name: 'KURK'
  },
  units: 'NANOMETERS'
};

export const KURK_FILTERED_CHANNEL_BEAM_FK = {
  channelBandType: 'BROADBAND',
  canonicalName:
    'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.4 3.5 3 BP causal/2f2e0f2674a5a0f3d87f94f534eabed2b2c4fb0482078583c5571fa80709b6d4',
  channelOrientationCode: 'Z',
  configuredInputs: [
    {
      effectiveAt: 1713961472.35,
      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/8c83f7aba668b8ef6e652ebebe5b4ee8b753c0f7b2061a662afb3cd03521dc20'
    }
  ],
  channelDataType: 'SEISMIC',
  description: 'KURK/BHZ fk beam Filtered using a 0.4 3.5 3 BP causal filter.',
  effectiveAt: 1713961472.35,
  effectiveUntil: 1713961772.325,
  channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
  location: {
    depthKm: 0.03,
    elevationKm: 0.2004,
    latitudeDegrees: 50.62264,
    longitudeDegrees: 78.53039
  },
  name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.4 3.5 3 BP causal/2f2e0f2674a5a0f3d87f94f534eabed2b2c4fb0482078583c5571fa80709b6d4',
  nominalSampleRateHz: 40,
  orientationAngles: {
    horizontalAngleDeg: -1,
    verticalAngleDeg: 0
  },
  channelOrientationType: 'VERTICAL',
  processingDefinition: {
    comments: 'Butterworth IIR band-pass, 0.4-3.5 Hz, order 3, causal',
    filterDescription: {
      causal: true,
      comments: '0.4 3.5 3 BP causal',
      filterType: 'LINEAR',
      highFrequencyHz: 3.5,
      linearFilterType: 'IIR_BUTTERWORTH',
      lowFrequencyHz: 0.4,
      order: 3,
      parameters: {
        groupDelaySec: 'P0D',
        sampleRateHz: 40,
        sampleRateToleranceHz: 0.01,
        sosDenominatorCoefficients: [
          1, -1.5739001384972777, 0.6020489682157348, 1, -1.9433249580631988, 0.9474877640135565, 1,
          -1.4287659390987777, 0.655197522434191
        ],
        sosNumeratorCoefficients: [
          0.1989755158921326, 0, -0.1989755158921326, 0.24376224007447606, 0, -0.24376224007447606,
          0.19321254848006578, 0, -0.19321254848006578
        ]
      },
      passBandType: 'BAND_PASS',
      zeroPhase: false
    },
    name: '0.4 3.5 3 BP causal'
  },
  processingMetadata: {
    BRIDGED: '/bridged,ARID:4402',
    CHANNEL_GROUP: 'beam',
    STEERING_BACK_AZIMUTH: 206.43622,
    STEERING_SLOWNESS: 10.85453,
    BEAM_SUMMATION: 'B',
    BEAM_TYPE: 'FK',
    FILTER_TYPE: 'LINEAR',
    FILTER_CAUSALITY: true
  },
  station: {
    name: 'KURK'
  },
  units: 'NANOMETERS'
};
export const KURK_FILTERED_CHANNEL_BHR_FK = {
  channelBandType: 'BROADBAND',
  canonicalName:
    'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,0.4 3.5 3 BP causal/242cef71e2982493eb1a6dd379dc32c69080b584924fe3ae1dbe418c8f53ffc9',
  channelOrientationCode: 'R',
  configuredInputs: [
    {
      effectiveAt: 1713816000,
      name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3'
    }
  ],
  channelDataType: 'SEISMIC',
  description:
    'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086. Filtered using a 0.4 3.5 3 BP causal filter.',
  effectiveAt: 1713816000,
  effectiveForRequestTime: null,
  effectiveUntil: null,
  channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
  location: {
    latitudeDegrees: 50.62264,
    longitudeDegrees: 78.53039,
    depthKm: 0.042,
    elevationKm: 0.2004
  },
  name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,0.4 3.5 3 BP causal/242cef71e2982493eb1a6dd379dc32c69080b584924fe3ae1dbe418c8f53ffc9',
  nominalSampleRateHz: 40,
  orientationAngles: {
    horizontalAngleDeg: 441.08642783670933,
    verticalAngleDeg: 90
  },
  channelOrientationType: 'RADIAL',
  processingDefinition: {
    comments: 'Butterworth IIR band-pass, 0.4-3.5 Hz, order 3, causal',
    filterDescription: {
      causal: true,
      comments: '0.4 3.5 3 BP causal',
      filterType: 'LINEAR',
      highFrequencyHz: 3.5,
      linearFilterType: 'IIR_BUTTERWORTH',
      lowFrequencyHz: 0.4,
      order: 3,
      parameters: {
        groupDelaySec: 'P0D',
        sampleRateHz: 40,
        sampleRateToleranceHz: 0.01,
        sosDenominatorCoefficients: [
          1, -1.5739001384972777, 0.6020489682157348, 1, -1.9433249580631988, 0.9474877640135565, 1,
          -1.4287659390987777, 0.655197522434191
        ],
        sosNumeratorCoefficients: [
          0.1989755158921326, 0, -0.1989755158921326, 0.24376224007447606, 0, -0.24376224007447606,
          0.19321254848006578, 0, -0.19321254848006578
        ]
      },
      passBandType: 'BAND_PASS',
      zeroPhase: false
    },
    name: '0.4 3.5 3 BP causal'
  },
  processingMetadata: {
    CHANNEL_GROUP: 'KURBB',
    STEERING_BACK_AZIMUTH: 261.08642783670933,
    FILTER_TYPE: 'LINEAR',
    FILTER_CAUSALITY: true
  },
  station: {
    name: 'KURK'
  },
  units: 'NANOMETERS'
};
export const KURK_FILTERED_CHANNEL_BHT_FK = {
  channelBandType: 'BROADBAND',
  canonicalName:
    'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,0.4 3.5 3 BP causal/e37e2ce84eee87883ef8a51fbbb7312fcb66e3b38c326b15fcb2cc797df071c4',
  channelOrientationCode: 'T',
  configuredInputs: [
    {
      effectiveAt: 1713816000,
      name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3'
    }
  ],
  channelDataType: 'SEISMIC',
  description:
    'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086. Filtered using a 0.4 3.5 3 BP causal filter.',
  effectiveAt: 1713816000,
  effectiveForRequestTime: null,
  effectiveUntil: null,
  channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
  location: {
    latitudeDegrees: 50.62264,
    longitudeDegrees: 78.53039,
    depthKm: 0.042,
    elevationKm: 0.2004
  },
  name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,0.4 3.5 3 BP causal/e37e2ce84eee87883ef8a51fbbb7312fcb66e3b38c326b15fcb2cc797df071c4',
  nominalSampleRateHz: 40,
  orientationAngles: {
    horizontalAngleDeg: 531.0864278367094,
    verticalAngleDeg: 90
  },
  channelOrientationType: 'TRANSVERSE',
  processingDefinition: {
    comments: 'Butterworth IIR band-pass, 0.4-3.5 Hz, order 3, causal',
    filterDescription: {
      causal: true,
      comments: '0.4 3.5 3 BP causal',
      filterType: 'LINEAR',
      highFrequencyHz: 3.5,
      linearFilterType: 'IIR_BUTTERWORTH',
      lowFrequencyHz: 0.4,
      order: 3,
      parameters: {
        groupDelaySec: 'P0D',
        sampleRateHz: 40,
        sampleRateToleranceHz: 0.01,
        sosDenominatorCoefficients: [
          1, -1.5739001384972777, 0.6020489682157348, 1, -1.9433249580631988, 0.9474877640135565, 1,
          -1.4287659390987777, 0.655197522434191
        ],
        sosNumeratorCoefficients: [
          0.1989755158921326, 0, -0.1989755158921326, 0.24376224007447606, 0, -0.24376224007447606,
          0.19321254848006578, 0, -0.19321254848006578
        ]
      },
      passBandType: 'BAND_PASS',
      zeroPhase: false
    },
    name: '0.4 3.5 3 BP causal'
  },
  processingMetadata: {
    CHANNEL_GROUP: 'KURBB',
    STEERING_BACK_AZIMUTH: 261.08642783670933,
    FILTER_TYPE: 'LINEAR',
    FILTER_CAUSALITY: true
  },
  station: {
    name: 'KURK'
  },
  units: 'NANOMETERS'
};

/**
 * Channel Segments
 */
export const KURK_BEAM_UNFILTERED_CHANNEL_SEGMENT = {
  channelSegment: {
    maskedBy: [],
    missingInputChannels: [],
    timeseries: [
      {
        startTime: 1713961472.35,
        endTime: 1713961772.325,
        type: 'WAVEFORM',
        sampleCount: 12000,
        sampleRateHz: 40,
        _uiClaimCheckId:
          '{"domain":{"startTimeSecs":1713960000,"endTimeSecs":1713963600},"id":{"channel":{"effectiveAt":1713961472.35,"name":"KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/8c83f7aba668b8ef6e652ebebe5b4ee8b753c0f7b2061a662afb3cd03521dc20"},"creationTime":1713961472.35,"endTime":1713961772.325,"startTime":1713961472.35},"type":"WAVEFORM","filter":"Unfiltered","waveform":{"type":"WAVEFORM","startTime":1713961472.35,"endTime":1713961772.325,"sampleCount":12000,"sampleRateHz":40}}'
      }
    ],
    timeseriesType: 'WAVEFORM',
    units: 'NANOMETERS',
    id: {
      channel: {
        effectiveAt: 1713961472.35,
        name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/8c83f7aba668b8ef6e652ebebe5b4ee8b753c0f7b2061a662afb3cd03521dc20'
      },
      creationTime: 1713961472.35,
      endTime: 1713961772.325,
      startTime: 1713961472.35
    },
    _uiFilterDefinitionName: 'Unfiltered'
  },
  channelSegmentDescriptor: {
    channel: {
      effectiveAt: 1713961472.35,
      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/8c83f7aba668b8ef6e652ebebe5b4ee8b753c0f7b2061a662afb3cd03521dc20'
    },
    creationTime: 1713961472.35,
    endTime: 1713961772.325,
    startTime: 1713961472.35
  },
  domainTimeRange: {
    startTimeSecs: 1713960000,
    endTimeSecs: 1713963600
  },
  isFiltered: false,
  uiFilterName: 'Unfiltered',
  isRotated: false
};

export const KURK_BHR_UNFILTERED_CHANNEL_SEGMENT = {
  channelSegmentDescriptor: {
    channel: {
      name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
      effectiveAt: 1713816000
    },
    startTime: 1713959100,
    endTime: 1713964500,
    creationTime: 1713976176.347
  },
  channelSegment: {
    id: {
      channel: {
        name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
        effectiveAt: 1713816000
      },
      startTime: 1713959100,
      endTime: 1713964500,
      creationTime: 1713976176.347
    },
    units: 'NANOMETERS',
    timeseriesType: 'WAVEFORM',
    timeseries: [
      {
        startTime: 1713959100,
        endTime: 1713964500,
        type: 'WAVEFORM',
        sampleCount: 216001,
        sampleRateHz: 40.00018518518519,
        _uiClaimCheckId:
          '{"domain":{"startTimeSecs":1713959100,"endTimeSecs":1713964500},"id":{"channel":{"name":"KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713959100,"endTime":1713964500,"creationTime":1713976176.347},"type":"WAVEFORM","filter":"Unfiltered","waveform":{"type":"WAVEFORM","startTime":1713959100,"endTime":1713964500,"sampleCount":216001,"sampleRateHz":40.00018518518519}}'
      }
    ],
    maskedBy: [],
    missingInputChannels: [],
    _uiFilterDefinitionName: 'Unfiltered'
  },
  domainTimeRange: {
    startTimeSecs: 1713960000,
    endTimeSecs: 1713963600
  },
  isRotated: true,
  isFiltered: false,
  uiFilterName: 'Unfiltered'
};

export const KURK_BHT_UNFILTERED_CHANNEL_SEGMENT = {
  channelSegmentDescriptor: {
    channel: {
      name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
      effectiveAt: 1713816000
    },
    startTime: 1713959100,
    endTime: 1713964500,
    creationTime: 1713976176.347
  },
  channelSegment: {
    id: {
      channel: {
        name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
        effectiveAt: 1713816000
      },
      startTime: 1713959100,
      endTime: 1713964500,
      creationTime: 1713976176.347
    },
    units: 'NANOMETERS',
    timeseriesType: 'WAVEFORM',
    timeseries: [
      {
        startTime: 1713959100,
        endTime: 1713964500,
        type: 'WAVEFORM',
        sampleCount: 216001,
        sampleRateHz: 40.00018518518519,
        _uiClaimCheckId:
          '{"domain":{"startTimeSecs":1713959100,"endTimeSecs":1713964500},"id":{"channel":{"name":"KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713959100,"endTime":1713964500,"creationTime":1713976176.347},"type":"WAVEFORM","filter":"Unfiltered","waveform":{"type":"WAVEFORM","startTime":1713959100,"endTime":1713964500,"sampleCount":216001,"sampleRateHz":40.00018518518519}}'
      }
    ],
    maskedBy: [],
    missingInputChannels: [],
    _uiFilterDefinitionName: 'Unfiltered'
  },
  domainTimeRange: {
    startTimeSecs: 1713960000,
    endTimeSecs: 1713963600
  },
  isRotated: true,
  isFiltered: false,
  uiFilterName: 'Unfiltered'
};

export const KURK_BHR_FK_FILTERED_CHANNEL_SEGMENT = {
  channelSegment: {
    id: {
      channel: {
        name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
        effectiveAt: 1713816000
      },
      startTime: 1713959100,
      endTime: 1713964500,
      creationTime: 1713976176.347
    },
    units: 'NANOMETERS',
    timeseriesType: 'WAVEFORM',
    timeseries: [
      {
        startTime: 1713959100,
        endTime: 1713964500,
        type: 'WAVEFORM',
        sampleCount: 216001,
        sampleRateHz: 40.00018518518519,
        _uiClaimCheckId:
          '{"domain":{"startTimeSecs":1713959100,"endTimeSecs":1713964500},"id":{"channel":{"name":"KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713959100,"endTime":1713964500,"creationTime":1713976176.347},"type":"WAVEFORM","filter":"2.0 5.0 3 BP causal","waveform":{"type":"WAVEFORM","startTime":1713959100,"endTime":1713964500,"sampleCount":216001,"sampleRateHz":40.00018518518519}}'
      }
    ],
    maskedBy: [],
    missingInputChannels: [],
    _uiFilterDefinitionName: '2.0 5.0 3 BP causal',
    _uiConfiguredInput: {
      channel: {
        name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
        effectiveAt: 1713816000
      },
      startTime: 1713959100,
      endTime: 1713964500,
      creationTime: 1713976176.347
    },
    _uiFiltersBySampleRate: {
      '40.00018518518519': {
        name: '2.0 5.0 3 BP causal',
        comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
        filterDescription: {
          comments: '2.0 5.0 3 BP causal',
          causal: true,
          filterType: 'LINEAR',
          linearFilterType: 'IIR_BUTTERWORTH',
          lowFrequencyHz: 2,
          highFrequencyHz: 5,
          order: 3,
          zeroPhase: false,
          passBandType: 'BAND_PASS',
          parameters: {
            sampleRateHz: 40.00018518518519,
            sampleRateToleranceHz: 0.01,
            groupDelaySec: 0,
            sosDenominatorCoefficients: [
              1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044, 0.8623084548971981,
              1, -1.2654002658879997, 0.7305963984206739
            ],
            sosNumeratorCoefficients: [
              0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
              -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
            ]
          }
        }
      }
    },
    channelName:
      'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af'
  },
  channelSegmentDescriptor: {
    channel: {
      name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
      effectiveAt: 1713816000
    },
    startTime: 1713959100,
    endTime: 1713964500,
    creationTime: 1713976176.347
  },
  domainTimeRange: {
    startTimeSecs: 1713960000,
    endTimeSecs: 1713963600
  },
  isFiltered: true,
  uiFilterName: 'FK',
  isRotated: true
};

export const KURK_BHT_FK_FILTERED_CHANNEL_SEGMENT = {
  channelSegment: {
    id: {
      channel: {
        name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52',
        effectiveAt: 1713816000
      },
      startTime: 1713959100,
      endTime: 1713964500,
      creationTime: 1713976176.347
    },
    units: 'NANOMETERS',
    timeseriesType: 'WAVEFORM',
    timeseries: [
      {
        startTime: 1713959100,
        endTime: 1713964500,
        type: 'WAVEFORM',
        sampleCount: 216001,
        sampleRateHz: 40.00018518518519,
        _uiClaimCheckId:
          '{"domain":{"startTimeSecs":1713959100,"endTimeSecs":1713964500},"id":{"channel":{"name":"KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713959100,"endTime":1713964500,"creationTime":1713976176.347},"type":"WAVEFORM","filter":"2.0 5.0 3 BP causal","waveform":{"type":"WAVEFORM","startTime":1713959100,"endTime":1713964500,"sampleCount":216001,"sampleRateHz":40.00018518518519}}'
      }
    ],
    maskedBy: [],
    missingInputChannels: [],
    _uiFilterDefinitionName: '2.0 5.0 3 BP causal',
    _uiConfiguredInput: {
      channel: {
        name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
        effectiveAt: 1713816000
      },
      startTime: 1713959100,
      endTime: 1713964500,
      creationTime: 1713976176.347
    },
    _uiFiltersBySampleRate: {
      '40.00018518518519': {
        name: '2.0 5.0 3 BP causal',
        comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
        filterDescription: {
          comments: '2.0 5.0 3 BP causal',
          causal: true,
          filterType: 'LINEAR',
          linearFilterType: 'IIR_BUTTERWORTH',
          lowFrequencyHz: 2,
          highFrequencyHz: 5,
          order: 3,
          zeroPhase: false,
          passBandType: 'BAND_PASS',
          parameters: {
            sampleRateHz: 40.00018518518519,
            sampleRateToleranceHz: 0.01,
            groupDelaySec: 0,
            sosDenominatorCoefficients: [
              1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044, 0.8623084548971981,
              1, -1.2654002658879997, 0.7305963984206739
            ],
            sosNumeratorCoefficients: [
              0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
              -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
            ]
          }
        }
      }
    },
    channelName:
      'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52'
  },
  channelSegmentDescriptor: {
    channel: {
      name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52',
      effectiveAt: 1713816000
    },
    startTime: 1713959100,
    endTime: 1713964500,
    creationTime: 1713976176.347
  },
  domainTimeRange: {
    startTimeSecs: 1713960000,
    endTimeSecs: 1713963600
  },
  isFiltered: true,
  uiFilterName: 'FK',
  isRotated: true
};

export const KURK_BEAM_FK_FILTERED_CHANNEL_SEGMENT = {
  channelSegment: {
    maskedBy: [],
    missingInputChannels: [],
    timeseries: [
      {
        startTime: 1713961472.35,
        endTime: 1713961772.325,
        type: 'WAVEFORM',
        sampleCount: 12000,
        sampleRateHz: 40,
        _uiClaimCheckId:
          '{"domain":{"startTimeSecs":1713960000,"endTimeSecs":1713963600},"id":{"channel":{"effectiveAt":1713961472.35,"name":"KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/8c83f7aba668b8ef6e652ebebe5b4ee8b753c0f7b2061a662afb3cd03521dc20"},"creationTime":1713961472.35,"endTime":1713961772.325,"startTime":1713961472.35},"type":"WAVEFORM","filter":"0.4 3.5 3 BP causal","waveform":{"type":"WAVEFORM","startTime":1713961472.35,"endTime":1713961772.325,"sampleCount":12000,"sampleRateHz":40}}'
      }
    ],
    timeseriesType: 'WAVEFORM',
    units: 'NANOMETERS',
    id: {
      channel: {
        effectiveAt: 1713961472.35,
        name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.4 3.5 3 BP causal/2f2e0f2674a5a0f3d87f94f534eabed2b2c4fb0482078583c5571fa80709b6d4'
      },
      creationTime: 1713961472.35,
      endTime: 1713961772.325,
      startTime: 1713961472.35
    },
    _uiFilterDefinitionName: '0.4 3.5 3 BP causal',
    _uiConfiguredInput: {
      channel: {
        effectiveAt: 1713961472.35,
        name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/8c83f7aba668b8ef6e652ebebe5b4ee8b753c0f7b2061a662afb3cd03521dc20'
      },
      creationTime: 1713961472.35,
      endTime: 1713961772.325,
      startTime: 1713961472.35
    },
    _uiFiltersBySampleRate: {
      '40': {
        name: '0.4 3.5 3 BP causal',
        comments: 'Butterworth IIR band-pass, 0.4-3.5 Hz, order 3, causal',
        filterDescription: {
          comments: '0.4 3.5 3 BP causal',
          causal: true,
          filterType: 'LINEAR',
          linearFilterType: 'IIR_BUTTERWORTH',
          lowFrequencyHz: 0.4,
          highFrequencyHz: 3.5,
          order: 3,
          zeroPhase: false,
          passBandType: 'BAND_PASS',
          parameters: {
            sampleRateHz: 40,
            sampleRateToleranceHz: 0.01,
            groupDelaySec: 0,
            sosDenominatorCoefficients: [
              1, -1.5739001384972777, 0.6020489682157348, 1, -1.9433249580631988,
              0.9474877640135565, 1, -1.4287659390987777, 0.655197522434191
            ],
            sosNumeratorCoefficients: [
              0.1989755158921326, 0, -0.1989755158921326, 0.24376224007447606, 0,
              -0.24376224007447606, 0.19321254848006578, 0, -0.19321254848006578
            ]
          }
        }
      }
    },
    channelName:
      'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.4 3.5 3 BP causal/2f2e0f2674a5a0f3d87f94f534eabed2b2c4fb0482078583c5571fa80709b6d4'
  },
  channelSegmentDescriptor: {
    channel: {
      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.4 3.5 3 BP causal/2f2e0f2674a5a0f3d87f94f534eabed2b2c4fb0482078583c5571fa80709b6d4',
      effectiveAt: 1713961472.35
    },
    creationTime: 1713961472.35,
    endTime: 1713961772.325,
    startTime: 1713961472.35
  },
  domainTimeRange: {
    startTimeSecs: 1713960000,
    endTimeSecs: 1713963600
  },
  isFiltered: true,
  uiFilterName: 'FK',
  isRotated: false
};

export const KURK_BEAM_DETECTION_FILTERED_CHANNEL_SEGMENT = {
  channelSegment: {
    maskedBy: [],
    missingInputChannels: [],
    timeseries: [
      {
        startTime: 1713961472.35,
        endTime: 1713961772.325,
        type: 'WAVEFORM',
        sampleCount: 12000,
        sampleRateHz: 40,
        _uiClaimCheckId:
          '{"domain":{"startTimeSecs":1713960000,"endTimeSecs":1713963600},"id":{"channel":{"effectiveAt":1713961472.35,"name":"KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/8c83f7aba668b8ef6e652ebebe5b4ee8b753c0f7b2061a662afb3cd03521dc20"},"creationTime":1713961472.35,"endTime":1713961772.325,"startTime":1713961472.35},"type":"WAVEFORM","filter":"0.5 4.0 3 BP causal","waveform":{"type":"WAVEFORM","startTime":1713961472.35,"endTime":1713961772.325,"sampleCount":12000,"sampleRateHz":40}}'
      }
    ],
    timeseriesType: 'WAVEFORM',
    units: 'NANOMETERS',
    id: {
      channel: {
        effectiveAt: 1713961472.35,
        name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.5 4.0 3 BP causal/929b9ff1814e740f6baffbf6c548b72bf412a65b94226072f2a2b8347f884886'
      },
      creationTime: 1713961472.35,
      endTime: 1713961772.325,
      startTime: 1713961472.35
    },
    _uiFilterDefinitionName: '0.5 4.0 3 BP causal',
    _uiConfiguredInput: {
      channel: {
        effectiveAt: 1713961472.35,
        name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/8c83f7aba668b8ef6e652ebebe5b4ee8b753c0f7b2061a662afb3cd03521dc20'
      },
      creationTime: 1713961472.35,
      endTime: 1713961772.325,
      startTime: 1713961472.35
    },
    _uiFiltersBySampleRate: {
      '40': {
        name: '0.5 4.0 3 BP causal',
        comments: 'Butterworth IIR band-pass 0.5-4.0 Hz, order 3, causal',
        filterDescription: {
          comments: '0.5 4.0 3 BP causal',
          causal: true,
          filterType: 'LINEAR',
          linearFilterType: 'IIR_BUTTERWORTH',
          lowFrequencyHz: 0.5,
          highFrequencyHz: 4,
          order: 3,
          zeroPhase: false,
          passBandType: 'BAND_PASS',
          parameters: {
            sampleRateHz: 40,
            sampleRateToleranceHz: 0.01,
            groupDelaySec: 0,
            sosDenominatorCoefficients: [
              1, -1.520697975242203, 0.560026908474077, 1, -1.929342750422624, 0.9358330515843435,
              1, -1.3382070277433393, 0.6258908523061232
            ],
            sosNumeratorCoefficients: [
              0.21998654576296148, 0, -0.21998654576296148, 0.2760021441526437, 0,
              -0.2760021441526437, 0.21165851497548066, 0, -0.21165851497548066
            ]
          }
        }
      }
    },
    channelName:
      'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.5 4.0 3 BP causal/929b9ff1814e740f6baffbf6c548b72bf412a65b94226072f2a2b8347f884886'
  },
  channelSegmentDescriptor: {
    channel: {
      name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.5 4.0 3 BP causal/929b9ff1814e740f6baffbf6c548b72bf412a65b94226072f2a2b8347f884886',
      effectiveAt: 1713961472.35
    },
    creationTime: 1713961472.35,
    endTime: 1713961772.325,
    startTime: 1713961472.35
  },
  domainTimeRange: {
    startTimeSecs: 1713960000,
    endTimeSecs: 1713963600
  },
  isFiltered: true,
  uiFilterName: 'DETECTION',
  isRotated: false
};
export const KURK_BHR_DETECTION_FILTERED_CHANNEL_SEGMENT = {
  channelSegment: {
    id: {
      channel: {
        name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
        effectiveAt: 1713816000
      },
      startTime: 1713959100,
      endTime: 1713964500,
      creationTime: 1713976176.347
    },
    units: 'NANOMETERS',
    timeseriesType: 'WAVEFORM',
    timeseries: [
      {
        startTime: 1713959100,
        endTime: 1713964500,
        type: 'WAVEFORM',
        sampleCount: 216001,
        sampleRateHz: 40.00018518518519,
        _uiClaimCheckId:
          '{"domain":{"startTimeSecs":1713959100,"endTimeSecs":1713964500},"id":{"channel":{"name":"KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713959100,"endTime":1713964500,"creationTime":1713976176.347},"type":"WAVEFORM","filter":"2.0 5.0 3 BP causal","waveform":{"type":"WAVEFORM","startTime":1713959100,"endTime":1713964500,"sampleCount":216001,"sampleRateHz":40.00018518518519}}'
      }
    ],
    maskedBy: [],
    missingInputChannels: [],
    _uiFilterDefinitionName: '2.0 5.0 3 BP causal',
    _uiConfiguredInput: {
      channel: {
        name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
        effectiveAt: 1713816000
      },
      startTime: 1713959100,
      endTime: 1713964500,
      creationTime: 1713976176.347
    },
    _uiFiltersBySampleRate: {
      '40.00018518518519': {
        name: '2.0 5.0 3 BP causal',
        comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
        filterDescription: {
          comments: '2.0 5.0 3 BP causal',
          causal: true,
          filterType: 'LINEAR',
          linearFilterType: 'IIR_BUTTERWORTH',
          lowFrequencyHz: 2,
          highFrequencyHz: 5,
          order: 3,
          zeroPhase: false,
          passBandType: 'BAND_PASS',
          parameters: {
            sampleRateHz: 40.00018518518519,
            sampleRateToleranceHz: 0.01,
            groupDelaySec: 0,
            sosDenominatorCoefficients: [
              1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044, 0.8623084548971981,
              1, -1.2654002658879997, 0.7305963984206739
            ],
            sosNumeratorCoefficients: [
              0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
              -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
            ]
          }
        }
      }
    },
    channelName:
      'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af'
  },
  channelSegmentDescriptor: {
    channel: {
      name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
      effectiveAt: 1713816000
    },
    startTime: 1713959100,
    endTime: 1713964500,
    creationTime: 1713976176.347
  },
  domainTimeRange: {
    startTimeSecs: 1713960000,
    endTimeSecs: 1713963600
  },
  isFiltered: true,
  uiFilterName: 'DETECTION',
  isRotated: true
};
export const KURK_BHT_DETECTION_FILTERED_CHANNEL_SEGMENT = {
  channelSegment: {
    id: {
      channel: {
        name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52',
        effectiveAt: 1713816000
      },
      startTime: 1713959100,
      endTime: 1713964500,
      creationTime: 1713976176.347
    },
    units: 'NANOMETERS',
    timeseriesType: 'WAVEFORM',
    timeseries: [
      {
        startTime: 1713959100,
        endTime: 1713964500,
        type: 'WAVEFORM',
        sampleCount: 216001,
        sampleRateHz: 40.00018518518519,
        _uiClaimCheckId:
          '{"domain":{"startTimeSecs":1713959100,"endTimeSecs":1713964500},"id":{"channel":{"name":"KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713959100,"endTime":1713964500,"creationTime":1713976176.347},"type":"WAVEFORM","filter":"2.0 5.0 3 BP causal","waveform":{"type":"WAVEFORM","startTime":1713959100,"endTime":1713964500,"sampleCount":216001,"sampleRateHz":40.00018518518519}}'
      }
    ],
    maskedBy: [],
    missingInputChannels: [],
    _uiFilterDefinitionName: '2.0 5.0 3 BP causal',
    _uiConfiguredInput: {
      channel: {
        name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
        effectiveAt: 1713816000
      },
      startTime: 1713959100,
      endTime: 1713964500,
      creationTime: 1713976176.347
    },
    _uiFiltersBySampleRate: {
      '40.00018518518519': {
        name: '2.0 5.0 3 BP causal',
        comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
        filterDescription: {
          comments: '2.0 5.0 3 BP causal',
          causal: true,
          filterType: 'LINEAR',
          linearFilterType: 'IIR_BUTTERWORTH',
          lowFrequencyHz: 2,
          highFrequencyHz: 5,
          order: 3,
          zeroPhase: false,
          passBandType: 'BAND_PASS',
          parameters: {
            sampleRateHz: 40.00018518518519,
            sampleRateToleranceHz: 0.01,
            groupDelaySec: 0,
            sosDenominatorCoefficients: [
              1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044, 0.8623084548971981,
              1, -1.2654002658879997, 0.7305963984206739
            ],
            sosNumeratorCoefficients: [
              0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
              -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
            ]
          }
        }
      }
    },
    channelName:
      'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52'
  },
  channelSegmentDescriptor: {
    channel: {
      name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52',
      effectiveAt: 1713816000
    },
    startTime: 1713959100,
    endTime: 1713964500,
    creationTime: 1713976176.347
  },
  domainTimeRange: {
    startTimeSecs: 1713960000,
    endTimeSecs: 1713963600
  },
  isFiltered: true,
  uiFilterName: 'DETECTION',
  isRotated: true
};

export const EVENT_ASSOCIATED_TO_SDS = {
  eventHypotheses: [
    {
      id: {
        eventId: 'd09bf415-44a3-365a-86c9-077ebb5e35c3',
        hypothesisId: '452b342c-bb7e-391e-bfdd-bd4975a3fccb'
      },
      associatedSignalDetectionHypotheses: [
        {
          id: {
            id: 'e3f6420b-a1f7-3263-91cc-bcc892250a1a',
            signalDetectionId: 'ba2f0015-122a-3955-b8b3-a50240fb91b2'
          }
        },
        {
          id: {
            id: 'e8106c34-4dfa-314b-9c29-41dd70ae0cb0',
            signalDetectionId: '59b1deff-341e-3b0b-b6ac-e57820cef237'
          }
        },
        {
          id: {
            id: '62e45eb1-8854-3b84-92c5-eee8d2621b95',
            signalDetectionId: '6e01383f-d96a-37ae-91cc-3e15447e7533'
          }
        }
      ],
      deleted: false,
      locationSolutions: [],
      parentEventHypotheses: [],
      preferredLocationSolution: {
        id: '4cecb7a8-22e5-4aee-98d5-a89231abce38'
      },
      rejected: false
    },
    {
      id: {
        eventId: 'd09bf415-44a3-365a-86c9-077ebb5e35c3',
        hypothesisId: '405940df-5bff-450e-bd45-f9973e6d971d'
      },
      associatedSignalDetectionHypotheses: [
        {
          id: {
            id: 'e3f6420b-a1f7-3263-91cc-bcc892250a1a',
            signalDetectionId: 'ba2f0015-122a-3955-b8b3-a50240fb91b2'
          }
        },
        {
          id: {
            id: 'e8106c34-4dfa-314b-9c29-41dd70ae0cb0',
            signalDetectionId: '59b1deff-341e-3b0b-b6ac-e57820cef237'
          }
        },
        {
          id: {
            id: '62e45eb1-8854-3b84-92c5-eee8d2621b95',
            signalDetectionId: '6e01383f-d96a-37ae-91cc-3e15447e7533'
          }
        },
        {
          id: {
            id: '9f6f51ce-3632-4ae9-bc55-e45ad93f4203',
            signalDetectionId: 'e63c1d7e-5eba-4c54-ac71-1cc71e90d4dc'
          }
        },
        {
          id: {
            id: '9a0d9194-d986-4039-9539-3ce7fe0c6ce7',
            signalDetectionId: '378de4ae-452a-4b78-9afd-9f7df5954ddc'
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
                  effectiveAt: 1713960892.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/0cfabd1579aa29869613138f04c6f12aa24530c12cc226a1c3f3f14094ae31b0'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: 'SLOWNESS',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'SLOWNESS',
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 0.15,
                      units: 'SECONDS_PER_DEGREE',
                      value: 6.130177999999999
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'SECONDS_PER_DEGREE',
                        value: 6.130177999999999
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        units: 'SECONDS_PER_DEGREE',
                        value: 0
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0.05,
                  elevationKm: 0.4,
                  latitudeDegrees: 53.108215,
                  longitudeDegrees: 157.69885
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              {
                channel: {
                  effectiveAt: 1713960614.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2edc5af6f7dcebadae77290b3dddde9ccd399d562367ea2f51e415fc8abf55d2'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: 'SLOWNESS',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'SLOWNESS',
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 0.15,
                      units: 'SECONDS_PER_DEGREE',
                      value: 8.7249994
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        units: 'SECONDS_PER_DEGREE',
                        value: 0
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'SECONDS_PER_DEGREE',
                        value: 8.7249994
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
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              {
                channel: {
                  effectiveAt: 1713960255,
                  name: 'TXAR.beam.SHZ/beam,fk,coherent/steer,az_288.267deg,slow_16.045s_per_deg/e8b504cce8788018b4b2cca61b91a3c490d2fc8ebfb9b436be9369691c24211c'
                },
                extrapolated: false,
                phase: 'Pg',
                predictionType: 'SLOWNESS',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'SLOWNESS',
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 0.15,
                      units: 'SECONDS_PER_DEGREE',
                      value: 16.66607363
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'SECONDS_PER_DEGREE',
                        value: 16.66607363
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        units: 'SECONDS_PER_DEGREE',
                        value: 0
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0.0061,
                  elevationKm: 0.9914,
                  latitudeDegrees: 29.334257,
                  longitudeDegrees: -103.667684
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              {
                channel: {
                  effectiveAt: 1713960892.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/0cfabd1579aa29869613138f04c6f12aa24530c12cc226a1c3f3f14094ae31b0'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: 'ARRIVAL_TIME',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'ARRIVAL_TIME',
                  predictedValue: {
                    arrivalTime: {
                      value: 1713960952.04
                    },
                    travelTime: {
                      standardDeviation: 1.1,
                      value: 674.9562
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        value: 'PT0S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        value: 'PT11M15.0283S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BULK_STATIC_STATION_CORRECTION',
                      value: {
                        value: 'PT-0.41284S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                      value: {
                        value: 'PT0.053109S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'ELEVATION_CORRECTION',
                      value: {
                        value: 'PT0.28759S'
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0.05,
                  elevationKm: 0.4,
                  latitudeDegrees: 53.108215,
                  longitudeDegrees: 157.69885
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              {
                channel: {
                  effectiveAt: 1713960614.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2edc5af6f7dcebadae77290b3dddde9ccd399d562367ea2f51e415fc8abf55d2'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: 'ARRIVAL_TIME',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'ARRIVAL_TIME',
                  predictedValue: {
                    arrivalTime: {
                      value: 1713960674.04
                    },
                    travelTime: {
                      standardDeviation: 1.4,
                      value: 396.1781
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        value: 'PT0S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'ELEVATION_CORRECTION',
                      value: {
                        value: 'PT0.49459S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        value: 'PT6M36.4132S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BULK_STATIC_STATION_CORRECTION',
                      value: {
                        value: 'PT-0.72469S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                      value: {
                        value: 'PT-0.0050424S'
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
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              {
                channel: {
                  effectiveAt: 1713960255,
                  name: 'TXAR.beam.SHZ/beam,fk,coherent/steer,az_288.267deg,slow_16.045s_per_deg/e8b504cce8788018b4b2cca61b91a3c490d2fc8ebfb9b436be9369691c24211c'
                },
                extrapolated: false,
                phase: 'Pg',
                predictionType: 'ARRIVAL_TIME',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'ARRIVAL_TIME',
                  predictedValue: {
                    arrivalTime: {
                      value: 1713960314.04
                    },
                    travelTime: {
                      standardDeviation: 2.068,
                      value: 36.97
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        value: 'PT0S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                      value: {
                        value: 'PT0.0099661S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        value: 'PT35.4844S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'ELEVATION_CORRECTION',
                      value: {
                        value: 'PT0.10722S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BULK_STATIC_STATION_CORRECTION',
                      value: {
                        value: 'PT1.3684S'
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0.0061,
                  elevationKm: 0.9914,
                  latitudeDegrees: 29.334257,
                  longitudeDegrees: -103.667684
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              {
                channel: {
                  effectiveAt: 1713960892.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/0cfabd1579aa29869613138f04c6f12aa24530c12cc226a1c3f3f14094ae31b0'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: 'EMERGENCE_ANGLE',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'EMERGENCE_ANGLE',
                  predictedValue: {
                    measuredValue: {
                      units: 'DEGREES',
                      value: 998
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'DEGREES',
                        value: 998
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0.05,
                  elevationKm: 0.4,
                  latitudeDegrees: 53.108215,
                  longitudeDegrees: 157.69885
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              {
                channel: {
                  effectiveAt: 1713960614.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2edc5af6f7dcebadae77290b3dddde9ccd399d562367ea2f51e415fc8abf55d2'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: 'EMERGENCE_ANGLE',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'EMERGENCE_ANGLE',
                  predictedValue: {
                    measuredValue: {
                      units: 'DEGREES',
                      value: 998
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'DEGREES',
                        value: 998
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
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              {
                channel: {
                  effectiveAt: 1713960255,
                  name: 'TXAR.beam.SHZ/beam,fk,coherent/steer,az_288.267deg,slow_16.045s_per_deg/e8b504cce8788018b4b2cca61b91a3c490d2fc8ebfb9b436be9369691c24211c'
                },
                extrapolated: false,
                phase: 'Pg',
                predictionType: 'EMERGENCE_ANGLE',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'EMERGENCE_ANGLE',
                  predictedValue: {
                    measuredValue: {
                      units: 'DEGREES',
                      value: 998
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'DEGREES',
                        value: 998
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0.0061,
                  elevationKm: 0.9914,
                  latitudeDegrees: 29.334257,
                  longitudeDegrees: -103.667684
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              {
                channel: {
                  effectiveAt: 1713960892.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/0cfabd1579aa29869613138f04c6f12aa24530c12cc226a1c3f3f14094ae31b0'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 20,
                      units: 'DEGREES',
                      value: 66.247664
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'DEGREES',
                        value: 66.247664
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        units: 'DEGREES',
                        value: 0
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0.05,
                  elevationKm: 0.4,
                  latitudeDegrees: 53.108215,
                  longitudeDegrees: 157.69885
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              {
                channel: {
                  effectiveAt: 1713960614.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2edc5af6f7dcebadae77290b3dddde9ccd399d562367ea2f51e415fc8abf55d2'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 20,
                      units: 'DEGREES',
                      value: 165.80986
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'DEGREES',
                        value: 165.80986
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        units: 'DEGREES',
                        value: 0
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
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              {
                channel: {
                  effectiveAt: 1713960255,
                  name: 'TXAR.beam.SHZ/beam,fk,coherent/steer,az_288.267deg,slow_16.045s_per_deg/e8b504cce8788018b4b2cca61b91a3c490d2fc8ebfb9b436be9369691c24211c'
                },
                extrapolated: false,
                phase: 'Pg',
                predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 20,
                      units: 'DEGREES',
                      value: 291.56513
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'DEGREES',
                        value: 291.56513
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        units: 'DEGREES',
                        value: 0
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0.0061,
                  elevationKm: 0.9914,
                  latitudeDegrees: 29.334257,
                  longitudeDegrees: -103.667684
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              }
            ]
          },
          location: {
            depthKm: 0,
            latitudeDegrees: 30.035715,
            longitudeDegrees: -105.75554,
            time: 1713960278.04
          },
          locationBehaviors: [
            {
              defining: true,
              measurement: {
                channel: {
                  effectiveAt: 1713960892.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/0cfabd1579aa29869613138f04c6f12aa24530c12cc226a1c3f3f14094ae31b0'
                },
                featureMeasurementType: 'SLOWNESS',
                measurementValue: {
                  measuredValue: {
                    standardDeviation: 4.42,
                    units: 'SECONDS_PER_DEGREE',
                    value: 14.205898
                  }
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1713960892.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/0cfabd1579aa29869613138f04c6f12aa24530c12cc226a1c3f3f14094ae31b0'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: 'SLOWNESS',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'SLOWNESS',
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 0.15,
                      units: 'SECONDS_PER_DEGREE',
                      value: 6.130177999999999
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'SECONDS_PER_DEGREE',
                        value: 6.130177999999999
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        units: 'SECONDS_PER_DEGREE',
                        value: 0
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0.05,
                  elevationKm: 0.4,
                  latitudeDegrees: 53.108215,
                  longitudeDegrees: 157.69885
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              residual: 8.07572,
              weight: 1
            },
            {
              defining: true,
              measurement: {
                channel: {
                  effectiveAt: 1713960892.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/0cfabd1579aa29869613138f04c6f12aa24530c12cc226a1c3f3f14094ae31b0'
                },
                featureMeasurementType: 'ARRIVAL_TIME',
                measurementValue: {
                  arrivalTime: {
                    standardDeviation: 1.72,
                    value: 1713960952.375
                  }
                },
                snr: {
                  units: 'DECIBELS',
                  value: 3.6538372
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1713960892.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/0cfabd1579aa29869613138f04c6f12aa24530c12cc226a1c3f3f14094ae31b0'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: 'ARRIVAL_TIME',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'ARRIVAL_TIME',
                  predictedValue: {
                    arrivalTime: {
                      value: 1713960952.04
                    },
                    travelTime: {
                      standardDeviation: 1.1,
                      value: 674.9562
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        value: 'PT0S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        value: 'PT11M15.0283S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BULK_STATIC_STATION_CORRECTION',
                      value: {
                        value: 'PT-0.41284S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                      value: {
                        value: 'PT0.053109S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'ELEVATION_CORRECTION',
                      value: {
                        value: 'PT0.28759S'
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0.05,
                  elevationKm: 0.4,
                  latitudeDegrees: 53.108215,
                  longitudeDegrees: 157.69885
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              residual: -0.62202983,
              weight: 1
            },
            {
              defining: false,
              measurement: {
                channel: {
                  effectiveAt: 1713960892.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/0cfabd1579aa29869613138f04c6f12aa24530c12cc226a1c3f3f14094ae31b0'
                },
                featureMeasurementType: 'EMERGENCE_ANGLE',
                measurementValue: {
                  measuredValue: {
                    units: 'DEGREES',
                    value: -1
                  }
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1713960892.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/0cfabd1579aa29869613138f04c6f12aa24530c12cc226a1c3f3f14094ae31b0'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: 'EMERGENCE_ANGLE',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'EMERGENCE_ANGLE',
                  predictedValue: {
                    measuredValue: {
                      units: 'DEGREES',
                      value: 998
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'DEGREES',
                        value: 998
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0.05,
                  elevationKm: 0.4,
                  latitudeDegrees: 53.108215,
                  longitudeDegrees: 157.69885
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              residual: -999
            },
            {
              defining: true,
              measurement: {
                channel: {
                  effectiveAt: 1713960892.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/0cfabd1579aa29869613138f04c6f12aa24530c12cc226a1c3f3f14094ae31b0'
                },
                featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                measurementValue: {
                  measuredValue: {
                    standardDeviation: 17.902263,
                    units: 'DEGREES',
                    value: 108.24585
                  }
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1713960892.375,
                  name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/0cfabd1579aa29869613138f04c6f12aa24530c12cc226a1c3f3f14094ae31b0'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 20,
                      units: 'DEGREES',
                      value: 66.247664
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'DEGREES',
                        value: 66.247664
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        units: 'DEGREES',
                        value: 0
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0.05,
                  elevationKm: 0.4,
                  latitudeDegrees: 53.108215,
                  longitudeDegrees: 157.69885
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              residual: 41.998186,
              weight: 1
            },
            {
              defining: true,
              measurement: {
                channel: {
                  effectiveAt: 1713960614.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2edc5af6f7dcebadae77290b3dddde9ccd399d562367ea2f51e415fc8abf55d2'
                },
                featureMeasurementType: 'SLOWNESS',
                measurementValue: {
                  measuredValue: {
                    standardDeviation: 0.72,
                    units: 'SECONDS_PER_DEGREE',
                    value: 5.4130544
                  }
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1713960614.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2edc5af6f7dcebadae77290b3dddde9ccd399d562367ea2f51e415fc8abf55d2'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: 'SLOWNESS',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'SLOWNESS',
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 0.15,
                      units: 'SECONDS_PER_DEGREE',
                      value: 8.7249994
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        units: 'SECONDS_PER_DEGREE',
                        value: 0
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'SECONDS_PER_DEGREE',
                        value: 8.7249994
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
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              residual: -3.311945,
              weight: 1
            },
            {
              defining: true,
              measurement: {
                channel: {
                  effectiveAt: 1713960614.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2edc5af6f7dcebadae77290b3dddde9ccd399d562367ea2f51e415fc8abf55d2'
                },
                featureMeasurementType: 'ARRIVAL_TIME',
                measurementValue: {
                  arrivalTime: {
                    standardDeviation: 1.72,
                    value: 1713960674.975
                  }
                },
                snr: {
                  units: 'DECIBELS',
                  value: 3.5784304
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1713960614.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2edc5af6f7dcebadae77290b3dddde9ccd399d562367ea2f51e415fc8abf55d2'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: 'ARRIVAL_TIME',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'ARRIVAL_TIME',
                  predictedValue: {
                    arrivalTime: {
                      value: 1713960674.04
                    },
                    travelTime: {
                      standardDeviation: 1.4,
                      value: 396.1781
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        value: 'PT0S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'ELEVATION_CORRECTION',
                      value: {
                        value: 'PT0.49459S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        value: 'PT6M36.4132S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BULK_STATIC_STATION_CORRECTION',
                      value: {
                        value: 'PT-0.72469S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                      value: {
                        value: 'PT-0.0050424S'
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
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              residual: 0.75605355,
              weight: 1
            },
            {
              defining: true,
              measurement: {
                channel: {
                  effectiveAt: 1713960614.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2edc5af6f7dcebadae77290b3dddde9ccd399d562367ea2f51e415fc8abf55d2'
                },
                featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                measurementValue: {
                  measuredValue: {
                    standardDeviation: 7.626245,
                    units: 'DEGREES',
                    value: 112.90577
                  }
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1713960614.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2edc5af6f7dcebadae77290b3dddde9ccd399d562367ea2f51e415fc8abf55d2'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 20,
                      units: 'DEGREES',
                      value: 165.80986
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'DEGREES',
                        value: 165.80986
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        units: 'DEGREES',
                        value: 0
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
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              residual: -52.904094,
              weight: 1
            },
            {
              defining: false,
              measurement: {
                channel: {
                  effectiveAt: 1713960614.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2edc5af6f7dcebadae77290b3dddde9ccd399d562367ea2f51e415fc8abf55d2'
                },
                featureMeasurementType: 'EMERGENCE_ANGLE',
                measurementValue: {
                  measuredValue: {
                    units: 'DEGREES',
                    value: -1
                  }
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1713960614.975,
                  name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2edc5af6f7dcebadae77290b3dddde9ccd399d562367ea2f51e415fc8abf55d2'
                },
                extrapolated: false,
                phase: 'P',
                predictionType: 'EMERGENCE_ANGLE',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'EMERGENCE_ANGLE',
                  predictedValue: {
                    measuredValue: {
                      units: 'DEGREES',
                      value: 998
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'DEGREES',
                        value: 998
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
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              residual: -999
            },
            {
              defining: true,
              measurement: {
                channel: {
                  effectiveAt: 1713960255,
                  name: 'TXAR.beam.SHZ/beam,fk,coherent/steer,az_288.267deg,slow_16.045s_per_deg/e8b504cce8788018b4b2cca61b91a3c490d2fc8ebfb9b436be9369691c24211c'
                },
                featureMeasurementType: 'ARRIVAL_TIME',
                measurementValue: {
                  arrivalTime: {
                    standardDeviation: 1.188,
                    value: 1713960315
                  }
                },
                snr: {
                  units: 'DECIBELS',
                  value: 8.6559982
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1713960255,
                  name: 'TXAR.beam.SHZ/beam,fk,coherent/steer,az_288.267deg,slow_16.045s_per_deg/e8b504cce8788018b4b2cca61b91a3c490d2fc8ebfb9b436be9369691c24211c'
                },
                extrapolated: false,
                phase: 'Pg',
                predictionType: 'ARRIVAL_TIME',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'ARRIVAL_TIME',
                  predictedValue: {
                    arrivalTime: {
                      value: 1713960314.04
                    },
                    travelTime: {
                      standardDeviation: 2.068,
                      value: 36.97
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        value: 'PT0S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'ELLIPTICITY_CORRECTION',
                      value: {
                        value: 'PT0.0099661S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        value: 'PT35.4844S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'ELEVATION_CORRECTION',
                      value: {
                        value: 'PT0.10722S'
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BULK_STATIC_STATION_CORRECTION',
                      value: {
                        value: 'PT1.3684S'
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0.0061,
                  elevationKm: 0.9914,
                  latitudeDegrees: 29.334257,
                  longitudeDegrees: -103.667684
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              residual: -0.010892879,
              weight: 1
            },
            {
              defining: true,
              measurement: {
                channel: {
                  effectiveAt: 1713960255,
                  name: 'TXAR.beam.SHZ/beam,fk,coherent/steer,az_288.267deg,slow_16.045s_per_deg/e8b504cce8788018b4b2cca61b91a3c490d2fc8ebfb9b436be9369691c24211c'
                },
                featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                measurementValue: {
                  measuredValue: {
                    standardDeviation: 7.8338307,
                    units: 'DEGREES',
                    value: 288.2666
                  }
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1713960255,
                  name: 'TXAR.beam.SHZ/beam,fk,coherent/steer,az_288.267deg,slow_16.045s_per_deg/e8b504cce8788018b4b2cca61b91a3c490d2fc8ebfb9b436be9369691c24211c'
                },
                extrapolated: false,
                phase: 'Pg',
                predictionType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'RECEIVER_TO_SOURCE_AZIMUTH',
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 20,
                      units: 'DEGREES',
                      value: 291.56513
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'DEGREES',
                        value: 291.56513
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        units: 'DEGREES',
                        value: 0
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0.0061,
                  elevationKm: 0.9914,
                  latitudeDegrees: 29.334257,
                  longitudeDegrees: -103.667684
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              residual: 2.7948449,
              weight: 1
            },
            {
              defining: false,
              measurement: {
                channel: {
                  effectiveAt: 1713960255,
                  name: 'TXAR.beam.SHZ/beam,fk,coherent/steer,az_288.267deg,slow_16.045s_per_deg/e8b504cce8788018b4b2cca61b91a3c490d2fc8ebfb9b436be9369691c24211c'
                },
                featureMeasurementType: 'EMERGENCE_ANGLE',
                measurementValue: {
                  measuredValue: {
                    units: 'DEGREES',
                    value: -1
                  }
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1713960255,
                  name: 'TXAR.beam.SHZ/beam,fk,coherent/steer,az_288.267deg,slow_16.045s_per_deg/e8b504cce8788018b4b2cca61b91a3c490d2fc8ebfb9b436be9369691c24211c'
                },
                extrapolated: false,
                phase: 'Pg',
                predictionType: 'EMERGENCE_ANGLE',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'EMERGENCE_ANGLE',
                  predictedValue: {
                    measuredValue: {
                      units: 'DEGREES',
                      value: 998
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'DEGREES',
                        value: 998
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0.0061,
                  elevationKm: 0.9914,
                  latitudeDegrees: 29.334257,
                  longitudeDegrees: -103.667684
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              residual: -999
            },
            {
              defining: true,
              measurement: {
                channel: {
                  effectiveAt: 1713960255,
                  name: 'TXAR.beam.SHZ/beam,fk,coherent/steer,az_288.267deg,slow_16.045s_per_deg/e8b504cce8788018b4b2cca61b91a3c490d2fc8ebfb9b436be9369691c24211c'
                },
                featureMeasurementType: 'SLOWNESS',
                measurementValue: {
                  measuredValue: {
                    standardDeviation: 2.19,
                    units: 'SECONDS_PER_DEGREE',
                    value: 16.044702
                  }
                }
              },
              prediction: {
                channel: {
                  effectiveAt: 1713960255,
                  name: 'TXAR.beam.SHZ/beam,fk,coherent/steer,az_288.267deg,slow_16.045s_per_deg/e8b504cce8788018b4b2cca61b91a3c490d2fc8ebfb9b436be9369691c24211c'
                },
                extrapolated: false,
                phase: 'Pg',
                predictionType: 'SLOWNESS',
                predictionValue: {
                  derivativeMap: {},
                  featureMeasurementType: 'SLOWNESS',
                  predictedValue: {
                    measuredValue: {
                      standardDeviation: 0.15,
                      units: 'SECONDS_PER_DEGREE',
                      value: 16.66607363
                    }
                  },
                  featurePredictionComponents: [
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'BASEMODEL_PREDICTION',
                      value: {
                        units: 'SECONDS_PER_DEGREE',
                        value: 16.66607363
                      }
                    },
                    {
                      extrapolated: false,
                      featurePredictionComponent: 'SOURCE_DEPENDENT_CORRECTION',
                      value: {
                        units: 'SECONDS_PER_DEGREE',
                        value: 0
                      }
                    }
                  ]
                },
                receiverLocation: {
                  depthKm: 0.0061,
                  elevationKm: 0.9914,
                  latitudeDegrees: 29.334257,
                  longitudeDegrees: -103.667684
                },
                sourceLocation: {
                  depthKm: 0,
                  latitudeDegrees: 30.035715,
                  longitudeDegrees: -105.75554,
                  time: 1713960278.04
                }
              },
              residual: -0.62137163,
              weight: 1
            },
            {
              defining: true,
              measurement: {
                featureMeasurementType: 'ARRIVAL_TIME',
                measurementValue: {
                  arrivalTime: {
                    value: 1713959601.9508953,
                    standardDeviation: 1,
                    units: 'SECONDS'
                  }
                },
                channel: {
                  name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
                  effectiveAt: 1713816000
                },
                measuredChannelSegment: {
                  id: {
                    channel: {
                      name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
                      effectiveAt: 1713816000
                    },
                    startTime: 1713959100,
                    endTime: 1713964500,
                    creationTime: 1713976176.347
                  }
                },
                analysisWaveform: {
                  waveform: {
                    id: {
                      channel: {
                        name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
                        effectiveAt: 1713816000
                      },
                      startTime: 1713959100,
                      endTime: 1713964500,
                      creationTime: 1713976176.347
                    }
                  }
                }
              }
            },
            {
              defining: true,
              measurement: {
                featureMeasurementType: 'ARRIVAL_TIME',
                measurementValue: {
                  arrivalTime: {
                    value: 1713959854.5449178,
                    standardDeviation: 1,
                    units: 'SECONDS'
                  }
                },
                channel: {
                  name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
                  effectiveAt: 1713816000
                },
                measuredChannelSegment: {
                  id: {
                    channel: {
                      name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
                      effectiveAt: 1713816000
                    },
                    startTime: 1713959100,
                    endTime: 1713964500,
                    creationTime: 1713976176.347
                  }
                },
                analysisWaveform: {
                  waveform: {
                    id: {
                      channel: {
                        name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
                        effectiveAt: 1713816000
                      },
                      startTime: 1713959100,
                      endTime: 1713964500,
                      creationTime: 1713976176.347
                    }
                  },
                  filterDefinitionUsage: 'DETECTION',
                  filterDefinition: {
                    name: '2.0 5.0 3 BP causal',
                    comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
                    filterDescription: {
                      causal: true,
                      comments: '2.0 5.0 3 BP causal',
                      filterType: 'LINEAR',
                      highFrequencyHz: 5,
                      linearFilterType: 'IIR_BUTTERWORTH',
                      lowFrequencyHz: 2,
                      order: 3,
                      parameters: {
                        groupDelaySec: 'P0D',
                        sampleRateHz: 40.00018518518519,
                        sampleRateToleranceHz: 0.01,
                        sosDenominatorCoefficients: [
                          1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044,
                          0.8623084548971981, 1, -1.2654002658879997, 0.7305963984206739
                        ],
                        sosNumeratorCoefficients: [
                          0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
                          -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
                        ]
                      },
                      passBandType: 'BAND_PASS',
                      zeroPhase: false
                    }
                  }
                }
              }
            }
          ],
          locationRestraint: {
            depthRestraintKm: 0,
            depthRestraintReason: 'FIXED_BY_ANALYST',
            depthRestraintType: 'FIXED',
            epicenterRestraintType: 'UNRESTRAINED',
            timeRestraintType: 'UNRESTRAINED'
          },
          locationUncertainty: {
            ellipses: [
              {
                confidenceLevel: 0.9,
                kWeight: 0,
                scalingFactorType: 'CONFIDENCE',
                semiMajorAxisLengthKm: 75.367533,
                semiMajorAxisTrendDeg: 34.299995,
                semiMinorAxisLengthKm: 22.124304,
                timeUncertainty: 2.8882713
              }
            ],
            ellipsoids: [],
            stdDevTravelTimeResiduals: 0.56528952,
            tt: 3.0780724,
            xt: 29.770948,
            xx: 464.72606,
            xy: 525.28217,
            yt: 34.53091,
            yy: 876.43794
          },
          networkMagnitudeSolutions: [
            {
              magnitude: {
                standardDeviation: -1,
                units: 'UNITLESS',
                value: 2.9559155
              },
              magnitudeBehaviors: [
                {
                  defining: false,
                  residual: 0.79866343,
                  stationMagnitudeSolution: {
                    magnitude: {
                      standardDeviation: 0.35,
                      units: 'UNITLESS',
                      value: 4.5532423
                    },
                    measurement: {
                      analysisWaveform: {
                        waveform: {
                          id: {
                            channel: {
                              effectiveAt: 1713960892.375,
                              name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/0cfabd1579aa29869613138f04c6f12aa24530c12cc226a1c3f3f14094ae31b0'
                            },
                            creationTime: 1713960892.375,
                            endTime: 1713961192.35,
                            startTime: 1713960892.375
                          }
                        }
                      },
                      channel: {
                        effectiveAt: 1713960892.375,
                        name: 'PETK.beam.SHZ/beam,fk,coherent/steer,az_108.246deg,slow_14.206s_per_deg/0cfabd1579aa29869613138f04c6f12aa24530c12cc226a1c3f3f14094ae31b0'
                      },
                      featureMeasurementType: 'AMPLITUDE_A5_OVER_2',
                      measurementValue: {
                        amplitude: 6.2286863,
                        clipped: false,
                        measurementTime: 1713960951.9,
                        measurementWindowDuration: 6,
                        measurementWindowStart: 1713960951.875,
                        period: 1.0853543,
                        units: 'UNITLESS'
                      }
                    },
                    model: 'UNKNOWN',
                    phase: 'P',
                    station: {
                      name: 'PETK'
                    },
                    type: 'MB'
                  },
                  weight: 1
                },
                {
                  defining: true,
                  residual: -0.79866343,
                  stationMagnitudeSolution: {
                    magnitude: {
                      standardDeviation: 0.35,
                      units: 'UNITLESS',
                      value: 2.9559155
                    },
                    measurement: {
                      analysisWaveform: {
                        waveform: {
                          id: {
                            channel: {
                              effectiveAt: 1713960614.975,
                              name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2edc5af6f7dcebadae77290b3dddde9ccd399d562367ea2f51e415fc8abf55d2'
                            },
                            creationTime: 1713960614.975,
                            endTime: 1713960914.95,
                            startTime: 1713960614.975
                          }
                        }
                      },
                      channel: {
                        effectiveAt: 1713960614.975,
                        name: 'YKA.beam.SHZ/beam,fk,coherent/steer,az_112.906deg,slow_5.413s_per_deg/2edc5af6f7dcebadae77290b3dddde9ccd399d562367ea2f51e415fc8abf55d2'
                      },
                      featureMeasurementType: 'AMPLITUDE_A5_OVER_2',
                      measurementValue: {
                        amplitude: 0.18160133,
                        clipped: false,
                        measurementTime: 1713960675.5,
                        measurementWindowDuration: 6,
                        measurementWindowStart: 1713960674.475,
                        period: 0.9210399,
                        units: 'UNITLESS'
                      }
                    },
                    model: 'UNKNOWN',
                    phase: 'P',
                    station: {
                      name: 'YKA'
                    },
                    type: 'MB'
                  },
                  weight: 1
                }
              ],
              type: 'MB'
            }
          ],
          id: '9e524bdb-7ae4-4614-923d-5490fd9e416a'
        }
      ],
      parentEventHypotheses: [
        {
          id: {
            eventId: 'd09bf415-44a3-365a-86c9-077ebb5e35c3',
            hypothesisId: '452b342c-bb7e-391e-bfdd-bd4975a3fccb'
          }
        }
      ],
      preferredLocationSolution: {
        id: '9e524bdb-7ae4-4614-923d-5490fd9e416a'
      },
      rejected: false,
      _uiHasUnsavedChanges: 1713978666.826
    }
  ],
  finalEventHypothesisHistory: [],
  monitoringOrganization: 'GMS',
  overallPreferred: {
    id: {
      eventId: 'd09bf415-44a3-365a-86c9-077ebb5e35c3',
      hypothesisId: '452b342c-bb7e-391e-bfdd-bd4975a3fccb'
    }
  },
  preferredEventHypothesisByStage: [
    {
      preferred: {
        id: {
          eventId: 'd09bf415-44a3-365a-86c9-077ebb5e35c3',
          hypothesisId: '452b342c-bb7e-391e-bfdd-bd4975a3fccb'
        }
      },
      preferredBy: '-',
      stage: {
        name: 'Auto Network'
      }
    },
    {
      stage: {
        name: 'AL1'
      },
      preferred: {
        id: {
          eventId: 'd09bf415-44a3-365a-86c9-077ebb5e35c3',
          hypothesisId: '405940df-5bff-450e-bd45-f9973e6d971d'
        }
      },
      preferredBy: 'eui'
    }
  ],
  rejectedSignalDetectionAssociations: [],
  id: 'd09bf415-44a3-365a-86c9-077ebb5e35c3',
  _uiHasUnsavedChanges: 1713978666.826
};

export const SD_EVENT_ASSOCIATED_UNFILTERED = {
  id: 'e63c1d7e-5eba-4c54-ac71-1cc71e90d4dc',
  monitoringOrganization: 'GMS',
  station: {
    name: 'KURK'
  },
  signalDetectionHypotheses: [
    {
      id: {
        id: '9f6f51ce-3632-4ae9-bc55-e45ad93f4203',
        signalDetectionId: 'e63c1d7e-5eba-4c54-ac71-1cc71e90d4dc'
      },
      monitoringOrganization: 'GMS',
      deleted: false,
      station: {
        name: 'KURK',
        effectiveAt: 1713794400
      },
      featureMeasurements: [
        {
          featureMeasurementType: 'ARRIVAL_TIME',
          measurementValue: {
            arrivalTime: {
              value: 1713959601.9508953,
              standardDeviation: 1,
              units: 'SECONDS'
            }
          },
          channel: {
            name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
            effectiveAt: 1713816000
          },
          measuredChannelSegment: {
            id: {
              channel: {
                name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
                effectiveAt: 1713816000
              },
              startTime: 1713959100,
              endTime: 1713964500,
              creationTime: 1713976176.347
            }
          },
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
                  effectiveAt: 1713816000
                },
                startTime: 1713959100,
                endTime: 1713964500,
                creationTime: 1713976176.347
              }
            }
          }
        },
        {
          featureMeasurementType: 'PHASE',
          measurementValue: {
            value: 'S',
            referenceTime: 1713959601.9508953
          },
          channel: {
            name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
            effectiveAt: 1713816000
          },
          measuredChannelSegment: {
            id: {
              channel: {
                name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
                effectiveAt: 1713816000
              },
              startTime: 1713959100,
              endTime: 1713964500,
              creationTime: 1713976176.347
            }
          },
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
                  effectiveAt: 1713816000
                },
                startTime: 1713959100,
                endTime: 1713964500,
                creationTime: 1713976176.347
              }
            }
          }
        }
      ],
      parentSignalDetectionHypothesis: null
    }
  ],
  _uiHasUnsavedChanges: 1713976221.752,
  _uiHasUnsavedEventSdhAssociation: 1713976221.752
};

export const SD_UNASSOCIATED_FK = {
  id: 'e1bad5b3-fc51-498d-b305-c7d416aa65ab',
  monitoringOrganization: 'GMS',
  station: {
    name: 'KURK'
  },
  signalDetectionHypotheses: [
    {
      id: {
        id: 'ec33e10e-1cb0-4830-83cf-ae578f6c0720',
        signalDetectionId: 'e1bad5b3-fc51-498d-b305-c7d416aa65ab'
      },
      monitoringOrganization: 'GMS',
      deleted: false,
      station: {
        name: 'KURK',
        effectiveAt: 1713794400
      },
      featureMeasurements: [
        {
          featureMeasurementType: 'ARRIVAL_TIME',
          measurementValue: {
            arrivalTime: {
              value: 1713960227.5710137,
              standardDeviation: 1,
              units: 'SECONDS'
            }
          },
          channel: {
            name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
            effectiveAt: 1713816000
          },
          measuredChannelSegment: {
            id: {
              channel: {
                name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
                effectiveAt: 1713816000
              },
              startTime: 1713959100,
              endTime: 1713964500,
              creationTime: 1713976176.347
            }
          },
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
                  effectiveAt: 1713816000
                },
                startTime: 1713959100,
                endTime: 1713964500,
                creationTime: 1713976176.347
              }
            },
            filterDefinitionUsage: 'DETECTION',
            filterDefinition: {
              name: '2.0 5.0 3 BP causal',
              comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
              filterDescription: {
                causal: true,
                comments: '2.0 5.0 3 BP causal',
                filterType: 'LINEAR',
                highFrequencyHz: 5,
                linearFilterType: 'IIR_BUTTERWORTH',
                lowFrequencyHz: 2,
                order: 3,
                parameters: {
                  groupDelaySec: 'P0D',
                  sampleRateHz: 40.00018518518519,
                  sampleRateToleranceHz: 0.01,
                  sosDenominatorCoefficients: [
                    1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044,
                    0.8623084548971981, 1, -1.2654002658879997, 0.7305963984206739
                  ],
                  sosNumeratorCoefficients: [
                    0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
                    -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
                  ]
                },
                passBandType: 'BAND_PASS',
                zeroPhase: false
              }
            }
          }
        },
        {
          featureMeasurementType: 'PHASE',
          measurementValue: {
            value: 'S',
            referenceTime: 1713960227.5710137
          },
          channel: {
            name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
            effectiveAt: 1713816000
          },
          measuredChannelSegment: {
            id: {
              channel: {
                name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
                effectiveAt: 1713816000
              },
              startTime: 1713959100,
              endTime: 1713964500,
              creationTime: 1713976176.347
            }
          },
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
                  effectiveAt: 1713816000
                },
                startTime: 1713959100,
                endTime: 1713964500,
                creationTime: 1713976176.347
              }
            },
            filterDefinition: {
              name: '2.0 5.0 3 BP causal',
              comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
              filterDescription: {
                causal: true,
                comments: '2.0 5.0 3 BP causal',
                filterType: 'LINEAR',
                highFrequencyHz: 5,
                linearFilterType: 'IIR_BUTTERWORTH',
                lowFrequencyHz: 2,
                order: 3,
                parameters: {
                  groupDelaySec: 'P0D',
                  sampleRateHz: 40.00018518518519,
                  sampleRateToleranceHz: 0.01,
                  sosDenominatorCoefficients: [
                    1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044,
                    0.8623084548971981, 1, -1.2654002658879997, 0.7305963984206739
                  ],
                  sosNumeratorCoefficients: [
                    0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
                    -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
                  ]
                },
                passBandType: 'BAND_PASS',
                zeroPhase: false
              }
            }
          }
        }
      ],
      parentSignalDetectionHypothesis: null
    }
  ],
  _uiHasUnsavedChanges: 1713978517.819
};

export const SD_EVENT_ASSOCIATED_FK = {
  id: '378de4ae-452a-4b78-9afd-9f7df5954ddc',
  monitoringOrganization: 'GMS',
  station: {
    name: 'KURK'
  },
  signalDetectionHypotheses: [
    {
      id: {
        id: '9a0d9194-d986-4039-9539-3ce7fe0c6ce7',
        signalDetectionId: '378de4ae-452a-4b78-9afd-9f7df5954ddc'
      },
      monitoringOrganization: 'GMS',
      deleted: false,
      station: {
        name: 'KURK',
        effectiveAt: 1713794400
      },
      featureMeasurements: [
        {
          featureMeasurementType: 'ARRIVAL_TIME',
          measurementValue: {
            arrivalTime: {
              value: 1713959854.5449178,
              standardDeviation: 1,
              units: 'SECONDS'
            }
          },
          channel: {
            name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
            effectiveAt: 1713816000
          },
          measuredChannelSegment: {
            id: {
              channel: {
                name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
                effectiveAt: 1713816000
              },
              startTime: 1713959100,
              endTime: 1713964500,
              creationTime: 1713976176.347
            }
          },
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
                  effectiveAt: 1713816000
                },
                startTime: 1713959100,
                endTime: 1713964500,
                creationTime: 1713976176.347
              }
            },
            filterDefinitionUsage: 'DETECTION',
            filterDefinition: {
              name: '2.0 5.0 3 BP causal',
              comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
              filterDescription: {
                causal: true,
                comments: '2.0 5.0 3 BP causal',
                filterType: 'LINEAR',
                highFrequencyHz: 5,
                linearFilterType: 'IIR_BUTTERWORTH',
                lowFrequencyHz: 2,
                order: 3,
                parameters: {
                  groupDelaySec: 'P0D',
                  sampleRateHz: 40.00018518518519,
                  sampleRateToleranceHz: 0.01,
                  sosDenominatorCoefficients: [
                    1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044,
                    0.8623084548971981, 1, -1.2654002658879997, 0.7305963984206739
                  ],
                  sosNumeratorCoefficients: [
                    0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
                    -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
                  ]
                },
                passBandType: 'BAND_PASS',
                zeroPhase: false
              }
            }
          }
        },
        {
          featureMeasurementType: 'PHASE',
          measurementValue: {
            value: 'S',
            referenceTime: 1713959854.5449178
          },
          channel: {
            name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
            effectiveAt: 1713816000
          },
          measuredChannelSegment: {
            id: {
              channel: {
                name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
                effectiveAt: 1713816000
              },
              startTime: 1713959100,
              endTime: 1713964500,
              creationTime: 1713976176.347
            }
          },
          analysisWaveform: {
            waveform: {
              id: {
                channel: {
                  name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
                  effectiveAt: 1713816000
                },
                startTime: 1713959100,
                endTime: 1713964500,
                creationTime: 1713976176.347
              }
            },
            filterDefinition: {
              name: '2.0 5.0 3 BP causal',
              comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
              filterDescription: {
                causal: true,
                comments: '2.0 5.0 3 BP causal',
                filterType: 'LINEAR',
                highFrequencyHz: 5,
                linearFilterType: 'IIR_BUTTERWORTH',
                lowFrequencyHz: 2,
                order: 3,
                parameters: {
                  groupDelaySec: 'P0D',
                  sampleRateHz: 40.00018518518519,
                  sampleRateToleranceHz: 0.01,
                  sosDenominatorCoefficients: [
                    1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044,
                    0.8623084548971981, 1, -1.2654002658879997, 0.7305963984206739
                  ],
                  sosNumeratorCoefficients: [
                    0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
                    -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
                  ]
                },
                passBandType: 'BAND_PASS',
                zeroPhase: false
              }
            }
          }
        }
      ],
      parentSignalDetectionHypothesis: null
    }
  ],
  _uiHasUnsavedChanges: 1713978666.826,
  _uiHasUnsavedEventSdhAssociation: 1713978666.826
};

export const KURK_DETECTION_FILTERED_CHANNEL_SEGMENT_ARRAY = [
  KURK_BEAM_DETECTION_FILTERED_CHANNEL_SEGMENT,
  KURK_BHR_DETECTION_FILTERED_CHANNEL_SEGMENT,
  KURK_BHT_DETECTION_FILTERED_CHANNEL_SEGMENT
];

export const KURK_FK_FILTERED_CHANNEL_SEGMENT_ARRAY = [
  KURK_BEAM_FK_FILTERED_CHANNEL_SEGMENT,
  KURK_BHR_FK_FILTERED_CHANNEL_SEGMENT,
  KURK_BHT_FK_FILTERED_CHANNEL_SEGMENT
];

export const KURK_UNFILTERED_CHANNEL_SEGMENT_ARRAY = [
  KURK_BEAM_UNFILTERED_CHANNEL_SEGMENT,
  KURK_BHR_UNFILTERED_CHANNEL_SEGMENT,
  KURK_BHT_UNFILTERED_CHANNEL_SEGMENT
];

export const KURK_UI_CHANNEL_SEGMENT_RECORD = {
  KURK: {
    Unfiltered: KURK_UNFILTERED_CHANNEL_SEGMENT_ARRAY,
    DETECTION: KURK_DETECTION_FILTERED_CHANNEL_SEGMENT_ARRAY,
    FK: KURK_FK_FILTERED_CHANNEL_SEGMENT_ARRAY
  }
};

export const KURK_FILTERED_CHANNEL_RECORD = {
  filtered: {
    'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.5 4.0 3 BP causal/929b9ff1814e740f6baffbf6c548b72bf412a65b94226072f2a2b8347f884886':
      {
        channelBandType: 'BROADBAND',
        canonicalName:
          'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.5 4.0 3 BP causal/929b9ff1814e740f6baffbf6c548b72bf412a65b94226072f2a2b8347f884886',
        channelOrientationCode: 'Z',
        configuredInputs: [
          {
            effectiveAt: 1713961472.35,
            name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/8c83f7aba668b8ef6e652ebebe5b4ee8b753c0f7b2061a662afb3cd03521dc20'
          }
        ],
        channelDataType: 'SEISMIC',
        description: 'KURK/BHZ fk beam Filtered using a 0.5 4.0 3 BP causal filter.',
        effectiveAt: 1713961472.35,
        effectiveUntil: 1713961772.325,
        channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
        location: {
          depthKm: 0.03,
          elevationKm: 0.2004,
          latitudeDegrees: 50.62264,
          longitudeDegrees: 78.53039
        },
        name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.5 4.0 3 BP causal/929b9ff1814e740f6baffbf6c548b72bf412a65b94226072f2a2b8347f884886',
        nominalSampleRateHz: 40,
        orientationAngles: {
          horizontalAngleDeg: -1,
          verticalAngleDeg: 0
        },
        channelOrientationType: 'VERTICAL',
        processingDefinition: {
          comments: 'Butterworth IIR band-pass 0.5-4.0 Hz, order 3, causal',
          filterDescription: {
            causal: true,
            comments: '0.5 4.0 3 BP causal',
            filterType: 'LINEAR',
            highFrequencyHz: 4,
            linearFilterType: 'IIR_BUTTERWORTH',
            lowFrequencyHz: 0.5,
            order: 3,
            parameters: {
              groupDelaySec: 'P0D',
              sampleRateHz: 40,
              sampleRateToleranceHz: 0.01,
              sosDenominatorCoefficients: [
                1, -1.520697975242203, 0.560026908474077, 1, -1.929342750422624, 0.9358330515843435,
                1, -1.3382070277433393, 0.6258908523061232
              ],
              sosNumeratorCoefficients: [
                0.21998654576296148, 0, -0.21998654576296148, 0.2760021441526437, 0,
                -0.2760021441526437, 0.21165851497548066, 0, -0.21165851497548066
              ]
            },
            passBandType: 'BAND_PASS',
            zeroPhase: false
          },
          name: '0.5 4.0 3 BP causal'
        },
        processingMetadata: {
          BRIDGED: '/bridged,ARID:4402',
          CHANNEL_GROUP: 'beam',
          STEERING_BACK_AZIMUTH: 206.43622,
          STEERING_SLOWNESS: 10.85453,
          BEAM_SUMMATION: 'B',
          BEAM_TYPE: 'FK',
          FILTER_TYPE: 'LINEAR',
          FILTER_CAUSALITY: true
        },
        station: {
          name: 'KURK'
        },
        units: 'NANOMETERS'
      },
    'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af':
      {
        channelBandType: 'BROADBAND',
        canonicalName:
          'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
        channelOrientationCode: 'R',
        configuredInputs: [
          {
            effectiveAt: 1713816000,
            name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3'
          }
        ],
        channelDataType: 'SEISMIC',
        description:
          'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086. Filtered using a 2.0 5.0 3 BP causal filter.',
        effectiveAt: 1713816000,
        effectiveForRequestTime: null,
        effectiveUntil: null,
        channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
        location: {
          latitudeDegrees: 50.62264,
          longitudeDegrees: 78.53039,
          depthKm: 0.042,
          elevationKm: 0.2004
        },
        name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
        nominalSampleRateHz: 40,
        orientationAngles: {
          horizontalAngleDeg: 441.08642783670933,
          verticalAngleDeg: 90
        },
        channelOrientationType: 'RADIAL',
        processingDefinition: {
          comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
          filterDescription: {
            causal: true,
            comments: '2.0 5.0 3 BP causal',
            filterType: 'LINEAR',
            highFrequencyHz: 5,
            linearFilterType: 'IIR_BUTTERWORTH',
            lowFrequencyHz: 2,
            order: 3,
            parameters: {
              groupDelaySec: 'P0D',
              sampleRateHz: 40.00018518518519,
              sampleRateToleranceHz: 0.01,
              sosDenominatorCoefficients: [
                1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044,
                0.8623084548971981, 1, -1.2654002658879997, 0.7305963984206739
              ],
              sosNumeratorCoefficients: [
                0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
                -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
              ]
            },
            passBandType: 'BAND_PASS',
            zeroPhase: false
          },
          name: '2.0 5.0 3 BP causal'
        },
        processingMetadata: {
          CHANNEL_GROUP: 'KURBB',
          STEERING_BACK_AZIMUTH: 261.08642783670933,
          FILTER_TYPE: 'LINEAR',
          FILTER_CAUSALITY: true
        },
        station: {
          name: 'KURK'
        },
        units: 'NANOMETERS'
      },
    'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52':
      {
        channelBandType: 'BROADBAND',
        canonicalName:
          'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52',
        channelOrientationCode: 'T',
        configuredInputs: [
          {
            effectiveAt: 1713816000,
            name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3'
          }
        ],
        channelDataType: 'SEISMIC',
        description:
          'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086. Filtered using a 2.0 5.0 3 BP causal filter.',
        effectiveAt: 1713816000,
        effectiveForRequestTime: null,
        effectiveUntil: null,
        channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
        location: {
          latitudeDegrees: 50.62264,
          longitudeDegrees: 78.53039,
          depthKm: 0.042,
          elevationKm: 0.2004
        },
        name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52',
        nominalSampleRateHz: 40,
        orientationAngles: {
          horizontalAngleDeg: 531.0864278367094,
          verticalAngleDeg: 90
        },
        channelOrientationType: 'TRANSVERSE',
        processingDefinition: {
          comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
          filterDescription: {
            causal: true,
            comments: '2.0 5.0 3 BP causal',
            filterType: 'LINEAR',
            highFrequencyHz: 5,
            linearFilterType: 'IIR_BUTTERWORTH',
            lowFrequencyHz: 2,
            order: 3,
            parameters: {
              groupDelaySec: 'P0D',
              sampleRateHz: 40.00018518518519,
              sampleRateToleranceHz: 0.01,
              sosDenominatorCoefficients: [
                1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044,
                0.8623084548971981, 1, -1.2654002658879997, 0.7305963984206739
              ],
              sosNumeratorCoefficients: [
                0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
                -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
              ]
            },
            passBandType: 'BAND_PASS',
            zeroPhase: false
          },
          name: '2.0 5.0 3 BP causal'
        },
        processingMetadata: {
          CHANNEL_GROUP: 'KURBB',
          STEERING_BACK_AZIMUTH: 261.08642783670933,
          FILTER_TYPE: 'LINEAR',
          FILTER_CAUSALITY: true
        },
        station: {
          name: 'KURK'
        },
        units: 'NANOMETERS'
      },
    'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.4 3.5 3 BP causal/2f2e0f2674a5a0f3d87f94f534eabed2b2c4fb0482078583c5571fa80709b6d4':
      {
        channelBandType: 'BROADBAND',
        canonicalName:
          'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.4 3.5 3 BP causal/2f2e0f2674a5a0f3d87f94f534eabed2b2c4fb0482078583c5571fa80709b6d4',
        channelOrientationCode: 'Z',
        configuredInputs: [
          {
            effectiveAt: 1713961472.35,
            name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/8c83f7aba668b8ef6e652ebebe5b4ee8b753c0f7b2061a662afb3cd03521dc20'
          }
        ],
        channelDataType: 'SEISMIC',
        description: 'KURK/BHZ fk beam Filtered using a 0.4 3.5 3 BP causal filter.',
        effectiveAt: 1713961472.35,
        effectiveUntil: 1713961772.325,
        channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
        location: {
          depthKm: 0.03,
          elevationKm: 0.2004,
          latitudeDegrees: 50.62264,
          longitudeDegrees: 78.53039
        },
        name: 'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.4 3.5 3 BP causal/2f2e0f2674a5a0f3d87f94f534eabed2b2c4fb0482078583c5571fa80709b6d4',
        nominalSampleRateHz: 40,
        orientationAngles: {
          horizontalAngleDeg: -1,
          verticalAngleDeg: 0
        },
        channelOrientationType: 'VERTICAL',
        processingDefinition: {
          comments: 'Butterworth IIR band-pass, 0.4-3.5 Hz, order 3, causal',
          filterDescription: {
            causal: true,
            comments: '0.4 3.5 3 BP causal',
            filterType: 'LINEAR',
            highFrequencyHz: 3.5,
            linearFilterType: 'IIR_BUTTERWORTH',
            lowFrequencyHz: 0.4,
            order: 3,
            parameters: {
              groupDelaySec: 'P0D',
              sampleRateHz: 40,
              sampleRateToleranceHz: 0.01,
              sosDenominatorCoefficients: [
                1, -1.5739001384972777, 0.6020489682157348, 1, -1.9433249580631988,
                0.9474877640135565, 1, -1.4287659390987777, 0.655197522434191
              ],
              sosNumeratorCoefficients: [
                0.1989755158921326, 0, -0.1989755158921326, 0.24376224007447606, 0,
                -0.24376224007447606, 0.19321254848006578, 0, -0.19321254848006578
              ]
            },
            passBandType: 'BAND_PASS',
            zeroPhase: false
          },
          name: '0.4 3.5 3 BP causal'
        },
        processingMetadata: {
          BRIDGED: '/bridged,ARID:4402',
          CHANNEL_GROUP: 'beam',
          STEERING_BACK_AZIMUTH: 206.43622,
          STEERING_SLOWNESS: 10.85453,
          BEAM_SUMMATION: 'B',
          BEAM_TYPE: 'FK',
          FILTER_TYPE: 'LINEAR',
          FILTER_CAUSALITY: true
        },
        station: {
          name: 'KURK'
        },
        units: 'NANOMETERS'
      },
    'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,0.4 3.5 3 BP causal/242cef71e2982493eb1a6dd379dc32c69080b584924fe3ae1dbe418c8f53ffc9':
      {
        channelBandType: 'BROADBAND',
        canonicalName:
          'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,0.4 3.5 3 BP causal/242cef71e2982493eb1a6dd379dc32c69080b584924fe3ae1dbe418c8f53ffc9',
        channelOrientationCode: 'R',
        configuredInputs: [
          {
            effectiveAt: 1713816000,
            name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3'
          }
        ],
        channelDataType: 'SEISMIC',
        description:
          'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086. Filtered using a 0.4 3.5 3 BP causal filter.',
        effectiveAt: 1713816000,
        effectiveForRequestTime: null,
        effectiveUntil: null,
        channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
        location: {
          latitudeDegrees: 50.62264,
          longitudeDegrees: 78.53039,
          depthKm: 0.042,
          elevationKm: 0.2004
        },
        name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,0.4 3.5 3 BP causal/242cef71e2982493eb1a6dd379dc32c69080b584924fe3ae1dbe418c8f53ffc9',
        nominalSampleRateHz: 40,
        orientationAngles: {
          horizontalAngleDeg: 441.08642783670933,
          verticalAngleDeg: 90
        },
        channelOrientationType: 'RADIAL',
        processingDefinition: {
          comments: 'Butterworth IIR band-pass, 0.4-3.5 Hz, order 3, causal',
          filterDescription: {
            causal: true,
            comments: '0.4 3.5 3 BP causal',
            filterType: 'LINEAR',
            highFrequencyHz: 3.5,
            linearFilterType: 'IIR_BUTTERWORTH',
            lowFrequencyHz: 0.4,
            order: 3,
            parameters: {
              groupDelaySec: 'P0D',
              sampleRateHz: 40,
              sampleRateToleranceHz: 0.01,
              sosDenominatorCoefficients: [
                1, -1.5739001384972777, 0.6020489682157348, 1, -1.9433249580631988,
                0.9474877640135565, 1, -1.4287659390987777, 0.655197522434191
              ],
              sosNumeratorCoefficients: [
                0.1989755158921326, 0, -0.1989755158921326, 0.24376224007447606, 0,
                -0.24376224007447606, 0.19321254848006578, 0, -0.19321254848006578
              ]
            },
            passBandType: 'BAND_PASS',
            zeroPhase: false
          },
          name: '0.4 3.5 3 BP causal'
        },
        processingMetadata: {
          CHANNEL_GROUP: 'KURBB',
          STEERING_BACK_AZIMUTH: 261.08642783670933,
          FILTER_TYPE: 'LINEAR',
          FILTER_CAUSALITY: true
        },
        station: {
          name: 'KURK'
        },
        units: 'NANOMETERS'
      },
    'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,0.4 3.5 3 BP causal/e37e2ce84eee87883ef8a51fbbb7312fcb66e3b38c326b15fcb2cc797df071c4':
      {
        channelBandType: 'BROADBAND',
        canonicalName:
          'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,0.4 3.5 3 BP causal/e37e2ce84eee87883ef8a51fbbb7312fcb66e3b38c326b15fcb2cc797df071c4',
        channelOrientationCode: 'T',
        configuredInputs: [
          {
            effectiveAt: 1713816000,
            name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3'
          }
        ],
        channelDataType: 'SEISMIC',
        description:
          'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086. Filtered using a 0.4 3.5 3 BP causal filter.',
        effectiveAt: 1713816000,
        effectiveForRequestTime: null,
        effectiveUntil: null,
        channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
        location: {
          latitudeDegrees: 50.62264,
          longitudeDegrees: 78.53039,
          depthKm: 0.042,
          elevationKm: 0.2004
        },
        name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,0.4 3.5 3 BP causal/e37e2ce84eee87883ef8a51fbbb7312fcb66e3b38c326b15fcb2cc797df071c4',
        nominalSampleRateHz: 40,
        orientationAngles: {
          horizontalAngleDeg: 531.0864278367094,
          verticalAngleDeg: 90
        },
        channelOrientationType: 'TRANSVERSE',
        processingDefinition: {
          comments: 'Butterworth IIR band-pass, 0.4-3.5 Hz, order 3, causal',
          filterDescription: {
            causal: true,
            comments: '0.4 3.5 3 BP causal',
            filterType: 'LINEAR',
            highFrequencyHz: 3.5,
            linearFilterType: 'IIR_BUTTERWORTH',
            lowFrequencyHz: 0.4,
            order: 3,
            parameters: {
              groupDelaySec: 'P0D',
              sampleRateHz: 40,
              sampleRateToleranceHz: 0.01,
              sosDenominatorCoefficients: [
                1, -1.5739001384972777, 0.6020489682157348, 1, -1.9433249580631988,
                0.9474877640135565, 1, -1.4287659390987777, 0.655197522434191
              ],
              sosNumeratorCoefficients: [
                0.1989755158921326, 0, -0.1989755158921326, 0.24376224007447606, 0,
                -0.24376224007447606, 0.19321254848006578, 0, -0.19321254848006578
              ]
            },
            passBandType: 'BAND_PASS',
            zeroPhase: false
          },
          name: '0.4 3.5 3 BP causal'
        },
        processingMetadata: {
          CHANNEL_GROUP: 'KURBB',
          STEERING_BACK_AZIMUTH: 261.08642783670933,
          FILTER_TYPE: 'LINEAR',
          FILTER_CAUSALITY: true
        },
        station: {
          name: 'KURK'
        },
        units: 'NANOMETERS'
      },
    'KURK.beam.BHZ/beam,event,coherent/steer,az_3.769deg,slow_4.439s_per_deg/filter,0.4 3.5 3 BP causal/3e571f42be75db3b428afab3f84038db4c7c356cfb8849ab29d6eec333235020':
      {
        channelBandType: 'BROADBAND',
        canonicalName:
          'KURK.beam.BHZ/beam,event,coherent/steer,az_3.769deg,slow_4.439s_per_deg/filter,0.4 3.5 3 BP causal/3e571f42be75db3b428afab3f84038db4c7c356cfb8849ab29d6eec333235020',
        channelOrientationCode: 'Z',
        configuredInputs: [
          {
            effectiveAt: 1713816000,
            name: 'KURK.beam.BHZ/beam,event,coherent/steer,az_3.769deg,slow_4.439s_per_deg/4da8fdd12ec4c1cf3e38b09c2931a4c97d0736b06a4dee524ec4be18d9143e4a'
          }
        ],
        channelDataType: 'SEISMIC',
        description:
          'broadband_vertical;EVENT beamed for event d09bf415-44a3-365a-86c9-077ebb5e35c3, at location /Location{latitudeDegrees=50.62264, longitudeDegrees=78.53039, depthKm=0.0, elevationKm=0.2004}LQ,back azimuth 3.76867deg,slowness 4.4389sec/deg,COHERENT,true Filtered using a 0.4 3.5 3 BP causal filter.',
        effectiveAt: 1713816000,
        channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
        location: {
          depthKm: 0.025,
          elevationKm: 0.1629,
          latitudeDegrees: 50.72161,
          longitudeDegrees: 78.56336
        },
        name: 'KURK.beam.BHZ/beam,event,coherent/steer,az_3.769deg,slow_4.439s_per_deg/filter,0.4 3.5 3 BP causal/3e571f42be75db3b428afab3f84038db4c7c356cfb8849ab29d6eec333235020',
        nominalSampleRateHz: 50,
        orientationAngles: {},
        channelOrientationType: 'VERTICAL',
        processingDefinition: {
          comments: 'Butterworth IIR band-pass, 0.4-3.5 Hz, order 3, causal',
          filterDescription: {
            causal: true,
            comments: '0.4 3.5 3 BP causal',
            filterType: 'LINEAR',
            highFrequencyHz: 3.5,
            linearFilterType: 'IIR_BUTTERWORTH',
            lowFrequencyHz: 0.4,
            order: 3,
            parameters: {
              groupDelaySec: 'P0D',
              sampleRateHz: 40,
              sampleRateToleranceHz: 0.01,
              sosDenominatorCoefficients: [
                1, -1.5739001384972777, 0.6020489682157348, 1, -1.9433249580631988,
                0.9474877640135565, 1, -1.4287659390987777, 0.655197522434191
              ],
              sosNumeratorCoefficients: [
                0.1989755158921326, 0, -0.1989755158921326, 0.24376224007447606, 0,
                -0.24376224007447606, 0.19321254848006578, 0, -0.19321254848006578
              ]
            },
            passBandType: 'BAND_PASS',
            zeroPhase: false
          },
          name: '0.4 3.5 3 BP causal'
        },
        processingMetadata: {
          BRIDGED: '/bridged,EVID:75',
          CHANNEL_GROUP: 'beam',
          STEERING_BACK_AZIMUTH: 3.76867,
          STEERING_SLOWNESS: 4.4389,
          BEAM_SUMMATION: 'B',
          BEAM_TYPE: 'EVENT',
          BEAM_LOCATION: {
            depthKm: 0,
            elevationKm: 0.2004,
            latitudeDegrees: 50.62264,
            longitudeDegrees: 78.53039
          },
          BEAM_PHASE: 'LQ',
          BEAM_EVENT_HYPOTHESIS_ID: {
            eventId: 'd09bf415-44a3-365a-86c9-077ebb5e35c3',
            hypothesisId: '452b342c-bb7e-391e-bfdd-bd4975a3fccb'
          },
          FILTER_TYPE: 'LINEAR',
          FILTER_CAUSALITY: true
        },
        station: {
          name: 'KURK',
          effectiveAt: 1713794400
        },
        units: 'NANOMETERS'
      }
  }
};

export const KURK_CHANNEL_RECORD = {
  raw: {},
  beamed: {
    'KURK.beam.BHZ/beam,event,coherent/steer,az_349.252deg,slow_1.915s_per_deg/49756ca70076e54f0b397b5b68b987f299ee30718f3081f6e90689027536a1d5':
      KURK_UNFILTERED_CHANNEL_BEAM,
    'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3':
      KURK_UNFILTERED_CHANNEL_BHR,
    'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3':
      KURK_UNFILTERED_CHANNEL_BHT
  },
  filtered: {
    'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.5 4.0 3 BP causal/929b9ff1814e740f6baffbf6c548b72bf412a65b94226072f2a2b8347f884886':
      KURK_FILTERED_CHANNEL_BEAM_DETECTION,
    'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af':
      KURK_FILTERED_CHANNEL_BHR_DETECTION,
    'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52':
      KURK_FILTERED_CHANNEL_BHT_DETECTION,
    'KURK.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/filter,0.4 3.5 3 BP causal/2f2e0f2674a5a0f3d87f94f534eabed2b2c4fb0482078583c5571fa80709b6d4':
      KURK_FILTERED_CHANNEL_BEAM_FK,
    'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,0.4 3.5 3 BP causal/242cef71e2982493eb1a6dd379dc32c69080b584924fe3ae1dbe418c8f53ffc9':
      KURK_FILTERED_CHANNEL_BHR_FK,
    'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,0.4 3.5 3 BP causal/e37e2ce84eee87883ef8a51fbbb7312fcb66e3b38c326b15fcb2cc797df071c4':
      KURK_FILTERED_CHANNEL_BHT_FK
  }
};

export const KURK_SIGNAL_DETECTION_RECORD = {
  '378de4ae-452a-4b78-9afd-9f7df5954ddc': SD_EVENT_ASSOCIATED_FK,
  'e63c1d7e-5eba-4c54-ac71-1cc71e90d4dc': SD_EVENT_ASSOCIATED_UNFILTERED,
  'e1bad5b3-fc51-498d-b305-c7d416aa65ab': SD_UNASSOCIATED_FK
};

export const ROTATED_STATE = {
  uiChannelSegments: KURK_UI_CHANNEL_SEGMENT_RECORD,
  channels: KURK_CHANNEL_RECORD,
  signalDetections: KURK_SIGNAL_DETECTION_RECORD,
  events: { 'd09bf415-44a3-365a-86c9-077ebb5e35c3': EVENT_ASSOCIATED_TO_SDS },
  filterDefinitionsForSignalDetections: {}
};

export const ROTATED_STATE_NO_SDS = {
  uiChannelSegments: KURK_UI_CHANNEL_SEGMENT_RECORD,
  channels: KURK_CHANNEL_RECORD,
  signalDetections: {},
  events: { 'd09bf415-44a3-365a-86c9-077ebb5e35c3': EVENT_ASSOCIATED_TO_SDS },
  filterDefinitionsForSignalDetections: {}
};

export const ROTATION_RESULTS_NOT_MATCHING_EVENT_OPEN = [
  {
    stationName: 'KURK',
    phase: 'S',
    rotatedChannel: {
      channelBandType: 'BROADBAND',
      canonicalName:
        'KURK.KURBB.BHR/rotate/steer,backaz_3.758deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
      channelOrientationCode: 'R',
      configuredInputs: [
        {
          name: 'KURK.KURBB.BH2',
          effectiveAt: 1713816000
        },
        {
          name: 'KURK.KURBB.BH1',
          effectiveAt: 1713795384.824
        }
      ],
      channelDataType: 'SEISMIC',
      description: 'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 3.758.',
      effectiveAt: 1713816000,
      effectiveForRequestTime: null,
      effectiveUntil: null,
      channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
      location: {
        latitudeDegrees: 50.62264,
        longitudeDegrees: 78.53039,
        depthKm: 0.042,
        elevationKm: 0.2004
      },
      name: 'KURK.KURBB.BHR/rotate/steer,backaz_3.758deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
      nominalSampleRateHz: 40,
      orientationAngles: {
        horizontalAngleDeg: 183.75845405007024,
        verticalAngleDeg: 90
      },
      channelOrientationType: 'RADIAL',
      processingDefinition: {
        phaseType: 'S',
        samplingType: 'NEAREST_SAMPLE',
        twoDimensional: true,
        location: {
          latitudeDegrees: 50.62264,
          longitudeDegrees: 78.53039,
          depthKm: 0.042,
          elevationKm: 0.2004
        },
        locationToleranceKm: 0.12,
        orientationAngles: {
          horizontalAngleDeg: 183.75845405007024,
          verticalAngleDeg: 90
        },
        orientationAngleToleranceDeg: 0.12,
        receiverToSourceAzimuthDeg: 3.7584540500702532,
        sampleRateHz: 40,
        sampleRateToleranceHz: 0.12
      },
      processingMetadata: {
        CHANNEL_GROUP: 'KURBB',
        STEERING_BACK_AZIMUTH: 3.7584540500702532
      },
      station: {
        name: 'KURK'
      },
      units: 'NANOMETERS'
    },
    rotatedUiChannelSegment: {
      channelSegmentDescriptor: {
        channel: {
          name: 'KURK.KURBB.BHR/rotate/steer,backaz_3.758deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
          effectiveAt: 1713816000
        },
        startTime: 1713961681.361,
        endTime: 1713961981.361,
        creationTime: 1713982747.701
      },
      channelSegment: {
        id: {
          channel: {
            name: 'KURK.KURBB.BHR/rotate/steer,backaz_3.758deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
            effectiveAt: 1713816000
          },
          startTime: 1713961681.361,
          endTime: 1713961981.361,
          creationTime: 1713982747.701
        },
        units: 'NANOMETERS',
        timeseriesType: 'WAVEFORM',
        timeseries: [
          {
            startTime: 1713961681.361,
            endTime: 1713961981.361,
            type: 'WAVEFORM',
            sampleCount: 12000,
            sampleRateHz: 40.00018518518519,
            _uiClaimCheckId:
              '{"domain":{"startTimeSecs":1713961681.361,"endTimeSecs":1713961981.361},"id":{"channel":{"name":"KURK.KURBB.BHR/rotate/steer,backaz_3.758deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713961681.361,"endTime":1713961981.361,"creationTime":1713982747.701},"type":"WAVEFORM","filter":"Unfiltered","waveform":{"type":"WAVEFORM","startTime":1713961681.361,"endTime":1713961981.361,"sampleCount":12000,"sampleRateHz":40.00018518518519}}'
          }
        ],
        maskedBy: [],
        missingInputChannels: [],
        _uiFilterDefinitionName: 'Unfiltered'
      },
      domainTimeRange: {
        startTimeSecs: 1713960000,
        endTimeSecs: 1713963600
      },
      isRotated: true,
      isFiltered: false,
      uiFilterName: 'Unfiltered'
    },
    filteredChannel: {
      channelBandType: 'BROADBAND',
      canonicalName:
        'KURK.KURBB.BHR/rotate/steer,backaz_3.758deg,phase_S/filter,2.0 5.0 3 BP causal/9b3b0e3fcc069007546539d6d656c95e408b0be3a1f639c6d8dd9a5a7f5b5709',
      channelOrientationCode: 'R',
      configuredInputs: [
        {
          effectiveAt: 1713816000,
          name: 'KURK.KURBB.BHR/rotate/steer,backaz_3.758deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3'
        }
      ],
      channelDataType: 'SEISMIC',
      description:
        'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 3.758. Filtered using a 2.0 5.0 3 BP causal filter.',
      effectiveAt: 1713816000,
      effectiveForRequestTime: null,
      effectiveUntil: null,
      channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
      location: {
        latitudeDegrees: 50.62264,
        longitudeDegrees: 78.53039,
        depthKm: 0.042,
        elevationKm: 0.2004
      },
      name: 'KURK.KURBB.BHR/rotate/steer,backaz_3.758deg,phase_S/filter,2.0 5.0 3 BP causal/9b3b0e3fcc069007546539d6d656c95e408b0be3a1f639c6d8dd9a5a7f5b5709',
      nominalSampleRateHz: 40,
      orientationAngles: {
        horizontalAngleDeg: 183.75845405007024,
        verticalAngleDeg: 90
      },
      channelOrientationType: 'RADIAL',
      processingDefinition: {
        comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
        filterDescription: {
          causal: true,
          comments: '2.0 5.0 3 BP causal',
          filterType: 'LINEAR',
          highFrequencyHz: 5,
          linearFilterType: 'IIR_BUTTERWORTH',
          lowFrequencyHz: 2,
          order: 3,
          parameters: {
            groupDelaySec: 'P0D',
            sampleRateHz: 40.00018518518519,
            sampleRateToleranceHz: 0.01,
            sosDenominatorCoefficients: [
              1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044, 0.8623084548971981,
              1, -1.2654002658879997, 0.7305963984206739
            ],
            sosNumeratorCoefficients: [
              0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
              -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
            ]
          },
          passBandType: 'BAND_PASS',
          zeroPhase: false
        },
        name: '2.0 5.0 3 BP causal'
      },
      processingMetadata: {
        CHANNEL_GROUP: 'KURBB',
        STEERING_BACK_AZIMUTH: 3.7584540500702532,
        FILTER_TYPE: 'LINEAR',
        FILTER_CAUSALITY: true
      },
      station: {
        name: 'KURK'
      },
      units: 'NANOMETERS'
    },
    filteredUiChannelSegment: {
      channelSegment: {
        id: {
          channel: {
            name: 'KURK.KURBB.BHR/rotate/steer,backaz_3.758deg,phase_S/filter,2.0 5.0 3 BP causal/9b3b0e3fcc069007546539d6d656c95e408b0be3a1f639c6d8dd9a5a7f5b5709',
            effectiveAt: 1713816000
          },
          startTime: 1713961681.361,
          endTime: 1713961981.361,
          creationTime: 1713982747.701
        },
        units: 'NANOMETERS',
        timeseriesType: 'WAVEFORM',
        timeseries: [
          {
            startTime: 1713961681.361,
            endTime: 1713961981.361,
            type: 'WAVEFORM',
            sampleCount: 12000,
            sampleRateHz: 40.00018518518519,
            _uiClaimCheckId:
              '{"domain":{"startTimeSecs":1713961681.361,"endTimeSecs":1713961981.361},"id":{"channel":{"name":"KURK.KURBB.BHR/rotate/steer,backaz_3.758deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713961681.361,"endTime":1713961981.361,"creationTime":1713982747.701},"type":"WAVEFORM","filter":"2.0 5.0 3 BP causal","waveform":{"type":"WAVEFORM","startTime":1713961681.361,"endTime":1713961981.361,"sampleCount":12000,"sampleRateHz":40.00018518518519}}'
          }
        ],
        maskedBy: [],
        missingInputChannels: [],
        _uiFilterDefinitionName: '2.0 5.0 3 BP causal',
        _uiConfiguredInput: {
          channel: {
            name: 'KURK.KURBB.BHR/rotate/steer,backaz_3.758deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
            effectiveAt: 1713816000
          },
          startTime: 1713961681.361,
          endTime: 1713961981.361,
          creationTime: 1713982747.701
        },
        _uiFiltersBySampleRate: {
          '40.00018518518519': {
            name: '2.0 5.0 3 BP causal',
            comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
            filterDescription: {
              comments: '2.0 5.0 3 BP causal',
              causal: true,
              filterType: 'LINEAR',
              linearFilterType: 'IIR_BUTTERWORTH',
              lowFrequencyHz: 2,
              highFrequencyHz: 5,
              order: 3,
              zeroPhase: false,
              passBandType: 'BAND_PASS',
              parameters: {
                sampleRateHz: 40.00018518518519,
                sampleRateToleranceHz: 0.01,
                groupDelaySec: 0,
                sosDenominatorCoefficients: [
                  1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044,
                  0.8623084548971981, 1, -1.2654002658879997, 0.7305963984206739
                ],
                sosNumeratorCoefficients: [
                  0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
                  -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
                ]
              }
            }
          }
        },
        channelName:
          'KURK.KURBB.BHR/rotate/steer,backaz_3.758deg,phase_S/filter,2.0 5.0 3 BP causal/9b3b0e3fcc069007546539d6d656c95e408b0be3a1f639c6d8dd9a5a7f5b5709'
      },
      channelSegmentDescriptor: {
        channel: {
          name: 'KURK.KURBB.BHR/rotate/steer,backaz_3.758deg,phase_S/filter,2.0 5.0 3 BP causal/9b3b0e3fcc069007546539d6d656c95e408b0be3a1f639c6d8dd9a5a7f5b5709',
          effectiveAt: 1713816000
        },
        startTime: 1713961681.361,
        endTime: 1713961981.361,
        creationTime: 1713982747.701
      },
      domainTimeRange: {
        startTimeSecs: 1713960000,
        endTimeSecs: 1713963600
      },
      isFiltered: true,
      uiFilterName: 'FK',
      isRotated: true
    }
  },
  {
    stationName: 'KURK',
    phase: 'S',
    rotatedChannel: {
      channelBandType: 'BROADBAND',
      canonicalName:
        'KURK.KURBB.BHT/rotate/steer,backaz_3.758deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
      channelOrientationCode: 'T',
      configuredInputs: [
        {
          name: 'KURK.KURBB.BH2',
          effectiveAt: 1713816000
        },
        {
          name: 'KURK.KURBB.BH1',
          effectiveAt: 1713795384.824
        }
      ],
      channelDataType: 'SEISMIC',
      description: 'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 3.758.',
      effectiveAt: 1713816000,
      effectiveForRequestTime: null,
      effectiveUntil: null,
      channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
      location: {
        latitudeDegrees: 50.62264,
        longitudeDegrees: 78.53039,
        depthKm: 0.042,
        elevationKm: 0.2004
      },
      name: 'KURK.KURBB.BHT/rotate/steer,backaz_3.758deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
      nominalSampleRateHz: 40,
      orientationAngles: {
        horizontalAngleDeg: 273.75845405007027,
        verticalAngleDeg: 90
      },
      channelOrientationType: 'TRANSVERSE',
      processingDefinition: {
        phaseType: 'S',
        samplingType: 'NEAREST_SAMPLE',
        twoDimensional: true,
        location: {
          latitudeDegrees: 50.62264,
          longitudeDegrees: 78.53039,
          depthKm: 0.042,
          elevationKm: 0.2004
        },
        locationToleranceKm: 0.12,
        orientationAngles: {
          horizontalAngleDeg: 273.75845405007027,
          verticalAngleDeg: 90
        },
        orientationAngleToleranceDeg: 0.12,
        receiverToSourceAzimuthDeg: 3.7584540500702532,
        sampleRateHz: 40,
        sampleRateToleranceHz: 0.12
      },
      processingMetadata: {
        CHANNEL_GROUP: 'KURBB',
        STEERING_BACK_AZIMUTH: 3.7584540500702532
      },
      station: {
        name: 'KURK'
      },
      units: 'NANOMETERS'
    },
    rotatedUiChannelSegment: {
      channelSegmentDescriptor: {
        channel: {
          name: 'KURK.KURBB.BHT/rotate/steer,backaz_3.758deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
          effectiveAt: 1713816000
        },
        startTime: 1713961681.361,
        endTime: 1713961981.361,
        creationTime: 1713982747.701
      },
      channelSegment: {
        id: {
          channel: {
            name: 'KURK.KURBB.BHT/rotate/steer,backaz_3.758deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
            effectiveAt: 1713816000
          },
          startTime: 1713961681.361,
          endTime: 1713961981.361,
          creationTime: 1713982747.701
        },
        units: 'NANOMETERS',
        timeseriesType: 'WAVEFORM',
        timeseries: [
          {
            startTime: 1713961681.361,
            endTime: 1713961981.361,
            type: 'WAVEFORM',
            sampleCount: 12000,
            sampleRateHz: 40.00018518518519,
            _uiClaimCheckId:
              '{"domain":{"startTimeSecs":1713961681.361,"endTimeSecs":1713961981.361},"id":{"channel":{"name":"KURK.KURBB.BHT/rotate/steer,backaz_3.758deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713961681.361,"endTime":1713961981.361,"creationTime":1713982747.701},"type":"WAVEFORM","filter":"Unfiltered","waveform":{"type":"WAVEFORM","startTime":1713961681.361,"endTime":1713961981.361,"sampleCount":12000,"sampleRateHz":40.00018518518519}}'
          }
        ],
        maskedBy: [],
        missingInputChannels: [],
        _uiFilterDefinitionName: 'Unfiltered'
      },
      domainTimeRange: {
        startTimeSecs: 1713960000,
        endTimeSecs: 1713963600
      },
      isRotated: true,
      isFiltered: false,
      uiFilterName: 'Unfiltered'
    },
    filteredChannel: {
      channelBandType: 'BROADBAND',
      canonicalName:
        'KURK.KURBB.BHT/rotate/steer,backaz_3.758deg,phase_S/filter,2.0 5.0 3 BP causal/6948a6ccfa48c88008d1d2da477a89b40e554d41509c81b139b5c499923f8e5b',
      channelOrientationCode: 'T',
      configuredInputs: [
        {
          effectiveAt: 1713816000,
          name: 'KURK.KURBB.BHT/rotate/steer,backaz_3.758deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3'
        }
      ],
      channelDataType: 'SEISMIC',
      description:
        'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 3.758. Filtered using a 2.0 5.0 3 BP causal filter.',
      effectiveAt: 1713816000,
      effectiveForRequestTime: null,
      effectiveUntil: null,
      channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
      location: {
        latitudeDegrees: 50.62264,
        longitudeDegrees: 78.53039,
        depthKm: 0.042,
        elevationKm: 0.2004
      },
      name: 'KURK.KURBB.BHT/rotate/steer,backaz_3.758deg,phase_S/filter,2.0 5.0 3 BP causal/6948a6ccfa48c88008d1d2da477a89b40e554d41509c81b139b5c499923f8e5b',
      nominalSampleRateHz: 40,
      orientationAngles: {
        horizontalAngleDeg: 273.75845405007027,
        verticalAngleDeg: 90
      },
      channelOrientationType: 'TRANSVERSE',
      processingDefinition: {
        comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
        filterDescription: {
          causal: true,
          comments: '2.0 5.0 3 BP causal',
          filterType: 'LINEAR',
          highFrequencyHz: 5,
          linearFilterType: 'IIR_BUTTERWORTH',
          lowFrequencyHz: 2,
          order: 3,
          parameters: {
            groupDelaySec: 'P0D',
            sampleRateHz: 40.00018518518519,
            sampleRateToleranceHz: 0.01,
            sosDenominatorCoefficients: [
              1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044, 0.8623084548971981,
              1, -1.2654002658879997, 0.7305963984206739
            ],
            sosNumeratorCoefficients: [
              0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
              -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
            ]
          },
          passBandType: 'BAND_PASS',
          zeroPhase: false
        },
        name: '2.0 5.0 3 BP causal'
      },
      processingMetadata: {
        CHANNEL_GROUP: 'KURBB',
        STEERING_BACK_AZIMUTH: 3.7584540500702532,
        FILTER_TYPE: 'LINEAR',
        FILTER_CAUSALITY: true
      },
      station: {
        name: 'KURK'
      },
      units: 'NANOMETERS'
    },
    filteredUiChannelSegment: {
      channelSegment: {
        id: {
          channel: {
            name: 'KURK.KURBB.BHT/rotate/steer,backaz_3.758deg,phase_S/filter,2.0 5.0 3 BP causal/6948a6ccfa48c88008d1d2da477a89b40e554d41509c81b139b5c499923f8e5b',
            effectiveAt: 1713816000
          },
          startTime: 1713961681.361,
          endTime: 1713961981.361,
          creationTime: 1713982747.701
        },
        units: 'NANOMETERS',
        timeseriesType: 'WAVEFORM',
        timeseries: [
          {
            startTime: 1713961681.361,
            endTime: 1713961981.361,
            type: 'WAVEFORM',
            sampleCount: 12000,
            sampleRateHz: 40.00018518518519,
            _uiClaimCheckId:
              '{"domain":{"startTimeSecs":1713961681.361,"endTimeSecs":1713961981.361},"id":{"channel":{"name":"KURK.KURBB.BHT/rotate/steer,backaz_3.758deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713961681.361,"endTime":1713961981.361,"creationTime":1713982747.701},"type":"WAVEFORM","filter":"2.0 5.0 3 BP causal","waveform":{"type":"WAVEFORM","startTime":1713961681.361,"endTime":1713961981.361,"sampleCount":12000,"sampleRateHz":40.00018518518519}}'
          }
        ],
        maskedBy: [],
        missingInputChannels: [],
        _uiFilterDefinitionName: '2.0 5.0 3 BP causal',
        _uiConfiguredInput: {
          channel: {
            name: 'KURK.KURBB.BHT/rotate/steer,backaz_3.758deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
            effectiveAt: 1713816000
          },
          startTime: 1713961681.361,
          endTime: 1713961981.361,
          creationTime: 1713982747.701
        },
        _uiFiltersBySampleRate: {
          '40.00018518518519': {
            name: '2.0 5.0 3 BP causal',
            comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
            filterDescription: {
              comments: '2.0 5.0 3 BP causal',
              causal: true,
              filterType: 'LINEAR',
              linearFilterType: 'IIR_BUTTERWORTH',
              lowFrequencyHz: 2,
              highFrequencyHz: 5,
              order: 3,
              zeroPhase: false,
              passBandType: 'BAND_PASS',
              parameters: {
                sampleRateHz: 40.00018518518519,
                sampleRateToleranceHz: 0.01,
                groupDelaySec: 0,
                sosDenominatorCoefficients: [
                  1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044,
                  0.8623084548971981, 1, -1.2654002658879997, 0.7305963984206739
                ],
                sosNumeratorCoefficients: [
                  0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
                  -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
                ]
              }
            }
          }
        },
        channelName:
          'KURK.KURBB.BHT/rotate/steer,backaz_3.758deg,phase_S/filter,2.0 5.0 3 BP causal/6948a6ccfa48c88008d1d2da477a89b40e554d41509c81b139b5c499923f8e5b'
      },
      channelSegmentDescriptor: {
        channel: {
          name: 'KURK.KURBB.BHT/rotate/steer,backaz_3.758deg,phase_S/filter,2.0 5.0 3 BP causal/6948a6ccfa48c88008d1d2da477a89b40e554d41509c81b139b5c499923f8e5b',
          effectiveAt: 1713816000
        },
        startTime: 1713961681.361,
        endTime: 1713961981.361,
        creationTime: 1713982747.701
      },
      domainTimeRange: {
        startTimeSecs: 1713960000,
        endTimeSecs: 1713963600
      },
      isFiltered: true,
      uiFilterName: 'FK',
      isRotated: true
    }
  }
];

export const ROTATION_RESULTS_MATCHING_FULL_DURATION = [
  {
    stationName: 'KURK',
    phase: 'S',
    rotatedChannel: {
      channelBandType: 'BROADBAND',
      canonicalName:
        'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
      channelOrientationCode: 'R',
      configuredInputs: [
        {
          name: 'KURK.KURBB.BH2',
          effectiveAt: 1713816000
        },
        {
          name: 'KURK.KURBB.BH1',
          effectiveAt: 1713795384.824
        }
      ],
      channelDataType: 'SEISMIC',
      description: 'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086.',
      effectiveAt: 1713816000,
      effectiveForRequestTime: null,
      effectiveUntil: null,
      channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
      location: {
        latitudeDegrees: 50.62264,
        longitudeDegrees: 78.53039,
        depthKm: 0.042,
        elevationKm: 0.2004
      },
      name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
      nominalSampleRateHz: 40,
      orientationAngles: {
        horizontalAngleDeg: 441.08642783670933,
        verticalAngleDeg: 90
      },
      channelOrientationType: 'RADIAL',
      processingDefinition: {
        phaseType: 'S',
        samplingType: 'Nearest sample',
        twoDimensional: true,
        location: {
          latitudeDegrees: 50.62264,
          longitudeDegrees: 78.53039,
          depthKm: 0.042,
          elevationKm: 0.2004
        },
        locationToleranceKm: 0.12,
        orientationAngles: {
          horizontalAngleDeg: 441.08642783670933,
          verticalAngleDeg: 90
        },
        orientationAngleToleranceDeg: 0.12,
        receiverToSourceAzimuthDeg: 261.08642783670933,
        sampleRateHz: 40,
        sampleRateToleranceHz: 0.12
      },
      processingMetadata: {
        CHANNEL_GROUP: 'KURBB',
        STEERING_BACK_AZIMUTH: 261.08642783670933
      },
      station: {
        name: 'KURK'
      },
      units: 'NANOMETERS'
    },
    rotatedUiChannelSegment: {
      channelSegmentDescriptor: {
        channel: {
          name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
          effectiveAt: 1713816000
        },
        startTime: 1713959100,
        endTime: 1713964500,
        creationTime: 1713983114.893
      },
      channelSegment: {
        id: {
          channel: {
            name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
            effectiveAt: 1713816000
          },
          startTime: 1713959100,
          endTime: 1713964500,
          creationTime: 1713983114.893
        },
        units: 'NANOMETERS',
        timeseriesType: 'WAVEFORM',
        timeseries: [
          {
            startTime: 1713959100,
            endTime: 1713964500,
            type: 'WAVEFORM',
            sampleCount: 216001,
            sampleRateHz: 40.00018518518519,
            _uiClaimCheckId:
              '{"domain":{"startTimeSecs":1713959100,"endTimeSecs":1713964500},"id":{"channel":{"name":"KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713959100,"endTime":1713964500,"creationTime":1713983114.893},"type":"WAVEFORM","filter":"Unfiltered","waveform":{"type":"WAVEFORM","startTime":1713959100,"endTime":1713964500,"sampleCount":216001,"sampleRateHz":40.00018518518519}}'
          }
        ],
        maskedBy: [],
        missingInputChannels: [],
        _uiFilterDefinitionName: 'Unfiltered'
      },
      domainTimeRange: {
        startTimeSecs: 1713960000,
        endTimeSecs: 1713963600
      },
      isRotated: true,
      isFiltered: false,
      uiFilterName: 'Unfiltered'
    },
    filteredChannel: {
      channelBandType: 'BROADBAND',
      canonicalName:
        'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
      channelOrientationCode: 'R',
      configuredInputs: [
        {
          effectiveAt: 1713816000,
          name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3'
        }
      ],
      channelDataType: 'SEISMIC',
      description:
        'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086. Filtered using a 2.0 5.0 3 BP causal filter.',
      effectiveAt: 1713816000,
      effectiveForRequestTime: null,
      effectiveUntil: null,
      channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
      location: {
        latitudeDegrees: 50.62264,
        longitudeDegrees: 78.53039,
        depthKm: 0.042,
        elevationKm: 0.2004
      },
      name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
      nominalSampleRateHz: 40,
      orientationAngles: {
        horizontalAngleDeg: 441.08642783670933,
        verticalAngleDeg: 90
      },
      channelOrientationType: 'RADIAL',
      processingDefinition: {
        comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
        filterDescription: {
          causal: true,
          comments: '2.0 5.0 3 BP causal',
          filterType: 'LINEAR',
          highFrequencyHz: 5,
          linearFilterType: 'IIR_BUTTERWORTH',
          lowFrequencyHz: 2,
          order: 3,
          parameters: {
            groupDelaySec: 'P0D',
            sampleRateHz: 40.00018518518519,
            sampleRateToleranceHz: 0.01,
            sosDenominatorCoefficients: [
              1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044, 0.8623084548971981,
              1, -1.2654002658879997, 0.7305963984206739
            ],
            sosNumeratorCoefficients: [
              0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
              -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
            ]
          },
          passBandType: 'BAND_PASS',
          zeroPhase: false
        },
        name: '2.0 5.0 3 BP causal'
      },
      processingMetadata: {
        CHANNEL_GROUP: 'KURBB',
        STEERING_BACK_AZIMUTH: 261.08642783670933,
        FILTER_TYPE: 'LINEAR',
        FILTER_CAUSALITY: true
      },
      station: {
        name: 'KURK'
      },
      units: 'NANOMETERS'
    },
    filteredUiChannelSegment: {
      channelSegment: {
        id: {
          channel: {
            name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
            effectiveAt: 1713816000
          },
          startTime: 1713959100,
          endTime: 1713964500,
          creationTime: 1713983114.893
        },
        units: 'NANOMETERS',
        timeseriesType: 'WAVEFORM',
        timeseries: [
          {
            startTime: 1713959100,
            endTime: 1713964500,
            type: 'WAVEFORM',
            sampleCount: 216001,
            sampleRateHz: 40.00018518518519,
            _uiClaimCheckId:
              '{"domain":{"startTimeSecs":1713959100,"endTimeSecs":1713964500},"id":{"channel":{"name":"KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713959100,"endTime":1713964500,"creationTime":1713983114.893},"type":"WAVEFORM","filter":"2.0 5.0 3 BP causal","waveform":{"type":"WAVEFORM","startTime":1713959100,"endTime":1713964500,"sampleCount":216001,"sampleRateHz":40.00018518518519}}'
          }
        ],
        maskedBy: [],
        missingInputChannels: [],
        _uiFilterDefinitionName: '2.0 5.0 3 BP causal',
        _uiConfiguredInput: {
          channel: {
            name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
            effectiveAt: 1713816000
          },
          startTime: 1713959100,
          endTime: 1713964500,
          creationTime: 1713983114.893
        },
        _uiFiltersBySampleRate: {
          '40.00018518518519': {
            name: '2.0 5.0 3 BP causal',
            comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
            filterDescription: {
              comments: '2.0 5.0 3 BP causal',
              causal: true,
              filterType: 'LINEAR',
              linearFilterType: 'IIR_BUTTERWORTH',
              lowFrequencyHz: 2,
              highFrequencyHz: 5,
              order: 3,
              zeroPhase: false,
              passBandType: 'BAND_PASS',
              parameters: {
                sampleRateHz: 40.00018518518519,
                sampleRateToleranceHz: 0.01,
                groupDelaySec: 0,
                sosDenominatorCoefficients: [
                  1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044,
                  0.8623084548971981, 1, -1.2654002658879997, 0.7305963984206739
                ],
                sosNumeratorCoefficients: [
                  0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
                  -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
                ]
              }
            }
          }
        },
        channelName:
          'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af'
      },
      channelSegmentDescriptor: {
        channel: {
          name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
          effectiveAt: 1713816000
        },
        startTime: 1713959100,
        endTime: 1713964500,
        creationTime: 1713983114.893
      },
      domainTimeRange: {
        startTimeSecs: 1713960000,
        endTimeSecs: 1713963600
      },
      isFiltered: true,
      uiFilterName: 'FK',
      isRotated: true
    }
  },
  {
    stationName: 'KURK',
    phase: 'S',
    rotatedChannel: {
      channelBandType: 'BROADBAND',
      canonicalName:
        'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
      channelOrientationCode: 'T',
      configuredInputs: [
        {
          name: 'KURK.KURBB.BH2',
          effectiveAt: 1713816000
        },
        {
          name: 'KURK.KURBB.BH1',
          effectiveAt: 1713795384.824
        }
      ],
      channelDataType: 'SEISMIC',
      description: 'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086.',
      effectiveAt: 1713816000,
      effectiveForRequestTime: null,
      effectiveUntil: null,
      channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
      location: {
        latitudeDegrees: 50.62264,
        longitudeDegrees: 78.53039,
        depthKm: 0.042,
        elevationKm: 0.2004
      },
      name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
      nominalSampleRateHz: 40,
      orientationAngles: {
        horizontalAngleDeg: 531.0864278367094,
        verticalAngleDeg: 90
      },
      channelOrientationType: 'TRANSVERSE',
      processingDefinition: {
        phaseType: 'S',
        samplingType: 'Nearest sample',
        twoDimensional: true,
        location: {
          latitudeDegrees: 50.62264,
          longitudeDegrees: 78.53039,
          depthKm: 0.042,
          elevationKm: 0.2004
        },
        locationToleranceKm: 0.12,
        orientationAngles: {
          horizontalAngleDeg: 531.0864278367094,
          verticalAngleDeg: 90
        },
        orientationAngleToleranceDeg: 0.12,
        receiverToSourceAzimuthDeg: 261.08642783670933,
        sampleRateHz: 40,
        sampleRateToleranceHz: 0.12
      },
      processingMetadata: {
        CHANNEL_GROUP: 'KURBB',
        STEERING_BACK_AZIMUTH: 261.08642783670933
      },
      station: {
        name: 'KURK'
      },
      units: 'NANOMETERS'
    },
    rotatedUiChannelSegment: {
      channelSegmentDescriptor: {
        channel: {
          name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
          effectiveAt: 1713816000
        },
        startTime: 1713959100,
        endTime: 1713964500,
        creationTime: 1713983114.893
      },
      channelSegment: {
        id: {
          channel: {
            name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
            effectiveAt: 1713816000
          },
          startTime: 1713959100,
          endTime: 1713964500,
          creationTime: 1713983114.893
        },
        units: 'NANOMETERS',
        timeseriesType: 'WAVEFORM',
        timeseries: [
          {
            startTime: 1713959100,
            endTime: 1713964500,
            type: 'WAVEFORM',
            sampleCount: 216001,
            sampleRateHz: 40.00018518518519,
            _uiClaimCheckId:
              '{"domain":{"startTimeSecs":1713959100,"endTimeSecs":1713964500},"id":{"channel":{"name":"KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713959100,"endTime":1713964500,"creationTime":1713983114.893},"type":"WAVEFORM","filter":"Unfiltered","waveform":{"type":"WAVEFORM","startTime":1713959100,"endTime":1713964500,"sampleCount":216001,"sampleRateHz":40.00018518518519}}'
          }
        ],
        maskedBy: [],
        missingInputChannels: [],
        _uiFilterDefinitionName: 'Unfiltered'
      },
      domainTimeRange: {
        startTimeSecs: 1713960000,
        endTimeSecs: 1713963600
      },
      isRotated: true,
      isFiltered: false,
      uiFilterName: 'Unfiltered'
    },
    filteredChannel: {
      channelBandType: 'BROADBAND',
      canonicalName:
        'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52',
      channelOrientationCode: 'T',
      configuredInputs: [
        {
          effectiveAt: 1713816000,
          name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3'
        }
      ],
      channelDataType: 'SEISMIC',
      description:
        'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086. Filtered using a 2.0 5.0 3 BP causal filter.',
      effectiveAt: 1713816000,
      effectiveForRequestTime: null,
      effectiveUntil: null,
      channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
      location: {
        latitudeDegrees: 50.62264,
        longitudeDegrees: 78.53039,
        depthKm: 0.042,
        elevationKm: 0.2004
      },
      name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52',
      nominalSampleRateHz: 40,
      orientationAngles: {
        horizontalAngleDeg: 531.0864278367094,
        verticalAngleDeg: 90
      },
      channelOrientationType: 'TRANSVERSE',
      processingDefinition: {
        comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
        filterDescription: {
          causal: true,
          comments: '2.0 5.0 3 BP causal',
          filterType: 'LINEAR',
          highFrequencyHz: 5,
          linearFilterType: 'IIR_BUTTERWORTH',
          lowFrequencyHz: 2,
          order: 3,
          parameters: {
            groupDelaySec: 'P0D',
            sampleRateHz: 40.00018518518519,
            sampleRateToleranceHz: 0.01,
            sosDenominatorCoefficients: [
              1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044, 0.8623084548971981,
              1, -1.2654002658879997, 0.7305963984206739
            ],
            sosNumeratorCoefficients: [
              0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
              -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
            ]
          },
          passBandType: 'BAND_PASS',
          zeroPhase: false
        },
        name: '2.0 5.0 3 BP causal'
      },
      processingMetadata: {
        CHANNEL_GROUP: 'KURBB',
        STEERING_BACK_AZIMUTH: 261.08642783670933,
        FILTER_TYPE: 'LINEAR',
        FILTER_CAUSALITY: true
      },
      station: {
        name: 'KURK'
      },
      units: 'NANOMETERS'
    },
    filteredUiChannelSegment: {
      channelSegment: {
        id: {
          channel: {
            name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52',
            effectiveAt: 1713816000
          },
          startTime: 1713959100,
          endTime: 1713964500,
          creationTime: 1713983114.893
        },
        units: 'NANOMETERS',
        timeseriesType: 'WAVEFORM',
        timeseries: [
          {
            startTime: 1713959100,
            endTime: 1713964500,
            type: 'WAVEFORM',
            sampleCount: 216001,
            sampleRateHz: 40.00018518518519,
            _uiClaimCheckId:
              '{"domain":{"startTimeSecs":1713959100,"endTimeSecs":1713964500},"id":{"channel":{"name":"KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713959100,"endTime":1713964500,"creationTime":1713983114.893},"type":"WAVEFORM","filter":"2.0 5.0 3 BP causal","waveform":{"type":"WAVEFORM","startTime":1713959100,"endTime":1713964500,"sampleCount":216001,"sampleRateHz":40.00018518518519}}'
          }
        ],
        maskedBy: [],
        missingInputChannels: [],
        _uiFilterDefinitionName: '2.0 5.0 3 BP causal',
        _uiConfiguredInput: {
          channel: {
            name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
            effectiveAt: 1713816000
          },
          startTime: 1713959100,
          endTime: 1713964500,
          creationTime: 1713983114.893
        },
        _uiFiltersBySampleRate: {
          '40.00018518518519': {
            name: '2.0 5.0 3 BP causal',
            comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
            filterDescription: {
              comments: '2.0 5.0 3 BP causal',
              causal: true,
              filterType: 'LINEAR',
              linearFilterType: 'IIR_BUTTERWORTH',
              lowFrequencyHz: 2,
              highFrequencyHz: 5,
              order: 3,
              zeroPhase: false,
              passBandType: 'BAND_PASS',
              parameters: {
                sampleRateHz: 40.00018518518519,
                sampleRateToleranceHz: 0.01,
                groupDelaySec: 0,
                sosDenominatorCoefficients: [
                  1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044,
                  0.8623084548971981, 1, -1.2654002658879997, 0.7305963984206739
                ],
                sosNumeratorCoefficients: [
                  0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
                  -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
                ]
              }
            }
          }
        },
        channelName:
          'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52'
      },
      channelSegmentDescriptor: {
        channel: {
          name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52',
          effectiveAt: 1713816000
        },
        startTime: 1713959100,
        endTime: 1713964500,
        creationTime: 1713983114.893
      },
      domainTimeRange: {
        startTimeSecs: 1713960000,
        endTimeSecs: 1713963600
      },
      isFiltered: true,
      uiFilterName: 'FK',
      isRotated: true
    }
  }
];

export const ROTATION_RESULTS_MATCHING_SHORT_DURATION = [
  {
    stationName: 'KURK',
    phase: 'S',
    rotatedChannel: {
      channelBandType: 'BROADBAND',
      canonicalName:
        'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
      channelOrientationCode: 'R',
      configuredInputs: [
        {
          name: 'KURK.KURBB.BH2',
          effectiveAt: 1713816000
        },
        {
          name: 'KURK.KURBB.BH1',
          effectiveAt: 1713795384.824
        }
      ],
      channelDataType: 'SEISMIC',
      description: 'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086.',
      effectiveAt: 1713816000,
      effectiveForRequestTime: null,
      effectiveUntil: null,
      channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
      location: {
        latitudeDegrees: 50.62264,
        longitudeDegrees: 78.53039,
        depthKm: 0.042,
        elevationKm: 0.2004
      },
      name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
      nominalSampleRateHz: 40,
      orientationAngles: {
        horizontalAngleDeg: 441.08642783670933,
        verticalAngleDeg: 90
      },
      channelOrientationType: 'RADIAL',
      processingDefinition: {
        phaseType: 'S',
        samplingType: 'Nearest sample',
        twoDimensional: true,
        location: {
          latitudeDegrees: 50.62264,
          longitudeDegrees: 78.53039,
          depthKm: 0.042,
          elevationKm: 0.2004
        },
        locationToleranceKm: 0.12,
        orientationAngles: {
          horizontalAngleDeg: 441.08642783670933,
          verticalAngleDeg: 90
        },
        orientationAngleToleranceDeg: 0.12,
        receiverToSourceAzimuthDeg: 261.08642783670933,
        sampleRateHz: 40,
        sampleRateToleranceHz: 0.12
      },
      processingMetadata: {
        CHANNEL_GROUP: 'KURBB',
        STEERING_BACK_AZIMUTH: 261.08642783670933
      },
      station: {
        name: 'KURK'
      },
      units: 'NANOMETERS'
    },
    rotatedUiChannelSegment: {
      channelSegmentDescriptor: {
        channel: {
          name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
          effectiveAt: 1713816000
        },
        startTime: 1713959100,
        endTime: 1713962100,
        creationTime: 1713983222.646
      },
      channelSegment: {
        id: {
          channel: {
            name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
            effectiveAt: 1713816000
          },
          startTime: 1713959100,
          endTime: 1713962100,
          creationTime: 1713983222.646
        },
        units: 'NANOMETERS',
        timeseriesType: 'WAVEFORM',
        timeseries: [
          {
            startTime: 1713959100,
            endTime: 1713962100,
            type: 'WAVEFORM',
            sampleCount: 120000,
            sampleRateHz: 40.00018518518519,
            _uiClaimCheckId:
              '{"domain":{"startTimeSecs":1713959100,"endTimeSecs":1713962100},"id":{"channel":{"name":"KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713959100,"endTime":1713962100,"creationTime":1713983222.646},"type":"WAVEFORM","filter":"Unfiltered","waveform":{"type":"WAVEFORM","startTime":1713959100,"endTime":1713962100,"sampleCount":120000,"sampleRateHz":40.00018518518519}}'
          }
        ],
        maskedBy: [],
        missingInputChannels: [],
        _uiFilterDefinitionName: 'Unfiltered'
      },
      domainTimeRange: {
        startTimeSecs: 1713960000,
        endTimeSecs: 1713963600
      },
      isRotated: true,
      isFiltered: false,
      uiFilterName: 'Unfiltered'
    },
    filteredChannel: {
      channelBandType: 'BROADBAND',
      canonicalName:
        'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
      channelOrientationCode: 'R',
      configuredInputs: [
        {
          effectiveAt: 1713816000,
          name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3'
        }
      ],
      channelDataType: 'SEISMIC',
      description:
        'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086. Filtered using a 2.0 5.0 3 BP causal filter.',
      effectiveAt: 1713816000,
      effectiveForRequestTime: null,
      effectiveUntil: null,
      channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
      location: {
        latitudeDegrees: 50.62264,
        longitudeDegrees: 78.53039,
        depthKm: 0.042,
        elevationKm: 0.2004
      },
      name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
      nominalSampleRateHz: 40,
      orientationAngles: {
        horizontalAngleDeg: 441.08642783670933,
        verticalAngleDeg: 90
      },
      channelOrientationType: 'RADIAL',
      processingDefinition: {
        comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
        filterDescription: {
          causal: true,
          comments: '2.0 5.0 3 BP causal',
          filterType: 'LINEAR',
          highFrequencyHz: 5,
          linearFilterType: 'IIR_BUTTERWORTH',
          lowFrequencyHz: 2,
          order: 3,
          parameters: {
            groupDelaySec: 'P0D',
            sampleRateHz: 40.00018518518519,
            sampleRateToleranceHz: 0.01,
            sosDenominatorCoefficients: [
              1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044, 0.8623084548971981,
              1, -1.2654002658879997, 0.7305963984206739
            ],
            sosNumeratorCoefficients: [
              0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
              -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
            ]
          },
          passBandType: 'BAND_PASS',
          zeroPhase: false
        },
        name: '2.0 5.0 3 BP causal'
      },
      processingMetadata: {
        CHANNEL_GROUP: 'KURBB',
        STEERING_BACK_AZIMUTH: 261.08642783670933,
        FILTER_TYPE: 'LINEAR',
        FILTER_CAUSALITY: true
      },
      station: {
        name: 'KURK'
      },
      units: 'NANOMETERS'
    },
    filteredUiChannelSegment: {
      channelSegment: {
        id: {
          channel: {
            name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
            effectiveAt: 1713816000
          },
          startTime: 1713959100,
          endTime: 1713962100,
          creationTime: 1713983222.646
        },
        units: 'NANOMETERS',
        timeseriesType: 'WAVEFORM',
        timeseries: [
          {
            startTime: 1713959100,
            endTime: 1713962100,
            type: 'WAVEFORM',
            sampleCount: 120000,
            sampleRateHz: 40.00018518518519,
            _uiClaimCheckId:
              '{"domain":{"startTimeSecs":1713959100,"endTimeSecs":1713962100},"id":{"channel":{"name":"KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713959100,"endTime":1713962100,"creationTime":1713983222.646},"type":"WAVEFORM","filter":"2.0 5.0 3 BP causal","waveform":{"type":"WAVEFORM","startTime":1713959100,"endTime":1713962100,"sampleCount":120000,"sampleRateHz":40.00018518518519}}'
          }
        ],
        maskedBy: [],
        missingInputChannels: [],
        _uiFilterDefinitionName: '2.0 5.0 3 BP causal',
        _uiConfiguredInput: {
          channel: {
            name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
            effectiveAt: 1713816000
          },
          startTime: 1713959100,
          endTime: 1713962100,
          creationTime: 1713983222.646
        },
        _uiFiltersBySampleRate: {
          '40.00018518518519': {
            name: '2.0 5.0 3 BP causal',
            comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
            filterDescription: {
              comments: '2.0 5.0 3 BP causal',
              causal: true,
              filterType: 'LINEAR',
              linearFilterType: 'IIR_BUTTERWORTH',
              lowFrequencyHz: 2,
              highFrequencyHz: 5,
              order: 3,
              zeroPhase: false,
              passBandType: 'BAND_PASS',
              parameters: {
                sampleRateHz: 40.00018518518519,
                sampleRateToleranceHz: 0.01,
                groupDelaySec: 0,
                sosDenominatorCoefficients: [
                  1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044,
                  0.8623084548971981, 1, -1.2654002658879997, 0.7305963984206739
                ],
                sosNumeratorCoefficients: [
                  0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
                  -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
                ]
              }
            }
          }
        },
        channelName:
          'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af'
      },
      channelSegmentDescriptor: {
        channel: {
          name: 'KURK.KURBB.BHR/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/45b805232f4cd13255a9115163aaaad274555cc17c583d2d5249b1c45f5730af',
          effectiveAt: 1713816000
        },
        startTime: 1713959100,
        endTime: 1713962100,
        creationTime: 1713983222.646
      },
      domainTimeRange: {
        startTimeSecs: 1713960000,
        endTimeSecs: 1713963600
      },
      isFiltered: true,
      uiFilterName: 'FK',
      isRotated: true
    }
  },
  {
    stationName: 'KURK',
    phase: 'S',
    rotatedChannel: {
      channelBandType: 'BROADBAND',
      canonicalName:
        'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
      channelOrientationCode: 'T',
      configuredInputs: [
        {
          name: 'KURK.KURBB.BH2',
          effectiveAt: 1713816000
        },
        {
          name: 'KURK.KURBB.BH1',
          effectiveAt: 1713795384.824
        }
      ],
      channelDataType: 'SEISMIC',
      description: 'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086.',
      effectiveAt: 1713816000,
      effectiveForRequestTime: null,
      effectiveUntil: null,
      channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
      location: {
        latitudeDegrees: 50.62264,
        longitudeDegrees: 78.53039,
        depthKm: 0.042,
        elevationKm: 0.2004
      },
      name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
      nominalSampleRateHz: 40,
      orientationAngles: {
        horizontalAngleDeg: 531.0864278367094,
        verticalAngleDeg: 90
      },
      channelOrientationType: 'TRANSVERSE',
      processingDefinition: {
        phaseType: 'S',
        samplingType: 'Nearest sample',
        twoDimensional: true,
        location: {
          latitudeDegrees: 50.62264,
          longitudeDegrees: 78.53039,
          depthKm: 0.042,
          elevationKm: 0.2004
        },
        locationToleranceKm: 0.12,
        orientationAngles: {
          horizontalAngleDeg: 531.0864278367094,
          verticalAngleDeg: 90
        },
        orientationAngleToleranceDeg: 0.12,
        receiverToSourceAzimuthDeg: 261.08642783670933,
        sampleRateHz: 40,
        sampleRateToleranceHz: 0.12
      },
      processingMetadata: {
        CHANNEL_GROUP: 'KURBB',
        STEERING_BACK_AZIMUTH: 261.08642783670933
      },
      station: {
        name: 'KURK'
      },
      units: 'NANOMETERS'
    },
    rotatedUiChannelSegment: {
      channelSegmentDescriptor: {
        channel: {
          name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
          effectiveAt: 1713816000
        },
        startTime: 1713959100,
        endTime: 1713962100,
        creationTime: 1713983222.646
      },
      channelSegment: {
        id: {
          channel: {
            name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
            effectiveAt: 1713816000
          },
          startTime: 1713959100,
          endTime: 1713962100,
          creationTime: 1713983222.646
        },
        units: 'NANOMETERS',
        timeseriesType: 'WAVEFORM',
        timeseries: [
          {
            startTime: 1713959100,
            endTime: 1713962100,
            type: 'WAVEFORM',
            sampleCount: 120000,
            sampleRateHz: 40.00018518518519,
            _uiClaimCheckId:
              '{"domain":{"startTimeSecs":1713959100,"endTimeSecs":1713962100},"id":{"channel":{"name":"KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713959100,"endTime":1713962100,"creationTime":1713983222.646},"type":"WAVEFORM","filter":"Unfiltered","waveform":{"type":"WAVEFORM","startTime":1713959100,"endTime":1713962100,"sampleCount":120000,"sampleRateHz":40.00018518518519}}'
          }
        ],
        maskedBy: [],
        missingInputChannels: [],
        _uiFilterDefinitionName: 'Unfiltered'
      },
      domainTimeRange: {
        startTimeSecs: 1713960000,
        endTimeSecs: 1713963600
      },
      isRotated: true,
      isFiltered: false,
      uiFilterName: 'Unfiltered'
    },
    filteredChannel: {
      channelBandType: 'BROADBAND',
      canonicalName:
        'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52',
      channelOrientationCode: 'T',
      configuredInputs: [
        {
          effectiveAt: 1713816000,
          name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3'
        }
      ],
      channelDataType: 'SEISMIC',
      description:
        'KURK.KURBB.BH1,KURK.KURBB.BH2 Rotated to 261.086. Filtered using a 2.0 5.0 3 BP causal filter.',
      effectiveAt: 1713816000,
      effectiveForRequestTime: null,
      effectiveUntil: null,
      channelInstrumentType: 'HIGH_GAIN_SEISMOMETER',
      location: {
        latitudeDegrees: 50.62264,
        longitudeDegrees: 78.53039,
        depthKm: 0.042,
        elevationKm: 0.2004
      },
      name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52',
      nominalSampleRateHz: 40,
      orientationAngles: {
        horizontalAngleDeg: 531.0864278367094,
        verticalAngleDeg: 90
      },
      channelOrientationType: 'TRANSVERSE',
      processingDefinition: {
        comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
        filterDescription: {
          causal: true,
          comments: '2.0 5.0 3 BP causal',
          filterType: 'LINEAR',
          highFrequencyHz: 5,
          linearFilterType: 'IIR_BUTTERWORTH',
          lowFrequencyHz: 2,
          order: 3,
          parameters: {
            groupDelaySec: 'P0D',
            sampleRateHz: 40.00018518518519,
            sampleRateToleranceHz: 0.01,
            sosDenominatorCoefficients: [
              1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044, 0.8623084548971981,
              1, -1.2654002658879997, 0.7305963984206739
            ],
            sosNumeratorCoefficients: [
              0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
              -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
            ]
          },
          passBandType: 'BAND_PASS',
          zeroPhase: false
        },
        name: '2.0 5.0 3 BP causal'
      },
      processingMetadata: {
        CHANNEL_GROUP: 'KURBB',
        STEERING_BACK_AZIMUTH: 261.08642783670933,
        FILTER_TYPE: 'LINEAR',
        FILTER_CAUSALITY: true
      },
      station: {
        name: 'KURK'
      },
      units: 'NANOMETERS'
    },
    filteredUiChannelSegment: {
      channelSegment: {
        id: {
          channel: {
            name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52',
            effectiveAt: 1713816000
          },
          startTime: 1713959100,
          endTime: 1713962100,
          creationTime: 1713983222.646
        },
        units: 'NANOMETERS',
        timeseriesType: 'WAVEFORM',
        timeseries: [
          {
            startTime: 1713959100,
            endTime: 1713962100,
            type: 'WAVEFORM',
            sampleCount: 120000,
            sampleRateHz: 40.00018518518519,
            _uiClaimCheckId:
              '{"domain":{"startTimeSecs":1713959100,"endTimeSecs":1713962100},"id":{"channel":{"name":"KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3","effectiveAt":1713816000},"startTime":1713959100,"endTime":1713962100,"creationTime":1713983222.646},"type":"WAVEFORM","filter":"2.0 5.0 3 BP causal","waveform":{"type":"WAVEFORM","startTime":1713959100,"endTime":1713962100,"sampleCount":120000,"sampleRateHz":40.00018518518519}}'
          }
        ],
        maskedBy: [],
        missingInputChannels: [],
        _uiFilterDefinitionName: '2.0 5.0 3 BP causal',
        _uiConfiguredInput: {
          channel: {
            name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/74d9ab9529d5b04e699d58aed1ca7108ad893a24bee49e9c319c3f57109f8dd3',
            effectiveAt: 1713816000
          },
          startTime: 1713959100,
          endTime: 1713962100,
          creationTime: 1713983222.646
        },
        _uiFiltersBySampleRate: {
          '40.00018518518519': {
            name: '2.0 5.0 3 BP causal',
            comments: 'Butterworth IIR band-pass, 2.0-5.0 Hz, order 3, causal',
            filterDescription: {
              comments: '2.0 5.0 3 BP causal',
              causal: true,
              filterType: 'LINEAR',
              linearFilterType: 'IIR_BUTTERWORTH',
              lowFrequencyHz: 2,
              highFrequencyHz: 5,
              order: 3,
              zeroPhase: false,
              passBandType: 'BAND_PASS',
              parameters: {
                sampleRateHz: 40.00018518518519,
                sampleRateToleranceHz: 0.01,
                groupDelaySec: 0,
                sosDenominatorCoefficients: [
                  1, -1.414216713516788, 0.6128022885987889, 1, -1.761852021911044,
                  0.8623084548971981, 1, -1.2654002658879997, 0.7305963984206739
                ],
                sosNumeratorCoefficients: [
                  0.1935988557006055, 0, -0.1935988557006055, 0.23179019381611632, 0,
                  -0.23179019381611632, 0.19161476207701855, 0, -0.19161476207701855
                ]
              }
            }
          }
        },
        channelName:
          'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52'
      },
      channelSegmentDescriptor: {
        channel: {
          name: 'KURK.KURBB.BHT/rotate/steer,backaz_261.086deg,phase_S/filter,2.0 5.0 3 BP causal/b1f4ec2102a31d918bc7c14c5fbb8ebcd0c9352bb36a1055842f4410e8dbec52',
          effectiveAt: 1713816000
        },
        startTime: 1713959100,
        endTime: 1713962100,
        creationTime: 1713983222.646
      },
      domainTimeRange: {
        startTimeSecs: 1713960000,
        endTimeSecs: 1713963600
      },
      isFiltered: true,
      uiFilterName: 'FK',
      isRotated: true
    }
  }
];
