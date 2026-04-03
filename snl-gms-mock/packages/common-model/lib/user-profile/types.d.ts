import type { ColorMapName } from '../color/types';
import type { IanDisplays } from '../displays/types';
import type { EntityReference } from '../faceted';
import type { FilterList } from '../filter';
import type { FkThumbnailSize } from '../fk';
import type { Station } from '../station-definitions/station-definitions';
import type { Modify } from '../type-util/type-util';
import type { ClickEventDefinitions, DoubleClickDefinitions, DragEventDefinitions, HotkeyDefinitions, KeyboardShortcuts, ScrollEventDefinitions, UITheme } from '../ui-configuration/types';
export declare const ANALYST_LAYOUT = "ANALYST_LAYOUT";
export declare const AllHideEmptyWaveformRows: readonly ["ALWAYS_ON", "ALWAYS_OFF", "PER_MODE"];
export type HideEmptyWaveformRows = (typeof AllHideEmptyWaveformRows)[number];
export declare const AllNumberVisibleWaveformsOptions: readonly ["PER_MODE", "CUSTOM"];
export type NumberVisibleWaveformsOption = (typeof AllNumberVisibleWaveformsOptions)[number];
export interface GlobalPreferences {
    readonly colorMap: ColorMapName;
    readonly currentTheme: UITheme['name'];
    readonly hideEmptyWaveformRows: HideEmptyWaveformRows;
    readonly numberVisibleWaveformsOption: NumberVisibleWaveformsOption;
    readonly customNumberVisibleWaveforms: number;
}
type GlobalPreferencesKey = keyof GlobalPreferences;
export type GlobalPreferencesProperty = GlobalPreferences[GlobalPreferencesKey];
export interface WorkspaceLayout {
    readonly name: string;
    readonly layoutConfiguration: string;
}
export declare enum MapLayers {
    regions = "regions",
    stations = "stations",
    sites = "sites",
    signalDetections = "signalDetections",
    events = "events",
    eventsDeleted = "eventsDeleted",
    eventsRejected = "eventsRejected",
    preferredLocationSolution = "preferredLocationSolution",
    edgeEventsBeforeInterval = "edgeEventsBeforeInterval",
    edgeEventsAfterInterval = "edgeEventsAfterInterval",
    nonPreferredLocationSolution = "nonPreferredLocationSolution",
    confidenceEllipse = "confidenceEllipse",
    coverageEllipse = "coverageEllipse",
    edgeDetectionBefore = "edgeDetectionBefore",
    edgeDetectionAfter = "edgeDetectionAfter",
    unassociatedDetection = "unassociatedDetection",
    associatedOpenDetection = "associatedOpenDetection",
    associatedOtherDetection = "associatedOtherDetection",
    associatedCompleteDetection = "associatedCompleteDetection",
    deletedDetection = "deletedDetection"
}
export interface MapDisplaySettings {
    readonly twoDimensional: boolean;
    readonly layerVisibility: Record<string, boolean>;
    readonly syncToWaveformDisplayVisibleTimeRange: boolean;
}
export type MapDisplaySettingsKey = keyof MapDisplaySettings;
export type MapDisplaySettingsProperty = MapDisplaySettings[MapDisplaySettingsKey];
/**
 * used to populate the values of the SD column picker dropdown, and match
 * the values to the table column ids
 */
export declare enum SignalDetectionColumn {
    unsavedChanges = "unsavedChanges",
    assocStatus = "assocStatus",
    conflict = "conflict",
    station = "station",
    channel = "channel",
    phase = "phase",
    phaseConfidence = "phaseConfidence",
    time = "time",
    timeUncertainty = "timeUncertainty",
    azimuth = "azimuth",
    azimuthStandardDeviation = "azimuthStandardDeviation",
    slowness = "slowness",
    slownessStandardDeviation = "slownessStandardDeviation",
    amplitude = "amplitude",
    period = "period",
    amplitudeType = "amplitudeType",
    sNR = "sNR",
    rectilinearity = "rectilinearity",
    emergenceAngle = "emergenceAngle",
    shortPeriodFirstMotion = "shortPeriodFirstMotion",
    longPeriodFirstMotion = "longPeriodFirstMotion",
    deleted = "deleted"
}
/**
 * Displayed signal detection configuration options for Signal Detections List Display
 */
