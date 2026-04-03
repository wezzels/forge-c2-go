// API Gateway Client - Reverse engineered from SNL-GMS UI

import axios from 'axios';

const GATEWAY_BASE_URL = process.env.GATEWAY_URL || 'http://localhost:3000/interactive-analysis-api-gateway';

export const gatewayClient = axios.create({
  baseURL: GATEWAY_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Health check
export const healthCheck = async () => {
  const response = await gatewayClient.get('/health-check');
  return response.data;
};

// Station endpoints
export const getStations = async (startTime: number, endTime: number) => {
  const response = await gatewayClient.post('/station-reference/station-reference/repository/stations/query', {
    startTime,
    endTime
  });
  return response.data;
};

// Event endpoints
export const getEvents = async (startTime: number, endTime: number) => {
  const response = await gatewayClient.post('/event-manager/events/query', {
    startTime,
    endTime
  });
  return response.data;
};

export const getEventStatus = async (stageId: string, eventIds: string[]) => {
  const response = await gatewayClient.post('/event-manager/events/status', {
    stageId,
    eventIds
  });
  return response.data;
};

// Signal detection endpoints
export const getSignalDetections = async (startTime: number, endTime: number, stationIds: string[]) => {
  const response = await gatewayClient.post('/signal-detection/signal-detections/query', {
    startTime,
    endTime,
    stationIds
  });
  return response.data;
};

// Channel segment endpoints
export const getChannelSegments = async (channelIds: string[], startTime: number, endTime: number) => {
  const response = await gatewayClient.post('/osd/channel-segments/query', {
    channelIds,
    startTime,
    endTime
  });
  return response.data;
};

// Workflow endpoints
export const getStageIntervals = async (stageIds: string[], startTime: number, endTime: number) => {
  const response = await gatewayClient.post('/workflow/stage-intervals/query', {
    stageIds,
    startTime,
    endTime
  });
  return response.data;
};
