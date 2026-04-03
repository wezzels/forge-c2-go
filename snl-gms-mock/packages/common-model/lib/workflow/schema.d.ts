import { z } from 'zod';
/** A zod schema defining the {@link WorkflowDefinitionId}. */
export declare const workflowDefinitionIdSchema: z.ZodObject<{
    name: z.ZodString;
    effectiveTime: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    name: string;
    effectiveTime?: number | undefined;
}, {
    name: string;
    effectiveTime?: number | undefined;
}>;
//# sourceMappingURL=schema.d.ts.map