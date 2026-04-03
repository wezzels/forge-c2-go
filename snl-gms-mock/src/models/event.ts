// Event Types - Reverse engineered from SNL-GMS UI

export enum EventStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETE = 'COMPLETE',
  NOT_STARTED = 'NOT_STARTED',
  NOT_COMPLETE = 'NOT_COMPLETE'
}

export interface Event {
  id: string;
  status: EventStatus;
  hypothesisId: string;
  location: Location;
  magnitude: number;
  originTime: number;
  depth: number;
  latitude: number;
  longitude: number;
  activeAnalysts?: string[];
  isOpen: boolean;
}

export interface LocationDistance {
  distance: Distance;
  azimuth: number;
  id: string;
}

export interface Distance {
  value: number;
  units: string;
}

export interface EventRowData {
  id: string;
  status: EventStatus;
  magnitude: number;
  latitude: number;
  longitude: number;
  depth: number;
  originTime: number;
  activeAnalysts?: string[];
  isOpen: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  depthKm: number;
  elevationKm: number;
}
