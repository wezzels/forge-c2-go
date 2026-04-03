/** Explicit category name for numeric hotkeys defined via User Preferences */
export const NUMERIC_HOTKEY_CATEGORY = 'Numeric Hotkeys';
/**
 * The various waveform display modes.
 */
export var WaveformMode;
(function (WaveformMode) {
    /** overlay mode all waveforms for a station are are displayed in a single station row */
    WaveformMode["Overlay"] = "OVERLAY";
    /** individual mode each waveform is displayed in a separate station row */
    WaveformMode["Individual"] = "INDIVIDUAL";
    /** for measuring amplitudes for the currently open event */
    WaveformMode["Measurement"] = "MEASUREMENT";
    /** eg; only show one best waveform at a time per station */
    WaveformMode["Focused"] = "FOCUSED";
    /** unassociated detection scan mode */
    WaveformMode["Unassociated"] = "UNASSOCIATED";
})(WaveformMode || (WaveformMode = {}));
/**
 * Available waveform sort types.
 */
export var WaveformSortType;
(function (WaveformSortType) {
    WaveformSortType["Distance"] = "Distance";
    WaveformSortType["StationNameAZ"] = "Station: A-Z";
    WaveformSortType["StationNameZA"] = "Station: Z-A";
})(WaveformSortType || (WaveformSortType = {}));
/**
 * Available waveform align types.
 */
export var AlignWaveformsOn;
(function (AlignWaveformsOn) {
    AlignWaveformsOn["TIME"] = "Time";
    AlignWaveformsOn["PREDICTED_PHASE"] = "Predicted";
    AlignWaveformsOn["OBSERVED_PHASE"] = "Observed";
})(AlignWaveformsOn || (AlignWaveformsOn = {}));
export const SHOW_EMPTY_ROWS_MODES = [
    WaveformMode.Overlay,
    WaveformMode.Measurement,
    WaveformMode.Unassociated
];
/**
 * Keys representing supported types of keyboard shortcuts. These are the keys in {@link KeyboardShortcuts}.
 */
export const allKeyboardShortcutEventTypes = [
    'hotkeys',
    'clickEvents',
    'doubleClickEvents',
    'dragEvents',
    'scrollEvents',
    'middleClickEvents',
    'rightClickEvents'
];
/**
 * All possible click events
 */
export const AllClickEventDefinitions = [
    'createSignalDetectionWithCurrentPhase',
    'createSignalDetectionWithDefaultPhase',
    'createSignalDetectionWithChosenPhase',
    'createSignalDetectionNotAssociatedWithWaveformCurrentPhase',
    'createSignalDetectionNotAssociatedWithWaveformDefaultPhase',
    'createSignalDetectionNotAssociatedWithWaveformChosenPhase',
    'viewQcSegmentDetails',
    'measureAmplitude',
    'showEventDetails',
    'showSignalDetectionDetails',
    'showStationDetails',
    'showRegionDetails',
    'selectParentChild',
    'selectParentChildRange'
];
/**
 * All possible double click events
 */
export const AllDoubleClickDefinitions = [
    'associateClickedSignalDetections',
    'unassociateClickedSignalDetections'
];
/**
 * All possible drag events
 */
export const AllDragEventDefinitions = [
    'zoomToRange',
    'drawMeasureWindow',
    'scaleWaveformAmplitude',
    'createQcSegments',
    'showRuler'
];
/**
 * All possible scroll events
 */
export const AllScrollEventDefinitions = ['zoomMouseWheel'];
/**
 * All possible hotkey events
 */
