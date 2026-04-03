// Fallback value for golden layout panel
export const ANALYST_LAYOUT = 'ANALYST_LAYOUT';
export const AllHideEmptyWaveformRows = [
    /** if the empty waveform rows are always hidden */
    'ALWAYS_ON',
    /** if the empty waveform rows are never hidden */
    'ALWAYS_OFF',
    /** if whether the empty waveform rows are hidden is based on WaveformMode */
    'PER_MODE'
];
export const AllNumberVisibleWaveformsOptions = ['PER_MODE', 'CUSTOM'];
export var MapLayers;
(function (MapLayers) {
    MapLayers["regions"] = "regions";
    MapLayers["stations"] = "stations";
    MapLayers["sites"] = "sites";
    MapLayers["signalDetections"] = "signalDetections";
    MapLayers["events"] = "events";
    MapLayers["eventsDeleted"] = "eventsDeleted";
    MapLayers["eventsRejected"] = "eventsRejected";
    MapLayers["preferredLocationSolution"] = "preferredLocationSolution";
    MapLayers["edgeEventsBeforeInterval"] = "edgeEventsBeforeInterval";
    MapLayers["edgeEventsAfterInterval"] = "edgeEventsAfterInterval";
    MapLayers["nonPreferredLocationSolution"] = "nonPreferredLocationSolution";
    MapLayers["confidenceEllipse"] = "confidenceEllipse";
    MapLayers["coverageEllipse"] = "coverageEllipse";
    MapLayers["edgeDetectionBefore"] = "edgeDetectionBefore";
    MapLayers["edgeDetectionAfter"] = "edgeDetectionAfter";
    MapLayers["unassociatedDetection"] = "unassociatedDetection";
    MapLayers["associatedOpenDetection"] = "associatedOpenDetection";
    MapLayers["associatedOtherDetection"] = "associatedOtherDetection";
    MapLayers["associatedCompleteDetection"] = "associatedCompleteDetection";
    MapLayers["deletedDetection"] = "deletedDetection";
})(MapLayers || (MapLayers = {}));
/**
 * used to populate the values of the SD column picker dropdown, and match
 * the values to the table column ids
 */
export var SignalDetectionColumn;
(function (SignalDetectionColumn) {
    SignalDetectionColumn["unsavedChanges"] = "unsavedChanges";
    SignalDetectionColumn["assocStatus"] = "assocStatus";
    SignalDetectionColumn["conflict"] = "conflict";
    SignalDetectionColumn["station"] = "station";
    SignalDetectionColumn["channel"] = "channel";
    SignalDetectionColumn["phase"] = "phase";
    SignalDetectionColumn["phaseConfidence"] = "phaseConfidence";
    SignalDetectionColumn["time"] = "time";
    SignalDetectionColumn["timeUncertainty"] = "timeUncertainty";
    SignalDetectionColumn["azimuth"] = "azimuth";
    SignalDetectionColumn["azimuthStandardDeviation"] = "azimuthStandardDeviation";
    SignalDetectionColumn["slowness"] = "slowness";
    SignalDetectionColumn["slownessStandardDeviation"] = "slownessStandardDeviation";
    SignalDetectionColumn["amplitude"] = "amplitude";
    SignalDetectionColumn["period"] = "period";
    SignalDetectionColumn["amplitudeType"] = "amplitudeType";
    SignalDetectionColumn["sNR"] = "sNR";
    SignalDetectionColumn["rectilinearity"] = "rectilinearity";
    SignalDetectionColumn["emergenceAngle"] = "emergenceAngle";
    SignalDetectionColumn["shortPeriodFirstMotion"] = "shortPeriodFirstMotion";
    SignalDetectionColumn["longPeriodFirstMotion"] = "longPeriodFirstMotion";
    SignalDetectionColumn["deleted"] = "deleted";
})(SignalDetectionColumn || (SignalDetectionColumn = {}));
/**
 * Displayed signal detection configuration options for Signal Detections List Display
 */
