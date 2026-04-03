/**
 * A Deferred represents an externally controllable Promise.
 *
 * @template Resolved - The type of the promise's resolved value.
 */
export interface Deferred<Resolved> {
    /**
     * The underlying Promise which will be resolved or rejected externally.
     */
    promise: Promise<Resolved>;
    /**
     * Resolve the promise with a value or another promise-like object.
     *
     * @param value - The value to resolve the promise with.
     */
    resolve: (value: Resolved | PromiseLike<Resolved>) => void;
    /**
     * Reject the promise with a given reason.
     *
     * @param reason - The reason for rejecting the promise.
     */
    reject: (reason?: any) => void;
}
/**
 * Create a new Deferred object, exposing its resolve and reject methods.
 *
 * @template Resolved - The type of the promise's resolved value.
 * @returns A Deferred containing a promise and its resolve/reject functions.
 *
 * @example
 * ```ts
 * const deferred = createDeferred<number>();
 *
 * deferred.promise.then(value => console.log("Resolved with", value));
 *
 * // Later in your code:
 * deferred.resolve(42);
 * ```
 */
export declare function createDeferred<Resolved>(): Deferred<Resolved>;
//# sourceMappingURL=deferred-util.d.ts.map