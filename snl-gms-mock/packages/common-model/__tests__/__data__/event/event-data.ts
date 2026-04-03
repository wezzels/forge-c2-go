import { Units } from '../../../src/ts/common/types';
import { EventTypes } from '../../../src/ts/common-model';
import { NetworkMagnitudeStatus } from '../../../src/ts/event/types';
import type { EntityReference } from '../../../src/ts/faceted';
import type { IntervalId } from '../../../src/ts/workflow/types';
import {
  asarFkBeamFacetedSignalDetectionHypothesis1,
  asarFkBeamFacetedSignalDetectionHypothesis2
} from '../signal-detections';

export const eventId = 'eventID';
export const eventId2 = 'eventID2';
export const eventId3 = 'eventID3';
export const rejectedEventId = 'rejectedEventId';
export const deletedEventId = 'deletedEventId';
export const hypothesisId = 'hypothesisID';
export const hypothesisId2 = 'hypothesisID2';
const rejectedHypothesisId = 'rejectedHypothesisId';
const deletedHypothesisId = 'deletedHypothesisId';
const locationSolutionId = 'locationSolutionID';
export const mockOpenIntervalName = 'AL1';
export const workflowDefinitionId = { name: mockOpenIntervalName, effectiveTime: 0 };
export const intervalId: IntervalId = {
  definitionId: { name: mockOpenIntervalName },
  startTime: 1669150800
};
export const user = 'preferredAnalyst';

export const eventStatusInfoInProgress = {
  eventStatus: EventTypes.EventStatus.IN_PROGRESS,
  activeAnalystIds: [user]
};
export const eventStatusInfoComplete = {
  eventStatus: EventTypes.EventStatus.COMPLETE,
  activeAnalystIds: [user]
};
export const eventStatusInfoNotStarted = {
  eventStatus: EventTypes.EventStatus.NOT_STARTED,
  activeAnalystIds: [user]
};
export const eventStatusInfoNotComplete = {
  eventStatus: EventTypes.EventStatus.NOT_COMPLETE,
  activeAnalystIds: [user]
};

export const eventHypothesisId: EventTypes.EventHypothesisId = {
  eventId,
  hypothesisId
};

export const eventHypothesisId2: EventTypes.EventHypothesisId = {
  eventId: eventId2,
  hypothesisId: hypothesisId2
};

export const rejectedEventHypothesisId: EventTypes.EventHypothesisId = {
  eventId: rejectedEventId,
  hypothesisId: rejectedHypothesisId
};

export const deletedEventHypothesisId: EventTypes.EventHypothesisId = {
  eventId: deletedEventId,
  hypothesisId: deletedHypothesisId
};

export const networkMagnitudeSolutionMB: EventTypes.NetworkMagnitudeSolution = {
  magnitude: { value: 1.2, standardDeviation: 0, units: Units.MAGNITUDE },
  magnitudeBehaviors: [],
  type: EventTypes.MagnitudeType.MB,
  status: NetworkMagnitudeStatus.VALID
};

export const location: EventTypes.EventLocation = {
  latitudeDegrees: 1.1,
  longitudeDegrees: 2.2,
  depthKm: 3.3,
  time: 3600
};

export const locationRestraint: EventTypes.LocationRestraint = {
  depthRestraintType: EventTypes.RestraintType.UNRESTRAINED,
  depthRestraintReason: EventTypes.DepthRestraintReason.FIXED_AT_SURFACE,
  depthRestraintKm: undefined,
  epicenterRestraintType: EventTypes.RestraintType.UNRESTRAINED,
  latitudeRestraintDegrees: undefined,
  longitudeRestraintDegrees: undefined,
  timeRestraintType: EventTypes.RestraintType.UNRESTRAINED,
  timeRestraint: undefined
};

export const locationSolution: EventTypes.LocationSolution = {
  id: locationSolutionId,
  networkMagnitudeSolutions: [networkMagnitudeSolutionMB],
  featurePredictions: { featurePredictions: [] },
  locationBehaviors: [],
  location,
  locationRestraint
};

export const eventHypothesis: EventTypes.EventHypothesis = {
  id: eventHypothesisId,
  rejected: false,
  deleted: false,
  parentEventHypotheses: [],
  associatedSignalDetectionHypotheses: [asarFkBeamFacetedSignalDetectionHypothesis1],
  preferredLocationSolution: locationSolution,
  locationSolutions: [locationSolution]
};

export const eventHypothesisMultipleSds: EventTypes.EventHypothesis = {
  id: eventHypothesisId,
  rejected: false,
  deleted: false,
  parentEventHypotheses: [],
  associatedSignalDetectionHypotheses: [
    asarFkBeamFacetedSignalDetectionHypothesis1,
    asarFkBeamFacetedSignalDetectionHypothesis2
  ],
  preferredLocationSolution: locationSolution,
  locationSolutions: [locationSolution]
};

export const facetedEventHypothesis: EntityReference<'id', EventTypes.EventHypothesis> = {
  id: eventHypothesisId
};

export const eventHypothesis2: EventTypes.EventHypothesis = {
  id: eventHypothesisId2,
  rejected: false,
  deleted: false,
  parentEventHypotheses: [],
  associatedSignalDetectionHypotheses: [asarFkBeamFacetedSignalDetectionHypothesis1],
  preferredLocationSolution: locationSolution,
  locationSolutions: [locationSolution]
};

