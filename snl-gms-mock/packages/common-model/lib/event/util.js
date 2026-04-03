import { getDistance, getGreatCircleBearing } from 'geolib';
import memoize from 'lodash/memoize';
import { findOrThrow } from '../array-util/array-util';
import { SignalDetectionStatus, Util } from '../signal-detection';
import { getCurrentHypothesis } from '../signal-detection/util';
import { eventHypothesisIdOnlySchema } from './schema';
import { DepthRestraintReason, EventStatus, RestrainerType, Restraint, RestraintType } from './types';
/**
 * Checks if the {@link EventTypes.EventHypothesis} is not an id-only instance
 * @param eventHypothesis the {@link EventTypes.EventHypothesis} to check
 * @returns true if the {@link EventTypes.EventHypothesis} is not an id-only instance; false otherwise
 */
export function isFullyPopulatedEventHypothesis(eventHypothesis) {
    // return true if it is not an id-only instance
    return !eventHypothesisIdOnlySchema.safeParse(eventHypothesis).success;
}
/**
 * Finds preferred event hypothesis for a given event and stage
 * If no preferred hypothesis exists for stage, will return most recent preferred hypothesis by stage
 *
 * @param event Event to search within
 * @param openIntervalName Currently open interval/stage name eg; "AL1"
 * @returns EventHypothesis corresponding to the current open stage, otherwise default stage EventHypothesis.
 */
export const findPreferredEventHypothesisByOpenStageOrDefaultStage = (event, openIntervalName) => {
    if (!event) {
        return undefined;
    }
    const { preferredEventHypothesisByStage, eventHypotheses } = event;
    const preferredHypoByStageId = preferredEventHypothesisByStage.find(hypo => hypo.stage.name === openIntervalName)?.preferred ??
        preferredEventHypothesisByStage[0].preferred; // Default preferred
    // Should not be capable of returning undefined
    // Should either return hypo by the open stage, or hypo by auto network (default)
    return findOrThrow(eventHypotheses, hypothesis => hypothesis.id.hypothesisId === preferredHypoByStageId.id.hypothesisId);
};
/**
 * Return a true if preferred EventHypotheses are associated with the detection
 *
 * @param detection signal detection to check event association against
 * @param events list of {@link Event} objects to search through
 * @param openIntervalName eg; Auto Network, AL1, AL2
 * @return boolean
 */
function doesEventHypothesesExistForDetection(detection, events, openIntervalName) {
    if (events.length > 0) {
        const allPreferredEventHypotheses = events.map(evt => findPreferredEventHypothesisByOpenStageOrDefaultStage(evt, openIntervalName));
        const currentHypothesis = getCurrentHypothesis(detection.signalDetectionHypotheses);
        // return true if the detection is associated to any event
        return allPreferredEventHypotheses.some(eventHypothesis => eventHypothesis
            ? eventHypothesis.associatedSignalDetectionHypotheses.some(sdh => sdh.id.id === currentHypothesis.id.id)
            : false);
    }
    return false;
}
/**
 * Search the events if an association is found to an event (but not the currently open event)
 * then return true
 *
 * @param detection signal detection to check event association against
 * @param events list of {@link Event} objects to search through
 * @param openIntervalName eg; Auto Network, AL1, AL2
 * @return boolean
 */
export function isSignalDetectionAssociated(detection, events, openIntervalName) {
    // If any of the events has the detection in its associated signal detection
    return doesEventHypothesesExistForDetection(detection, events, openIntervalName);
}
/**
 * Determine if a signal detection is associated to an event.
 *
 * @param detection signal detection to check event association against
 * @param events list of {@link Event} objects to search through
 * @param currentOpenEventId
 * @param openIntervalName eg; Auto Network, AL1, AL2
 * @returns boolean
 */
