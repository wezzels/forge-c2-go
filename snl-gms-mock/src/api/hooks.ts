// API Hooks - React Query hooks for live data

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gatewayClient } from './gateway';

// Stations hooks
export const useStations = (startTime: number, endTime: number) => {
  return useQuery({
    queryKey: ['stations', startTime, endTime],
    queryFn: () => gatewayClient.post('/station-reference/station-reference/repository/stations/query', {
      startTime,
      endTime
    }).then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Events hooks
export const useEvents = (startTime: number, endTime: number) => {
  return useQuery({
    queryKey: ['events', startTime, endTime],
    queryFn: () => gatewayClient.post('/event-manager/events/query', {
      startTime,
      endTime
    }).then(res => res.data),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useEventStatus = (stageId: string, eventIds: string[]) => {
  return useQuery({
    queryKey: ['eventStatus', stageId, eventIds],
    queryFn: () => gatewayClient.post('/event-manager/events/status', {
      stageId,
      eventIds
    }).then(res => res.data),
    enabled: eventIds.length > 0,
  });
};

// Signal Detections hooks
export const useSignalDetections = (startTime: number, endTime: number, stationIds: string[]) => {
  return useQuery({
    queryKey: ['signalDetections', startTime, endTime, stationIds],
    queryFn: () => gatewayClient.post('/signal-detection/signal-detections/query', {
      startTime,
      endTime,
      stationIds
    }).then(res => res.data),
    enabled: stationIds.length > 0,
  });
};

// Channel Segments hooks
export const useChannelSegments = (channelIds: string[], startTime: number, endTime: number) => {
  return useQuery({
    queryKey: ['channelSegments', channelIds, startTime, endTime],
    queryFn: () => gatewayClient.post('/osd/channel-segments/query', {
      channelIds,
      startTime,
      endTime
    }).then(res => res.data),
    enabled: channelIds.length > 0,
  });
};

// Workflow hooks
export const useStageIntervals = (stageIds: string[], startTime: number, endTime: number) => {
  return useQuery({
    queryKey: ['stageIntervals', stageIds, startTime, endTime],
    queryFn: () => gatewayClient.post('/workflow/stage-intervals/query', {
      stageIds,
      startTime,
      endTime
    }).then(res => res.data),
  });
};

// Mutations
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (event: any) => gatewayClient.post('/event-manager/events', event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useCreateSignalDetection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (detection: any) => gatewayClient.post('/signal-detection/signal-detections', detection),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signalDetections'] });
    },
  });
};
