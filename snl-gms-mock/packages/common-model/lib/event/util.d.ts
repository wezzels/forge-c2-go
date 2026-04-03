import type { Distance, Location } from '../common';
import type { SignalDetection, SignalDetectionAssociationStatus, SignalDetectionHypothesisFaceted } from '../signal-detection';
import { SignalDetectionStatus } from '../signal-detection';
import type { Channel } from '../station-definitions/channel-definitions';
import type { Station } from '../station-definitions/station-definitions';
import { type Event, type EventHypothesis, type EventLocation, type EventStatusWrapper, type LocationDistance, type LocationRestraint, type LocationSolution, Restraint } from './types';
/**
 * Checks if the {@link EventTypes.EventHypothesis} is not an id-only instance
 * @param eventHypothesis the {@link EventTypes.EventHypothesis} to check
 * @returns true if the {@link EventTypes.EventHypothesis} is not an id-only instance; false otherwise
 */
export declare function isFullyPopulatedEventHypothesis(eventHypothesis: EventHypothesis | Pick<EventHypothesis, 'id'>): eventHypothesis is EventHypothesis;
/**
 * Finds preferred event hypothesis for a given event and stage
 * If no preferred hypothesis exists for stage, will return most recent preferred hypothesis by stage
 *
 * @param event Event to search within
 * @param openIntervalName Currently open interval/stage name eg; "AL1"
 * @returns EventHypothesis corresponding to the current open stage, otherwise default stage EventHypothesis.
 */
export declare const findPreferredEventHypothesisByOpenStageOrDefaultStage: (event: Event | undefined, openIntervalName: string) => EventHypothesis | undefined;
/**
 * Search the events if an association is found to an event (but not the currently open event)
 * then return true
 *
 * @param detection signal detection to check event association against
 * @param events list of {@link Event} objects to search through
 * @param openIntervalName eg; Auto Network, AL1, AL2
 * @return boolean
 */
export declare function isSignalDetectionAssociated(detection: SignalDetection, events: Event[], openIntervalName: string): boolean;
/**
 * Determine if a signal detection is associated to an event.
 *
 * @param detection signal detection to check event association against
 * @param events list of {@link Event} objects to search through
 * @param currentOpenEventId
 * @param openIntervalName eg; Auto Network, AL1, AL2
 * @returns boolean
 */
export declare function isSignalDetectionOpenAssociated(detection: SignalDetection, events: Event[], currentOpenEventId: string | undefined, openIntervalName: string): boolean;
/**
 * Determines if the provided {@link EventHypothesis} object is the
 * preferredEventHypothesis for the current open stage.
 *
 * @param event Event object to check
 * @param openIntervalName Current open stage
 * @param eventHypothesis EventHypothesis object to verify
 * @returns true if the eventHypothesis is preferred
 */
export declare const isPreferredEventHypothesisByStage: (event: Event, openIntervalName: string, eventHypothesis: EventHypothesis) => boolean;
/**
 * Finds the last non rejected parent event hypothesis for a given event and hypothesis
 * if no valid hypothesis is found it returns the first hypothesis
 *
 * @param event
 * @param eventHypothesis
 */
export declare const findEventHypothesisParent: (event: Event, eventHypothesis: EventHypothesis | undefined) => EventHypothesis | undefined;
/**
 * Finds the preferred location solution for a hypothesis falling back to the parents if the hypothesis is rejected
 *
 * @param eventHypothesisId hypothesis id to find the solution for
 * @param eventHypotheses list of hypotheses, if an event is opened
 * @returns a location solution
 */
export declare const findPreferredLocationSolution: (eventHypothesisId: string, eventHypotheses: EventHypothesis[]) => LocationSolution | undefined;
/**
 * Calculate the distance in kilometers between an event and a station.
 *
 * @param source The source location for which to calculate distance
 * @param destination The destination location for which to calculate distance
 * @returns calculated distance in kilometers
 */
export declare function getLocationToEventDistance(source: Location, destination: EventLocation): Distance;
/**
 * Calculate a location to event location azimuth
 *
 * @param source The source location for which to calculate azimuth
 * @param destination The destination location for which to calculate azimuth
 * @param type The calculation type for distance Receiver to source | Source to receiver
 * @returns calculated distance in kilometers
 */
declare function getLocationToLocationAzimuth(source: Location, destination: EventLocation, type: 'Receiver to source' | 'Source to receiver'): number;
export declare const memoizedLocationToEventDistance: typeof getLocationToEventDistance & import("lodash").MemoizedFunction;
export declare const memoizedLocationToEventAzimuth: typeof getLocationToLocationAzimuth & import("lodash").MemoizedFunction;
/**
 * Return a list of preferred EventHypotheses associated with the detection or an empty list
 *
 * @param detection signal detection to check event association against
 * @param events list of {@link Event} objects to search through
 * @param openIntervalName eg; Auto Network, AL1, AL2
 * @return list of {@link EventHypothesis}
 */
