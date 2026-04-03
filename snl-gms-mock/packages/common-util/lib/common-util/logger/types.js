/** the defined log levels */
export var LogLevel;
(function (LogLevel) {
    LogLevel["OFF"] = "off";
    LogLevel["ERROR"] = "error";
    LogLevel["WARN"] = "warn";
    LogLevel["INFO"] = "info";
    LogLevel["DEBUG"] = "debug";
})(LogLevel || (LogLevel = {}));
/** the defined log level order */
export var LogOrder;
(function (LogOrder) {
    LogOrder[LogOrder["OFF"] = 0] = "OFF";
    LogOrder[LogOrder["ERROR"] = 1] = "ERROR";
    LogOrder[LogOrder["WARN"] = 2] = "WARN";
    LogOrder[LogOrder["INFO"] = 3] = "INFO";
    LogOrder[LogOrder["DEBUG"] = 4] = "DEBUG";
})(LogOrder || (LogOrder = {}));
//# sourceMappingURL=types.js.map