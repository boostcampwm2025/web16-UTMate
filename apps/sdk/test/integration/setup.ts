import { CompressionStream, DecompressionStream } from 'node:stream/web';

import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { initRecorder } from '../../src/recorder';

// jsdom 환경에서는 global에 이 API들이 없을 수 있으므로 수동으로 할당
if (typeof global.CompressionStream === 'undefined') {
  global.CompressionStream = CompressionStream as any;
  global.DecompressionStream = DecompressionStream as any;
}

interface IRRWebEvent {
  type: number;
  data?: Record<string, unknown>;
  timestamp?: number;
}

declare global {
  // eslint-disable-next-line no-var
  var simulateRRWebEvent: (event: IRRWebEvent) => void;
}

// rrweb.record depends on browser globals that are not fully simulated in JSDOM sometimes,
// and we want to test our SDK logic, not rrweb itself.
vi.mock('@rrweb/record', () => ({
  record: vi.fn(({ emit }) => {
    // expose the emit function so we can simulate rrweb events in tests
    (globalThis as unknown as { simulateRRWebEvent: typeof emit }).simulateRRWebEvent = emit;
    return () => {}; // return stop function
  }),
}));

export const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });

  // Expose UTMateRecorder globally to bypass dynamic script loading in tests
  (window as Window & { UTMateRecorder?: unknown }).UTMateRecorder = {
    initRecorder,
  };
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
  sessionStorage.clear();
  localStorage.clear();
  document.body.innerHTML = '';
});

afterAll(() => server.close());