export var DisplayedSignalDetectionConfigurationEnum;
(function (DisplayedSignalDetectionConfigurationEnum) {
    DisplayedSignalDetectionConfigurationEnum["syncWaveform"] = "syncWaveform";
    DisplayedSignalDetectionConfigurationEnum["signalDetectionBeforeInterval"] = "signalDetectionBeforeInterval";
    DisplayedSignalDetectionConfigurationEnum["signalDetectionAfterInterval"] = "signalDetectionAfterInterval";
    DisplayedSignalDetectionConfigurationEnum["signalDetectionAssociatedToOpenEvent"] = "signalDetectionAssociatedToOpenEvent";
    DisplayedSignalDetectionConfigurationEnum["signalDetectionAssociatedToCompletedEvent"] = "signalDetectionAssociatedToCompletedEvent";
    DisplayedSignalDetectionConfigurationEnum["signalDetectionAssociatedToOtherEvent"] = "signalDetectionAssociatedToOtherEvent";
    DisplayedSignalDetectionConfigurationEnum["signalDetectionConflicts"] = "signalDetectionConflicts";
    DisplayedSignalDetectionConfigurationEnum["signalDetectionDeleted"] = "signalDetectionDeleted";
    DisplayedSignalDetectionConfigurationEnum["signalDetectionUnassociated"] = "signalDetectionUnassociated";
})(DisplayedSignalDetectionConfigurationEnum || (DisplayedSignalDetectionConfigurationEnum = {}));
/**
 * Enumerated column names for the event table
 */
export var EventsColumn;
(function (EventsColumn) {
    EventsColumn["unsavedChanges"] = "unsavedChanges";
    EventsColumn["conflict"] = "conflict";
    EventsColumn["time"] = "time";
    EventsColumn["timeUncertainty"] = "timeUncertainty";
    EventsColumn["latitudeDegrees"] = "latitudeDegrees";
    EventsColumn["longitudeDegrees"] = "longitudeDegrees";
    EventsColumn["depthKm"] = "depthKm";
    EventsColumn["depthUncertainty"] = "depthUncertainty";
    EventsColumn["magnitudeMb"] = "magnitudeMb";
    EventsColumn["magnitudeMs"] = "magnitudeMs";
    EventsColumn["magnitudeMl"] = "magnitudeMl";
    EventsColumn["numberAssociated"] = "numberAssociated";
    EventsColumn["numberDefining"] = "numberDefining";
    EventsColumn["observationsStandardDeviation"] = "observationsStandardDeviation";
    EventsColumn["coverageSemiMajorAxis"] = "coverageSemiMajorAxis";
    EventsColumn["coverageSemiMinorAxis"] = "coverageSemiMinorAxis";
    EventsColumn["coverageSemiMajorTrend"] = "coverageSemiMajorTrend";
    EventsColumn["coverageAreaOfEllipse"] = "coverageAreaOfEllipse";
    EventsColumn["confidenceSemiMajorAxis"] = "confidenceSemiMajorAxis";
    EventsColumn["confidenceSemiMinorAxis"] = "confidenceSemiMinorAxis";
    EventsColumn["confidenceSemiMajorTrend"] = "confidenceSemiMajorTrend";
    EventsColumn["confidenceAreaOfEllipse"] = "confidenceAreaOfEllipse";
    EventsColumn["kWeight"] = "kWeight";
    EventsColumn["kWeightedSemiMajorAxisLengthKm"] = "kWeightedSemiMajorAxisLengthKm";
    EventsColumn["kWeightedSemiMinorAxisLengthKm"] = "kWeightedSemiMinorAxisLengthKm";
    EventsColumn["kWeightedSemiMajorAxisTrendDeg"] = "kWeightedSemiMajorAxisTrendDeg";
    EventsColumn["kWeightedAreaOfEllipse"] = "kWeightedAreaOfEllipse";
    EventsColumn["region"] = "region";
    EventsColumn["activeAnalysts"] = "activeAnalysts";
    EventsColumn["preferred"] = "preferred";
    EventsColumn["status"] = "status";
    EventsColumn["rejected"] = "rejected";
    EventsColumn["deleted"] = "deleted";
})(EventsColumn || (EventsColumn = {}));
/**
 * Displayed events configuration options for Events Display
 */
