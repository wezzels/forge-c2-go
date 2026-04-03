import type { StationType } from '../common/types';
import type { MagnitudeType, Restraint } from '../event/types';
import type { Filter } from '../filter';
import type { FkFrequencyRangeWithPrefilter, FkWindow } from '../fk';
import type { Modify } from '../type-util/type-util';
import type { UiUserPreferences } from '../user-profile/types';
import type { WaveformFilter } from '../waveform/types';
import type { AnalysisMode } from '../workflow/types';
/** Explicit category name for numeric hotkeys defined via User Preferences */
export declare const NUMERIC_HOTKEY_CATEGORY = "Numeric Hotkeys";
/**
 * A visual theme for the UI (including colors, typography, spacing, etc...).
 * These are loaded in from processing config, and the user profile defines the active theme.
 */
export interface UITheme {
    /**
     * Theme name must be unique, and is what is used to indicate which theme
     * a user is configured to use.
     */
    name: string;
    /**
     * The colors for this theme.
     */
    colors: ColorTheme;
    /**
     * Visual configurations for opacity and brightness
     */
    display: {
        edgeEventOpacity: number;
        edgeSDOpacity: number;
        predictionSDOpacity: number;
    };
    /**
     * Used to determine if we're in a dark mode or a light mode. This indicates if we should
     * tell our component library (Blueprint) to be in dark or light mode.
     */
    isDarkMode?: boolean;
    /**
     * The GeographicRegion Styles
     */
    geoRegionStyles: GeoRegionStyle[];
}
/**
 * A definition of a style for a @interface GeographicRegion
 * This is used to determine how a region is rendered in the UI
 */
export interface GeoRegionStyle {
    name: string;
    fill?: {
        color: string;
        opacity: number;
        hatched?: {
            color: string;
            opacity: number;
            hatchSize: number;
            hatchLine: {
                width: number;
            };
        };
    };
    stroke: {
        color: string;
        opacity: number;
        outline: {
            width: number;
            dashSize?: number;
        };
    };
    layerOrder: number;
}
/**
 * A definition of a style-category mapping for a GeographicRegion
 */
export interface GeoRegionStyleCategoryMapping {
    category: string;
    description: string;
    displayName: string;
}
/**
 * A definition of configurable colors for a @interface UITheme.
 * Color strings may be any valid css color.
 */
export interface ColorTheme {
    gmsMain: string;
    gmsMainInverted: string;
    gmsBackground: string;
    gmsSelection: string;
    gmsTableSelection: string;
    gmsStrongWarning: string;
    gmsWarning: string;
    gmsGood: string;
    gmsTooltipBackground: string;
    gmsTooltipForeground: string;
    gmsTooltipForegroundSoft: string;
    mapStationDefault: string;
    mapArraySiteLines: string;
    mapVisibleStation: string;
    unassociatedSDColor: string;
    openEventSDColor: string;
    completeEventSDColor: string;
    completeEventSDHoverColor: string;
    conflict: string;
    otherEventSDColor: string;
    deletedEventColor: string;
    fkNeedsReview: string;
    fkDisplayed: string;
    rejectedEventColor: string;
    deletedSdColor: string;
    predictionSDColor: string;
    waveformDimPercent: number;
    waveformRaw: string;
    waveformFilterError: string;
    waveformRawSelected: string;
    waveformFilterErrorSelected: string;
    waveformSelected: string;
    waveformFilterLabel: string;
    waveformMaskLabel: string;
    qcMaskColors: Record<Exclude<QCMaskTypes, QCMaskTypes.QC_SEGMENTS>, string>;
    weavessOutOfBounds: string;
    popover: PopoverColorTheme;
    gmsActionTarget: string;
    measurement: {
        reviewRequired: string;
        selection: {
            color: string;
            borderColor: string;
        };
        peakTroughSelection: {
            color: string;
            borderColor: string;
            colorWarning: string;
            borderColorWarning: string;
        };
    };
    locationSolutionSetCellHighlight: string;
    locationSolutionCellChangedColor: string;
    noisePhase: string;
}
/**
 * A definition of configurable colors for the popover element in @interface ColorTheme
 * Color strings may be any valid css color.
 */
