import { z } from 'zod';

import type { ToZodSchema } from '../type-util/zod-util';
import type { WorkflowDefinitionId } from './types';

/** A zod schema defining the {@link WorkflowDefinitionId}. */
export const workflowDefinitionIdSchema = z
  .object({
    name: z.string(),
    effectiveTime: z.number().optional()
  } satisfies ToZodSchema<WorkflowDefinitionId>)
  .strict();