export var DisplayedEventsConfigurationEnum;
(function (DisplayedEventsConfigurationEnum) {
    DisplayedEventsConfigurationEnum["edgeEventsBeforeInterval"] = "edgeEventsBeforeInterval";
    DisplayedEventsConfigurationEnum["edgeEventsAfterInterval"] = "edgeEventsAfterInterval";
    DisplayedEventsConfigurationEnum["eventsCompleted"] = "eventsCompleted";
    DisplayedEventsConfigurationEnum["eventsRemaining"] = "eventsRemaining";
    DisplayedEventsConfigurationEnum["eventsConflict"] = "eventsConflict";
    DisplayedEventsConfigurationEnum["eventsDeleted"] = "eventsDeleted";
    DisplayedEventsConfigurationEnum["eventsRejected"] = "eventsRejected";
})(DisplayedEventsConfigurationEnum || (DisplayedEventsConfigurationEnum = {}));
/**
 * Displayed signal detection configuration options for Waveform Display
 */
export var WaveformDisplayedSignalDetectionConfigurationEnum;
(function (WaveformDisplayedSignalDetectionConfigurationEnum) {
    WaveformDisplayedSignalDetectionConfigurationEnum["signalDetectionBeforeInterval"] = "signalDetectionBeforeInterval";
    WaveformDisplayedSignalDetectionConfigurationEnum["signalDetectionAfterInterval"] = "signalDetectionAfterInterval";
    WaveformDisplayedSignalDetectionConfigurationEnum["signalDetectionAssociatedToOpenEvent"] = "signalDetectionAssociatedToOpenEvent";
    WaveformDisplayedSignalDetectionConfigurationEnum["signalDetectionAssociatedToCompletedEvent"] = "signalDetectionAssociatedToCompletedEvent";
    WaveformDisplayedSignalDetectionConfigurationEnum["signalDetectionAssociatedToOtherEvent"] = "signalDetectionAssociatedToOtherEvent";
    WaveformDisplayedSignalDetectionConfigurationEnum["signalDetectionConflicts"] = "signalDetectionConflicts";
    WaveformDisplayedSignalDetectionConfigurationEnum["signalDetectionDeleted"] = "signalDetectionDeleted";
    WaveformDisplayedSignalDetectionConfigurationEnum["signalDetectionUnassociated"] = "signalDetectionUnassociated";
})(WaveformDisplayedSignalDetectionConfigurationEnum || (WaveformDisplayedSignalDetectionConfigurationEnum = {}));
/**
 * Enumerated column names for the location history table.
 */