export function isSignalDetectionOpenAssociated(detection, events, currentOpenEventId, openIntervalName) {
    if (!currentOpenEventId || events.length === 0) {
        return false;
    }
    const currentOpenEvent = events.find(event => event.id === currentOpenEventId);
    const currentPreferredHypothesis = findPreferredEventHypothesisByOpenStageOrDefaultStage(currentOpenEvent, openIntervalName);
    // Determines if the current SD hypothesis is in the associated SD
    // list for the current preferred event hypothesis
    return !!currentPreferredHypothesis?.associatedSignalDetectionHypotheses?.find(sd => sd?.id.id === getCurrentHypothesis(detection?.signalDetectionHypotheses)?.id.id);
}
/**
 * Determines if the provided {@link EventHypothesis} object is the
 * preferredEventHypothesis for the current open stage.
 *
 * @param event Event object to check
 * @param openIntervalName Current open stage
 * @param eventHypothesis EventHypothesis object to verify
 * @returns true if the eventHypothesis is preferred
 */
export const isPreferredEventHypothesisByStage = (event, openIntervalName, eventHypothesis) => {
    if (!event || !eventHypothesis) {
        return false;
    }
    // Get the preferredEventHypo exists for the open stage (if it exists)
    const maybePreferred = event.preferredEventHypothesisByStage.find(hypo => hypo.stage.name === openIntervalName);
    // Check if these two have the same identifiers
    return (maybePreferred?.preferred.id.eventId === eventHypothesis.id.eventId &&
        maybePreferred?.preferred.id.hypothesisId === eventHypothesis.id.hypothesisId);
};
/**
 * Finds the last non rejected parent event hypothesis for a given event and hypothesis
 * if no valid hypothesis is found it returns the first hypothesis
 *
 * @param event
 * @param eventHypothesis
 */
export const findEventHypothesisParent = (event, 
/** Can be either the hypothesis for the open stage, or the default stage */
eventHypothesis) => {
    if (!eventHypothesis) {
        return undefined;
    }
    // loop backwards until we find a non-rejected hypothesis
    for (let i = eventHypothesis.parentEventHypotheses.length - 1; i >= 0; i -= 1) {
        const parentEventHypothesis = event.eventHypotheses.find(hypo => hypo.id.hypothesisId === eventHypothesis.parentEventHypotheses[i].id.hypothesisId);
        if (parentEventHypothesis) {
            return parentEventHypothesis;
        }
    }
    // nothing was found, return the first hypothesis
    return event.eventHypotheses[0];
};
/**
 * Finds the preferred location solution for a hypothesis falling back to the parents if the hypothesis is rejected
 *
 * @param eventHypothesisId hypothesis id to find the solution for
 * @param eventHypotheses list of hypotheses, if an event is opened
 * @returns a location solution
 */
export const findPreferredLocationSolution = (eventHypothesisId, eventHypotheses) => {
    const eventHypothesis = eventHypotheses.find(hypothesis => hypothesis.id.hypothesisId === eventHypothesisId);
    if (!eventHypothesis)
        return undefined;
    if (eventHypothesis.preferredLocationSolution) {
        return eventHypothesis.locationSolutions.find(ls => ls.id === eventHypothesis?.preferredLocationSolution?.id);
    }
    if (eventHypothesis.parentEventHypotheses) {
        const parentHypothesisId = eventHypothesis.parentEventHypotheses[eventHypothesis.parentEventHypotheses.length - 1].id
            .hypothesisId;
        const parentEventHypothesis = eventHypotheses.find(hypothesis => hypothesis.id.hypothesisId === parentHypothesisId);
        return parentEventHypothesis?.locationSolutions.find(ls => ls.id === parentEventHypothesis?.preferredLocationSolution?.id);
    }
    return undefined;
};
/**
 * Calculate the distance in kilometers between an event and a station.
 *
 * @param source The source location for which to calculate distance
 * @param destination The destination location for which to calculate distance
 * @returns calculated distance in kilometers
 */
