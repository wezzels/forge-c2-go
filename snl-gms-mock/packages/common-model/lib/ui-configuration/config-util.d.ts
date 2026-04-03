import { type KeyboardShortcut, type KeyboardShortcutEventType, type PreventDefaultHotkeyOverride, type TypedKeyboardShortcut } from './types';
/**
 * @param config A hotkey config or an override to prevent default browser hotkeys, or undefined
 * @returns true if it is a hotkey config, false if undefined or a prevent default override
 */
export declare function isKeyboardShortcut(config: KeyboardShortcut | PreventDefaultHotkeyOverride | undefined): config is KeyboardShortcut;
/**
 * @param config A hotkey config or an override to prevent default browser hotkeys, or undefined
 * @returns true if it is a prevent default override, false if undefined, or if it is a hotkey config object
 */
export declare function isPreventDefaultHotkeyOverride(config: KeyboardShortcut | PreventDefaultHotkeyOverride | undefined): config is KeyboardShortcut;
/**
 * Check if a string is a {@link KeyboardShortcutEventType} (i.e., a key within the KeyboardShortcuts)
 * @param maybeKeyboardShortcutEventType the string to check
 */
export declare function isKeyboardShortcutEventType(maybeKeyboardShortcutEventType: string): maybeKeyboardShortcutEventType is KeyboardShortcutEventType;
/**
 * Asserts a string is a {@link KeyboardShortcutEventType} (i.e., a key within the KeyboardShortcuts)
 * @param maybeKeyboardShortcutEventType the string to check
 */
export declare function assertIsKeyboardShortcutEventType(maybeKeyboardShortcutEventType: string): asserts maybeKeyboardShortcutEventType is KeyboardShortcutEventType;
/**
 * Checks if the given hotkey configuration is a typed hotkey configuration.
 *
 * A typed hotkey configuration is identified by the presence of a specific
 * type property that matches one of the predefined keyboard shortcut event types.
 *
 * @param config - The hotkey configuration to check.
 * @returns True if the configuration is a typed hotkey configuration; otherwise, false.
 */
export declare function isTypedKeyboardShortcut(config: KeyboardShortcut): config is TypedKeyboardShortcut;
/**
 * Asserts that the given hotkey configuration is a typed hotkey configuration.
 *
 * If the configuration is not a typed hotkey configuration, an error is thrown.
 *
 * @param config - The hotkey configuration to assert.
 * @throws {Error} Throws an error if the configuration is not a typed hotkey configuration.
 */
export declare function assertIsTypedKeyboardShortcut(config: KeyboardShortcut): asserts config is TypedKeyboardShortcut;
//# sourceMappingURL=config-util.d.ts.map