export declare enum IanDisplays {
    EVENTS = "events",
    MAP = "map",
    SIGNAL_DETECTIONS = "signal-detections-list",
    STATION_PROPERTIES = "station-properties",
    WAVEFORM = "waveform",
    WORKFLOW = "workflow",
    FILTERS = "filters",
    AZIMUTH_SLOWNESS = "azimuth-slowness",
    HISTORY = "undo-redo",
    LOCATION = "location",
    MAGNITUDE = "magnitude",
    NAVIGATION = "navigation"
}
export type DisplayNames = IanDisplays;
/**
 * Type guard to check if a string is a valid display name. Display names are the strings
 * used to identify components that are passed to GoldenLayout, and are also used to define
 * the routes at which displays can be visited.
 *
 * @param candidateName a string to check
 * @returns whether the name is in one of the DisplayName enums
 */
export declare const isValidDisplayName: (candidateName: string) => candidateName is IanDisplays;
/**
 * Converts the enum to a human readable title so they can be kept in sync easier.
 * If the enum appears as a key in {@link displayTitleOverrides}, we simply return the
 * value from that record, with any provided prefix added.
 *
 * @param str a string to convert
 * @param prefix a string to append to the start of the converted title, such as `GMS: `
 * @returns a human readable title
 */
export declare const toDisplayTitle: (str: string, prefix?: string, suffix?: string, splitChars?: Record<string, string>) => string;
//# sourceMappingURL=types.d.ts.map