export interface PopoverColorTheme {
    background: string;
    header: string;
    input: string;
    invalidInput: string;
    gridBackground: string;
}
/**
 * The various waveform display modes.
 */
export declare enum WaveformMode {
    /** overlay mode all waveforms for a station are are displayed in a single station row */
    Overlay = "OVERLAY",
    /** individual mode each waveform is displayed in a separate station row */
    Individual = "INDIVIDUAL",
    /** for measuring amplitudes for the currently open event */
    Measurement = "MEASUREMENT",
    /** eg; only show one best waveform at a time per station */
    Focused = "FOCUSED",
    /** unassociated detection scan mode */
    Unassociated = "UNASSOCIATED"
}
/**
 * Available waveform sort types.
 */
export declare enum WaveformSortType {
    Distance = "Distance",
    StationNameAZ = "Station: A-Z",
    StationNameZA = "Station: Z-A"
}
/**
 * Available waveform align types.
 */
export declare enum AlignWaveformsOn {
    TIME = "Time",
    PREDICTED_PHASE = "Predicted",
    OBSERVED_PHASE = "Observed"
}
export declare const SHOW_EMPTY_ROWS_MODES: readonly WaveformMode[];
/**
 * A collection of configuration values that can change
 * based on the {@link AnalysisMode}  of the interval
 */
export interface AnalysisModeSettings {
    /** default waveform mode */
    defaultWaveformMode: WaveformMode;
    /** default waveform (station) sort order */
    defaultWaveformSortType: WaveformSortType;
    /** default waveform alignment */
    defaultAlignWaveformsOn: AlignWaveformsOn;
    /** default number of waveform rows to be displayed in the waveform display  */
    defaultNumberOfVisibleWaveforms: number;
    /** default are stations expanded state, true if stations are expanded by default; false otherwise */
    defaultAreStationsExpanded: boolean;
    /** measure window duration in seconds */
    unassociatedScanMeasureWindowDurationSeconds?: number;
}
/**
 * Keys representing supported types of keyboard shortcuts. These are the keys in {@link KeyboardShortcuts}.
 */
export declare const allKeyboardShortcutEventTypes: readonly ["hotkeys", "clickEvents", "doubleClickEvents", "dragEvents", "scrollEvents", "middleClickEvents", "rightClickEvents"];
/**
 * Represent keys of all supported keyboard shortcut types. These are the keys in {@link KeyboardShortcuts}
 */
export type KeyboardShortcutEventType = (typeof allKeyboardShortcutEventTypes)[number];
/**
 * The configuration for a single keyboard shortcut, including information
 * for display in the keyboards shortcuts dialog, as well as the actual hotkeys themselves.
 */
export interface KeyboardShortcut {
    /** Human readable, short description of what the keyboard shortcut does */
    description: string;
    /** If provided, gets displayed in an info popover */
    helpText: string;
    /** The actual hotkey combo(s) that trigger this event */
    combos: string[];
    /** A list of search terms that should be considered matches */
    tags?: string[];
    /** Groups like hotkeys. If it is scoped to a display, use the display name */
    categories?: string[];
    /**
     * Used by the UI for identifying the shortcut category
     * eg; clickEvent, doubleClickEvent, hotkeys
     */
    _uiHotkeyConfigurationType?: keyof UiUserPreferences['keyboardShortcuts'];
    /**
     * Used by the UI for indentifying the name of the shortcut
     * eg; `deleteDetection` or `toggleSetPhaseMenu`
     */
    _uiHotkeyName?: KeyboardShortcutDefinitions;
}
/**
 * All possible click events
 */
export declare const AllClickEventDefinitions: readonly ["createSignalDetectionWithCurrentPhase", "createSignalDetectionWithDefaultPhase", "createSignalDetectionWithChosenPhase", "createSignalDetectionNotAssociatedWithWaveformCurrentPhase", "createSignalDetectionNotAssociatedWithWaveformDefaultPhase", "createSignalDetectionNotAssociatedWithWaveformChosenPhase", "viewQcSegmentDetails", "measureAmplitude", "showEventDetails", "showSignalDetectionDetails", "showStationDetails", "showRegionDetails", "selectParentChild", "selectParentChildRange"];
/**
 * A hotkey configuration that has the `_uiHotkeyConfigurationType` parameter set to one of
 * the {@link KeyboardShortcutEventType} keys
 */
