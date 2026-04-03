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
export function createVersionReferenceSchema<T extends ZodRawShape>(idSchema: ZodObject<T>) {
  return idSchema.extend({
    effectiveAt: z.number()
  });
}

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
export function createEntityReferenceSchema<T extends ZodRawShape>(idSchema: ZodObject<T>) {
  return idSchema;
}
