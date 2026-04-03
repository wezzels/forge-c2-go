// Signal Detection Types - Reverse engineered from SNL-GMS UI

export enum FeatureMeasurementType {
  AMPLITUDE_ALR_OVER_2 = 'AMPLITUDE_ALR_OVER_2',
  ARRIVAL_TIME = 'ARRIVAL_TIME',
  PHASE = 'PHASE',
  SLOWNESS = 'SLOWNESS',
  RECTILINEARITY = 'RECTILINEARITY',
  SHORT_PERIOD_FIRST_MOTION = 'SHORT_PERIOD_FIRST_MOTION',
  LONG_PERIOD_FIRST_MOTION = 'LONG_PERIOD_FIRST_MOTION'
}

export interface SignalDetection {
  id: string;
  station: { name: string };
  phase: string;
  arrivalTime: number;
  slowness?: number;
  azimuth?: number;
  amplitude?: number;
  period?: number;
  signalToNoise?: number;
  eventHypothesisId?: string;
  status: DetectionStatus;
}

export enum DetectionStatus {
  OPEN = 'OPEN',
  COMPLETE = 'COMPLETE',
  IN_PROGRESS = 'IN_PROGRESS',
  NOT_STARTED = 'NOT_STARTED'
}

export interface SignalDetectionRowData {
  id: string;
  station: string;
  phase: string;
  arrivalTime: number;
  slowness?: number;
  azimuth?: number;
  amplitude?: number;
  status: DetectionStatus;
  eventHypothesisId?: string;
}