export function getLocationToEventDistance(source, destination) {
    const accuracy = 1000;
    const degreePrecision = 1000;
    const KM = 1000;
    const KM_TO_DEGREES = 111.1949266;
    const dist = getDistance({ latitude: source.latitudeDegrees, longitude: source.longitudeDegrees }, {
        latitude: destination.latitudeDegrees,
        longitude: destination.longitudeDegrees
    }, accuracy);
    const kmDistance = dist / KM;
    // return distance as degrees and km
    return {
        degrees: Math.round((kmDistance / KM_TO_DEGREES) * degreePrecision) / degreePrecision,
        km: kmDistance
    };
}
/**
 * Calculate a location to event location azimuth
 *
 * @param source The source location for which to calculate azimuth
 * @param destination The destination location for which to calculate azimuth
 * @param type The calculation type for distance Receiver to source | Source to receiver
 * @returns calculated distance in kilometers
 */
function getLocationToLocationAzimuth(source, destination, type) {
    const origin = {
        latitude: source.latitudeDegrees,
        longitude: source.longitudeDegrees
    };
    const dest = {
        latitude: destination.latitudeDegrees,
        longitude: destination.longitudeDegrees
    };
    if (type === 'Receiver to source')
        return getGreatCircleBearing(origin, dest);
    return getGreatCircleBearing(dest, origin);
}
// A function to explicitly set the memoization cache ID.
// This resolves an issue where the cache hitting a false positive
const memoizeRecordResolver = (source, destination, type) => `${type}; ${source.latitudeDegrees},${source.longitudeDegrees}; ${destination.latitudeDegrees},${destination.longitudeDegrees}`;
export const memoizedLocationToEventDistance = memoize(getLocationToEventDistance, memoizeRecordResolver);
export const memoizedLocationToEventAzimuth = memoize(getLocationToLocationAzimuth, memoizeRecordResolver);
/**
 * Return a list of preferred EventHypotheses associated with the detection or an empty list
 *
 * @param detection signal detection to check event association against
 * @param events list of {@link Event} objects to search through
 * @param openIntervalName eg; Auto Network, AL1, AL2
 * @return list of {@link EventHypothesis}
 */
export function findEventHypothesesForDetection(detection, events, openIntervalName) {
    if (detection.signalDetectionHypotheses.length === 0)
        return [];
    return events.reduce((accumulator, event) => {
        const preferredHypothesis = findPreferredEventHypothesisByOpenStageOrDefaultStage(event, openIntervalName);
        const isAssociated = !!(preferredHypothesis &&
            preferredHypothesis.associatedSignalDetectionHypotheses.some(sdHypo => sdHypo.id.id === Util.getCurrentHypothesis(detection.signalDetectionHypotheses).id.id));
        if (isAssociated) {
            accumulator.push(preferredHypothesis);
        }
        return accumulator;
    }, []);
}
const distances = {};
function cleanDistances(locationSolutionId) {
    // Cleanup old keys to avoid memory leak
    Object.keys(distances).forEach(key => {
        if (key !== locationSolutionId)
            delete distances[key];
    });
}
/**
 * Gets the distance and azimuth to all stations and channels for the given location solution
 *
 * @param event event with a preferred location solution
 * @param stations array of stations to calculated distances for
 * @param openStageName string name of the open stage in order to find the preferred hypothesis
 * @param type The calculation type for distance Receiver to source | Source to receiver
 */
export function getDistanceToStationsUsingLocationSolution(locationSolution, stations, allChannels, type = 'Receiver to source') {
    if (!locationSolution || !stations)
        return {};
    if (!distances[locationSolution.id])
        distances[locationSolution.id] = { 'Receiver to source': {}, 'Source to receiver': {} };
    stations.forEach(station => {
        // Don't recalculate the same station again
        if (distances[locationSolution.id][type][station.name])
            return;
        // Azimuth is the same for the station and channels
        const azimuth = memoizedLocationToEventAzimuth(station.location, locationSolution.location, type);
        distances[locationSolution.id][type][station.name] = {
            azimuth,
            distance: memoizedLocationToEventDistance(station.location, locationSolution.location),
            id: station.name
        };
        if (allChannels.length > 0) {
            station.allRawChannels.forEach(channel => {
                // Don't recalculate a known channel name
                if (distances[locationSolution.id][type][channel.name])
                    return;
                const fullChannel = allChannels.find(c => channel.name === c.name);
                if (fullChannel !== undefined) {
                    distances[locationSolution.id][type][channel.name] = {
                        azimuth,
                        distance: memoizedLocationToEventDistance(fullChannel.location, locationSolution.location),
                        id: fullChannel.name
                    };
                }
            });
        }
    });
    cleanDistances(locationSolution.id);
    return distances[locationSolution.id][type];
}
/**
 * Gets the distance and azimuth to all stations and channels using the preferred location solution
 * of the provided event.
 *
 * @param event event with a preferred location solution
 * @param stations array of stations to calculated distances for
 * @param openStageName string name of the open stage in order to find the preferred hypothesis
 * @param allChannels all the channels getting a distance calculation
 */
