/**
 * Generate a UUID string
 */
declare function asString(): string;
/**
 * Generate a UUID string
 */
export declare const uuid4: () => string;
export declare const uuid: {
    asString: typeof asString;
};
/**
 * Generates a V5 uuid
 *
 * See: {@link https://www.npmjs.com/package/uuid#uuidv5name-namespace-buffer-offset | NPM Docs}
 *
 * @param name
 * @param namespace
 * @returns
 */
export declare const uuid5: (name: string, namespace: string) => string;
export {};
//# sourceMappingURL=uuid-util.d.ts.map