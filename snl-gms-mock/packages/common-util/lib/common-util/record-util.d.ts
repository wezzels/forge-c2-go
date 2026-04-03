/**
 * Return number of entries in the Record if undefined returns 0
 *
 * @param record Record
 * @returns number of entries
 */
export declare function recordLength(record: Record<string | number | symbol, unknown> | null | undefined): number;
/**
 * Type-guard that checks an object to see if it has only string or number keys (serializable).
 * Note that a record can have Symbols as keys, too. If they were present here,
 * this would return false.
 *
 * @param obj an object to check
 * @returns true if the record has only string/number keys
 */
export declare function recordHasStringOrNumberKeys<T extends 'string' | 'number'>(obj: any): obj is Record<T, unknown>;
/**
 * Object string params are ordered according to insertion order. This function ensures that
 * they will be ordered alphabetically, which can be useful in cases such as when the user
 * is expecting a specific order, such as in JSON that is desired in a specific order.
 *
 * @param record a record with string keys, to be sorted
 * @returns a matching record with the params added in alphabetical order by key
 */
export declare function sortRecordByKeys<T extends Record<string | number, unknown>>(record: T): T;
//# sourceMappingURL=record-util.d.ts.map