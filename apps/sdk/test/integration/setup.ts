import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

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
    globalThis.simulateRRWebEvent = emit;
    return () => {}; // return stop function
  }),
}));

export const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
  sessionStorage.clear();
  localStorage.clear();
  document.body.innerHTML = '';
});
afterAll(() => server.close());

// Mock constants if needed, but we can also just use the ones from the file
// if they are exported. (They are imported in index.ts)
