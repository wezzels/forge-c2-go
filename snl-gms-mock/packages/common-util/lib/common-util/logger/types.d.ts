/** the defined log levels */
export declare enum LogLevel {
    OFF = "off",
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    DEBUG = "debug"
}
/** the defined log level order */
export declare enum LogOrder {
    OFF = 0,
    ERROR = 1,
    WARN = 2,
    INFO = 3,
    DEBUG = 4
}
/** the log settings */
export interface LogSettings {
    readonly shouldLogDebug?: boolean;
    readonly shouldLogInfo?: boolean;
    readonly shouldLogWarn?: boolean;
    readonly shouldLogError?: boolean;
}
/** the logger interface */
export interface ILogger {
    debug(message: string, ...optionalParams: unknown[]): void;
    info(message: string, ...optionalParams: unknown[]): void;
    warn(message: string, ...optionalParams: unknown[]): void;
    error(message: string, ...optionalParams: unknown[]): void;
}
//# sourceMappingURL=types.d.ts.map