import { StationTypes } from '../../../../src/ts/common-model';
import type { VersionReference } from '../../../../src/ts/faceted';
import * as channelData from '../channel-definitions/channel-definitions-data';

export const pdar: StationTypes.Station = {
  name: 'PDAR',
  type: StationTypes.StationType.SEISMIC_ARRAY,
  effectiveUntil: 1660701599.984,
  effectiveAt: 1636503404,
  description: 'Pinedale,_Wyoming:_USA_array_element',
  relativePositionChannelPairs: [
    {
      channel: {
        name: 'PDAR.PD01.SHZ',
        effectiveAt: 0
      },
      relativePosition: {
        northDisplacementKm: 1.014,
        eastDisplacementKm: -2.066,
        verticalDisplacementKm: 0
      }
    },
    {
      channel: {
        name: 'PDAR.PD02.SHZ',
        effectiveAt: 0
      },
      relativePosition: {
        northDisplacementKm: 1.201,
        eastDisplacementKm: -0.688,
        verticalDisplacementKm: 0
      }
    },
    {
      channel: {
        name: 'PDAR.PD03.SHZ',
        effectiveAt: 0
      },
      relativePosition: {
        northDisplacementKm: 0.939,
        eastDisplacementKm: 0.688,
        verticalDisplacementKm: 0
      }
    },
    {
      channel: {
        name: 'PDAR.PD31.BHE',
        effectiveAt: 0
      },
      relativePosition: {
        northDisplacementKm: 0.0,
        eastDisplacementKm: 0.0,
        verticalDisplacementKm: 0
      }
    },
    {
      channel: {
        name: 'PDAR.PD31.BHN',
        effectiveAt: 0
      },
      relativePosition: {
        northDisplacementKm: 0.0,
        eastDisplacementKm: 0.0,
        verticalDisplacementKm: 0
      }
    }
  ],
  location: {
    latitudeDegrees: 42.76738,
    longitudeDegrees: -109.5579,
    depthKm: 0,
    elevationKm: 2.215
  },
  channelGroups: [
    channelData.pdarPD01ChannelGroup,
    channelData.pdarPD02ChannelGroup,
    channelData.pdarPD03ChannelGroup,
    channelData.pdarPD31ChannelGroup
  ],
  allRawChannels: [
    channelData.pdarPD01Channel,
    channelData.pdarPD02Channel,
    channelData.pdarPD03Channel
  ]
};

export const akasg: StationTypes.Station = {
  name: 'AKASG',
  effectiveUntil: 1660701599.984,
  effectiveAt: 1636503404,
  type: StationTypes.StationType.SEISMIC_3_COMPONENT,
  description: 'AKASG,_Tajikistan',
  relativePositionChannelPairs: [
    {
      channel: {
        name: 'AKASG.AKASG.HHZ',
        effectiveAt: 0
      },
      relativePosition: { northDisplacementKm: 0, eastDisplacementKm: 0, verticalDisplacementKm: 0 }
    },
    {
      channel: {
        name: 'AKASG.AKASG.HHN',
        effectiveAt: 0
      },
      relativePosition: {
        northDisplacementKm: 0,
        eastDisplacementKm: 0,
        verticalDisplacementKm: 0
      }
    },
    {
      channel: {
        name: 'AKASG.AKASG.HHE',
        effectiveAt: 0
      },
      relativePosition: {
        northDisplacementKm: 0,
        eastDisplacementKm: 0,
        verticalDisplacementKm: 0
      }
    }
  ],
  location: {
    latitudeDegrees: 37.53,
    longitudeDegrees: 71.66,
    depthKm: 0,
    elevationKm: 2.312
  },
  channelGroups: [channelData.akasgChannelGroup],
  allRawChannels: [
    channelData.akasgBHEChannel,
    channelData.akasgBHNChannel,
    channelData.akasgBHZChannel
  ]
};

export const asar: StationTypes.Station = {
  name: 'ASAR',
  effectiveUntil: 1660701599.984,
  effectiveAt: 1636503404,
  type: StationTypes.StationType.SEISMIC_3_COMPONENT,
  description: 'ASAR',
  relativePositionChannelPairs: [
    {
      channel: {
        name: 'ASAR.AS01.SHZ',
        effectiveAt: 0
      },
      relativePosition: { northDisplacementKm: 0, eastDisplacementKm: 0, verticalDisplacementKm: 0 }
    },
    {
      channel: {
        name: 'ASAR.AS02.SHZ',
        effectiveAt: 0
      },
      relativePosition: {
        northDisplacementKm: 0,
        eastDisplacementKm: 0,
        verticalDisplacementKm: 0
      }
    },
    {
      channel: {
        name: 'ASAR.AS03.SHZ',
        effectiveAt: 0
      },
      relativePosition: {
        northDisplacementKm: 0,
        eastDisplacementKm: 0,
        verticalDisplacementKm: 0
      }
    }
  ],
  location: {
    latitudeDegrees: 37.53,
    longitudeDegrees: 71.66,
    depthKm: 0,
    elevationKm: 2.312
  },
  channelGroups: [channelData.asarChannelGroup],
  allRawChannels: [
    channelData.asarAS01Channel,
    channelData.asarAS02Channel,
    channelData.asarAS03Channel
  ]
};

export const pdarVersionReference: VersionReference<'name'> = {
  name: pdar.name,
  effectiveAt: pdar.effectiveAt || 0
};

export const akasgVersionReference: VersionReference<'name'> = {
  name: akasg.name,
  effectiveAt: akasg.effectiveAt || 0
};

export const asarVersionReference: VersionReference<'name'> = {
  name: asar.name,
  effectiveAt: asar.effectiveAt || 0
};

export const defaultStations: StationTypes.Station[] = [pdar, akasg, asar];