export const AllHotkeyDefinitions = [
    'zoomInOneStep',
    'zoomOutOneStep',
    'zoomOutFully',
    'zas',
    'createEventBeam',
    'panRight25',
    'panLeft25',
    'panRight75',
    'panLeft75',
    'pageDown',
    'pageUp',
    'loadLaterData',
    'locate',
    'loadEarlierData',
    'deleteSignalDetection',
    'scaleAllWaveformAmplitude',
    'resetSelectedWaveformAmplitudeScaling',
    'resetAllWaveformAmplitudeScaling',
    'toggleUncertainty',
    'editSignalDetectionUncertainty',
    'toggleQcMaskVisibility',
    'toggleAlignment',
    'workflowRightOneDay',
    'workflowLeftOneDay',
    'workflowRightOneWeek',
    'workflowLeftOneWeek',
    'showKeyboardShortcuts',
    'toggleSetPhaseMenu',
    'selectNextFilter',
    'selectPreviousFilter',
    'selectUnfiltered',
    'createNewEvent',
    'associateSelectedSignalDetections',
    'unassociateSelectedSignalDetections',
    'currentPhaseLabel',
    'defaultPhaseLabel',
    'historyEventMode',
    'undo',
    'redo',
    'eventUndo',
    'eventRedo',
    'toggleCurrentPhaseMenu',
    'toggleCommandPalette',
    'hideMeasureWindow',
    'increaseVisibleWaveforms',
    'decreaseVisibleWaveforms',
    'closeCreateSignalDetectionOverlay',
    'rotate',
    'loadGmsFromFile',
    'saveGmsToFile',
    'saveGmsToFileAs',
    'nextFk',
    'selectNextAmplitude',
    'selectPrevAmplitude',
    'selectNextUnassociated',
    'selectPrevUnassociated',
    'toggleShowEmptyRows',
    'showFk',
    'locate',
    'magnitude'
];
/**
 * All definitions for preventing default hotkey behavior
 */
export const AllPreventDefaultDefinitions = [
    'chromeMenu',
    'saveFile',
    'loadFile',
    'associateSelectedSignalDetections',
    'selectUnfiltered',
    'createSignalDetectionWithChosenPhase',
    'preventPrintPage'
];
/**
 * Record mapping the keyboard shortcut keys to display strings that are implied by this
 * group of keyboard shortcuts
 */
export const ImpliedUserActions = {
    clickEvents: 'click',
    doubleClickEvents: 'double click',
    dragEvents: 'drag',
    hotkeys: '', // special case, since we don't want to add any other text
    middleClickEvents: 'middle click',
    rightClickEvents: 'right click',
    scrollEvents: 'mouse wheel'
};
/**
 * A list of mask types for the qc mask dropdown
 */
export var QCMaskTypes;
(function (QCMaskTypes) {
    QCMaskTypes["ANALYST_DEFINED"] = "analystDefined";
    QCMaskTypes["DATA_AUTHENTICATION"] = "dataAuthentication";
    QCMaskTypes["REJECTED"] = "rejected";
    QCMaskTypes["STATION_SOH"] = "stationSOH";
    QCMaskTypes["WAVEFORM"] = "waveform";
    QCMaskTypes["LONG_TERM"] = "longTerm";
    QCMaskTypes["UNPROCESSED"] = "unprocessed";
    QCMaskTypes["PROCESSING_MASKS"] = "processingMask";
    QCMaskTypes["QC_SEGMENTS"] = "qcSegments";
})(QCMaskTypes || (QCMaskTypes = {}));
/**
 * Analyst configurations loaded from service
 */
export var AnalystConfigs;
(function (AnalystConfigs) {
    AnalystConfigs["DEFAULT"] = "ui.analyst-settings";
})(AnalystConfigs || (AnalystConfigs = {}));
/**
 * Common configurations loaded from service
 */
export var CommonConfigs;
(function (CommonConfigs) {
    CommonConfigs["DEFAULT"] = "ui.common-settings";
})(CommonConfigs || (CommonConfigs = {}));
/**
 * Operational time periods loaded from service
 */
export var OperationalTimePeriodConfigs;
(function (OperationalTimePeriodConfigs) {
    OperationalTimePeriodConfigs["DEFAULT"] = "global.operational-time-period";
})(OperationalTimePeriodConfigs || (OperationalTimePeriodConfigs = {}));
/**
 * IAN Station Definition station group names loaded from service
 */