export type TypedKeyboardShortcut = Modify<KeyboardShortcut, {
    _uiHotkeyConfigurationType: keyof UiUserPreferences['keyboardShortcuts'];
    _uiHotkeyName: KeyboardShortcutDefinitions;
}>;
/** Union type for click definitions */
export type ClickEventDefinitions = (typeof AllClickEventDefinitions)[number];
/**
 * Type identifying an override for a default hotkey.
 */
export type PreventDefaultHotkeyOverride = Pick<KeyboardShortcut, 'combos'>;
/**
 * All possible double click events
 */
export declare const AllDoubleClickDefinitions: readonly ["associateClickedSignalDetections", "unassociateClickedSignalDetections"];
/** Union type for double click definitions */
export type DoubleClickDefinitions = (typeof AllDoubleClickDefinitions)[number];
/**
 * All possible drag events
 */
export declare const AllDragEventDefinitions: readonly ["zoomToRange", "drawMeasureWindow", "scaleWaveformAmplitude", "createQcSegments", "showRuler"];
/** Union type for drag event definitions */
export type DragEventDefinitions = (typeof AllDragEventDefinitions)[number];
/**
 * All possible scroll events
 */
export declare const AllScrollEventDefinitions: readonly ["zoomMouseWheel"];
/** Union type for scroll event definitions */
export type ScrollEventDefinitions = (typeof AllScrollEventDefinitions)[number];
/**
 * All possible hotkey events
 */
export declare const AllHotkeyDefinitions: readonly ["zoomInOneStep", "zoomOutOneStep", "zoomOutFully", "zas", "createEventBeam", "panRight25", "panLeft25", "panRight75", "panLeft75", "pageDown", "pageUp", "loadLaterData", "locate", "loadEarlierData", "deleteSignalDetection", "scaleAllWaveformAmplitude", "resetSelectedWaveformAmplitudeScaling", "resetAllWaveformAmplitudeScaling", "toggleUncertainty", "editSignalDetectionUncertainty", "toggleQcMaskVisibility", "toggleAlignment", "workflowRightOneDay", "workflowLeftOneDay", "workflowRightOneWeek", "workflowLeftOneWeek", "showKeyboardShortcuts", "toggleSetPhaseMenu", "selectNextFilter", "selectPreviousFilter", "selectUnfiltered", "createNewEvent", "associateSelectedSignalDetections", "unassociateSelectedSignalDetections", "currentPhaseLabel", "defaultPhaseLabel", "historyEventMode", "undo", "redo", "eventUndo", "eventRedo", "toggleCurrentPhaseMenu", "toggleCommandPalette", "hideMeasureWindow", "increaseVisibleWaveforms", "decreaseVisibleWaveforms", "closeCreateSignalDetectionOverlay", "rotate", "loadGmsFromFile", "saveGmsToFile", "saveGmsToFileAs", "nextFk", "selectNextAmplitude", "selectPrevAmplitude", "selectNextUnassociated", "selectPrevUnassociated", "toggleShowEmptyRows", "showFk", "locate", "magnitude"];
/** Union type for hotkey definitions */
export type HotkeyDefinitions = (typeof AllHotkeyDefinitions)[number];
/**
 * All definitions for preventing default hotkey behavior
 */
export declare const AllPreventDefaultDefinitions: readonly ["chromeMenu", "saveFile", "loadFile", "associateSelectedSignalDetections", "selectUnfiltered", "createSignalDetectionWithChosenPhase", "preventPrintPage"];
/** Union type for prevent default definitions */
export type PreventDefaultDefinitions = (typeof AllPreventDefaultDefinitions)[number];
/** Union type of all possible keyboard shortcut names/definitions */
export type KeyboardShortcutDefinitions = ClickEventDefinitions | DoubleClickDefinitions | ScrollEventDefinitions | HotkeyDefinitions;
/**
 * The configuration object describing the 'click' keyboard shortcuts.
 * Enforces that every shortcut definition must be provided.
 */
