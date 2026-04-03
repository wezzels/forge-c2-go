import { HotkeysProvider, useHotkeys } from '@blueprintjs/core';
import { getByRole, render, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import type { HotkeyHandlerProps } from '../../../src/ts/components/hotkey-handler';
import { HotkeyHandler, useWaveformHotkeyConfig } from '../../../src/ts/components/hotkey-handler';
import { initialConfiguration } from '../../__data__/test-util-data';

const panRatio = 0.25;
const zoomInRatio = -0.25;
const zoomOutRatio = 0.5;

jest.mock('@blueprintjs/core', () => {
  const blueprintActual = jest.requireActual('@blueprintjs/core');
  const mockHandleKeyDown = jest.fn();
  const mockHandleKeyUp = jest.fn();
  const mockUseHotkeys = jest.fn(() => ({
    handleKeyUp: mockHandleKeyDown,
    handleKeyDown: mockHandleKeyUp
  }));
  return {
    ...blueprintActual,
    useHotkeys: mockUseHotkeys
  };
});

describe('HotkeyHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPan = jest.fn(arg => arg);
  const mockZoom = jest.fn();
  const mockFullZoomOut = jest.fn();
  const mockCreateQcSegmentsKeyDown = jest.fn();
  const mockCreateQcSegmentsKeyUp = jest.fn();
  const mockPageDown = jest.fn();
  const mockPageUp = jest.fn();

  it('useHotkeys is called with the proper configuration', () => {
    render(
      <HotkeysProvider>
        <HotkeyHandler
          pan={mockPan}
          panRatio={panRatio}
          zoomInRatio={zoomInRatio}
          zoomOutRatio={zoomOutRatio}
          zoomByPercentageToPoint={mockZoom}
          hotKeysConfig={initialConfiguration.hotKeys}
          fullZoomOut={mockFullZoomOut}
          createQcSegmentsKeyDown={mockCreateQcSegmentsKeyDown}
          createQcSegmentsKeyUp={mockCreateQcSegmentsKeyUp}
          pageDown={mockPageDown}
          pageUp={mockPageUp}
          isSplitChannelOverlayOpen={false}
        >
          hotkey handler contents
        </HotkeyHandler>
      </HotkeysProvider>
    );

    expect((useHotkeys as unknown as any).mock.calls).toMatchSnapshot();
  });

  it('useHotkeys is called with undefined pan ratio', async () => {
    const { container } = render(
      <HotkeysProvider>
        <HotkeyHandler
          pan={mockPan}
          panRatio={undefined}
          zoomInRatio={zoomInRatio}
          zoomOutRatio={zoomOutRatio}
          zoomByPercentageToPoint={mockZoom}
          hotKeysConfig={initialConfiguration.hotKeys}
          fullZoomOut={mockFullZoomOut}
          createQcSegmentsKeyDown={mockCreateQcSegmentsKeyDown}
          createQcSegmentsKeyUp={mockCreateQcSegmentsKeyUp}
          pageDown={mockPageDown}
          pageUp={mockPageUp}
          isSplitChannelOverlayOpen={false}
        >
          hotkey handler contents
        </HotkeyHandler>
      </HotkeysProvider>
    );
    const hkhProps: HotkeyHandlerProps = {
      pan: mockPan,
      panRatio: undefined,
      zoomInRatio,
      zoomOutRatio,
      zoomByPercentageToPoint: mockZoom,
      hotKeysConfig: initialConfiguration.hotKeys,
      fullZoomOut: mockFullZoomOut,
      createQcSegmentsKeyDown: mockCreateQcSegmentsKeyDown,
      createQcSegmentsKeyUp: mockCreateQcSegmentsKeyUp,
      pageDown: mockPageDown,
      pageUp: mockPageUp,
      isSplitChannelOverlayOpen: false,
      children: undefined
    };
    const hotkeyHandler = getByRole(container, 'tab');
    hotkeyHandler.focus();
    const { result } = renderHook(() => useWaveformHotkeyConfig(hkhProps));
    await userEvent.keyboard('[KeyA]');
    await userEvent.keyboard('[KeyD]');
    await userEvent.keyboard('{Shift>}A{/Shift}');
    await userEvent.keyboard('{Shift>}D{/Shift}');
    const { handleKeyDown } = useHotkeys(result.current);
    expect(handleKeyDown).toHaveBeenCalled();

    expect((useHotkeys as unknown as any).mock.calls).toMatchSnapshot();
  });

  it('HandleKeyDown is called when a key is pressed', async () => {
    const hkhProps: HotkeyHandlerProps = {
      pan: mockPan,
      panRatio,
      zoomInRatio,
      zoomOutRatio,
      zoomByPercentageToPoint: mockZoom,
      hotKeysConfig: initialConfiguration.hotKeys,
      fullZoomOut: mockFullZoomOut,
      createQcSegmentsKeyDown: mockCreateQcSegmentsKeyDown,
      createQcSegmentsKeyUp: mockCreateQcSegmentsKeyUp,
      pageDown: mockPageDown,
      pageUp: mockPageUp,
      isSplitChannelOverlayOpen: false,
      children: undefined
    };
    const { container } = render(
      <HotkeysProvider>
        <HotkeyHandler
          pan={mockPan}
          panRatio={panRatio}
          zoomInRatio={zoomInRatio}
          zoomOutRatio={zoomOutRatio}
          zoomByPercentageToPoint={mockZoom}
          hotKeysConfig={initialConfiguration.hotKeys}
          fullZoomOut={mockFullZoomOut}
          createQcSegmentsKeyDown={mockCreateQcSegmentsKeyDown}
          createQcSegmentsKeyUp={mockCreateQcSegmentsKeyUp}
          pageDown={mockPageDown}
          pageUp={mockPageUp}
          isSplitChannelOverlayOpen={false}
        >
          hotkey handler contents
        </HotkeyHandler>
      </HotkeysProvider>
    );
    const hotkeyHandler = getByRole(container, 'tab');
    hotkeyHandler.focus();
    const { result } = renderHook(() => useWaveformHotkeyConfig(hkhProps));
    await userEvent.keyboard('[KeyA]');
    await userEvent.keyboard('[KeyD]');
    await userEvent.keyboard('{Shift>}A{/Shift}');
    await userEvent.keyboard('{Shift>}D{/Shift}');
    const { handleKeyDown } = useHotkeys(result.current);
    expect(handleKeyDown).toHaveBeenCalled();
  });
});