export var LocationHistoryColumn;
(function (LocationHistoryColumn) {
    LocationHistoryColumn["preferred"] = "preferred";
    LocationHistoryColumn["time"] = "time";
    LocationHistoryColumn["timeUncertainty"] = "timeUncertainty";
    LocationHistoryColumn["latitudeDegrees"] = "latitudeDegrees";
    LocationHistoryColumn["longitudeDegrees"] = "longitudeDegrees";
    LocationHistoryColumn["depthKm"] = "depthKm";
    LocationHistoryColumn["depthUncertainty"] = "depthUncertainty";
    LocationHistoryColumn["restraint"] = "restraint";
    LocationHistoryColumn["stdDevTravelTimeResiduals"] = "stdDevTravelTimeResiduals";
    LocationHistoryColumn["numberOfAssociated"] = "numberOfAssociated";
    LocationHistoryColumn["numberOfDefining"] = "numberOfDefining";
    LocationHistoryColumn["region"] = "region";
    LocationHistoryColumn["coverageSemiMajorAxisLengthKm"] = "coverageSemiMajorAxisLengthKm";
    LocationHistoryColumn["coverageSemiMinorAxisLengthKm"] = "coverageSemiMinorAxisLengthKm";
    LocationHistoryColumn["coverageSemiMajorAxisTrendDeg"] = "coverageSemiMajorAxisTrendDeg";
    LocationHistoryColumn["coverageAreaOfEllipse"] = "coverageAreaOfEllipse";
    LocationHistoryColumn["confidenceSemiMajorAxisLengthKm"] = "confidenceSemiMajorAxisLengthKm";
    LocationHistoryColumn["confidenceSemiMinorAxisLengthKm"] = "confidenceSemiMinorAxisLengthKm";
    LocationHistoryColumn["confidenceSemiMajorAxisTrendDeg"] = "confidenceSemiMajorAxisTrendDeg";
    LocationHistoryColumn["confidenceAreaOfEllipse"] = "confidenceAreaOfEllipse";
    LocationHistoryColumn["kWeight"] = "kWeight";
    LocationHistoryColumn["kWeightedSemiMajorAxisLengthKm"] = "kWeightedSemiMajorAxisLengthKm";
    LocationHistoryColumn["kWeightedSemiMinorAxisLengthKm"] = "kWeightedSemiMinorAxisLengthKm";
    LocationHistoryColumn["kWeightedSemiMajorAxisTrendDeg"] = "kWeightedSemiMajorAxisTrendDeg";
    LocationHistoryColumn["kWeightedAreaOfEllipse"] = "kWeightedAreaOfEllipse";
})(LocationHistoryColumn || (LocationHistoryColumn = {}));
/** String used to capture mag types spacer for columns to keep tables sizes in sync */
export const COLUMN_SPACER_PREFIX = 'spacer__';
/**
 * Enumerated column names for the network magnitude table.
 */