export declare function findEventHypothesesForDetection(detection: SignalDetection, events: Event[], openIntervalName: string): EventHypothesis[];
/**
 * Gets the distance and azimuth to all stations and channels for the given location solution
 *
 * @param event event with a preferred location solution
 * @param stations array of stations to calculated distances for
 * @param openStageName string name of the open stage in order to find the preferred hypothesis
 * @param type The calculation type for distance Receiver to source | Source to receiver
 */
export declare function getDistanceToStationsUsingLocationSolution(locationSolution: LocationSolution | undefined, stations: Station[] | undefined, allChannels: Channel[], type?: 'Receiver to source' | 'Source to receiver'): Record<string, LocationDistance>;
/**
 * Gets the distance and azimuth to all stations and channels using the preferred location solution
 * of the provided event.
 *
 * @param event event with a preferred location solution
 * @param stations array of stations to calculated distances for
 * @param openStageName string name of the open stage in order to find the preferred hypothesis
 * @param allChannels all the channels getting a distance calculation
 */
export declare function getDistanceToStationsForPreferredLocationSolutionId(event: Event | undefined, stations: Station[] | undefined, openStageName: string, allChannels: Channel[]): Record<string, LocationDistance>;
/**
 * Determine if a signal detection is complete.
 *
 * @param detection signal detection to check event association against
 * @param events list of {@link Event} objects to search through
 * @param eventsStatuses record of {@link EventStatus} objects
 * @param openIntervalName eg; Auto Network, AL1, AL2
 * @returns boolean
 */
export declare function isSignalDetectionCompleteAssociated(detection: SignalDetection, events: Event[], eventsStatuses: Record<string, EventStatusWrapper> | undefined, openIntervalName: string): boolean;
/**
 * Search the events if an association is found to an event (but not the currently open event)
 * then return true
 *
 * @param detection signal detection to check event association against
 * @param events list of {@link Event} objects to search through
 * @param currentOpenEventId
 * @param openIntervalName eg; Auto Network, AL1, AL2
 * @return boolean
 */
export declare function isSignalDetectionOtherAssociated(detection: SignalDetection, events: Event[], currentOpenEventId: string | undefined, openIntervalName: string): boolean;
/**
 * Find all signal detections associated to the event
 *
 * @param event openEvent
 * @param signalDetections all signal detections
 * @returns associated signal detections
 */
export declare const getAssociatedDetections: (event: Event | undefined, signalDetections: SignalDetection[], openIntervalName: string) => SignalDetection[];
/**
 * Returns a CONST string representing the provided signal detection association status
 */
export declare function getSignalDetectionStatus(signalDetection: SignalDetection, events: Event[], openEventId: string | undefined, eventsStatuses: Record<string, EventStatusWrapper> | undefined, openIntervalName: string): SignalDetectionStatus;
/**
 * Returns a list of signal detection association statuses and their signal detection id
 */
export declare function getSignalDetectionStatuses(signalDetections: SignalDetection[], events: Event[], openEventId: string | undefined, eventsStatuses: Record<string, EventStatusWrapper> | undefined, openIntervalName: string): SignalDetectionAssociationStatus[];
/**
 * Checks if a given {@link SignalDetectionHypothesis} is
 * associated with a given {@link EventHypothesis}.
 *
 * @returns true if associated, false otherwise.
 */
export declare function isSdHypothesisAssociatedToEventHypothesis(sdHypothesis: SignalDetectionHypothesisFaceted, eventHypothesis: EventHypothesis | undefined): boolean;
/**
 * Get the preferred location solution for an event and the open interval.
 *
 * @throws if the event does not have a preferred event hypothesis
 * @throws  if there is no preferred location solution for the preferred event hypothesis
 *
 * @param event an event from which to get the preferred location solution
 * @param openIntervalName the name of the currently open interval, such as 'AL1 Event Review'
 * @returns the preferred location solution for the provided event
 */
export declare function getPreferredLocationSolutionForEventAndInterval(event: Event, openIntervalName: string): LocationSolution;
/**
 * Determine the computed {@link Restraint} based on the values of the {@link LocationRestraint}
 * @param locationRestraint
 * @returns returns the computed {@link Restraint} based on the values of the {@link LocationRestraint}
 */
export declare function determineRestraint(locationRestraint: LocationRestraint): Restraint;
export {};
//# sourceMappingURL=util.d.ts.map