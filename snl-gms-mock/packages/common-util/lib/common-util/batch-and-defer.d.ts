/**
 * Will return a version of the input function that will batch all given parameters into
 * fewer calls.
 *
 * @param fn the function to batch and defer
 * @param wait how long to wait for more params (default 150)
 * @returns the batched function
 */
export declare const batchAndDefer: <T>(fn: any, wait?: number) => (incomingArgs: T) => void;
//# sourceMappingURL=batch-and-defer.d.ts.map