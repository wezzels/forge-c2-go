import { z } from 'zod';
import type { Channel } from './channel-definitions/channel-definitions';
import { ChannelGroupType } from './channel-definitions/channel-definitions';
import { StationType } from './station-definitions/station-definitions';
export declare const orientationAnglesSchema: z.ZodObject<{
    horizontalAngleDeg: z.ZodOptional<z.ZodNumber>;
    verticalAngleDeg: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    horizontalAngleDeg?: number | undefined;
    verticalAngleDeg?: number | undefined;
}, {
    horizontalAngleDeg?: number | undefined;
    verticalAngleDeg?: number | undefined;
}>;
export declare const relativePositionSchema: z.ZodObject<{
    northDisplacementKm: z.ZodNumber;
    eastDisplacementKm: z.ZodNumber;
    verticalDisplacementKm: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    northDisplacementKm: number;
    eastDisplacementKm: number;
    verticalDisplacementKm: number;
}, {
    northDisplacementKm: number;
    eastDisplacementKm: number;
    verticalDisplacementKm: number;
}>;
/**
 * Represents the identifier for a faceted channel, which is the name.
 *
 * This schema is used to validate channel identifiers, ensuring that they conform to the expected structure and types.
 */
export declare const channelIdentifierSchema: z.ZodObject<{
    name: z.ZodString;
}, "strict", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
/**
 * Represents an entity reference for a Channel.
 *
 * This schema is used to validate channel entity references, ensuring that they conform to the expected structure and types.
 */
export declare const channelEntityReferenceSchema: z.ZodObject<{
    name: z.ZodString;
}, "strict", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
/**
 * Represents a version reference for a channel.
 *
 * This schema is used to validate channel version references, ensuring that they conform to the expected structure and types.
 */
export declare const channelVersionReferenceSchema: z.ZodObject<{
    name: z.ZodString;
    effectiveAt: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    name: string;
    effectiveAt: number;
}, {
    name: string;
    effectiveAt: number;
}>;
/**
 * Represents the identifier for a faceted station, which is the name.
 *
 * This schema is used to validate station identifiers, ensuring that they conform to the expected structure and types.
 */
export declare const stationIdentifierSchema: z.ZodObject<{
    name: z.ZodString;
}, "strict", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
/**
 * Represents a version reference for a station.
 *
 * This schema is used to validate station version references, ensuring that they conform to the expected structure and types.
 */
export declare const stationVersionReferenceSchema: z.ZodObject<{
    name: z.ZodString;
    effectiveAt: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    name: string;
    effectiveAt: number;
}, {
    name: string;
    effectiveAt: number;
}>;
/**
 * Represents an entity reference for a station.
 *
 * This schema is used to validate station entity references, ensuring that they conform to the expected structure and types.
 */
export declare const stationEntityReferenceSchema: z.ZodObject<{
    name: z.ZodString;
}, "strict", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
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
export declare const channelSchema: z.ZodType<Channel>;
/**
 * Represents a group of Channels, including metadata, location, and the channels that comprise the group
 *
 * Schema for {@link ChannelGroup}. Used to validate that an object conforms to the expected structure and types
 */
