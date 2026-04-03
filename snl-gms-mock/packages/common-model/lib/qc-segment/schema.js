import { z } from 'zod';
import { channelSchema, channelVersionReferenceSchema } from '../station-definitions';
import { workflowDefinitionIdSchema } from '../workflow/schema';
import { QcSegmentCategory, QcSegmentType } from './types';
/** A zod schema defining the {@link QcSegmentVersionId}. */
export const qcSegmentVersionIdSchema = z
    .object({
    parentQcSegmentId: z.string(),
    effectiveAt: z.number()
})
    .strict();
/** A zod schema defining the {@link QcSegmentVersion}. */
export const qcSegmentVersionSchema = z
    .object({
    id: qcSegmentVersionIdSchema,
    startTime: z.number(),
    endTime: z.number(),
    createdBy: z.string(),
    rejected: z.boolean(),
    rationale: z.string(),
    type: z.nativeEnum(QcSegmentType).optional(),
    discoveredOn: z
        .array(z.object({
        id: z
            .object({
            channel: z.union([channelSchema, channelVersionReferenceSchema]),
            startTime: z.number(),
            endTime: z.number(),
            creationTime: z.number()
        })
            .strict()
    }))
        .optional(),
    stageId: workflowDefinitionIdSchema.optional(),
    category: z.nativeEnum(QcSegmentCategory).optional(),
    channels: z.array(channelVersionReferenceSchema)
})
    .strict();
//# sourceMappingURL=schema.js.map