export var NetworkMagnitudeColumn;
(function (NetworkMagnitudeColumn) {
    NetworkMagnitudeColumn["restraint"] = "restraint";
    NetworkMagnitudeColumn["preferred"] = "preferred";
    NetworkMagnitudeColumn["magnitude__MB"] = "magnitude__MB";
    NetworkMagnitudeColumn["stdDev__MB"] = "stdDev__MB";
    NetworkMagnitudeColumn["defining__MB"] = "defining__MB";
    NetworkMagnitudeColumn["nonDefining__MB"] = "nonDefining__MB";
    NetworkMagnitudeColumn["magnitude__MB_CODA"] = "magnitude__MB_CODA";
    NetworkMagnitudeColumn["stdDev__MB_CODA"] = "stdDev__MB_CODA";
    NetworkMagnitudeColumn["defining__MB_CODA"] = "defining__MB_CODA";
    NetworkMagnitudeColumn["nonDefining__MB_CODA"] = "nonDefining__MB_CODA";
    NetworkMagnitudeColumn["magnitude__MB_MB"] = "magnitude__MB_MB";
    NetworkMagnitudeColumn["stdDev__MB_MB"] = "stdDev__MB_MB";
    NetworkMagnitudeColumn["defining__MB_MB"] = "defining__MB_MB";
    NetworkMagnitudeColumn["nonDefining__MB_MB"] = "nonDefining__MB_MB";
    NetworkMagnitudeColumn["magnitude__MB_MLE"] = "magnitude__MB_MLE";
    NetworkMagnitudeColumn["stdDev__MB_MLE"] = "stdDev__MB_MLE";
    NetworkMagnitudeColumn["defining__MB_MLE"] = "defining__MB_MLE";
    NetworkMagnitudeColumn["nonDefining__MB_MLE"] = "nonDefining__MB_MLE";
    NetworkMagnitudeColumn["detecting__MB_MLE"] = "detecting__MB_MLE";
    NetworkMagnitudeColumn["nonDetecting__MB_MLE"] = "nonDetecting__MB_MLE";
    NetworkMagnitudeColumn["magnitude__MB_PG"] = "magnitude__MB_PG";
    NetworkMagnitudeColumn["stdDev__MB_PG"] = "stdDev__MB_PG";
    NetworkMagnitudeColumn["defining__MB_PG"] = "defining__MB_PG";
    NetworkMagnitudeColumn["nonDefining__MB_PG"] = "nonDefining__MB_PG";
    NetworkMagnitudeColumn["magnitude__MB_REL_T"] = "magnitude__MB_REL_T";
    NetworkMagnitudeColumn["stdDev__MB_REL_T"] = "stdDev__MB_REL_T";
    NetworkMagnitudeColumn["defining__MB_REL_T"] = "defining__MB_REL_T";
    NetworkMagnitudeColumn["nonDefining__MB_REL_T"] = "nonDefining__MB_REL_T";
    NetworkMagnitudeColumn["magnitude__ML"] = "magnitude__ML";
    NetworkMagnitudeColumn["stdDev__ML"] = "stdDev__ML";
    NetworkMagnitudeColumn["defining__ML"] = "defining__ML";
    NetworkMagnitudeColumn["nonDefining__ML"] = "nonDefining__ML";
    NetworkMagnitudeColumn["magnitude__MS"] = "magnitude__MS";
    NetworkMagnitudeColumn["stdDev__MS"] = "stdDev__MS";
    NetworkMagnitudeColumn["defining__MS"] = "defining__MS";
    NetworkMagnitudeColumn["nonDefining__MS"] = "nonDefining__MS";
    NetworkMagnitudeColumn["magnitude__MS_MLE"] = "magnitude__MS_MLE";
    NetworkMagnitudeColumn["stdDev__MS_MLE"] = "stdDev__MS_MLE";
    NetworkMagnitudeColumn["defining__MS_MLE"] = "defining__MS_MLE";
    NetworkMagnitudeColumn["nonDefining__MS_MLE"] = "nonDefining__MS_MLE";
    NetworkMagnitudeColumn["detecting__MS_MLE"] = "detecting__MS_MLE";
    NetworkMagnitudeColumn["nonDetecting__MS_MLE"] = "nonDetecting__MS_MLE";
    NetworkMagnitudeColumn["magnitude__MS_VMAX"] = "magnitude__MS_VMAX";
    NetworkMagnitudeColumn["stdDev__MS_VMAX"] = "stdDev__MS_VMAX";
    NetworkMagnitudeColumn["defining__MS_VMAX"] = "defining__MS_VMAX";
    NetworkMagnitudeColumn["nonDefining__MS_VMAX"] = "nonDefining__MS_VMAX";
    NetworkMagnitudeColumn["magnitude__MW_CODA"] = "magnitude__MW_CODA";
    NetworkMagnitudeColumn["stdDev__MW_CODA"] = "stdDev__MW_CODA";
    NetworkMagnitudeColumn["defining__MW_CODA"] = "defining__MW_CODA";
    NetworkMagnitudeColumn["nonDefining__MW_CODA"] = "nonDefining__MW_CODA";
})(NetworkMagnitudeColumn || (NetworkMagnitudeColumn = {}));
/**
 * Enumerated column names for the network magnitude table.
 */