export type ClickShortcutConfig = {
    [key in ClickEventDefinitions]: KeyboardShortcut;
};
/**
 * The configuration object describing the 'middle click' keyboard shortcuts.
 * Enforces that every shortcut definition must be provided.
 */
export type MiddleClickShortcutConfig = {
    [key in never]: KeyboardShortcut;
};
/**
 * The configuration object describing the 'right click' keyboard shortcuts.
 * Enforces that every shortcut definition must be provided.
 */
export type RightClickShortcutConfig = {
    [key in never]: KeyboardShortcut;
};
/**
 * The configuration object describing the 'double click' keyboard shortcuts.
 * Enforces that every shortcut definition must be provided.
 */
export type DoubleClickShortcutConfig = {
    [key in DoubleClickDefinitions]: KeyboardShortcut;
};
/**
 * The configuration object describing the 'drag' keyboard shortcuts.
 * Enforces that every shortcut definition must be provided.
 */
export type DragShortcutConfig = {
    [key in DragEventDefinitions]: KeyboardShortcut;
};
/**
 * The configuration object describing the 'scroll' keyboard shortcuts.
 * Enforces that every shortcut definition must be provided.
 */
export type ScrollShortcutConfig = {
    [key in ScrollEventDefinitions]: KeyboardShortcut;
};
/**
 * The configuration object describing the 'hotkey' keyboard shortcuts.
 * Enforces that every shortcut definition must be provided.
 */
export type HotkeyShortcutConfig = {
    [key in HotkeyDefinitions]: KeyboardShortcut;
};
/**
 * The configuration object describing the 'hotkey' keyboard shortcuts.
 * Enforces that every shortcut definition must be provided.
 */
export type PreventDefaultConfig = {
    [key in PreventDefaultDefinitions]: PreventDefaultHotkeyOverride;
};
/**
 * Mapping of all keyboard shortcut types and their corresponding possible fields
 */
export interface KeyboardShortcuts {
    clickEvents: ClickShortcutConfig;
    middleClickEvents: MiddleClickShortcutConfig;
    rightClickEvents: RightClickShortcutConfig;
    doubleClickEvents: DoubleClickShortcutConfig;
    dragEvents: DragShortcutConfig;
    scrollEvents: ScrollShortcutConfig;
    hotkeys: HotkeyShortcutConfig;
}
export type PartialKeyboardShortcuts = Modify<KeyboardShortcuts, {
    clickEvents: Partial<ClickShortcutConfig>;
    middleClickEvents: Partial<MiddleClickShortcutConfig>;
    rightClickEvents: Partial<RightClickShortcutConfig>;
    doubleClickEvents: Partial<DoubleClickShortcutConfig>;
    dragEvents: Partial<DragShortcutConfig>;
    scrollEvents: Partial<ScrollShortcutConfig>;
    hotkeys: Partial<HotkeyShortcutConfig>;
}>;
/**
 * Record mapping the keyboard shortcut keys to display strings that are implied by this
 * group of keyboard shortcuts
 */
export declare const ImpliedUserActions: Record<keyof KeyboardShortcuts, string>;
/**
 * A list of mask types for the qc mask dropdown
 */
export declare enum QCMaskTypes {
    ANALYST_DEFINED = "analystDefined",
    DATA_AUTHENTICATION = "dataAuthentication",
    REJECTED = "rejected",
    STATION_SOH = "stationSOH",
    WAVEFORM = "waveform",
    LONG_TERM = "longTerm",
    UNPROCESSED = "unprocessed",
    PROCESSING_MASKS = "processingMask",
    QC_SEGMENTS = "qcSegments"
}
export type QCMaskColorTypes = Exclude<QCMaskTypes, QCMaskTypes.QC_SEGMENTS>;
/**
 * Collection of FK configurations belonging to a specific station type
 */
export interface FKStationTypeConfiguration {
    constantVelocityRings: number[];
    frequencyBands: FkFrequencyRangeWithPrefilter[];
    spectrumWindowDefinitions: FkWindow[];
    filters: Filter[];
}
export interface FkStationTypeConfigurations {
    [StationType.SEISMIC_ARRAY]: FKStationTypeConfiguration;
    [StationType.SEISMIC_3_COMPONENT]: FKStationTypeConfiguration;
    [StationType.HYDROACOUSTIC]: FKStationTypeConfiguration;
    [StationType.HYDROACOUSTIC_ARRAY]: FKStationTypeConfiguration;
    [StationType.INFRASOUND]: FKStationTypeConfiguration;
    [StationType.INFRASOUND_ARRAY]: FKStationTypeConfiguration;
}
/**
 * A rotation phase and workflow definition pair—identifying the default rotation phase
 * for the activity represented by the workflow definition
 */
