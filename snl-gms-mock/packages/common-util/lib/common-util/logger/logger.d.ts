import Immutable from 'immutable';
import type { ILogger } from './types';
import { LogLevel } from './types';
/**
 * The default log level.
 * ? If NODE ENV is production set to WARN; otherwise set to INFO
 */
export declare const DEFAULT_LOG_LEVEL: LogLevel;
/**
 * The global log level env override
 * ! if this is set it will override all log levels
 */
export declare const gmsLogLevel: string | undefined;
/**
 * A  logger that provides settings for enabling and disabling logs.
 */
export declare class Logger implements ILogger {
    /** the unique logger id */
    private readonly id;
    /** the log settings */
    private readonly settings;
    /** the logger instances */
    private instances;
    /**
     * Create a logger instance
     *
     * @param id the unique id
     * @param level (optional) log level
     */
    static readonly create: (id: string, level?: LogLevel | string) => Logger;
    /**
     * Logger constructor
     *
     * @param id the unique id
     * @param level (optional) log level
     */
    private constructor();
    /**
     * Logs a console message with the provided console function
     *
     * @param logFuncs the log functions
     * @param shouldLog true if to log; false otherwise
     * @param message the message
     * @param optionalParams the optional parameters
     */
    private readonly log;
    /**
     * Returns the configured loggers.
     */
    readonly getConfiguredLoggers: () => Immutable.List<ILogger>;
    /**
     * Sets the configured loggers.
     * ! replaces any previous configured loggers
     */
    readonly setConfiguredLoggers: (instances: ILogger[]) => this;
    /**
     * Adds a additional configured logger/
     */
    readonly addConfiguredLogger: (instance: ILogger) => this;
    /**
     * The `logger.debug()` function.
     *
     * @param message the message
     * @param optionalParams the optional parameters
     */
    readonly debug: (message: string, ...optionalParams: unknown[]) => void;
    /**
     * The `logger.info()` function.
     *
     * @param message the message
     * @param optionalParams the optional parameters
     */
    readonly info: (message: string, ...optionalParams: unknown[]) => void;
    /**
     * The `logger.time()` function.
     *
     * @param label the unique label
     */
    readonly time: (label: string) => void;
    /**
     * The `logger.timeEnd()` function.
     *
     * @param label the unique label
     */
    readonly timeEnd: (label: string) => void;
    /**
     * The `logger.warn()` function.
     *
     * @param message the message
     * @param optionalParams the optional parameters
     */
    readonly warn: (message: string, ...optionalParams: unknown[]) => void;
    /**
     * The `logger.error()` function.
     *
     * @param message the message
     * @param optionalParams the optional parameters
     */
    readonly error: (message: string, ...optionalParams: unknown[]) => void;
}
//# sourceMappingURL=logger.d.ts.map