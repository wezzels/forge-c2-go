import {
  clickShortcutConfigSchema,
  keyboardShortcutSchema,
  keyboardShortcutsSchema
} from '../../src/ts/ui-configuration/schema';
import { processingAnalystConfigurationData } from '../__data__';

describe('KeyboardShortcuts schema', () => {
  describe('KeyboardShortcut (singular) schema', () => {
    const { createSignalDetectionWithCurrentPhase: shortcut } =
      processingAnalystConfigurationData.keyboardShortcuts.clickEvents;
    it('should validate a valid object', () => {
      expect(keyboardShortcutSchema.safeParse(shortcut).success).toBeTruthy();
    });

    it('should invalidate an object missing required fields', () => {
      const mangledShortcut = {
        description: shortcut.description,
        tags: shortcut.tags,
        categories: shortcut.categories
      };

      expect(keyboardShortcutSchema.safeParse(mangledShortcut).success).toBeFalsy();
    });
  });

  describe('clickShortcutConfig schema', () => {
    const { clickEvents } = processingAnalystConfigurationData.keyboardShortcuts;

    it('should validate a valid object', () => {
      expect(clickShortcutConfigSchema.safeParse(clickEvents).success).toBeTruthy();
    });

    it('should invalidate an object with incorrect fields', () => {
      const mangledClickEvents = {
        ...clickEvents,
        // Bad value
        measureAmplitude: 'bad'
      };

      expect(clickShortcutConfigSchema.safeParse(mangledClickEvents).success).toBeFalsy();
    });

    it('should invalidate an object with additional fields that are not valid', () => {
      const mangledClickEvents = {
        ...clickEvents,
        // Extra event that does not exist
        fakeEvent: { ...clickEvents.measureAmplitude }
      };

      expect(clickShortcutConfigSchema.safeParse(mangledClickEvents).success).toBeFalsy();
    });
  });

  describe('Full keyboardShortcutsSchema', () => {
    const { keyboardShortcuts } = processingAnalystConfigurationData;

    it('should validate a valid object', () => {
      expect(keyboardShortcutsSchema.safeParse(keyboardShortcuts).success).toBeTruthy();
    });

    it('should invalidate an object with incorrect fields', () => {
      const mangledKeyboardShortcuts = {
        ...keyboardShortcuts,
        // Bad value
        clickEvents: 'bad'
      };

      expect(keyboardShortcutsSchema.safeParse(mangledKeyboardShortcuts).success).toBeFalsy();
    });

    it('should invalidate an object with additional fields that are not valid', () => {
      const mangledKeyboardShortcuts = {
        ...keyboardShortcuts,
        // Extra event that does not exist
        fakeEvents: { ...keyboardShortcuts.clickEvents }
      };

      expect(keyboardShortcutsSchema.safeParse(mangledKeyboardShortcuts).success).toBeFalsy();
    });
  });
});
