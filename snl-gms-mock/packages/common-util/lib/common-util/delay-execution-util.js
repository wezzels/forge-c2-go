/**
 * Delay invoking a function for some number of milliseconds.
 *
 * @param func the function to call on a delayed time
 * @param delayMillis the number of milliseconds to delay
 */
export const delayExecution = async (func, delayMillis = 50) => new Promise((resolve, reject) => {
    setTimeout(() => {
        try {
            resolve(func());
        }
        catch (e) {
            reject(e);
        }
    }, delayMillis);
});
/**
 * Calls a function that accepts an arbitrary number of
 * arguments within setTimeout and returns clearTimeout
 *
 * @param func the function to be called
 * @param timeout optional timeout
 * @param funcArgs function arguments
 * @returns
 */
export function delayExecutionReturnClearTimeout(func, timeout = 0, ...funcArgs) {
    const timer = setTimeout(() => func(...funcArgs), timeout);
    return () => {
        clearTimeout(timer);
    };
}
//# sourceMappingURL=delay-execution-util.js.map