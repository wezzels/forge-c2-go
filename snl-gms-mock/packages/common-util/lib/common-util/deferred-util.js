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
export function createDeferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}
//# sourceMappingURL=deferred-util.js.map