export declare const channelGroupSchema: z.ZodObject<{
    /**
     * Name of the channel group, e.g., "ABC.XY01".
     */
    name: z.ZodString;
    /**
     * Description of the channel group.
     */
    description: z.ZodString;
    /**
     * Time that the channel group came online. ISO-8601 time string, down to ms, e.g., "2021-02-26T19:10:41.283Z".
     */
    effectiveAt: z.ZodNumber;
    /**
     * Time that the channel group went offline. ISO-8601 time string, down to ms, e.g., "2021-02-26T19:10:41.283Z".
     */
    effectiveUntil: z.ZodOptional<z.ZodNumber>;
    /**
     * The location of the channel group.
     */
    location: z.ZodObject<{
        latitudeDegrees: z.ZodNumber;
        longitudeDegrees: z.ZodNumber;
        elevationKm: z.ZodNumber;
        depthKm: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        latitudeDegrees: number;
        longitudeDegrees: number;
        elevationKm: number;
        depthKm: number;
    }, {
        latitudeDegrees: number;
        longitudeDegrees: number;
        elevationKm: number;
        depthKm: number;
    }>;
    /**
     * The type of the group.
     */
    type: z.ZodNativeEnum<typeof ChannelGroupType>;
    /**
     * The channels comprising the channel group.
     */
    channels: z.ZodArray<z.ZodUnion<[z.ZodType<Channel, z.ZodTypeDef, Channel>, z.ZodObject<{
        name: z.ZodString;
        effectiveAt: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        name: string;
        effectiveAt: number;
    }, {
        name: string;
        effectiveAt: number;
    }>]>, "many">;
}, "strict", z.ZodTypeAny, {
    name: string;
    effectiveAt: number;
    description: string;
    location: {
        latitudeDegrees: number;
        longitudeDegrees: number;
        elevationKm: number;
        depthKm: number;
    };
    type: ChannelGroupType;
    channels: (Channel | {
        name: string;
        effectiveAt: number;
    })[];
    effectiveUntil?: number | undefined;
}, {
    name: string;
    effectiveAt: number;
    description: string;
    location: {
        latitudeDegrees: number;
        longitudeDegrees: number;
        elevationKm: number;
        depthKm: number;
    };
    type: ChannelGroupType;
    channels: (Channel | {
        name: string;
        effectiveAt: number;
    })[];
    effectiveUntil?: number | undefined;
}>;
/** A zod schema defining the {@link Station}. */
export declare const stationSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof StationType>;
    description: z.ZodString;
    effectiveAt: z.ZodOptional<z.ZodNumber>;
    effectiveUntil: z.ZodOptional<z.ZodNumber>;
    relativePositionChannelPairs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        channel: z.ZodObject<{
            name: z.ZodString;
            effectiveAt: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            name: string;
            effectiveAt: number;
        }, {
            name: string;
            effectiveAt: number;
        }>;
        relativePosition: z.ZodObject<{
            northDisplacementKm: z.ZodNumber;
            eastDisplacementKm: z.ZodNumber;
            verticalDisplacementKm: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            northDisplacementKm: number;
            eastDisplacementKm: number;
            verticalDisplacementKm: number;
        }, {
            northDisplacementKm: number;
            eastDisplacementKm: number;
            verticalDisplacementKm: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        channel: {
            name: string;
            effectiveAt: number;
        };
        relativePosition: {
            northDisplacementKm: number;
            eastDisplacementKm: number;
            verticalDisplacementKm: number;
        };
    }, {
        channel: {
            name: string;
            effectiveAt: number;
        };
        relativePosition: {
            northDisplacementKm: number;
            eastDisplacementKm: number;
            verticalDisplacementKm: number;
        };
    }>, "many">>;
    location: z.ZodObject<{
        latitudeDegrees: z.ZodNumber;
        longitudeDegrees: z.ZodNumber;
        elevationKm: z.ZodNumber;
        depthKm: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        latitudeDegrees: number;
        longitudeDegrees: number;
        elevationKm: number;
        depthKm: number;
    }, {
        latitudeDegrees: number;
        longitudeDegrees: number;
        elevationKm: number;
        depthKm: number;
    }>;
    channelGroups: z.ZodArray<z.ZodObject<{
        /**
         * Name of the channel group, e.g., "ABC.XY01".
         */
        name: z.ZodString;
        /**
         * Description of the channel group.
         */
        description: z.ZodString;
        /**
         * Time that the channel group came online. ISO-8601 time string, down to ms, e.g., "2021-02-26T19:10:41.283Z".
         */
        effectiveAt: z.ZodNumber;
        /**
         * Time that the channel group went offline. ISO-8601 time string, down to ms, e.g., "2021-02-26T19:10:41.283Z".
         */
        effectiveUntil: z.ZodOptional<z.ZodNumber>;
        /**
         * The location of the channel group.
         */
        location: z.ZodObject<{
            latitudeDegrees: z.ZodNumber;
            longitudeDegrees: z.ZodNumber;
            elevationKm: z.ZodNumber;
            depthKm: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            latitudeDegrees: number;
            longitudeDegrees: number;
            elevationKm: number;
            depthKm: number;
        }, {
            latitudeDegrees: number;
            longitudeDegrees: number;
            elevationKm: number;
            depthKm: number;
        }>;
        /**
         * The type of the group.
         */
        type: z.ZodNativeEnum<typeof ChannelGroupType>;
        /**
         * The channels comprising the channel group.
         */
        channels: z.ZodArray<z.ZodUnion<[z.ZodType<Channel, z.ZodTypeDef, Channel>, z.ZodObject<{
            name: z.ZodString;
            effectiveAt: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            name: string;
            effectiveAt: number;
        }, {
            name: string;
            effectiveAt: number;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        name: string;
        effectiveAt: number;
        description: string;
        location: {
            latitudeDegrees: number;
            longitudeDegrees: number;
            elevationKm: number;
            depthKm: number;
        };
        type: ChannelGroupType;
        channels: (Channel | {
            name: string;
            effectiveAt: number;
        })[];
        effectiveUntil?: number | undefined;
    }, {
        name: string;
        effectiveAt: number;
        description: string;
        location: {
            latitudeDegrees: number;
            longitudeDegrees: number;
            elevationKm: number;
            depthKm: number;
        };
        type: ChannelGroupType;
        channels: (Channel | {
            name: string;
            effectiveAt: number;
        })[];
        effectiveUntil?: number | undefined;
    }>, "many">;
    allRawChannels: z.ZodArray<z.ZodUnion<[z.ZodType<Channel, z.ZodTypeDef, Channel>, z.ZodObject<{
        name: z.ZodString;
        effectiveAt: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        name: string;
        effectiveAt: number;
    }, {
        name: string;
        effectiveAt: number;
    }>]>, "many">;
    name: z.ZodString;
}, "strict", z.ZodTypeAny, {
    name: string;
    description: string;
    location: {
        latitudeDegrees: number;
        longitudeDegrees: number;
        elevationKm: number;
        depthKm: number;
    };
    type: StationType;
    channelGroups: {
        name: string;
        effectiveAt: number;
        description: string;
        location: {
            latitudeDegrees: number;
            longitudeDegrees: number;
            elevationKm: number;
            depthKm: number;
        };
        type: ChannelGroupType;
        channels: (Channel | {
            name: string;
            effectiveAt: number;
        })[];
        effectiveUntil?: number | undefined;
    }[];
    allRawChannels: (Channel | {
        name: string;
        effectiveAt: number;
    })[];
    effectiveAt?: number | undefined;
    effectiveUntil?: number | undefined;
    relativePositionChannelPairs?: {
        channel: {
            name: string;
            effectiveAt: number;
        };
        relativePosition: {
            northDisplacementKm: number;
            eastDisplacementKm: number;
            verticalDisplacementKm: number;
        };
    }[] | undefined;
}, {
    name: string;
    description: string;
    location: {
        latitudeDegrees: number;
        longitudeDegrees: number;
        elevationKm: number;
        depthKm: number;
    };
    type: StationType;
    channelGroups: {
        name: string;
        effectiveAt: number;
        description: string;
        location: {
            latitudeDegrees: number;
            longitudeDegrees: number;
            elevationKm: number;
            depthKm: number;
        };
        type: ChannelGroupType;
        channels: (Channel | {
            name: string;
            effectiveAt: number;
        })[];
        effectiveUntil?: number | undefined;
    }[];
    allRawChannels: (Channel | {
        name: string;
        effectiveAt: number;
    })[];
    effectiveAt?: number | undefined;
    effectiveUntil?: number | undefined;
    relativePositionChannelPairs?: {
        channel: {
            name: string;
            effectiveAt: number;
        };
        relativePosition: {
            northDisplacementKm: number;
            eastDisplacementKm: number;
            verticalDisplacementKm: number;
        };
    }[] | undefined;
}>;
//# sourceMappingURL=schema.d.ts.map