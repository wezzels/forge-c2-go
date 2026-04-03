import { z } from 'zod';
/** A zod schema defining the {@link WorkflowDefinitionId}. */
export const workflowDefinitionIdSchema = z
    .object({
    name: z.string(),
    effectiveTime: z.number().optional()
})
    .strict();
//# sourceMappingURL=schema.js.map