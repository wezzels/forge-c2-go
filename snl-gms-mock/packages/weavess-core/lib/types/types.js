/**
 * Type of display
 */
export var DisplayType;
(function (DisplayType) {
    /** String representation of line type 'LINE' */
    DisplayType["LINE"] = "LINE";
    /** String representation of line type 'SCATTER' */
    DisplayType["SCATTER"] = "SCATTER";
})(DisplayType || (DisplayType = {}));
/**
 * Type of line
 */
export var LineStyle;
(function (LineStyle) {
    /** String representation of solid line */
    LineStyle["SOLID"] = "solid";
    /** String representation of dashed line */
    LineStyle["DASHED"] = "dashed";
    /** String representation of dotted line */
    LineStyle["DOTTED"] = "dotted";
})(LineStyle || (LineStyle = {}));
/**
 * Distance value's units degrees or kilometers
 */
export var DistanceUnits;
(function (DistanceUnits) {
    /** String representation of 'degrees' */
    DistanceUnits["Degrees"] = "degrees";
    /** String representation of 'km' */
    DistanceUnits["Km"] = "km";
})(DistanceUnits || (DistanceUnits = {}));
export var SplitMode;
(function (SplitMode) {
    SplitMode["CREATE_SD"] = "CREATE_SD";
    SplitMode["SELECT_WAVEFORM"] = "SELECT_WAVEFORM";
})(SplitMode || (SplitMode = {}));
export const UNFILTERED = 'Unfiltered';
//# sourceMappingURL=types.js.map