export declare enum DisplayedSignalDetectionConfigurationEnum {
    syncWaveform = "syncWaveform",
    signalDetectionBeforeInterval = "signalDetectionBeforeInterval",
    signalDetectionAfterInterval = "signalDetectionAfterInterval",
    signalDetectionAssociatedToOpenEvent = "signalDetectionAssociatedToOpenEvent",
    signalDetectionAssociatedToCompletedEvent = "signalDetectionAssociatedToCompletedEvent",
    signalDetectionAssociatedToOtherEvent = "signalDetectionAssociatedToOtherEvent",
    signalDetectionConflicts = "signalDetectionConflicts",
    signalDetectionDeleted = "signalDetectionDeleted",
    signalDetectionUnassociated = "signalDetectionUnassociated"
}
/**
 * Enumerated column names for the event table
 */
export declare enum EventsColumn {
    unsavedChanges = "unsavedChanges",
    conflict = "conflict",
    time = "time",
    timeUncertainty = "timeUncertainty",
    latitudeDegrees = "latitudeDegrees",
    longitudeDegrees = "longitudeDegrees",
    depthKm = "depthKm",
    depthUncertainty = "depthUncertainty",
    magnitudeMb = "magnitudeMb",
    magnitudeMs = "magnitudeMs",
    magnitudeMl = "magnitudeMl",
    numberAssociated = "numberAssociated",
    numberDefining = "numberDefining",
    observationsStandardDeviation = "observationsStandardDeviation",
    coverageSemiMajorAxis = "coverageSemiMajorAxis",
    coverageSemiMinorAxis = "coverageSemiMinorAxis",
    coverageSemiMajorTrend = "coverageSemiMajorTrend",
    coverageAreaOfEllipse = "coverageAreaOfEllipse",
    confidenceSemiMajorAxis = "confidenceSemiMajorAxis",
    confidenceSemiMinorAxis = "confidenceSemiMinorAxis",
    confidenceSemiMajorTrend = "confidenceSemiMajorTrend",
    confidenceAreaOfEllipse = "confidenceAreaOfEllipse",
    kWeight = "kWeight",
    kWeightedSemiMajorAxisLengthKm = "kWeightedSemiMajorAxisLengthKm",
    kWeightedSemiMinorAxisLengthKm = "kWeightedSemiMinorAxisLengthKm",
    kWeightedSemiMajorAxisTrendDeg = "kWeightedSemiMajorAxisTrendDeg",
    kWeightedAreaOfEllipse = "kWeightedAreaOfEllipse",
    region = "region",
    activeAnalysts = "activeAnalysts",
    preferred = "preferred",
    status = "status",
    rejected = "rejected",
    deleted = "deleted"
}
/**
 * Displayed events configuration options for Events Display
 */
export declare enum DisplayedEventsConfigurationEnum {
    edgeEventsBeforeInterval = "edgeEventsBeforeInterval",
    edgeEventsAfterInterval = "edgeEventsAfterInterval",
    eventsCompleted = "eventsCompleted",
    eventsRemaining = "eventsRemaining",
    eventsConflict = "eventsConflict",
    eventsDeleted = "eventsDeleted",
    eventsRejected = "eventsRejected"
}
/**
 * Displayed signal detection configuration options for Waveform Display
 */
export declare enum WaveformDisplayedSignalDetectionConfigurationEnum {
    signalDetectionBeforeInterval = "signalDetectionBeforeInterval",
    signalDetectionAfterInterval = "signalDetectionAfterInterval",
    signalDetectionAssociatedToOpenEvent = "signalDetectionAssociatedToOpenEvent",
    signalDetectionAssociatedToCompletedEvent = "signalDetectionAssociatedToCompletedEvent",
    signalDetectionAssociatedToOtherEvent = "signalDetectionAssociatedToOtherEvent",
    signalDetectionConflicts = "signalDetectionConflicts",
    signalDetectionDeleted = "signalDetectionDeleted",
    signalDetectionUnassociated = "signalDetectionUnassociated"
}
/**
 * Enumerated column names for the location history table.
 */