export var StationMagnitudeColumn;
(function (StationMagnitudeColumn) {
    StationMagnitudeColumn["az"] = "az";
    StationMagnitudeColumn["station"] = "station";
    StationMagnitudeColumn["distance"] = "distance";
    StationMagnitudeColumn["channel__MB"] = "channel__MB";
    StationMagnitudeColumn["phase__MB"] = "phase__MB";
    StationMagnitudeColumn["amplitude__MB"] = "amplitude__MB";
    StationMagnitudeColumn["period__MB"] = "period__MB";
    StationMagnitudeColumn["mag__MB"] = "mag__MB";
    StationMagnitudeColumn["residual__MB"] = "residual__MB";
    StationMagnitudeColumn["used__MB"] = "used__MB";
    StationMagnitudeColumn["defining__MB"] = "defining__MB";
    StationMagnitudeColumn["channel__MB_CODA"] = "channel__MB_CODA";
    StationMagnitudeColumn["phase__MB_CODA"] = "phase__MB_CODA";
    StationMagnitudeColumn["amplitude__MB_CODA"] = "amplitude__MB_CODA";
    StationMagnitudeColumn["period__MB_CODA"] = "period__MB_CODA";
    StationMagnitudeColumn["mag__MB_CODA"] = "mag__MB_CODA";
    StationMagnitudeColumn["residual__MB_CODA"] = "residual__MB_CODA";
    StationMagnitudeColumn["used__MB_CODA"] = "used__MB_CODA";
    StationMagnitudeColumn["defining__MB_CODA"] = "defining__MB_CODA";
    StationMagnitudeColumn["channel__MB_MB"] = "channel__MB_MB";
    StationMagnitudeColumn["phase__MB_MB"] = "phase__MB_MB";
    StationMagnitudeColumn["amplitude__MB_MB"] = "amplitude__MB_MB";
    StationMagnitudeColumn["period__MB_MB"] = "period__MB_MB";
    StationMagnitudeColumn["mag__MB_MB"] = "mag__MB_MB";
    StationMagnitudeColumn["residual__MB_MB"] = "residual__MB_MB";
    StationMagnitudeColumn["used__MB_MB"] = "used__MB_MB";
    StationMagnitudeColumn["defining__MB_MB"] = "defining__MB_MB";
    StationMagnitudeColumn["channel__MB_MLE"] = "channel__MB_MLE";
    StationMagnitudeColumn["phase__MB_MLE"] = "phase__MB_MLE";
    StationMagnitudeColumn["amplitude__MB_MLE"] = "amplitude__MB_MLE";
    StationMagnitudeColumn["period__MB_MLE"] = "period__MB_MLE";
    StationMagnitudeColumn["mag__MB_MLE"] = "mag__MB_MLE";
    StationMagnitudeColumn["residual__MB_MLE"] = "residual__MB_MLE";
    StationMagnitudeColumn["used__MB_MLE"] = "used__MB_MLE";
    StationMagnitudeColumn["defining__MB_MLE"] = "defining__MB_MLE";
    StationMagnitudeColumn["channel__MB_PG"] = "channel__MB_PG";
    StationMagnitudeColumn["phase__MB_PG"] = "phase__MB_PG";
    StationMagnitudeColumn["amplitude__MB_PG"] = "amplitude__MB_PG";
    StationMagnitudeColumn["period__MB_PG"] = "period__MB_PG";
    StationMagnitudeColumn["mag__MB_PG"] = "mag__MB_PG";
    StationMagnitudeColumn["residual__MB_PG"] = "residual__MB_PG";
    StationMagnitudeColumn["used__MB_PG"] = "used__MB_PG";
    StationMagnitudeColumn["defining__MB_PG"] = "defining__MB_PG";
    StationMagnitudeColumn["channel__MB_REL_T"] = "channel__MB_REL_T";
    StationMagnitudeColumn["phase__MB_REL_T"] = "phase__MB_REL_T";
    StationMagnitudeColumn["amplitude__MB_REL_T"] = "amplitude__MB_REL_T";
    StationMagnitudeColumn["period__MB_REL_T"] = "period__MB_REL_T";
    StationMagnitudeColumn["mag__MB_REL_T"] = "mag__MB_REL_T";
    StationMagnitudeColumn["residual__MB_REL_T"] = "residual__MB_REL_T";
    StationMagnitudeColumn["used__MB_REL_T"] = "used__MB_REL_T";
    StationMagnitudeColumn["defining__MB_REL_T"] = "defining__MB_REL_T";
    StationMagnitudeColumn["channel__ML"] = "channel__ML";
    StationMagnitudeColumn["phase__ML"] = "phase__ML";
    StationMagnitudeColumn["amplitude__ML"] = "amplitude__ML";
    StationMagnitudeColumn["period__ML"] = "period__ML";
    StationMagnitudeColumn["mag__ML"] = "mag__ML";
    StationMagnitudeColumn["residual__ML"] = "residual__ML";
    StationMagnitudeColumn["used__ML"] = "used__ML";
    StationMagnitudeColumn["defining__ML"] = "defining__ML";
    StationMagnitudeColumn["channel__MS"] = "channel__MS";
    StationMagnitudeColumn["phase__MS"] = "phase__MS";
    StationMagnitudeColumn["amplitude__MS"] = "amplitude__MS";
    StationMagnitudeColumn["period__MS"] = "period__MS";
    StationMagnitudeColumn["mag__MS"] = "mag__MS";
    StationMagnitudeColumn["residual__MS"] = "residual__MS";
    StationMagnitudeColumn["used__MS"] = "used__MS";
    StationMagnitudeColumn["defining__MS"] = "defining__MS";
    StationMagnitudeColumn["channel__MS_MLE"] = "channel__MS_MLE";
    StationMagnitudeColumn["phase__MS_MLE"] = "phase__MS_MLE";
    StationMagnitudeColumn["amplitude__MS_MLE"] = "amplitude__MS_MLE";
    StationMagnitudeColumn["period__MS_MLE"] = "period__MS_MLE";
    StationMagnitudeColumn["mag__MS_MLE"] = "mag__MS_MLE";
    StationMagnitudeColumn["residual__MS_MLE"] = "residual__MS_MLE";
    StationMagnitudeColumn["used__MS_MLE"] = "used__MS_MLE";
    StationMagnitudeColumn["defining__MS_MLE"] = "defining__MS_MLE";
    StationMagnitudeColumn["channel__MS_VMAX"] = "channel__MS_VMAX";
    StationMagnitudeColumn["phase__MS_VMAX"] = "phase__MS_VMAX";
    StationMagnitudeColumn["amplitude__MS_VMAX"] = "amplitude__MS_VMAX";
    StationMagnitudeColumn["period__MS_VMAX"] = "period__MS_VMAX";
    StationMagnitudeColumn["mag__MS_VMAX"] = "mag__MS_VMAX";
    StationMagnitudeColumn["residual__MS_VMAX"] = "residual__MS_VMAX";
    StationMagnitudeColumn["used__MS_VMAX"] = "used__MS_VMAX";
    StationMagnitudeColumn["defining__MS_VMAX"] = "defining__MS_VMAX";
    StationMagnitudeColumn["channel__MW_CODA"] = "channel__MW_CODA";
    StationMagnitudeColumn["phase__MW_CODA"] = "phase__MW_CODA";
    StationMagnitudeColumn["amplitude__MW_CODA"] = "amplitude__MW_CODA";
    StationMagnitudeColumn["period__MW_CODA"] = "period__MW_CODA";
    StationMagnitudeColumn["mag__MW_CODA"] = "mag__MW_CODA";
    StationMagnitudeColumn["residual__MW_CODA"] = "residual__MW_CODA";
    StationMagnitudeColumn["used__MW_CODA"] = "used__MW_CODA";
    StationMagnitudeColumn["defining__MW_CODA"] = "defining__MW_CODA";
})(StationMagnitudeColumn || (StationMagnitudeColumn = {}));
/**
 * Enumerated column names for the location history association table.
 */
