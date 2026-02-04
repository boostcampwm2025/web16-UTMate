import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EVENT_SEND_INTERVAL, SERVER_URL } from '../../src/constants';
import { initRecorder } from '../../src/recorder';
import { decompress } from '../../src/utils/compression';

import { server } from './setup';

describe('Recorder 통합 테스트', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('주기적으로 이벤트를 전송(flush)해야 한다', async () => {
    const token = 'periodic-token';

    const flushCalled = vi.fn();
    server.use(
      http.post(`${SERVER_URL}/sdk/replay_logs`, async ({ request }) => {
        const body = await request.arrayBuffer();
        expect(body.byteLength).toBeGreaterThan(0);
        expect(request.headers.get('Content-Type')).toBe('application/gzip');
        expect(request.headers.get('Content-Encoding')).toBe('gzip');
        expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`);

        const decompressed = await decompress(new Uint8Array(body));
        const events = decompressed
          .split('\n')
          .filter((line: string) => line.trim())
          .map((line: string) => JSON.parse(line));
        expect(events).toHaveLength(1);

        flushCalled();
        return new HttpResponse(null, { status: 200 });
      }),
    );

    initRecorder({ auth: token });

    const mockEvent = { type: 3, data: {}, timestamp: Date.now() };
    globalThis.simulateRRWebEvent(mockEvent);

    await vi.advanceTimersByTimeAsync(EVENT_SEND_INTERVAL);

    await vi.waitFor(() => {
      expect(flushCalled).toHaveBeenCalled();
    });
  });

  it('visibilitychange 이벤트를 처리해야 한다', async () => {
    const token = 'visibility-token';

    const flushCalled = vi.fn();
    server.use(
      http.post(`${SERVER_URL}/sdk/replay_logs`, () => {
        flushCalled();
        return new HttpResponse(null, { status: 200 });
      }),
    );

    initRecorder({ auth: token });

    simulateRRWebEvent({ type: 3, data: {}, timestamp: Date.now() });

    Object.defineProperty(document, 'visibilityState', {
      writable: true,
      configurable: true,
      value: 'hidden',
    });

    document.dispatchEvent(new Event('visibilitychange'));

    await vi.advanceTimersByTimeAsync(100);

    await vi.waitFor(() => {
      expect(flushCalled).toHaveBeenCalled();
    });
  });

  it('pagehide 이벤트를 처리해야 한다', async () => {
    const token = 'pagehide-token';

    const flushCalled = vi.fn();
    server.use(
      http.post(`${SERVER_URL}/sdk/replay_logs`, () => {
        flushCalled();
        return new HttpResponse(null, { status: 200 });
      }),
    );

    initRecorder({ auth: token });

    simulateRRWebEvent({ type: 3, data: {}, timestamp: Date.now() });

    window.dispatchEvent(new Event('pagehide'));

    await vi.advanceTimersByTimeAsync(100);

    await vi.waitFor(() => {
      expect(flushCalled).toHaveBeenCalled();
    });
  });

  it('부모 창으로부터의 flush 요청을 처리해야 한다', async () => {
    const token = 'message-token';

    const flushCalled = vi.fn();
    server.use(
      http.post(`${SERVER_URL}/sdk/replay_logs`, () => {
        flushCalled();
        return new HttpResponse(null, { status: 200 });
      }),
    );

    initRecorder({ auth: token });

    const mockEvent = { type: 3, data: {}, timestamp: Date.now() };
    simulateRRWebEvent(mockEvent);

    const mockOpener = {
      postMessage: vi.fn(),
    };
    vi.stubGlobal('opener', mockOpener);

    window.dispatchEvent(
      new MessageEvent('message', {
        data: { type: 'UTM_SDK_FLUSH_REQUEST' },
      }),
    );

    await vi.advanceTimersByTimeAsync(100);

    await vi.waitFor(() => {
      expect(flushCalled).toHaveBeenCalled();
      expect(mockOpener.postMessage).toHaveBeenCalledWith(
        { type: 'UTM_SDK_FLUSH_COMPLETE', success: true },
        '*',
      );
    });
  });

  it('네트워크 실패 시 이벤트를 큐에 다시 넣어야 한다', async () => {
    const token = 'retry-token';

    let callCount = 0;
    server.use(
      http.post(`${SERVER_URL}/sdk/replay_logs`, () => {
        callCount++;
        if (callCount === 1) {
          return new HttpResponse(null, { status: 500 });
        }
        return new HttpResponse(null, { status: 200 });
      }),
    );

    initRecorder({ auth: token });

    simulateRRWebEvent({ type: 3, data: {}, timestamp: Date.now() });

    await vi.advanceTimersByTimeAsync(EVENT_SEND_INTERVAL);
    await vi.waitFor(() => {
      expect(callCount).toBe(1);
    });

    await vi.advanceTimersByTimeAsync(EVENT_SEND_INTERVAL);
    await vi.waitFor(() => {
      expect(callCount).toBe(2);
    });
  });
});
