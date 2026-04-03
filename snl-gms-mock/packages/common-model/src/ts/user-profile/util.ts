import type { WaveformMode } from '../ui-configuration/types';
import { SHOW_EMPTY_ROWS_MODES } from '../ui-configuration/types';
import type { HideEmptyWaveformRows } from './types';

/**
 * Determines whether or not empty rows in the waveform display should be visible
 * in scenarios where we are switching waveform modes
 * @param hideEmptyWaveformRowsOption from the user's current user preferences
 * @param mode the mode to be entered
 */
export const determineEmptyRowVisibility = (
  hideEmptyWaveformRowsOption: HideEmptyWaveformRows,
  mode: WaveformMode
) => {
  switch (hideEmptyWaveformRowsOption) {
    case 'ALWAYS_ON':
      return true;
    case 'ALWAYS_OFF':
      return false;
    case 'PER_MODE':
    default:
      return SHOW_EMPTY_ROWS_MODES.includes(mode);
  }
};
