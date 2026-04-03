import type { KeyboardShortcut } from '../../src/ts/ui-configuration';
import {
  assertIsKeyboardShortcutEventType,
  assertIsTypedKeyboardShortcut,
  isKeyboardShortcut,
  isKeyboardShortcutEventType,
  isPreventDefaultHotkeyOverride,
  isTypedKeyboardShortcut
} from '../../src/ts/ui-configuration';

describe('Config utils', () => {
  const hotkeyConfiguration: KeyboardShortcut = {
    description: 'Do the click thing',
    helpText: 'Click to do the thing.',
    combos: ['ctrl+a'],
    tags: ['click', 'foo'],
    categories: ['A']
  };

  describe('isKeyboardShortcut', () => {
    it('passes check', () => {
      expect(isKeyboardShortcut(hotkeyConfiguration)).toBeTruthy();
    });

    it('fails check', () => {
      expect(isKeyboardShortcut({} as KeyboardShortcut)).toBeFalsy();
    });
  });

  describe('isPreventDefaultHotkeyOverride', () => {
    it('passes check', () => {
      expect(
        isPreventDefaultHotkeyOverride({
          combos: hotkeyConfiguration.combos
        })
      ).toBeTruthy();
    });

    it('fails check', () => {
      expect(isPreventDefaultHotkeyOverride(hotkeyConfiguration)).toBeFalsy();
    });
  });

  describe('isKeyboardShortcutEventType', () => {
    it('passes check', () => {
      expect(isKeyboardShortcutEventType('clickEvents')).toBeTruthy();
    });

    it('fails check', () => {
      expect(isKeyboardShortcutEventType('bad')).toBeFalsy();
    });
  });

  describe('assertIsKeyboardShortcutEventType', () => {
    it('passes assertion', () => {
      expect(() => assertIsKeyboardShortcutEventType('clickEvents')).not.toThrow();
    });

    it('fails assertion', () => {
      expect(() => assertIsKeyboardShortcutEventType('bad')).toThrow();
    });
  });

  describe('isTypedKeyboardShortcut', () => {
    it('passes check', () => {
      expect(
        isTypedKeyboardShortcut({
          ...hotkeyConfiguration,
          _uiHotkeyConfigurationType: 'clickEvents',
          _uiHotkeyName: 'associateClickedSignalDetections'
        })
      ).toBeTruthy();
    });

    it('fails check', () => {
      expect(isTypedKeyboardShortcut(hotkeyConfiguration)).toBeFalsy();
    });
  });

  describe('assertIsTypedKeyboardShortcut', () => {
    it('passes assertion', () => {
      expect(() =>
        assertIsTypedKeyboardShortcut({
          ...hotkeyConfiguration,
          _uiHotkeyConfigurationType: 'clickEvents',
          _uiHotkeyName: 'associateClickedSignalDetections'
        })
      ).not.toThrow();
    });

    it('fails assertion', () => {
      expect(() => assertIsTypedKeyboardShortcut(hotkeyConfiguration)).toThrow();
    });
  });
});