export function getDistanceToStationsForPreferredLocationSolutionId(event, stations, openStageName, allChannels) {
    // Bail if event or stations are null
    if (!event || !stations)
        return {};
    const preferredEventHypothesisByStage = findPreferredEventHypothesisByOpenStageOrDefaultStage(event, openStageName);
    // Bail if the preferredEventHypothesisByStage is null
    if (!preferredEventHypothesisByStage)
        return {};
    const locationSolution = findPreferredLocationSolution(preferredEventHypothesisByStage.id.hypothesisId, event.eventHypotheses);
    return getDistanceToStationsUsingLocationSolution(locationSolution, stations, allChannels);
}
/**
 * Determine if a signal detection is complete.
 *
 * @param detection signal detection to check event association against
 * @param events list of {@link Event} objects to search through
 * @param eventsStatuses record of {@link EventStatus} objects
 * @param openIntervalName eg; Auto Network, AL1, AL2
 * @returns boolean
 */
export function isSignalDetectionCompleteAssociated(detection, events, eventsStatuses, openIntervalName) {
    const associatedEventIds = findEventHypothesesForDetection(detection, events, openIntervalName).map(hypo => hypo.id.eventId);
    let isComplete = false;
    events.forEach(event => {
        isComplete = !!(isComplete ||
            (associatedEventIds.find(id => event.id === id) !== undefined &&
                eventsStatuses &&
                eventsStatuses[event.id] !== undefined &&
                eventsStatuses[event.id] !== null &&
                eventsStatuses[event.id].eventStatusInfo.eventStatus === EventStatus.COMPLETE));
    });
    return isComplete;
}
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
export function isSignalDetectionOtherAssociated(detection, events, currentOpenEventId, openIntervalName) {
    // If any of the events has the detection in it's associated signal detection
    const associatedEventHypo = findEventHypothesesForDetection(detection, events, openIntervalName);
    return associatedEventHypo.some(assoc => assoc.id.eventId !== currentOpenEventId);
}
/**
 * Find all signal detections associated to the event
 *
 * @param event openEvent
 * @param signalDetections all signal detections
 * @returns associated signal detections
 */
export const getAssociatedDetections = (event, signalDetections, openIntervalName) => {
    if (event) {
        return signalDetections.filter(sd => sd &&
            isSignalDetectionOpenAssociated(sd, [event], event.id, openIntervalName) &&
            !Util.getCurrentHypothesis(sd.signalDetectionHypotheses).deleted);
    }
    return [];
};
/**
 * Returns a CONST string representing the provided signal detection association status
 */
export function getSignalDetectionStatus(signalDetection, events, openEventId, eventsStatuses, openIntervalName) {
    const sdHyp = Util.getCurrentHypothesis(signalDetection?.signalDetectionHypotheses);
    if (sdHyp && sdHyp.deleted) {
        return SignalDetectionStatus.DELETED;
    }
    if (isSignalDetectionOpenAssociated(signalDetection, events, openEventId, openIntervalName)) {
        return SignalDetectionStatus.OPEN_ASSOCIATED;
    }
    // determine if associated to a complete event
    if (isSignalDetectionCompleteAssociated(signalDetection, events, eventsStatuses, openIntervalName)) {
        return SignalDetectionStatus.COMPLETE_ASSOCIATED;
    }
    // determine if associated to another event
    if (isSignalDetectionOtherAssociated(signalDetection, events, openEventId, openIntervalName)) {
        return SignalDetectionStatus.OTHER_ASSOCIATED;
    }
    // else it is unassociated
    return SignalDetectionStatus.UNASSOCIATED;
}
/**
 * Returns a list of signal detection association statuses and their signal detection id
 */
