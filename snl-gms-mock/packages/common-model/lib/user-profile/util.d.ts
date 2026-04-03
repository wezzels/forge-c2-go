import type { WaveformMode } from '../ui-configuration/types';
import type { HideEmptyWaveformRows } from './types';
/**
 * Determines whether or not empty rows in the waveform display should be visible
 * in scenarios where we are switching waveform modes
 * @param hideEmptyWaveformRowsOption from the user's current user preferences
 * @param mode the mode to be entered
 */
export declare const determineEmptyRowVisibility: (hideEmptyWaveformRowsOption: HideEmptyWaveformRows, mode: WaveformMode) => boolean;
//# sourceMappingURL=util.d.ts.map