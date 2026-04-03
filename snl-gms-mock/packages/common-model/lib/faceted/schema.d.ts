import { z, type ZodObject, type ZodRawShape } from 'zod';
/**
 * Create a version reference with the specified identifier
 *
 * @example
 * ```
 * // Define the identifier schema for Channel (using `name` as the identifier)
 * const channelIdentifierSchema = z.object({
 *   name: z.string(),
 * });
 * const channelVersionReferenceSchema = createVersionReferenceSchema(channelIdentifierSchema);
 * ```
 *
 * @param idSchema the schema defining the faceting identifier
 * @returns a version reference schema, including the identifier and an effectiveAt
 *
 */
export declare function createVersionReferenceSchema<T extends ZodRawShape>(idSchema: ZodObject<T>): z.ZodObject<Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
} extends infer T_1 ? { [k in keyof T_1]: (Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
})[k]; } : never, z.UnknownKeysParam, z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
} extends infer T_1 ? { [k in keyof T_1]: (Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
})[k]; } : never>, (z.baseObjectOutputType<Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
} extends infer T_1 ? { [k in keyof T_1]: (Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
})[k]; } : never> extends infer T_3 extends object ? { [k_2 in keyof T_3]: undefined extends z.baseObjectOutputType<Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
} extends infer T_1 ? { [k in keyof T_1]: (Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
})[k]; } : never>[k_2] ? never : k_2; } : never)["effectiveAt" | Exclude<keyof T, "effectiveAt">]> extends infer T_2 ? { [k_1 in keyof T_2]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
} extends infer T_1 ? { [k in keyof T_1]: (Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
})[k]; } : never>, (z.baseObjectOutputType<Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
} extends infer T_1 ? { [k in keyof T_1]: (Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
})[k]; } : never> extends infer T_3 extends object ? { [k_2 in keyof T_3]: undefined extends z.baseObjectOutputType<Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
} extends infer T_1 ? { [k in keyof T_1]: (Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
})[k]; } : never>[k_2] ? never : k_2; } : never)["effectiveAt" | Exclude<keyof T, "effectiveAt">]>[k_1]; } : never, z.baseObjectInputType<Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
} extends infer T_1 ? { [k in keyof T_1]: (Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
})[k]; } : never> extends infer T_4 ? { [k_3 in keyof T_4]: z.baseObjectInputType<Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
} extends infer T_1 ? { [k in keyof T_1]: (Omit<T, "effectiveAt"> & {
    effectiveAt: z.ZodNumber;
})[k]; } : never>[k_3]; } : never>;
/**
 * Create an entity reference with the specified identifier
 *
 * @example
 * ```
 * // Define the identifier schema for Channel (using `name` as the identifier)
 * const channelIdentifierSchema = z.object({
 *   name: z.string(),
 * });
 * ```
 *
 * @param identifierSchema the schema defining the faceting identifier
 * @returns an entity reference schema, including only the identifier
 *
 */
export declare function createEntityReferenceSchema<T extends ZodRawShape>(idSchema: ZodObject<T>): z.ZodObject<T, z.UnknownKeysParam, z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<T>, { [k_1 in keyof z.baseObjectOutputType<T>]: undefined extends z.baseObjectOutputType<T>[k_1] ? never : k_1; }[keyof T]> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<T>, { [k_1 in keyof z.baseObjectOutputType<T>]: undefined extends z.baseObjectOutputType<T>[k_1] ? never : k_1; }[keyof T]>[k]; } : never, z.baseObjectInputType<T> extends infer T_2 ? { [k_2 in keyof T_2]: z.baseObjectInputType<T>[k_2]; } : never>;
//# sourceMappingURL=schema.d.ts.map