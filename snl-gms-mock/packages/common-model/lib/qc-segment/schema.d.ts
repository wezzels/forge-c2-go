import { z } from 'zod';
import { QcSegmentCategory, QcSegmentType } from './types';
/** A zod schema defining the {@link QcSegmentVersionId}. */
export declare const qcSegmentVersionIdSchema: z.ZodObject<{
    parentQcSegmentId: z.ZodString;
    effectiveAt: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    effectiveAt: number;
    parentQcSegmentId: string;
}, {
    effectiveAt: number;
    parentQcSegmentId: string;
}>;
/** A zod schema defining the {@link QcSegmentVersion}. */
export declare const qcSegmentVersionSchema: z.ZodObject<{
    id: z.ZodObject<{
        parentQcSegmentId: z.ZodString;
        effectiveAt: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        effectiveAt: number;
        parentQcSegmentId: string;
    }, {
        effectiveAt: number;
        parentQcSegmentId: string;
    }>;
    startTime: z.ZodNumber;
    endTime: z.ZodNumber;
    createdBy: z.ZodString;
    rejected: z.ZodBoolean;
    rationale: z.ZodString;
    type: z.ZodOptional<z.ZodNativeEnum<typeof QcSegmentType>>;
    discoveredOn: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodObject<{
            channel: z.ZodUnion<[z.ZodType<import("../station-definitions/channel-definitions").Channel, z.ZodTypeDef, import("../station-definitions/channel-definitions").Channel>, z.ZodObject<{
                name: z.ZodString;
                effectiveAt: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                name: string;
                effectiveAt: number;
            }, {
                name: string;
                effectiveAt: number;
            }>]>;
            startTime: z.ZodNumber;
            endTime: z.ZodNumber;
            creationTime: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            channel: (import("../station-definitions/channel-definitions").Channel | {
                name: string;
                effectiveAt: number;
            }) & (import("../station-definitions/channel-definitions").Channel | {
                name: string;
                effectiveAt: number;
            } | undefined);
            startTime: number;
            endTime: number;
            creationTime: number;
        }, {
            channel: (import("../station-definitions/channel-definitions").Channel | {
                name: string;
                effectiveAt: number;
            }) & (import("../station-definitions/channel-definitions").Channel | {
                name: string;
                effectiveAt: number;
            } | undefined);
            startTime: number;
            endTime: number;
            creationTime: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        id: {
            channel: (import("../station-definitions/channel-definitions").Channel | {
                name: string;
                effectiveAt: number;
            }) & (import("../station-definitions/channel-definitions").Channel | {
                name: string;
                effectiveAt: number;
            } | undefined);
            startTime: number;
            endTime: number;
            creationTime: number;
        };
    }, {
        id: {
            channel: (import("../station-definitions/channel-definitions").Channel | {
                name: string;
                effectiveAt: number;
            }) & (import("../station-definitions/channel-definitions").Channel | {
                name: string;
                effectiveAt: number;
            } | undefined);
            startTime: number;
            endTime: number;
            creationTime: number;
        };
    }>, "many">>;
    stageId: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        effectiveTime: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        name: string;
        effectiveTime?: number | undefined;
    }, {
        name: string;
        effectiveTime?: number | undefined;
    }>>;
    category: z.ZodOptional<z.ZodNativeEnum<typeof QcSegmentCategory>>;
    channels: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        effectiveAt: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        name: string;
        effectiveAt: number;
    }, {
        name: string;
        effectiveAt: number;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    id: {
        effectiveAt: number;
        parentQcSegmentId: string;
    };
    channels: {
        name: string;
        effectiveAt: number;
    }[];
    startTime: number;
    endTime: number;
    rejected: boolean;
    createdBy: string;
    rationale: string;
    type?: QcSegmentType | undefined;
    discoveredOn?: {
        id: {
            channel: (import("../station-definitions/channel-definitions").Channel | {
                name: string;
                effectiveAt: number;
            }) & (import("../station-definitions/channel-definitions").Channel | {
                name: string;
                effectiveAt: number;
            } | undefined);
            startTime: number;
            endTime: number;
            creationTime: number;
        };
    }[] | undefined;
    stageId?: {
        name: string;
        effectiveTime?: number | undefined;
    } | undefined;
    category?: QcSegmentCategory | undefined;
}, {
    id: {
        effectiveAt: number;
        parentQcSegmentId: string;
    };
    channels: {
        name: string;
        effectiveAt: number;
    }[];
    startTime: number;
    endTime: number;
    rejected: boolean;
    createdBy: string;
    rationale: string;
    type?: QcSegmentType | undefined;
    discoveredOn?: {
        id: {
            channel: (import("../station-definitions/channel-definitions").Channel | {
                name: string;
                effectiveAt: number;
            }) & (import("../station-definitions/channel-definitions").Channel | {
                name: string;
                effectiveAt: number;
            } | undefined);
            startTime: number;
            endTime: number;
            creationTime: number;
        };
    }[] | undefined;
    stageId?: {
        name: string;
        effectiveTime?: number | undefined;
    } | undefined;
    category?: QcSegmentCategory | undefined;
}>;
//# sourceMappingURL=schema.d.ts.map