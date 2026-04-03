import type { ChannelTypes, StationTypes } from '../../common-model';
import type { WaveformMode } from '../../ui-configuration/types';
import type { AnalysisMode, StationGroup, WorkflowDefinitionId } from '../types';

/**
 * Configuration necessary for supporting event review and scan mode Analyst Activities.
 */
export interface ActivityDefinition {
  activityId?: WorkflowDefinitionId;
  defaultAnalysisMode: AnalysisMode;
  defaultWaveformMode: WaveformMode;
  defaultPhase: string;
  stationGroup?: StationGroup;
  filterList: string;
}

/**
 * Per COI, EventReviewActivityDefinition is a Marker class.
 * !analystActivity should always be set to `EVENT_REVIEW`
 */
export type EventReviewActivityDefinition = ActivityDefinition;

export interface Hypocenter {
  latitudeDegrees: number;
  longitudeDegrees: number;
  depthKm: number;
}

/**
 * !analystActivity should always be set to `SCAN`
 */
export interface ScanActivityDefinition extends ActivityDefinition {
  geographicRegionName: string;
  defaultScanTimeRange: number;
  rawChannelsVisibleForStation: Record<StationTypes.Station['name'], ChannelTypes.Channel[]>;
  virtualEventHypocenter: Hypocenter;
}

/**
 * Assert the object is {@link FilterDefinitionRealization} or throw
 * @param object the object to check
 */
export function isScanActivityDefinition(
  object: ActivityDefinition
): object is ScanActivityDefinition {
  if (Object.keys(object).includes('virtualEventHypocenter')) return true;
  return false;
}
