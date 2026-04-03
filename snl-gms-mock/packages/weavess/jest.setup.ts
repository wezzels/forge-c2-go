import * as d3 from 'd3';
import fetchMock from 'jest-fetch-mock';
import * as util from 'util';

fetchMock.enableMocks();

Object.defineProperty(window, 'TextEncoder', {
  writable: true,
  value: util.TextEncoder
});
Object.defineProperty(window, 'TextDecoder', {
  writable: true,
  value: util.TextDecoder
});
Object.defineProperty(global, 'TextEncoder', {
  writable: true,
  value: util.TextEncoder
});
Object.defineProperty(global, 'TextDecoder', {
  writable: true,
  value: util.TextDecoder
});

const globalAny: any = global;

globalAny.DOMRect = jest.fn(() => ({}));
window.ResizeObserver = jest.fn(() => {
  return { observe: jest.fn(), disconnect: jest.fn(), unobserve: jest.fn() };
});
globalAny.window = window;

class Worker {
  public url: string;

  public onmessage: (message: Record<string, unknown>, transfer?: Transferable[]) => void;

  public constructor(stringUrl: string) {
    this.url = stringUrl;
    this.onmessage = () => {
      // do nothing
    };
  }

  public postMessage(message: Record<string, unknown>, transfer?: Transferable[]) {
    this.onmessage(message, transfer);
  }
}
globalAny.window.Worker = Worker;

jest.mock('three', () => {
  const THREE = jest.requireActual('three');
  return {
    ...THREE,
    WebGLRenderer: jest.fn().mockReturnValue({
      domElement: document.createElement('div'), // create a fake div
      setSize: jest.fn(),
      render: jest.fn(),
      setScissorTest: jest.fn(),
      setViewport: jest.fn(),
      dispose: jest.fn(),
      getContext: jest.fn()
    })
  };
});

jest.mock('worker-rpc', () => {
  const realWorkerRpc = jest.requireActual('worker-rpc');
  // We do this here to guarantee that it runs before the waveform panel generates its workers.
  // This works because jest.mock gets hoisted and run before even imports are figured out.
  Object.defineProperty(window.navigator, 'hardwareConcurrency', {
    writable: false,
    value: 4
  });

  return {
    ...realWorkerRpc,
    RPCProvider: {
      constructor: () => ({
        _dispatch: jest.fn(),
        _nextTransactionId: 0,
        _pendingTransactions: {},
        _rpcHandlers: {},
        _rpcTimeout: 0,
        _signalHandlers: {},
        error: {
          _contexts: [],
          _handlers: [],
          dispatch: jest.fn(),
          hasHandlers: false
        }
      })
    }
  };
});
jest.mock('react-toastify', () => {
  const actualToastify = jest.requireActual('react-toastify');
  return {
    ...actualToastify,
    info: (message: string, options: any, ...args) => {
      actualToastify.info(message, { ...options, toastId: 'mock-toast-info' }, args);
    },
    warn: (message: string, options: any, ...args) => {
      actualToastify.warn(message, { ...options, toastId: 'mock-toast-warn' }, args);
    },
    error: (message: string, options: any, ...args) => {
      actualToastify.error(message, { ...options, toastId: 'mock-toast-error' }, args);
    }
  };
});

jest.mock('@gms/ui-util/src/ts/ui-util/color-scale-util', () => {
  return {
    // mock to prevent any calls to `d3-scale-chromatic` which do not work in jest
    createColorScale: jest.fn(() => {
      return d3.scaleSequential(() => 'rgb(0, 0, 0)');
    })
  };
});
