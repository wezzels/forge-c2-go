import type { ILogger } from './types';
/**
 * A simple console logger for logging console logs.
 */
export declare class ConsoleLogger implements ILogger {
    private static instance;
    /** returns the logger instance */
    static Instance(): ConsoleLogger;
    /**
     * The `console.debug()` function.
     *
     * @param message the message
     * @param optionalParams the optional parameters
     */
    readonly debug: (message: string, ...optionalParams: unknown[]) => void;
    /**
     * The `console.info()` function.
     *
     * @param message the message
     * @param optionalParams the optional parameters
     */
    readonly info: (message: string, ...optionalParams: unknown[]) => void;
    /**
     * The `console.warn()` function.
     *
     * @param message the message
     * @param optionalParams the optional parameters
     */
    readonly warn: (message: string, ...optionalParams: unknown[]) => void;
    /**
     * The `console.time()` function.
     *
     * @param label the unique label
     */
    readonly time: (label: string) => void;
    /**
     * The `console.timeEnd()` function.
     *
     * @param label the unique label
     */
    readonly timeEnd: (label: string) => void;
    /**
     * The `console.error()` function.
     *
     * @param message the message
     * @param optionalParams the optional parameters
     */
    readonly error: (message: string, ...optionalParams: unknown[]) => void;
}
//# sourceMappingURL=console-logger.d.ts.map