export const eventHypothesisNoAssocSD: EventTypes.EventHypothesis = {
  id: eventHypothesisId2,
  rejected: false,
  deleted: false,
  parentEventHypotheses: [],
  associatedSignalDetectionHypotheses: [],
  preferredLocationSolution: locationSolution,
  locationSolutions: [locationSolution]
};

export const preferredEventHypothesis: EventTypes.PreferredEventHypothesis = {
  preferredBy: user,
  stage: workflowDefinitionId,
  preferred: { id: eventHypothesis.id }
};

export const preferredEventHypothesis2: EventTypes.PreferredEventHypothesis = {
  preferredBy: user,
  stage: workflowDefinitionId,
  preferred: { id: eventHypothesis2.id }
};

export const preferredEventHypothesisNoAssocSD: EventTypes.PreferredEventHypothesis = {
  preferredBy: user,
  stage: workflowDefinitionId,
  preferred: { id: eventHypothesisNoAssocSD.id }
};
export const rejectedEventHypothesis: EventTypes.EventHypothesis = {
  id: rejectedEventHypothesisId,
  rejected: true,
  deleted: false,
  parentEventHypotheses: [{ id: eventHypothesis.id }],
  associatedSignalDetectionHypotheses: [],
  preferredLocationSolution: locationSolution,
  locationSolutions: [locationSolution]
};

export const preferredEventHypothesisRejected: EventTypes.PreferredEventHypothesis = {
  preferredBy: user,
  stage: workflowDefinitionId,
  preferred: { id: rejectedEventHypothesis.id }
};

export const deletedEventHypothesis: EventTypes.EventHypothesis = {
  id: deletedEventHypothesisId,
  rejected: false,
  deleted: true,
  parentEventHypotheses: [{ id: eventHypothesis.id }],
  associatedSignalDetectionHypotheses: [],
  preferredLocationSolution: locationSolution,
  locationSolutions: [locationSolution]
};

export const preferredEventHypothesisDeleted: EventTypes.PreferredEventHypothesis = {
  preferredBy: user,
  stage: workflowDefinitionId,
  preferred: { id: deletedEventHypothesis.id }
};

export const eventData: EventTypes.Event = {
  id: eventId,
  rejectedSignalDetectionAssociations: [],
  monitoringOrganization: 'testOrg',
  overallPreferred: { id: eventHypothesis.id },
  eventHypotheses: [eventHypothesis],
  preferredEventHypothesisByStage: [preferredEventHypothesis],
  finalEventHypothesisHistory: [],
  _uiHasUnsavedChanges: undefined
};

export const eventData2: EventTypes.Event = {
  id: eventId2,
  rejectedSignalDetectionAssociations: [],
  monitoringOrganization: 'testOrg',
  overallPreferred: { id: eventHypothesis2.id },
  eventHypotheses: [eventHypothesis2],
  preferredEventHypothesisByStage: [preferredEventHypothesis2],
  finalEventHypothesisHistory: [],
  _uiHasUnsavedChanges: undefined
};

export const eventDataNoAssocSD: EventTypes.Event = {
  id: eventId2,
  rejectedSignalDetectionAssociations: [],
  monitoringOrganization: 'testOrg',
  overallPreferred: { id: eventHypothesisNoAssocSD.id },
  eventHypotheses: [eventHypothesisNoAssocSD],
  preferredEventHypothesisByStage: [preferredEventHypothesisNoAssocSD],
  finalEventHypothesisHistory: [],
  _uiHasUnsavedChanges: undefined
};

export const rejectedEventData: EventTypes.Event = {
  id: eventId,
  rejectedSignalDetectionAssociations: [],
  monitoringOrganization: 'testOrg',
  overallPreferred: { id: rejectedEventHypothesis.id },
  eventHypotheses: [eventHypothesis, rejectedEventHypothesis],
  preferredEventHypothesisByStage: [preferredEventHypothesisRejected],
  finalEventHypothesisHistory: [],
  _uiHasUnsavedChanges: undefined
};

export const deletedEventData: EventTypes.Event = {
  id: deletedEventId,
  rejectedSignalDetectionAssociations: [],
  monitoringOrganization: 'testOrg',
  overallPreferred: { id: deletedEventHypothesis.id },
  eventHypotheses: [eventHypothesis, deletedEventHypothesis],
  preferredEventHypothesisByStage: [preferredEventHypothesisDeleted],
  finalEventHypothesisHistory: [],
  _uiHasUnsavedChanges: undefined
};

export const eventWithUnsavedChangesData: EventTypes.Event = {
  id: eventId,
  rejectedSignalDetectionAssociations: [],
  monitoringOrganization: 'testOrg',
  overallPreferred: { id: eventHypothesis.id },
  eventHypotheses: [eventHypothesis],
  preferredEventHypothesisByStage: [preferredEventHypothesis],
  finalEventHypothesisHistory: [],
  _uiHasUnsavedChanges: 1681326922.651
};

export const eventList = [
  eventData,
  eventData2,
  eventWithUnsavedChangesData,
  rejectedEventData,
  deletedEventData
];
