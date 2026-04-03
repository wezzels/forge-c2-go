/**
 * Determine if TimeRange #2 falls within TimeRange #1.
 */
export const doTimeRangesOverlap = (r1, r2) => {
    return ((r2.endTimeSecs <= r1.endTimeSecs && r2.endTimeSecs >= r1.startTimeSecs) ||
        (r2.startTimeSecs <= r1.endTimeSecs && r2.startTimeSecs >= r1.startTimeSecs) ||
        (r1.endTimeSecs <= r2.endTimeSecs && r1.endTimeSecs >= r2.startTimeSecs) ||
        (r1.startTimeSecs <= r2.endTimeSecs && r1.startTimeSecs >= r2.startTimeSecs));
};
//# sourceMappingURL=time-range-util.js.map