export var StationGroupNamesConfig;
(function (StationGroupNamesConfig) {
    StationGroupNamesConfig["DEFAULT"] = "station-definition-manager.station-group-names";
})(StationGroupNamesConfig || (StationGroupNamesConfig = {}));
/**
 * Monitoring organization loaded from service
 */
export var MonitoringOrganizationConfig;
(function (MonitoringOrganizationConfig) {
    MonitoringOrganizationConfig["DEFAULT"] = "global.monitoring-org";
})(MonitoringOrganizationConfig || (MonitoringOrganizationConfig = {}));
/**
 * UI Analyst Processing Configuration Default Values
 */
export const defaultUnassociatedSignalDetectionLengthMeters = 11100000;
/**
 * The default colors for the fallback @interface UITheme (what is loaded if no theme is found).
 */
export const defaultColorTheme = {
    gmsMain: '#f5f8fa',
    gmsMainInverted: '#10161a',
    gmsBackground: '#182026',
    gmsSelection: '#1589d1',
    gmsTableSelection: '#f5f8fa',
    gmsStrongWarning: '#a82a2a',
    gmsWarning: '#f2b824',
    gmsGood: '#1d7324',
    gmsTooltipBackground: '#373E48',
    gmsTooltipForeground: '#f6f7f9',
    gmsTooltipForegroundSoft: '#9FADC0',
    mapVisibleStation: '#D9822B',
    mapStationDefault: '#6F6E74',
    mapArraySiteLines: '#182026',
    waveformDimPercent: 0.75,
    waveformFilterLabel: '#f5f8fa',
    waveformMaskLabel: '#EB06C8',
    waveformRaw: '#4580e6',
    waveformFilterError: '#8e292c',
    waveformRawSelected: '#A4BAE1',
    waveformFilterErrorSelected: '#a55456',
    waveformSelected: '#A4BAE1',
    unassociatedSDColor: '#C23030',
    openEventSDColor: '#C87619',
    completeEventSDColor: '#62D96B',
    completeEventSDHoverColor: '#BBFFBC',
    conflict: '#FF0000',
    otherEventSDColor: '#FFFFFF',
    predictionSDColor: '#C58C1B',
    qcMaskColors: {
        analystDefined: '#EB06C8',
        dataAuthentication: '#8A57FF',
        longTerm: '#0E9B96',
        processingMask: '#F87C2E',
        rejected: '#FF0000',
        stationSOH: '#B58400',
        unprocessed: '#FFFFFF',
        waveform: '#00E22B'
    },
    deletedEventColor: '#FF4E2E',
    fkNeedsReview: '#EBFF00',
    fkDisplayed: '#00FFFF',
    rejectedEventColor: '#ab83f1',
    deletedSdColor: '#ff6347',
    weavessOutOfBounds: '#10161a',
    popover: {
        background: '#30404d',
        header: '#30404d',
        input: '#2d3b44',
        invalidInput: '#1c2127',
        gridBackground: '#3d4b58'
    },
    gmsActionTarget: '#ffffff',
    measurement: {
        reviewRequired: '#d1980b',
        selection: {
            color: 'rgba(255, 255,255,0.25)',
            borderColor: 'rgba(255, 255,255,0.5)'
        },
        peakTroughSelection: {
            color: 'rgba(41, 166, 52, .25)',
            borderColor: 'rgba(41, 166, 52, .5)',
            colorWarning: 'rgba(255, 255, 0, 0.1)',
            borderColorWarning: 'rgba(255, 255, 0, 0.5)'
        }
    },
    locationSolutionSetCellHighlight: '#6ba2dd',
    locationSolutionCellChangedColor: '#ccea99',
    noisePhase: '#8899B6'
};
//# sourceMappingURL=types.js.map