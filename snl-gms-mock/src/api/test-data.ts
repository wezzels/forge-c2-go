// Test data for development
import type { Station } from '../models/station';
import type { Event } from '../models/event';
import type { SignalDetection } from '../models/detection';
import type { ChannelSegment } from '../models/weavess';

export const getTestStations = (): Station[] => {
  return [
    { name: 'ASAR', type: 'SEISMIC_ARRAY' as any, description: 'Alice Springs Array', location: { latitude: -23.698, longitude: 133.895, depthKm: 0, elevationKm: 0.5 }, effectiveAt: Date.now() / 1000, channelGroups: [] },
    { name: 'ARCES', type: 'SEISMIC_ARRAY' as any, description: 'Arctic Array', location: { latitude: 69.535, longitude: 25.506, depthKm: 0, elevationKm: 0.4 }, effectiveAt: Date.now() / 1000, channelGroups: [] },
    { name: 'MKAR', type: 'SEISMIC_ARRAY' as any, description: 'Makanchi Array', location: { latitude: 46.793, longitude: 82.295, depthKm: 0, elevationKm: 0.6 }, effectiveAt: Date.now() / 1000, channelGroups: [] },
    { name: 'ILAR', type: 'SEISMIC_ARRAY' as any, description: 'Fairbanks Array', location: { latitude: 64.77, longitude: -146.88, depthKm: 0, elevationKm: 0.3 }, effectiveAt: Date.now() / 1000, channelGroups: [] },
    { name: 'PDAR', type: 'SEISMIC_ARRAY' as any, description: 'Pinedale Array', location: { latitude: 42.77, longitude: -110.58, depthKm: 0, elevationKm: 0.7 }, effectiveAt: Date.now() / 1000, channelGroups: [] }
  ];
};

export const getTestEvents = (): Event[] => {
  return [
    { id: 'EVT001', status: 'IN_PROGRESS' as any, hypothesisId: 'HYP001', location: { latitude: 35.5, longitude: 140.2, depthKm: 50, elevationKm: 0 }, magnitude: 5.2, originTime: Date.now() / 1000 - 3600, depth: 50, latitude: 35.5, longitude: 140.2, isOpen: true },
    { id: 'EVT002', status: 'COMPLETE' as any, hypothesisId: 'HYP002', location: { latitude: 45.1, longitude: 120.3, depthKm: 30, elevationKm: 0 }, magnitude: 4.1, originTime: Date.now() / 1000 - 7200, depth: 30, latitude: 45.1, longitude: 120.3, isOpen: false },
    { id: 'EVT003', status: 'IN_PROGRESS' as any, hypothesisId: 'HYP003', location: { latitude: -10.5, longitude: 160.8, depthKm: 100, elevationKm: 0 }, magnitude: 6.0, originTime: Date.now() / 1000 - 1800, depth: 100, latitude: -10.5, longitude: 160.8, isOpen: true }
  ];
};

export const getTestDetections = (): SignalDetection[] => {
  return [
    { id: 'SD001', station: { name: 'ASAR' }, phase: 'P', arrivalTime: Date.now() / 1000 - 3500, slowness: 12.5, azimuth: 45.2, amplitude: 1.2e-6, status: 'OPEN' as any },
    { id: 'SD002', station: { name: 'ARCES' }, phase: 'P', arrivalTime: Date.now() / 1000 - 3400, slowness: 8.3, azimuth: 90.1, amplitude: 2.5e-7, status: 'COMPLETE' as any },
    { id: 'SD003', station: { name: 'MKAR' }, phase: 'S', arrivalTime: Date.now() / 1000 - 3200, slowness: 15.2, azimuth: 180.5, amplitude: 3.1e-6, status: 'OPEN' as any }
  ];
};

export const getTestChannelSegments = (): ChannelSegment[] => {
  const now = Date.now() / 1000;
  
  return [
    {
      id: 'CH001',
      name: 'ASAR.BHZ',
      type: 'RAW' as any,
      channel: { name: 'ASAR.BHZ', type: 'RAW' as any, stationName: 'ASAR' },
      timeseries: [
        {
          type: 'WAVEFORM' as any,
          values: generateSineWave(1000, 10, 0.1),
          startTime: now - 3600,
          sampleCount: 1000,
          sampleRate: 1
        }
      ]
    },
    {
      id: 'CH002',
      name: 'ARCES.BHZ',
      type: 'RAW' as any,
      channel: { name: 'ARCES.BHZ', type: 'RAW' as any, stationName: 'ARCES' },
      timeseries: [
        {
          type: 'WAVEFORM' as any,
          values: generateSineWave(1000, 8, 0.15),
          startTime: now - 3600,
          sampleCount: 1000,
          sampleRate: 1
        }
      ]
    },
    {
      id: 'CH003',
      name: 'MKAR.BHZ',
      type: 'RAW' as any,
      channel: { name: 'MKAR.BHZ', type: 'RAW' as any, stationName: 'MKAR' },
      timeseries: [
        {
          type: 'WAVEFORM' as any,
          values: generateSineWave(1000, 12, 0.08),
          startTime: now - 3600,
          sampleCount: 1000,
          sampleRate: 1
        }
      ]
    },
    {
      id: 'CH004',
      name: 'ILAR.BHZ',
      type: 'RAW' as any,
      channel: { name: 'ILAR.BHZ', type: 'RAW' as any, stationName: 'ILAR' },
      timeseries: [
        {
          type: 'WAVEFORM' as any,
          values: generateSineWave(1000, 6, 0.12),
          startTime: now - 3600,
          sampleCount: 1000,
          sampleRate: 1
        }
      ]
    },
    {
      id: 'CH005',
      name: 'PDAR.BHZ',
      type: 'RAW' as any,
      channel: { name: 'PDAR.BHZ', type: 'RAW' as any, stationName: 'PDAR' },
      timeseries: [
        {
          type: 'WAVEFORM' as any,
          values: generateSineWave(1000, 15, 0.09),
          startTime: now - 3600,
          sampleCount: 1000,
          sampleRate: 1
        }
      ]
    }
  ];
};

function generateSineWave(length: number, frequency: number, amplitude: number): number[] {
  const values: number[] = [];
  for (let i = 0; i < length; i++) {
    values.push(Math.sin(2 * Math.PI * frequency * i / length) * amplitude * 1000000);
  }
  return values;
}
