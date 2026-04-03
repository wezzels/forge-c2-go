import { z } from 'zod';

import type { ChannelSegmentDescriptor } from '../channel-segment';
import { channelSchema, channelVersionReferenceSchema } from '../station-definitions';
import type { ToZodSchema } from '../type-util/zod-util';
import { workflowDefinitionIdSchema } from '../workflow/schema';
import type { QcSegmentVersion, QcSegmentVersionId } from './types';
import { QcSegmentCategory, QcSegmentType } from './types';

/** A zod schema defining the {@link QcSegmentVersionId}. */
export const qcSegmentVersionIdSchema = z
  .object({
    parentQcSegmentId: z.string(),
    effectiveAt: z.number()
  } satisfies ToZodSchema<QcSegmentVersionId>)
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
      .array(
        z.object({
          id: z
            .object({
              channel: z.union([channelSchema, channelVersionReferenceSchema]),
              startTime: z.number(),
              endTime: z.number(),
              creationTime: z.number()
            } satisfies ToZodSchema<ChannelSegmentDescriptor>)
            .strict()
        })
      )
      .optional(),
    stageId: workflowDefinitionIdSchema.optional(),
    category: z.nativeEnum(QcSegmentCategory).optional(),
    channels: z.array(channelVersionReferenceSchema)
  } satisfies ToZodSchema<QcSegmentVersion>)
  .strict();
