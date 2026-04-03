/* eslint-disable @typescript-eslint/no-use-before-define */
import { z } from 'zod';

import { Units } from '../common';
import { locationSchema } from '../common/schema';
import { createEntityReferenceSchema, createVersionReferenceSchema } from '../faceted/schema';
import type { EntityReference } from '../faceted/types';
import type { ToZodSchema } from '../type-util/zod-util';
import type {
  Channel,
  ChannelGroup,
  OrientationAngles,
  RelativePosition
} from './channel-definitions/channel-definitions';
import {
  ChannelBandType,
  ChannelDataType,
  ChannelGroupType,
  ChannelInstrumentType,
  ChannelOrientationType,
  ChannelProcessingMetadataType
} from './channel-definitions/channel-definitions';
import { responseSchema } from './response-definitions/schema';
import type { Station } from './station-definitions/station-definitions';
import { StationType } from './station-definitions/station-definitions';

export const orientationAnglesSchema = z.object({
  horizontalAngleDeg: z.number().optional(),
  verticalAngleDeg: z.number().optional()
} satisfies ToZodSchema<OrientationAngles>);

export const relativePositionSchema = z
  .object({
    northDisplacementKm: z.number(),
    eastDisplacementKm: z.number(),
    verticalDisplacementKm: z.number()
  } satisfies ToZodSchema<RelativePosition>)
  .strict();

/**
 * Represents the identifier for a faceted channel, which is the name.
 *
 * This schema is used to validate channel identifiers, ensuring that they conform to the expected structure and types.
 */
export const channelIdentifierSchema = z
  .object({
    name: z.string()
  } satisfies ToZodSchema<EntityReference<'name', Channel>>)
  .strict();

/**
 * Represents an entity reference for a Channel.
 *
 * This schema is used to validate channel entity references, ensuring that they conform to the expected structure and types.
 */
export const channelEntityReferenceSchema =
  createEntityReferenceSchema(channelIdentifierSchema).strict();

/**
 * Represents a version reference for a channel.
 *
 * This schema is used to validate channel version references, ensuring that they conform to the expected structure and types.
 */
export const channelVersionReferenceSchema =
  createVersionReferenceSchema(channelIdentifierSchema).strict();

/**
 * Represents the identifier for a faceted station, which is the name.
 *
 * This schema is used to validate station identifiers, ensuring that they conform to the expected structure and types.
 */
export const stationIdentifierSchema = z
  .object({
    name: z.string()
  } satisfies ToZodSchema<EntityReference<'name', Station>>)
  .strict();

/**
 * Represents a version reference for a station.
 *
 * This schema is used to validate station version references, ensuring that they conform to the expected structure and types.
 */
export const stationVersionReferenceSchema =
  createVersionReferenceSchema(stationIdentifierSchema).strict();

/**
 * Represents an entity reference for a station.
 *
 * This schema is used to validate station entity references, ensuring that they conform to the expected structure and types.
 */
export const stationEntityReferenceSchema =
  createEntityReferenceSchema(stationIdentifierSchema).strict();

/**
 * Represents a {@link Channel}, including its metadata, location, orientation, processing information, and response.
 *
 * This schema is used to validate Channel objects, ensuring that they conform to the expected structure and types.
 *
 * ! We have to explicitly define the channelSchema as `z.ZodType<Channel>` or else it treats the station lazy type as
 * ! possibly undefined, which does not align to the type of Channel.
 *
 * The inclusion of Station creates a circular reference, since Station references ChannelGroup, which references Channel.
 * This requires the use of z.lazy to avoid build errors.
 */
export const channelSchema: z.ZodType<Channel> = z
  .object({
    ...channelIdentifierSchema.shape,
    effectiveAt: z.number(),
    canonicalName: z.string(),
    description: z.string(),
    effectiveForRequestTime: z.number().optional(),
    effectiveUntil: z.number().optional(),
    channelDataType: z.nativeEnum(ChannelDataType),
    channelBandType: z.nativeEnum(ChannelBandType),
    channelInstrumentType: z.nativeEnum(ChannelInstrumentType),
    channelOrientationType: z.nativeEnum(ChannelOrientationType),
    channelOrientationCode: z.string(),
    units: z.nativeEnum(Units),
    nominalSampleRateHz: z.number().optional(),
    location: locationSchema,
    orientationAngles: orientationAnglesSchema.optional(),
    processingDefinition: z.record(z.any()).optional(),
    processingMetadata: z.record(z.nativeEnum(ChannelProcessingMetadataType), z.any()).optional(),
    response: responseSchema.optional(),
    station: z.union([
      z.lazy(() => stationSchema), // Must explicitly type `channelSchema`
      stationVersionReferenceSchema,
      stationEntityReferenceSchema
    ]),
    configuredInputs: z.lazy(() => z.array(z.union([channelSchema, channelVersionReferenceSchema])))
  } satisfies ToZodSchema<Channel>)
  .strict();

/**
 * Represents a group of Channels, including metadata, location, and the channels that comprise the group
 *
 * Schema for {@link ChannelGroup}. Used to validate that an object conforms to the expected structure and types
 */
export const channelGroupSchema = z
  .object({
    /**
     * Name of the channel group, e.g., "ABC.XY01".
     */
    name: z.string(),

    /**
     * Description of the channel group.
     */
    description: z.string(),

    /**
     * Time that the channel group came online. ISO-8601 time string, down to ms, e.g., "2021-02-26T19:10:41.283Z".
     */
    effectiveAt: z.number(),

    /**
     * Time that the channel group went offline. ISO-8601 time string, down to ms, e.g., "2021-02-26T19:10:41.283Z".
     */
    effectiveUntil: z.number().optional(),

    /**
     * The location of the channel group.
     */
    location: locationSchema,

    /**
     * The type of the group.
     */
    type: z.nativeEnum(ChannelGroupType),

    /**
     * The channels comprising the channel group.
     */
    channels: z.array(z.union([channelSchema, channelVersionReferenceSchema]))
  } satisfies ToZodSchema<ChannelGroup>)
  .strict();

/** A zod schema defining the {@link Station}. */
export const stationSchema = z
  .object({
    ...stationIdentifierSchema.shape,
    type: z.nativeEnum(StationType),
    description: z.string(),
    effectiveAt: z.number().optional(),
    effectiveUntil: z.number().optional(),
    relativePositionChannelPairs: z
      .array(
        z.object({
          channel: channelVersionReferenceSchema,
          relativePosition: relativePositionSchema
        })
      )
      .optional(),
    location: locationSchema,
    channelGroups: z.array(channelGroupSchema),
    allRawChannels: z.array(z.union([channelSchema, channelVersionReferenceSchema]))
  } satisfies ToZodSchema<Station>)
  .strict();