export function getSignalDetectionStatuses(signalDetections, events, openEventId, eventsStatuses, openIntervalName) {
    return signalDetections.map(sd => {
        const sdAssociation = {
            signalDetectionId: sd.id,
            associationStatus: getSignalDetectionStatus(sd, events, openEventId, eventsStatuses, openIntervalName)
        };
        return sdAssociation;
    });
}
/**
 * Checks if a given {@link SignalDetectionHypothesis} is
 * associated with a given {@link EventHypothesis}.
 *
 * @returns true if associated, false otherwise.
 */
export function isSdHypothesisAssociatedToEventHypothesis(sdHypothesis, eventHypothesis) {
    if (!eventHypothesis || !sdHypothesis)
        return false;
    return eventHypothesis.associatedSignalDetectionHypotheses.some(sdAssoc => sdAssoc.id.id === sdHypothesis.id.id);
}
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
export function getPreferredLocationSolutionForEventAndInterval(event, openIntervalName) {
    const preferredHypothesis = findPreferredEventHypothesisByOpenStageOrDefaultStage(event, openIntervalName);
    if (preferredHypothesis === undefined) {
        throw new Error('No preferred hypothesis found for current open event.');
    }
    const preferredLocationSolution = findPreferredLocationSolution(preferredHypothesis.id.hypothesisId, event.eventHypotheses);
    if (preferredLocationSolution === undefined) {
        throw new Error('No preferred location solution found for open event.');
    }
    return preferredLocationSolution;
}
/**
 * Determine the computed {@link Restraint} based on the values of the {@link LocationRestraint}
 * @param locationRestraint
 * @returns returns the computed {@link Restraint} based on the values of the {@link LocationRestraint}
 */
export function determineRestraint(locationRestraint) {
    // ANALYST
    if (locationRestraint.restrainer === RestrainerType.FIXED_BY_ANALYST) {
        return Restraint.FIXED_BY_ANALYST;
    }
    // LOCATOR
    if (locationRestraint.restrainer === RestrainerType.FIXED_BY_LOCATOR) {
        return Restraint.FIXED_BY_LOCATOR;
    }
    // UNRESTRAINED
    if (locationRestraint.depthRestraintType === RestraintType.UNRESTRAINED &&
        locationRestraint.epicenterRestraintType === RestraintType.UNRESTRAINED &&
        locationRestraint.timeRestraintType === RestraintType.UNRESTRAINED) {
        return Restraint.UNRESTRAINED;
    }
    // FIXED AT SURFACE
    if (locationRestraint.depthRestraintType === RestraintType.FIXED &&
        locationRestraint.depthRestraintReason === DepthRestraintReason.FIXED_AT_SURFACE &&
        locationRestraint.epicenterRestraintType === RestraintType.UNRESTRAINED &&
        locationRestraint.timeRestraintType === RestraintType.UNRESTRAINED &&
        locationRestraint.restrainer === RestrainerType.FIXED_BY_CONFIGURATION) {
        return Restraint.FIXED_AT_SURFACE;
    }
    // FIXED AT DEPTH
    if (locationRestraint.depthRestraintType === RestraintType.FIXED &&
        locationRestraint.depthRestraintReason === DepthRestraintReason.FIXED_AT_STANDARD_DEPTH &&
        locationRestraint.epicenterRestraintType === RestraintType.UNRESTRAINED &&
        locationRestraint.timeRestraintType === RestraintType.UNRESTRAINED &&
        locationRestraint.restrainer === RestrainerType.FIXED_BY_CONFIGURATION) {
        return Restraint.FIXED_AT_DEPTH;
    }
    // UNKNOWN
    return Restraint.UNKNOWN;
}
//# sourceMappingURL=util.js.map