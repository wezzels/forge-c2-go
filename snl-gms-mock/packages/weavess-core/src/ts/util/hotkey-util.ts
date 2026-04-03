import type { WeavessKeyboardShortcut } from '../types';

/**
 * @returns A list of keyboard shortcut combos
 */
export function getKeyboardShortcutCombos(
  weavessKeyboardShortcut: WeavessKeyboardShortcut | undefined
) {
  return weavessKeyboardShortcut?.combos ?? [];
}
