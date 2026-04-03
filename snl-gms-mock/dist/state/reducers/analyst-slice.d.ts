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
export declare const analystInitialState: AnalystState;
export declare const analystSlice: import("@reduxjs/toolkit").Slice<AnalystState, {
    setCurrentPhase: (state: Draft<AnalystState>, action: PayloadAction<string>) => void;
    setOpenEventId: (state: Draft<AnalystState>, action: PayloadAction<string>) => void;
    setSelectedEventIds: (state: Draft<AnalystState>, action: PayloadAction<string[]>) => void;
    setSelectedChannelIds: (state: Draft<AnalystState>, action: PayloadAction<string[]>) => void;
    setSelectedStationIds: (state: Draft<AnalystState>, action: PayloadAction<string[]>) => void;
    setSelectedFilterList: (state: Draft<AnalystState>, action: PayloadAction<string>) => void;
    setSelectedFilterIndex: (state: Draft<AnalystState>, action: PayloadAction<number>) => void;
}, "analyst">;
export declare const setCurrentPhase: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "analyst/setCurrentPhase">, setOpenEventId: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "analyst/setOpenEventId">, setSelectedEventIds: import("@reduxjs/toolkit").ActionCreatorWithPayload<string[], "analyst/setSelectedEventIds">, setSelectedChannelIds: import("@reduxjs/toolkit").ActionCreatorWithPayload<string[], "analyst/setSelectedChannelIds">, setSelectedStationIds: import("@reduxjs/toolkit").ActionCreatorWithPayload<string[], "analyst/setSelectedStationIds">, setSelectedFilterList: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "analyst/setSelectedFilterList">, setSelectedFilterIndex: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "analyst/setSelectedFilterIndex">;
declare const _default: import("redux").Reducer<AnalystState>;
export default _default;
//# sourceMappingURL=analyst-slice.d.ts.map