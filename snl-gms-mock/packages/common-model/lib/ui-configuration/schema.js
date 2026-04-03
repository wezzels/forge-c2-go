import { z } from 'zod';
import { AllClickEventDefinitions, AllDoubleClickDefinitions, AllDragEventDefinitions, AllHotkeyDefinitions, allKeyboardShortcutEventTypes, AllScrollEventDefinitions } from './types';
/**
 * zod schema for a single keyboard shortcut
 */
export const keyboardShortcutSchema = z
    .object({
    description: z.string(),
    helpText: z.string(),
    combos: z.array(z.string()),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    _uiHotkeyConfigurationType: z.enum(allKeyboardShortcutEventTypes).optional(),
    _uiHotkeyName: z
        .union([
        z.enum(AllClickEventDefinitions),
        z.enum(AllDoubleClickDefinitions),
        z.enum(AllScrollEventDefinitions),
        z.enum(AllHotkeyDefinitions)
    ])
        .optional()
})
    .strict();
/**
 * zod schema for the 'click' keyboard shortcuts object
 */
export const clickShortcutConfigSchema = z
    .object(Object.fromEntries(AllClickEventDefinitions.map(clickEventDefinition => [
    clickEventDefinition,
    keyboardShortcutSchema
])))
    .strict();
/**
 * zod schema for the 'double click' keyboard shortcuts object
 */
export const doubleClickShortcutConfigSchema = z
    .object(Object.fromEntries(AllDoubleClickDefinitions.map(doubleClickEventDefinition => [
    doubleClickEventDefinition,
    keyboardShortcutSchema
])))
    .strict();
/**
 * zod schema for the 'drag event' keyboard shortcuts object
 */
export const dragEventsShortcutConfigSchema = z
    .object(Object.fromEntries(AllDragEventDefinitions.map(dragEventDefinition => [
    dragEventDefinition,
    keyboardShortcutSchema
])))
    .strict();
/**
 * zod schema for the 'scroll event' keyboard shortcuts object
 */
export const scrollEventsShortcutConfigSchema = z
    .object(Object.fromEntries(AllScrollEventDefinitions.map(scrollEventDefinition => [
    scrollEventDefinition,
    keyboardShortcutSchema
])))
    .strict();
/**
 * zod schema for the 'hotkey' keyboard shortcuts object
 */
export const hotkeysShortcutConfigSchema = z
    .object(Object.fromEntries(AllHotkeyDefinitions.map(hotkeyDefinition => [hotkeyDefinition, keyboardShortcutSchema])))
    .strict();
export const keyboardShortcutsSchema = z
    .object({
    clickEvents: clickShortcutConfigSchema,
    middleClickEvents: z.object({}),
    rightClickEvents: z.object({}),
    doubleClickEvents: doubleClickShortcutConfigSchema,
    dragEvents: dragEventsShortcutConfigSchema,
    scrollEvents: scrollEventsShortcutConfigSchema,
    hotkeys: hotkeysShortcutConfigSchema
})
    .strict();
//# sourceMappingURL=schema.js.map