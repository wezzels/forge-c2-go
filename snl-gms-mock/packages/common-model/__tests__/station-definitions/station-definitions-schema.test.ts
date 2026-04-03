import type { EntityReference, VersionReference } from '../../src/ts/faceted';
import type {
  Channel,
  ChannelGroup,
  OrientationAngles,
  RelativePosition
} from '../../src/ts/station-definitions/channel-definitions';
import {
  channelEntityReferenceSchema,
  channelGroupSchema,
  channelIdentifierSchema,
  channelSchema,
  channelVersionReferenceSchema,
  orientationAnglesSchema,
  relativePositionSchema,
  stationEntityReferenceSchema,
  stationIdentifierSchema,
  stationSchema,
  stationVersionReferenceSchema
} from '../../src/ts/station-definitions/schema';
import { type Station, StationType } from '../../src/ts/station-definitions/station-definitions';
import {
  allRawChannels,
  asar,
  asarChannelGroup,
  defaultStations,
  pdarPD01Channel,
  pdarPD01ChannelRotated
} from '../__data__';

describe('station definitions schema', () => {
  describe('orientationAnglesSchema', () => {
    it('should validate a valid OrientationAngles object', () => {
      const validOrientationAngles: OrientationAngles = {
        horizontalAngleDeg: 45,
        verticalAngleDeg: 30
      };

      expect(orientationAnglesSchema.safeParse(validOrientationAngles).success).toBeTruthy();
    });

    it('should validate an OrientationAngles object without optional fields', () => {
      const validOrientationAngles: OrientationAngles = {};

      expect(orientationAnglesSchema.safeParse(validOrientationAngles).success).toBeTruthy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidOrientationAngles = {
        horizontalAngleDeg: '45', // horizontalAngleDeg should be a number
        verticalAngleDeg: 30
      };

      expect(orientationAnglesSchema.safeParse(invalidOrientationAngles).success).toBeFalsy();
    });
  });

  describe('relativePositionSchema', () => {
    it('should validate a valid RelativePosition object', () => {
      const validRelativePosition: RelativePosition = {
        northDisplacementKm: 1.0,
        eastDisplacementKm: 2.0,
        verticalDisplacementKm: 3.0
      };

      expect(relativePositionSchema.safeParse(validRelativePosition).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidRelativePosition = {
        northDisplacementKm: 1.0,
        eastDisplacementKm: 2.0
        // Missing verticalDisplacementKm
      };

      expect(relativePositionSchema.safeParse(invalidRelativePosition).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidRelativePosition = {
        northDisplacementKm: 1.0,
        eastDisplacementKm: '2.0', // eastDisplacementKm should be a number
        verticalDisplacementKm: 3.0
      };

      expect(relativePositionSchema.safeParse(invalidRelativePosition).success).toBeFalsy();
    });
  });

  describe('channelIdentifierSchema', () => {
    it('should validate a valid ChannelIdentifier object', () => {
      const validIdentifier: EntityReference<'name', Channel> = { name: 'Channel1' };

      expect(channelIdentifierSchema.safeParse(validIdentifier).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidIdentifier = {};

      expect(channelIdentifierSchema.safeParse(invalidIdentifier).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidIdentifier = { name: 123 }; // name should be a string

      expect(channelIdentifierSchema.safeParse(invalidIdentifier).success).toBeFalsy();
    });
  });

  describe('channelEntityReferenceSchema', () => {
    it('should validate a valid ChannelEntityReference object', () => {
      const validReference: EntityReference<'name', Channel> = { name: 'Channel1' };

      expect(channelEntityReferenceSchema.safeParse(validReference).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidReference = {};

      expect(channelEntityReferenceSchema.safeParse(invalidReference).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidReference = { name: 123 }; // name should be a string

      expect(channelEntityReferenceSchema.safeParse(invalidReference).success).toBeFalsy();
    });
  });

  describe('channelVersionReferenceSchema', () => {
    it('should validate a valid ChannelVersionReference object', () => {
      const validReference: VersionReference<'name', Channel> = {
        name: 'Channel1',
        effectiveAt: 1627849200
      };

      expect(channelVersionReferenceSchema.safeParse(validReference).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidReference = { name: 'Channel1' }; // Missing effectiveAt

      expect(channelVersionReferenceSchema.safeParse(invalidReference).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidReference = { name: 'Channel1', effectiveAt: '1627849200' }; // effectiveAt should be a number

      expect(channelVersionReferenceSchema.safeParse(invalidReference).success).toBeFalsy();
    });
  });

  describe('stationIdentifierSchema', () => {
    it('should validate a valid StationIdentifier object', () => {
      const validIdentifier: EntityReference<'name', Station> = { name: 'Station1' };

      expect(stationIdentifierSchema.safeParse(validIdentifier).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidIdentifier = {};

      expect(stationIdentifierSchema.safeParse(invalidIdentifier).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidIdentifier = { name: 123 }; // name should be a string

      expect(stationIdentifierSchema.safeParse(invalidIdentifier).success).toBeFalsy();
    });
  });

  describe('stationVersionReferenceSchema', () => {
    it('should validate a valid StationVersionReference object', () => {
      const validReference: VersionReference<'name', Station> = {
        name: 'Station1',
        effectiveAt: 1627849200
      };

      expect(stationVersionReferenceSchema.safeParse(validReference).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidReference = { name: 'Station1' }; // Missing effectiveAt

      expect(stationVersionReferenceSchema.safeParse(invalidReference).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidReference = { name: 'Station1', effectiveAt: '1627849200' }; // effectiveAt should be a number

      expect(stationVersionReferenceSchema.safeParse(invalidReference).success).toBeFalsy();
    });
  });

  describe('stationEntityReferenceSchema', () => {
    it('should validate a valid StationEntityReference object', () => {
      const validReference: EntityReference<'name', Station> = { name: 'Station1' };

      expect(stationEntityReferenceSchema.safeParse(validReference).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidReference = {};

      expect(stationEntityReferenceSchema.safeParse(invalidReference).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidReference = { name: 123 }; // name should be a string

      expect(stationEntityReferenceSchema.safeParse(invalidReference).success).toBeFalsy();
    });
  });

  describe('channelSchema', () => {
    it('should validate valid raw Channel objects', () => {
      const validChannels: Channel[] = allRawChannels;
      validChannels.forEach(validChannel => {
        expect(channelSchema.safeParse(validChannel).success).toBeTruthy();
      });
    });

    it('should validate a valid rotated Channel object', () => {
      const validChannel: Channel = pdarPD01ChannelRotated;

      expect(channelSchema.safeParse(validChannel).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidChannel = {
        name: 'Channel1',
        effectiveAt: 1627849200
        // Missing canonicalName, description, and other required fields
      };

      expect(channelSchema.safeParse(invalidChannel).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidChannel = { ...pdarPD01Channel, effectiveAt: `${pdarPD01Channel.effectiveAt}` };

      expect(channelSchema.safeParse(invalidChannel).success).toBeFalsy();
    });
  });

  describe('channelGroupSchema', () => {
    it('should validate a valid ChannelGroup object', () => {
      const validChannelGroup: ChannelGroup = asarChannelGroup;

      expect(channelGroupSchema.safeParse(validChannelGroup).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidChannelGroup = {
        name: 'ABC.XY01',
        description: 'This is a channel group',
        effectiveAt: 1627849200
        // Missing effectiveUntil, location, type, and channels
      };

      expect(channelGroupSchema.safeParse(invalidChannelGroup).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidChannelGroup = {
        ...asarChannelGroup,
        effectiveUntil: `${asarChannelGroup.effectiveUntil}`
      };

      expect(channelGroupSchema.safeParse(invalidChannelGroup).success).toBeFalsy();
    });
  });

  describe('stationSchema', () => {
    it('should validate valid Station objects', () => {
      const validStations = defaultStations;

      validStations.forEach(validStation => {
        expect(stationSchema.parse(validStation)).toBeTruthy();
      });
    });
  });

  it('should invalidate an object with missing required fields', () => {
    const invalidStation = {
      name: 'Station1',
      type: StationType.SEISMIC_3_COMPONENT,
      description: 'This is a station',
      effectiveAt: 1627849200
      // Missing effectiveUntil, location, channelGroups, and allRawChannels
    };

    expect(stationSchema.safeParse(invalidStation).success).toBeFalsy();
  });

  it('should invalidate an object with incorrect types', () => {
    const invalidStation = { ...asar, effectiveAt: `${asar.effectiveAt}` };

    expect(stationSchema.safeParse(invalidStation).success).toBeFalsy();
  });
});