export declare enum LocationHistoryColumn {
    preferred = "preferred",
    time = "time",
    timeUncertainty = "timeUncertainty",
    latitudeDegrees = "latitudeDegrees",
    longitudeDegrees = "longitudeDegrees",
    depthKm = "depthKm",
    depthUncertainty = "depthUncertainty",
    restraint = "restraint",
    stdDevTravelTimeResiduals = "stdDevTravelTimeResiduals",
    numberOfAssociated = "numberOfAssociated",
    numberOfDefining = "numberOfDefining",
    region = "region",
    coverageSemiMajorAxisLengthKm = "coverageSemiMajorAxisLengthKm",
    coverageSemiMinorAxisLengthKm = "coverageSemiMinorAxisLengthKm",
    coverageSemiMajorAxisTrendDeg = "coverageSemiMajorAxisTrendDeg",
    coverageAreaOfEllipse = "coverageAreaOfEllipse",
    confidenceSemiMajorAxisLengthKm = "confidenceSemiMajorAxisLengthKm",
    confidenceSemiMinorAxisLengthKm = "confidenceSemiMinorAxisLengthKm",
    confidenceSemiMajorAxisTrendDeg = "confidenceSemiMajorAxisTrendDeg",
    confidenceAreaOfEllipse = "confidenceAreaOfEllipse",
    kWeight = "kWeight",
    kWeightedSemiMajorAxisLengthKm = "kWeightedSemiMajorAxisLengthKm",
    kWeightedSemiMinorAxisLengthKm = "kWeightedSemiMinorAxisLengthKm",
    kWeightedSemiMajorAxisTrendDeg = "kWeightedSemiMajorAxisTrendDeg",
    kWeightedAreaOfEllipse = "kWeightedAreaOfEllipse"
}
/** String used to capture mag types spacer for columns to keep tables sizes in sync */
export declare const COLUMN_SPACER_PREFIX = "spacer__";
/**
 * Enumerated column names for the network magnitude table.
 */
export declare enum NetworkMagnitudeColumn {
    restraint = "restraint",
    preferred = "preferred",
    magnitude__MB = "magnitude__MB",
    stdDev__MB = "stdDev__MB",
    defining__MB = "defining__MB",
    nonDefining__MB = "nonDefining__MB",
    magnitude__MB_CODA = "magnitude__MB_CODA",
    stdDev__MB_CODA = "stdDev__MB_CODA",
    defining__MB_CODA = "defining__MB_CODA",
    nonDefining__MB_CODA = "nonDefining__MB_CODA",
    magnitude__MB_MB = "magnitude__MB_MB",
    stdDev__MB_MB = "stdDev__MB_MB",
    defining__MB_MB = "defining__MB_MB",
    nonDefining__MB_MB = "nonDefining__MB_MB",
    magnitude__MB_MLE = "magnitude__MB_MLE",
    stdDev__MB_MLE = "stdDev__MB_MLE",
    defining__MB_MLE = "defining__MB_MLE",
    nonDefining__MB_MLE = "nonDefining__MB_MLE",
    detecting__MB_MLE = "detecting__MB_MLE",
    nonDetecting__MB_MLE = "nonDetecting__MB_MLE",
    magnitude__MB_PG = "magnitude__MB_PG",
    stdDev__MB_PG = "stdDev__MB_PG",
    defining__MB_PG = "defining__MB_PG",
    nonDefining__MB_PG = "nonDefining__MB_PG",
    magnitude__MB_REL_T = "magnitude__MB_REL_T",
    stdDev__MB_REL_T = "stdDev__MB_REL_T",
    defining__MB_REL_T = "defining__MB_REL_T",
    nonDefining__MB_REL_T = "nonDefining__MB_REL_T",
    magnitude__ML = "magnitude__ML",
    stdDev__ML = "stdDev__ML",
    defining__ML = "defining__ML",
    nonDefining__ML = "nonDefining__ML",
    magnitude__MS = "magnitude__MS",
    stdDev__MS = "stdDev__MS",
    defining__MS = "defining__MS",
    nonDefining__MS = "nonDefining__MS",
    magnitude__MS_MLE = "magnitude__MS_MLE",
    stdDev__MS_MLE = "stdDev__MS_MLE",
    defining__MS_MLE = "defining__MS_MLE",
    nonDefining__MS_MLE = "nonDefining__MS_MLE",
    detecting__MS_MLE = "detecting__MS_MLE",
    nonDetecting__MS_MLE = "nonDetecting__MS_MLE",
    magnitude__MS_VMAX = "magnitude__MS_VMAX",
    stdDev__MS_VMAX = "stdDev__MS_VMAX",
    defining__MS_VMAX = "defining__MS_VMAX",
    nonDefining__MS_VMAX = "nonDefining__MS_VMAX",
    magnitude__MW_CODA = "magnitude__MW_CODA",
    stdDev__MW_CODA = "stdDev__MW_CODA",
    defining__MW_CODA = "defining__MW_CODA",
    nonDefining__MW_CODA = "nonDefining__MW_CODA"
}
/**
 * Enumerated column names for the network magnitude table.
 */