export interface DefaultRotationPhaseForActivity {
    workflowDefinitionId: string;
    defaultRotationPhase: string;
}
type StationName = string;
type ChannelName = string;
export type DefaultRotatedChannelsRecord = Record<StationName, [ChannelName, ChannelName]>;
/**
 * Processing configuration for rotation
 */
export interface RotationConfiguration {
    /** Creating new rotate waveforms will remove old rotated UiChannelSegments
     * and derived Channel objects if the new rotated waveform is within this
     * tolerance, and if the rotated waveform is for the same station, orientation,
     * and phase */
    readonly rotationReplacementAzimuthToleranceDeg: number;
    /** Default lead time in seconds used if none found per station/phase */
    readonly defaultRotationLeadTime: number;
    /** Default duration in seconds used if none found per station/phase */
    readonly defaultRotationDuration: number;
    /** Default interpolation method if none found per station/phase */
    readonly defaultRotationInterpolation: string;
    /** Default phase to use per activity */
    readonly defaultRotationPhaseByActivity: DefaultRotationPhaseForActivity[];
    /** Friendly names of interpolation methods */
    interpolationMethods: Record<string, string>;
    /** Detailed help text describing how rotation works for the dialog tooltip */
    rotationDescription: string;
    /** Channels that will be rotated by default if no selections are made */
    defaultRotatedChannels: DefaultRotatedChannelsRecord;
}
/** Types are required to be reviewed by processing activity within UI Processing Configuration */
export interface RequiredAmplitudeType {
    readonly ampReviewPhases: string[];
    readonly requiredAmpType: string[];
}
/**
 * Defines the analyst configuration specific for Event Location.
 */
export interface LocationConfiguration {
    readonly allFirstPs: string[];
    readonly locationSolutionSortOrder: Restraint[];
}
/**
 * Defines the analyst configuration specific for Event Location.
 */
export interface MagnitudeConfiguration {
    readonly magnitudeTypes: MagnitudeType[];
    readonly noiseNonNoisePhaseList: Record<string, string>;
    readonly noisePhaseList: string[];
}
/**
 * Interface for the UI Processing Configuration
 */
