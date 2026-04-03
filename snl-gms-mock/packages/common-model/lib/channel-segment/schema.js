import { z } from 'zod';
import { Units } from '../common';
import { filterDefinitionSchema } from '../filter/schema';
import { qcSegmentVersionSchema } from '../qc-segment/schema';
import { channelEntityReferenceSchema, channelSchema, channelVersionReferenceSchema } from '../station-definitions';
import { ProcessingOperation, TimeseriesType } from './types';
/**
 * Represents a descriptor for a segment of a channel, including the channel information, start time, end time, and creation time.
 *
 * This schema is used to validate channel segment descriptors, ensuring that they conform to the expected structure and types.
 */
export const channelSegmentDescriptorSchema = z
    .object({
    channel: z.union([channelSchema, channelVersionReferenceSchema]),
    startTime: z.number(),
    endTime: z.number(),
    creationTime: z.number()
})
    .strict();
/** A zod schema defining the {@link ChannelSegmentFaceted}. */
export const channelSegmentFacetedSchema = z
    .object({
    id: channelSegmentDescriptorSchema
})
    .strict();
/** A zod schema defining the {@link ProcessingMask}. */
export const processingMaskSchema = z
    .object({
    id: z.string(),
    effectiveAt: z.number(),
    startTime: z.number(),
    endTime: z.number(),
    appliedToRawChannel: channelEntityReferenceSchema,
    processingOperation: z.nativeEnum(ProcessingOperation),
    maskedQcSegmentVersions: z.array(qcSegmentVersionSchema)
})
    .strict();
/** A zod schema defining the {@link Timeseries}. */
export const timeseriesSchema = z
    .object({
    type: z.nativeEnum(TimeseriesType),
    startTime: z.number(),
    endTime: z.number(),
    sampleRateHz: z.number(),
    sampleCount: z.number()
})
    .strict();
/** A zod schema defining the {@link TimeRangesByChannel}. */
export const timeRangesByChannelSchema = z
    .object({
    channel: channelEntityReferenceSchema,
    timeRanges: z.array(z.object({
        startTime: z.number(),
        endTime: z.number()
    }))
})
    .strict();
/** A zod schema defining the {@link ChannelSegment}. */
export const channelSegmentSchema = z
    .object({
    id: channelSegmentDescriptorSchema,
    units: z.nativeEnum(Units),
    timeseriesType: z.nativeEnum(TimeseriesType),
    timeseries: z.array(timeseriesSchema),
    maskedBy: z.array(processingMaskSchema),
    missingInputChannels: z.array(timeRangesByChannelSchema),
    _uiFilterDefinitionName: z.string().optional(),
    _uiFiltersBySampleRate: z.record(z.number(), filterDefinitionSchema).optional(),
    _uiConfiguredInput: channelSegmentDescriptorSchema.optional()
})
    .strict();
/** A zod schema defining the {@link FdsnWaveform}. */
export const fdsnWaveformSchema = z
    .object({
    data: z.array(z.number()),
    channel: z.string().min(1, 'channel should not be an empty string'),
    station: z.string().min(1, 'station should not be an empty string'),
    location: z.string(),
    storage: z.string(),
    sampleRate: z.number(),
    numberOfSamples: z.number(),
    timestamp: z.string().min(1, 'timestamp should not be an empty string'),
    network: z.string()
})
    .strict()
    .refine(data => data.numberOfSamples === data.data.length, () => ({
    message: `the size of data samples must be the same as the number of samples`,
    path: ['data', 'numberOfSamples']
}))
    .refine(data => data.sampleRate >= 0, () => ({
    message: `the data sample rate must be greater than or equal to zero`,
    path: ['sampleRate']
}));
//# sourceMappingURL=schema.js.map