export declare enum StationMagnitudeColumn {
    az = "az",
    station = "station",
    distance = "distance",
    channel__MB = "channel__MB",
    phase__MB = "phase__MB",
    amplitude__MB = "amplitude__MB",
    period__MB = "period__MB",
    mag__MB = "mag__MB",
    residual__MB = "residual__MB",
    used__MB = "used__MB",
    defining__MB = "defining__MB",
    channel__MB_CODA = "channel__MB_CODA",
    phase__MB_CODA = "phase__MB_CODA",
    amplitude__MB_CODA = "amplitude__MB_CODA",
    period__MB_CODA = "period__MB_CODA",
    mag__MB_CODA = "mag__MB_CODA",
    residual__MB_CODA = "residual__MB_CODA",
    used__MB_CODA = "used__MB_CODA",
    defining__MB_CODA = "defining__MB_CODA",
    channel__MB_MB = "channel__MB_MB",
    phase__MB_MB = "phase__MB_MB",
    amplitude__MB_MB = "amplitude__MB_MB",
    period__MB_MB = "period__MB_MB",
    mag__MB_MB = "mag__MB_MB",
    residual__MB_MB = "residual__MB_MB",
    used__MB_MB = "used__MB_MB",
    defining__MB_MB = "defining__MB_MB",
    channel__MB_MLE = "channel__MB_MLE",
    phase__MB_MLE = "phase__MB_MLE",
    amplitude__MB_MLE = "amplitude__MB_MLE",
    period__MB_MLE = "period__MB_MLE",
    mag__MB_MLE = "mag__MB_MLE",
    residual__MB_MLE = "residual__MB_MLE",
    used__MB_MLE = "used__MB_MLE",
    defining__MB_MLE = "defining__MB_MLE",
    channel__MB_PG = "channel__MB_PG",
    phase__MB_PG = "phase__MB_PG",
    amplitude__MB_PG = "amplitude__MB_PG",
    period__MB_PG = "period__MB_PG",
    mag__MB_PG = "mag__MB_PG",
    residual__MB_PG = "residual__MB_PG",
    used__MB_PG = "used__MB_PG",
    defining__MB_PG = "defining__MB_PG",
    channel__MB_REL_T = "channel__MB_REL_T",
    phase__MB_REL_T = "phase__MB_REL_T",
    amplitude__MB_REL_T = "amplitude__MB_REL_T",
    period__MB_REL_T = "period__MB_REL_T",
    mag__MB_REL_T = "mag__MB_REL_T",
    residual__MB_REL_T = "residual__MB_REL_T",
    used__MB_REL_T = "used__MB_REL_T",
    defining__MB_REL_T = "defining__MB_REL_T",
    channel__ML = "channel__ML",
    phase__ML = "phase__ML",
    amplitude__ML = "amplitude__ML",
    period__ML = "period__ML",
    mag__ML = "mag__ML",
    residual__ML = "residual__ML",
    used__ML = "used__ML",
    defining__ML = "defining__ML",
    channel__MS = "channel__MS",
    phase__MS = "phase__MS",
    amplitude__MS = "amplitude__MS",
    period__MS = "period__MS",
    mag__MS = "mag__MS",
    residual__MS = "residual__MS",
    used__MS = "used__MS",
    defining__MS = "defining__MS",
    channel__MS_MLE = "channel__MS_MLE",
    phase__MS_MLE = "phase__MS_MLE",
    amplitude__MS_MLE = "amplitude__MS_MLE",
    period__MS_MLE = "period__MS_MLE",
    mag__MS_MLE = "mag__MS_MLE",
    residual__MS_MLE = "residual__MS_MLE",
    used__MS_MLE = "used__MS_MLE",
    defining__MS_MLE = "defining__MS_MLE",
    channel__MS_VMAX = "channel__MS_VMAX",
    phase__MS_VMAX = "phase__MS_VMAX",
    amplitude__MS_VMAX = "amplitude__MS_VMAX",
    period__MS_VMAX = "period__MS_VMAX",
    mag__MS_VMAX = "mag__MS_VMAX",
    residual__MS_VMAX = "residual__MS_VMAX",
    used__MS_VMAX = "used__MS_VMAX",
    defining__MS_VMAX = "defining__MS_VMAX",
    channel__MW_CODA = "channel__MW_CODA",
    phase__MW_CODA = "phase__MW_CODA",
    amplitude__MW_CODA = "amplitude__MW_CODA",
    period__MW_CODA = "period__MW_CODA",
    mag__MW_CODA = "mag__MW_CODA",
    residual__MW_CODA = "residual__MW_CODA",
    used__MW_CODA = "used__MW_CODA",
    defining__MW_CODA = "defining__MW_CODA"
}
/**
 * Enumerated column names for the location history association table.
 */
