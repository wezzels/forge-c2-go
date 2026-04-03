/**
 * Delay invoking a function for some number of milliseconds.
 *
 * @param func the function to call on a delayed time
 * @param delayMillis the number of milliseconds to delay
 */
export declare const delayExecution: <T>(func: () => T, delayMillis?: number) => Promise<T>;
/**
 * Calls a function that accepts an arbitrary number of
 * arguments within setTimeout and returns clearTimeout
 *
 * @param func the function to be called
 * @param timeout optional timeout
 * @param funcArgs function arguments
 * @returns
 */
export declare function delayExecutionReturnClearTimeout(func: (...args: any[]) => void, timeout?: number, ...funcArgs: any[]): () => void;
//# sourceMappingURL=delay-execution-util.d.ts.map