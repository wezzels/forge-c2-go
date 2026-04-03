/**
 * A simple console logger for logging console logs.
 */
export class ConsoleLogger {
    static instance;
    /** returns the logger instance */
    static Instance() {
        if (!ConsoleLogger.instance) {
            ConsoleLogger.instance = new ConsoleLogger();
        }
        return ConsoleLogger.instance;
    }
    /**
     * The `console.debug()` function.
     *
     * @param message the message
     * @param optionalParams the optional parameters
     */
    debug = (message, ...optionalParams) => {
        console.debug(message, ...optionalParams);
    };
    /**
     * The `console.info()` function.
     *
     * @param message the message
     * @param optionalParams the optional parameters
     */
    info = (message, ...optionalParams) => {
        console.info(message, ...optionalParams);
    };
    /**
     * The `console.warn()` function.
     *
     * @param message the message
     * @param optionalParams the optional parameters
     */
    warn = (message, ...optionalParams) => {
        console.warn(message, ...optionalParams);
    };
    /**
     * The `console.time()` function.
     *
     * @param label the unique label
     */
    time = (label) => {
        console.time(label);
    };
    /**
     * The `console.timeEnd()` function.
     *
     * @param label the unique label
     */
    timeEnd = (label) => {
        console.timeEnd(label);
    };
    /**
     * The `console.error()` function.
     *
     * @param message the message
     * @param optionalParams the optional parameters
     */
    error = (message, ...optionalParams) => {
        console.error(message, ...optionalParams);
    };
}
/* eslint-enable class-methods-use-this */
//# sourceMappingURL=console-logger.js.map