export declare enum LocationHistoryAssociationColumn {
    station = "station",
    channel = "channel",
    phase = "phase",
    distance = "distance",
    az = "az",
    arrivalTimeObserved = "arrivalTimeObserved",
    arrivalTimeStdDev = "arrivalTimeStdDev",
    arrivalTimeResidual = "arrivalTimeResidual",
    arrivalTimeUsed = "arrivalTimeUsed",
    arrivalTimeDefining = "arrivalTimeDefining",
    azimuthObserved = "azimuthObserved",
    azimuthStdDev = "azimuthStdDev",
    azimuthResidual = "azimuthResidual",
    azimuthUsed = "azimuthUsed",
    azimuthDefining = "azimuthDefining",
    slownessObserved = "slownessObserved",
    slownessStdDev = "slownessStdDev",
    slownessResidual = "slownessResidual",
    slownessUsed = "slownessUsed",
    slownessDefining = "slownessDefining"
}
/**
 * used to populate the values of the Station Properties Display site column picker dropdown, and match the values to the table column ids
 */
export declare enum SiteColumn {
    name = "name",
    effectiveAt = "effectiveAt",
    effectiveUntil = "effectiveUntil",
    latitudeDegrees = "latitudeDegrees",
    longitudeDegrees = "longitudeDegrees",
    depthKm = "depthKm",
    elevationKm = "elevationKm",
    type = "type",
    description = "description"
}
/**
 * used to populate the values of the Station Properties Display channel column picker dropdown, and match the values to the table column ids
 */
export declare enum ChannelColumn {
    name = "name",
    effectiveAt = "effectiveAt",
    effectiveUntil = "effectiveUntil",
    latitudeDegrees = "latitudeDegrees",
    longitudeDegrees = "longitudeDegrees",
    depthKm = "depthKm",
    elevationKm = "elevationKm",
    nominalSampleRateHz = "nominalSampleRateHz",
    units = "units",
    orientationHorizontalDegrees = "orientationHorizontalDegrees",
    orientationVerticalDegrees = "orientationVerticalDegrees",
    calibrationFactor = "calibrationFactor",
    calibrationPeriod = "calibrationPeriod",
    calibrationEffectiveAt = "calibrationEffectiveAt",
    calibrationTimeShift = "calibrationTimeShift",
    calibrationStandardDeviation = "calibrationStandardDeviation",
    northDisplacementKm = "northDisplacementKm",
    eastDisplacementKm = "eastDisplacementKm",
    verticalDisplacementKm = "verticalDisplacementKm",
    description = "description",
    channelDataType = "channelDataType",
    channelBandType = "channelBandType",
    channelInstrumentType = "channelInstrumentType",
    channelOrientationCode = "channelOrientationCode",
    channelOrientationType = "channelOrientationType",
    calibrationResponseId = "calibrationResponseId",
    fapResponseId = "fapResponseId"
}
/**
 * Column names for the FK Properties table
 */
export declare enum FkPropertiesColumn {
    description = "description",
    peak = "peak",
    predicted = "predicted",
    measured = "measured",
    residual = "residual"
}
/**
 * Base interface for display layouts utilizing tables, e.g., Azimuth-Slowness or Events
 */
