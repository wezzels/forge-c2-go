export declare const ONE_FRAME_MS = 16;
/**
 * Starts a timer, if the GMS_PERFORMANCE_MONITORING_ENABLED
 * environment variable is set.
 *
 * @param key a descriptive key representing this timer.
 * Keys should be unique per timer (only one timer running
 * at a time for a given key.)
 */
export declare const start: (key: string) => void;
/**
 * Stops the timer corresponding to a key. If the GMS_PERFORMANCE_MONITORING_ENABLED
 * environment variable is set to 'verbose', it will log times. If it is set to
 * any other string, it will simply log warnings if an operation takes above the
 * acceptableDurationMs, or the 16ms (one frame) default if none is set.
 *
 * @param key the string key which was used to start the timer.
 * @param acceptableDurationMs optional max duration. Timers over this
 * limit will log a warning.
 */
export declare const end: (key: string, acceptableDurationMs?: number) => void;
//# sourceMappingURL=performance-monitoring-util.d.ts.map