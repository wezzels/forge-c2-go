// ***************************************
// Workflow interfaces
// ***************************************
export * from './activity-definition';
export var StageMode;
(function (StageMode) {
    StageMode["INTERACTIVE"] = "INTERACTIVE";
    StageMode["AUTOMATIC"] = "AUTOMATIC";
})(StageMode || (StageMode = {}));
export var AnalysisActivity;
(function (AnalysisActivity) {
    AnalysisActivity["EVENT_REVIEW"] = "EVENT_REVIEW";
    AnalysisActivity["SCAN"] = "SCAN";
})(AnalysisActivity || (AnalysisActivity = {}));
// !Keep this alphabetized so the drop down is alphabetized without needing to do it at runtime
export var AnalysisMode;
(function (AnalysisMode) {
    AnalysisMode["CUSTOM_SCAN"] = "CUSTOM_SCAN";
    AnalysisMode["DETECTION_STACK_SCAN"] = "DETECTION_STACK_SCAN";
    AnalysisMode["EVENT_REVIEW"] = "EVENT_REVIEW";
    AnalysisMode["UNASSOCIATED_SIGNAL_DETECTION_SCAN"] = "UNASSOCIATED_SIGNAL_DETECTION_SCAN";
    AnalysisMode["WAVEFORM_SCAN"] = "WAVEFORM_SCAN";
})(AnalysisMode || (AnalysisMode = {}));
// !Keep this alphabetized so the drop down is alphabetized without needing to do it at runtime
export var HumanReadableAnalysisMode;
(function (HumanReadableAnalysisMode) {
    HumanReadableAnalysisMode["CUSTOM_SCAN"] = "Custom scan";
    HumanReadableAnalysisMode["DETECTION_STACK_SCAN"] = "Detection scan";
    HumanReadableAnalysisMode["EVENT_REVIEW"] = "Event review";
    HumanReadableAnalysisMode["UNASSOCIATED_SIGNAL_DETECTION_SCAN"] = "Unassociated detection scan";
    HumanReadableAnalysisMode["WAVEFORM_SCAN"] = "Waveform scan";
})(HumanReadableAnalysisMode || (HumanReadableAnalysisMode = {}));
// ***************************************
// Workflow Interval interfaces
// ***************************************
export var IntervalStatus;
(function (IntervalStatus) {
    IntervalStatus["NOT_STARTED"] = "NOT_STARTED";
    IntervalStatus["IN_PROGRESS"] = "IN_PROGRESS";
    IntervalStatus["NOT_COMPLETE"] = "NOT_COMPLETE";
    IntervalStatus["COMPLETE"] = "COMPLETE";
    IntervalStatus["FAILED"] = "FAILED";
    IntervalStatus["SKIPPED"] = "SKIPPED";
})(IntervalStatus || (IntervalStatus = {}));
// ***************************************
// Type Utilities
// ***************************************
/**
 * Checks if stage  is InteractiveAnalysisStage
 *
 * @param object Stage
 * @returns boolean
 */
export function isInteractiveAnalysisStage(object) {
    return !!object && object.mode === StageMode.INTERACTIVE;
}
/**
 * Checks if stage interval is AutomaticProcessingStage
 *
 * @param object Stage
 * @returns boolean
 */
export function isAutomaticProcessingStage(object) {
    return !!object && object.mode === StageMode.AUTOMATIC;
}
/**
 * Checks if stage interval is InteractiveAnalysisStageInterval
 *
 * @param object Stage Interval
 * @returns boolean
 */
export function isInteractiveAnalysisStageInterval(object) {
    return object && object.stageMode === StageMode.INTERACTIVE;
}
/**
 * Checks if stage interval is AutomaticProcessingStageInterval
 *
 * @param object Stage Interval
 * @returns boolean
 */
export function isAutomaticProcessingStageInterval(object) {
    return object && object.stageMode === StageMode.AUTOMATIC;
}
/**
 * Checks if stage interval is ProcessingSequenceInterval
 *
 * @param object Interval & Partial<ProcessingSequenceInterval>
 * @returns boolean
 */
export function isProcessingSequenceInterval(object) {
    return (object && object.lastExecutedStepName !== undefined && object.percentComplete !== undefined);
}
/**
 * Checks if interval is StageInterval
 *
 * @param object Interval
 * @returns boolean
 */
export function isStageInterval(object) {
    return object && object.stageMode !== undefined;
}
/**
 * Checks if interval is ActivityInterval
 *
 * @param object Interval
 * @returns boolean
 */
export function isActivityInterval(object) {
    return object && object.stageIntervalId !== undefined && object.activeAnalystIds !== undefined;
}
//# sourceMappingURL=types.js.map