export interface TabularDisplayLayout {
    /** Record of `{ columnId: isVisible }` */
    readonly columnVisibility: Record<string, boolean>;
    /** Record of `{ columnId: 'left' | 'right' }` */
    readonly pinnedColumns: Record<string, 'left' | 'right'>;
    readonly columnOrder: string[];
    /** Record of `{ columnId: columnWidthPixels }` */
    readonly columnWidths: Record<string, number>;
}
export type TabularDisplayLayoutKey = keyof TabularDisplayLayout;
export type TabularDisplayColumnWidths = {
    colId: string;
    width: number;
}[];
export type TabularDisplayLayoutProperty = TabularDisplayLayout[Exclude<TabularDisplayLayoutKey, 'columnWidths'>] | TabularDisplayColumnWidths;
export interface DualDisplayLayout {
    displayOne: TabularDisplayLayout;
    displayTwo: TabularDisplayLayout;
}
type DualDisplayLayoutKey = keyof DualDisplayLayout;
export type TableDisplayNamePath = [
    displayKey: IanDisplays,
    ...dualDisplayKeys: DualDisplayLayoutKey[]
];
export interface SignalDetectionDisplayLayout extends TabularDisplayLayout {
    /** Record of `{ signalDetectionType: isVisible }` */
    readonly visibleSignalDetections: Record<string, boolean>;
}
export interface EventDisplayLayout extends TabularDisplayLayout {
    /** Record of `{ eventType: isVisible }` */
    readonly visibleEvents: Record<string, boolean>;
}
export interface AzimuthSlownessDisplayLayout extends Pick<TabularDisplayLayout, 'columnOrder'> {
    readonly thumbnailSize: FkThumbnailSize;
    readonly thumbnailColumnWidth: number;
    /** Denotes if FK step lines should be displayed in beams/traces panel */
    readonly fkStepsVisible: boolean;
    /** Denotes if frequency preview thumbnails should be displayed */
    readonly fkPreviewsVisible: boolean;
    /** Denotes if beams and traces panel is visible */
    readonly fkBeamsAndTracesVisible: boolean;
}
export interface LocationDisplayLayout extends Pick<DualDisplayLayout, 'displayOne'> {
    displayTwo: Omit<TabularDisplayLayout, 'pinnedColumns'>;
}
export interface MagnitudeDisplayLayout extends DualDisplayLayout {
    /** Record of `{ magnitudeType: isVisible }` */
    visibleMagnitudeTypes: Record<string, boolean>;
}
export type AzimuthSlownessPreferencesKey = Exclude<keyof AzimuthSlownessDisplayLayout, TabularDisplayLayout>;
export type AzimuthSlownessPreferencesProperty = AzimuthSlownessDisplayLayout[AzimuthSlownessPreferencesKey];
export interface WaveformDisplayLayout {
    readonly visibleSignalDetections: Record<string, boolean>;
}
export interface StationVisibilityList {
    readonly name: string;
    readonly stations: EntityReference<'name', Station>[];
}
/**
 * User UserLayout COI
 *
 * A URI encoded json representation of a golden layout.
 * Includes metadata like supported user interface modes and the name of the layout.
 */
export interface UserLayout {
    readonly name: string;
    readonly layoutConfiguration: string;
}
/**  User profile COI */
export interface UserProfile {
    readonly userId: string;
    readonly userPreferences: UiUserPreferences;
}
export interface DisplayLayouts {
    [IanDisplays.AZIMUTH_SLOWNESS]: AzimuthSlownessDisplayLayout;
    [IanDisplays.EVENTS]: EventDisplayLayout;
    [IanDisplays.SIGNAL_DETECTIONS]: SignalDetectionDisplayLayout;
    [IanDisplays.LOCATION]: LocationDisplayLayout;
    [IanDisplays.STATION_PROPERTIES]: DualDisplayLayout;
    [IanDisplays.MAGNITUDE]: MagnitudeDisplayLayout;
}
/**
 * KeyboardShortcuts collection specific to userPreferences.
 * Each shortcut type maps to a keyboardShortcut name and a list of additional combo strings
 *
 * @example
 * {
 *   clickEvents: {
 *     associateSelectedSignalDetections: ["shift+0"]
 *   }
 * }
 */
export type UserPreferencesKeyboardShortcuts = Modify<KeyboardShortcuts, {
    clickEvents: Partial<Record<ClickEventDefinitions, string[]>>;
    middleClickEvents: Partial<Record<never, string[]>>;
    rightClickEvents: Partial<Record<never, string[]>>;
    doubleClickEvents: Partial<Record<DoubleClickDefinitions, string[]>>;
    dragEvents: Partial<Record<DragEventDefinitions, string[]>>;
    scrollEvents: Partial<Record<ScrollEventDefinitions, string[]>>;
    hotkeys: Partial<Record<HotkeyDefinitions, string[]>>;
}>;
/**
 * Holds info about choices the choices a user has made about displays in the UI
 */
export interface UiUserPreferences {
    readonly defaultWorkspaceLayout: string;
    readonly globalPreferences: GlobalPreferences;
    readonly workspaceLayouts: WorkspaceLayout[];
    readonly customFilterList?: FilterList;
    readonly mapDisplaySettings: MapDisplaySettings;
    readonly displayLayouts: DisplayLayouts;
    readonly waveformDisplayLayout: WaveformDisplayLayout;
    readonly stationVisibilityLists: StationVisibilityList[];
    readonly keyboardShortcuts: UserPreferencesKeyboardShortcuts;
}
export {};
//# sourceMappingURL=types.d.ts.map