export var LocationHistoryAssociationColumn;
(function (LocationHistoryAssociationColumn) {
    LocationHistoryAssociationColumn["station"] = "station";
    LocationHistoryAssociationColumn["channel"] = "channel";
    LocationHistoryAssociationColumn["phase"] = "phase";
    LocationHistoryAssociationColumn["distance"] = "distance";
    LocationHistoryAssociationColumn["az"] = "az";
    LocationHistoryAssociationColumn["arrivalTimeObserved"] = "arrivalTimeObserved";
    LocationHistoryAssociationColumn["arrivalTimeStdDev"] = "arrivalTimeStdDev";
    LocationHistoryAssociationColumn["arrivalTimeResidual"] = "arrivalTimeResidual";
    LocationHistoryAssociationColumn["arrivalTimeUsed"] = "arrivalTimeUsed";
    LocationHistoryAssociationColumn["arrivalTimeDefining"] = "arrivalTimeDefining";
    LocationHistoryAssociationColumn["azimuthObserved"] = "azimuthObserved";
    LocationHistoryAssociationColumn["azimuthStdDev"] = "azimuthStdDev";
    LocationHistoryAssociationColumn["azimuthResidual"] = "azimuthResidual";
    LocationHistoryAssociationColumn["azimuthUsed"] = "azimuthUsed";
    LocationHistoryAssociationColumn["azimuthDefining"] = "azimuthDefining";
    LocationHistoryAssociationColumn["slownessObserved"] = "slownessObserved";
    LocationHistoryAssociationColumn["slownessStdDev"] = "slownessStdDev";
    LocationHistoryAssociationColumn["slownessResidual"] = "slownessResidual";
    LocationHistoryAssociationColumn["slownessUsed"] = "slownessUsed";
    LocationHistoryAssociationColumn["slownessDefining"] = "slownessDefining";
})(LocationHistoryAssociationColumn || (LocationHistoryAssociationColumn = {}));
/**
 * used to populate the values of the Station Properties Display site column picker dropdown, and match the values to the table column ids
 */