export interface ProcessingAnalystConfiguration {
    readonly defaultNetwork: string;
    readonly defaultInteractiveAnalysisStationGroup: string;
    readonly defaultFilters: WaveformFilter[];
    readonly defaultSDTimeUncertainty: number;
    readonly currentIntervalEndTime: number;
    readonly currentIntervalDuration: number;
    readonly geoRegionCategoryStyleMappings: GeoRegionStyleCategoryMapping[];
    readonly maximumOpenAnythingDuration: number;
    readonly fixedAmplitudeScaleValues: number[];
    readonly qcMaskTypeVisibilities: Record<QCMaskTypes, boolean>;
    readonly leadBufferDuration: number;
    readonly lagBufferDuration: number;
    readonly uiThemes: UITheme[];
    readonly zasDefaultAlignmentPhase: string;
    readonly zasZoomInterval: number;
    readonly phasesWithoutPredictions: string[];
    /**
     * The configuration values used for the GMS filtering algorithm
     */
    readonly phaseLists: PhaseList[];
    readonly gmsFilters: {
        readonly defaultTaper: number;
        readonly defaultRemoveGroupDelay: boolean;
        readonly defaultSampleRateToleranceHz: number;
        readonly defaultGroupDelaySecs: number;
        readonly defaultDesignedSampleRates: number[];
    };
    readonly unassociatedSignalDetectionLengthMeters: number;
    readonly minimumRequestDuration: number;
    readonly stations: {
        readonly stationsDialog: {
            infoText: string;
        };
    };
    readonly waveform: {
        readonly analysisModeSettings: Record<AnalysisMode, AnalysisModeSettings>;
        readonly panningBoundaryDuration: number;
        readonly panRatio: number;
        readonly trimWaveformLead: number;
        readonly trimWaveformDuration: number;
        readonly trimWaveformRetimeThreshold: number;
    };
    readonly workflow: {
        readonly panSingleArrow: number;
        readonly panDoubleArrow: number;
    };
    readonly endpointConfigurations: {
        readonly maxParallelRequests: number;
        readonly getEventsWithDetectionsAndSegmentsByTime: {
            readonly maxTimeRangeRequestInSeconds: number;
        };
        readonly fetchQcSegmentsByChannelsAndTime: {
            readonly maxTimeRangeRequestInSeconds: number;
        };
    };
    readonly defaultDeletedEventVisibility: boolean;
    readonly defaultRejectedEventVisibility: boolean;
    readonly defaultDeletedSignalDetectionVisibility: boolean;
    readonly beamAndFkInputChannelPrioritization: string[];
    readonly fkConfigurations: {
        readonly fkStationTypeConfigurations: FkStationTypeConfigurations;
        readonly keyActivityPhases: Record<string, string[]>;
        readonly fkRetimeThresholdSeconds: number;
        readonly invalidFkPhaseList: string[];
    };
    readonly amplitudeMeasurement: {
        readonly ampMeasurementZoomWindow: number;
        readonly peakTroughSelectionBorderWidth: number;
        readonly requiredAmplitudeTypes: Record<string, RequiredAmplitudeType>;
    };
    readonly beamforming: {
        readonly expandedTimeBuffer: number;
        readonly beamChannelThreshold: number;
        readonly createEventBeamsDescription: string;
        readonly beamDuration: number;
        readonly leadDuration: number;
        readonly beamSummationMethods: Record<string, string>;
        readonly interpolationMethods: Record<string, string>;
        readonly defaultSummationMethod: string;
        readonly defaultInterpolationMethod: string;
    };
    readonly keyboardShortcuts: KeyboardShortcuts;
    readonly preventBrowserDefaults: PreventDefaultConfig;
    readonly rotation: RotationConfiguration;
    readonly location: LocationConfiguration;
    readonly magnitude: MagnitudeConfiguration;
}
/**
 * Interface for the Operational Time Period Configuration
 */
export interface OperationalTimePeriodConfiguration {
    readonly operationalPeriodStart: number;
    readonly operationalPeriodEnd: number;
}
/**
 * Interface for the Station Group Names Configuration
 */
export interface StationGroupNamesConfiguration {
    readonly stationGroupNames: string[];
}
/**
 * Interface for the monitoring organization Configuration
 */
export interface MonitoringOrganizationConfiguration {
    readonly monitoringOrganization: string;
}
/**
 * phase list for ui processing config
 */
export interface PhaseList {
    favorites: string[];
    defaultPhaseLabelAssignment: string;
    listTitle: string;
    categorizedPhases: CategorizedPhase[];
}
export interface CategorizedPhase {
    categoryTitle: string;
    phases: string[];
}
/**
 * Selector interface for config service
 */
export interface Selector {
    criterion: string;
    value: string;
}
/**
 * Analyst configurations loaded from service
 */
export declare enum AnalystConfigs {
    DEFAULT = "ui.analyst-settings"
}
/**
 * Common configurations loaded from service
 */
export declare enum CommonConfigs {
    DEFAULT = "ui.common-settings"
}
/**
 * Operational time periods loaded from service
 */
export declare enum OperationalTimePeriodConfigs {
    DEFAULT = "global.operational-time-period"
}
/**
 * IAN Station Definition station group names loaded from service
 */
export declare enum StationGroupNamesConfig {
    DEFAULT = "station-definition-manager.station-group-names"
}
/**
 * Monitoring organization loaded from service
 */
export declare enum MonitoringOrganizationConfig {
    DEFAULT = "global.monitoring-org"
}
/**
 * UI Analyst Processing Configuration Default Values
 */
export declare const defaultUnassociatedSignalDetectionLengthMeters = 11100000;
/**
 * The default colors for the fallback @interface UITheme (what is loaded if no theme is found).
 */
export declare const defaultColorTheme: ColorTheme;
export {};
//# sourceMappingURL=types.d.ts.map