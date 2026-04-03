// Analyst State Slice - Reverse engineered from SNL-GMS UI

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction, Draft } from '@reduxjs/toolkit';

export interface AnalystState {
  defaultSignalDetectionPhase: string;
  effectiveNowTime: number;
  openEventId: string;
  currentPhase: string;
  selectedEventIds: string[];
  selectedChannelIds: string[];
  selectedStationIds: string[];
  selectedFilterList: string;
  selectedFilterIndex: number;
  selectedSdIds: string[];
  selectedWaveforms: string[];
  areEmptyRowsVisible: boolean;
  actionTargets: ActionTargets;
}

export interface ActionTargets {
  actionType: string | null;
  eventIds: string[];
  signalDetectionIds: string[];
}

export const analystInitialState: AnalystState = {
  defaultSignalDetectionPhase: 'P',
  effectiveNowTime: Date.now() / 1000,
  openEventId: '',
  currentPhase: '',
  selectedEventIds: [],
  selectedChannelIds: [],
  selectedStationIds: [],
  selectedFilterList: '',
  selectedFilterIndex: -1,
  selectedSdIds: [],
  selectedWaveforms: [],
  areEmptyRowsVisible: true,
  actionTargets: {
    actionType: null,
    eventIds: [],
    signalDetectionIds: []
  }
};

export const analystSlice = createSlice({
  name: 'analyst',
  initialState: analystInitialState,
  reducers: {
    setCurrentPhase: (state: Draft<AnalystState>, action: PayloadAction<string>) => {
      state.currentPhase = action.payload;
    },
    setOpenEventId: (state: Draft<AnalystState>, action: PayloadAction<string>) => {
      state.openEventId = action.payload;
    },
    setSelectedEventIds: (state: Draft<AnalystState>, action: PayloadAction<string[]>) => {
      state.selectedEventIds = action.payload;
    },
    setSelectedChannelIds: (state: Draft<AnalystState>, action: PayloadAction<string[]>) => {
      state.selectedChannelIds = action.payload;
    },
    setSelectedStationIds: (state: Draft<AnalystState>, action: PayloadAction<string[]>) => {
      state.selectedStationIds = action.payload;
    },
    setSelectedFilterList: (state: Draft<AnalystState>, action: PayloadAction<string>) => {
      state.selectedFilterList = action.payload;
    },
    setSelectedFilterIndex: (state: Draft<AnalystState>, action: PayloadAction<number>) => {
      state.selectedFilterIndex = action.payload;
    }
  }
});

export const {
  setCurrentPhase,
  setOpenEventId,
  setSelectedEventIds,
  setSelectedChannelIds,
  setSelectedStationIds,
  setSelectedFilterList,
  setSelectedFilterIndex
} = analystSlice.actions;

export default analystSlice.reducer;