export var SiteColumn;
(function (SiteColumn) {
    SiteColumn["name"] = "name";
    SiteColumn["effectiveAt"] = "effectiveAt";
    SiteColumn["effectiveUntil"] = "effectiveUntil";
    SiteColumn["latitudeDegrees"] = "latitudeDegrees";
    SiteColumn["longitudeDegrees"] = "longitudeDegrees";
    SiteColumn["depthKm"] = "depthKm";
    SiteColumn["elevationKm"] = "elevationKm";
    SiteColumn["type"] = "type";
    SiteColumn["description"] = "description";
})(SiteColumn || (SiteColumn = {}));
/**
 * used to populate the values of the Station Properties Display channel column picker dropdown, and match the values to the table column ids
 */
export var ChannelColumn;
(function (ChannelColumn) {
    ChannelColumn["name"] = "name";
    ChannelColumn["effectiveAt"] = "effectiveAt";
    ChannelColumn["effectiveUntil"] = "effectiveUntil";
    ChannelColumn["latitudeDegrees"] = "latitudeDegrees";
    ChannelColumn["longitudeDegrees"] = "longitudeDegrees";
    ChannelColumn["depthKm"] = "depthKm";
    ChannelColumn["elevationKm"] = "elevationKm";
    ChannelColumn["nominalSampleRateHz"] = "nominalSampleRateHz";
    ChannelColumn["units"] = "units";
    ChannelColumn["orientationHorizontalDegrees"] = "orientationHorizontalDegrees";
    ChannelColumn["orientationVerticalDegrees"] = "orientationVerticalDegrees";
    ChannelColumn["calibrationFactor"] = "calibrationFactor";
    ChannelColumn["calibrationPeriod"] = "calibrationPeriod";
    ChannelColumn["calibrationEffectiveAt"] = "calibrationEffectiveAt";
    ChannelColumn["calibrationTimeShift"] = "calibrationTimeShift";
    ChannelColumn["calibrationStandardDeviation"] = "calibrationStandardDeviation";
    ChannelColumn["northDisplacementKm"] = "northDisplacementKm";
    ChannelColumn["eastDisplacementKm"] = "eastDisplacementKm";
    ChannelColumn["verticalDisplacementKm"] = "verticalDisplacementKm";
    ChannelColumn["description"] = "description";
    ChannelColumn["channelDataType"] = "channelDataType";
    ChannelColumn["channelBandType"] = "channelBandType";
    ChannelColumn["channelInstrumentType"] = "channelInstrumentType";
    ChannelColumn["channelOrientationCode"] = "channelOrientationCode";
    ChannelColumn["channelOrientationType"] = "channelOrientationType";
    ChannelColumn["calibrationResponseId"] = "calibrationResponseId";
    ChannelColumn["fapResponseId"] = "fapResponseId";
})(ChannelColumn || (ChannelColumn = {}));
/**
 * Column names for the FK Properties table
 */
export var FkPropertiesColumn;
(function (FkPropertiesColumn) {
    FkPropertiesColumn["description"] = "description";
    FkPropertiesColumn["peak"] = "peak";
    FkPropertiesColumn["predicted"] = "predicted";
    FkPropertiesColumn["measured"] = "measured";
    FkPropertiesColumn["residual"] = "residual";
})(FkPropertiesColumn || (FkPropertiesColumn = {}));
//# sourceMappingURL=types.js.map