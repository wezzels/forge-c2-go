import { allKeyboardShortcutEventTypes } from './types';
/**
 * @param config A hotkey config or an override to prevent default browser hotkeys, or undefined
 * @returns true if it is a hotkey config, false if undefined or a prevent default override
 */
export function isKeyboardShortcut(config) {
    return config?.description !== undefined;
}
/**
 * @param config A hotkey config or an override to prevent default browser hotkeys, or undefined
 * @returns true if it is a prevent default override, false if undefined, or if it is a hotkey config object
 */
export function isPreventDefaultHotkeyOverride(config) {
    return config !== undefined && config.description === undefined;
}
/**
 * Check if a string is a {@link KeyboardShortcutEventType} (i.e., a key within the KeyboardShortcuts)
 * @param maybeKeyboardShortcutEventType the string to check
 */
export function isKeyboardShortcutEventType(maybeKeyboardShortcutEventType) {
    return (typeof maybeKeyboardShortcutEventType === 'string' &&
        allKeyboardShortcutEventTypes.includes(maybeKeyboardShortcutEventType));
}
/**
 * Asserts a string is a {@link KeyboardShortcutEventType} (i.e., a key within the KeyboardShortcuts)
 * @param maybeKeyboardShortcutEventType the string to check
 */
export function assertIsKeyboardShortcutEventType(maybeKeyboardShortcutEventType) {
    if (!isKeyboardShortcutEventType(maybeKeyboardShortcutEventType)) {
        throw new Error(`Invalid Keyboard Shortcut Event Type: ${maybeKeyboardShortcutEventType}`);
    }
}
/**
 * Checks if the given hotkey configuration is a typed hotkey configuration.
 *
 * A typed hotkey configuration is identified by the presence of a specific
 * type property that matches one of the predefined keyboard shortcut event types.
 *
 * @param config - The hotkey configuration to check.
 * @returns True if the configuration is a typed hotkey configuration; otherwise, false.
 */
export function isTypedKeyboardShortcut(config) {
    return (
    // eslint-disable-next-line no-underscore-dangle
    config._uiHotkeyConfigurationType !== undefined &&
        // eslint-disable-next-line no-underscore-dangle
        allKeyboardShortcutEventTypes.includes(config._uiHotkeyConfigurationType));
}
/**
 * Asserts that the given hotkey configuration is a typed hotkey configuration.
 *
 * If the configuration is not a typed hotkey configuration, an error is thrown.
 *
 * @param config - The hotkey configuration to assert.
 * @throws {Error} Throws an error if the configuration is not a typed hotkey configuration.
 */
export function assertIsTypedKeyboardShortcut(config) {
    if (!isTypedKeyboardShortcut(config)) {
        throw new Error('Invalid hotkey configuration. Expected hotkey config to be a typed configuration value, but no type was set');
    }
}
//# sourceMappingURL=config-util.js.map