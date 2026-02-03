import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '../vitest.setup';

import { EVENT_SEND_INTERVAL, SERVER_URL } from './constants';

// 모듈의 IIFE를 트리거하기 위해 모듈을 다시 임포트해야 할 수 있습니다.
// Vitest는 이를 위해 vi.resetModules()를 제공합니다.

describe('SDK 통합 테스트', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();
    // 위치 검색 쿼리 초기화
    const url = new URL('http://localhost');
    vi.stubGlobal('location', {
      ...window.location,
      href: url.href,
      search: url.search,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('URL에 토큰이 있으면 초기화되고 기록을 시작해야 한다', async () => {
    const token = 'test-token-123';
    vi.stubGlobal('location', {
      search: `?utmate-auth=${token}`,
    });

    // 임포트 시 IIFE가 실행됨
    await import('./index');

    // 토큰이 sessionStorage에 저장되었는지 확인
    expect(sessionStorage.getItem('utmate-auth')).toBe(token);

    // rrweb.record가 호출되었는지 확인
    const { record } = await import('@rrweb/record');
    expect(record).toHaveBeenCalled();
  });

  it('토큰이 없으면 기록을 시작하지 않아야 한다', async () => {
    await import('./index');

    const { record } = await import('@rrweb/record');
    expect(record).not.toHaveBeenCalled();
  });

  it('utm-sdk-verify 파라미터가 있으면 SDK 설치를 검증해야 한다', async () => {
    const testId = 'test-456';
    vi.stubGlobal('location', {
      search: `?utm-sdk-verify=true&test-id=${testId}`,
    });

    const verifyCalled = vi.fn();
    server.use(
      http.post(`${SERVER_URL}/sdk/tests/${testId}/verify-sdk`, () => {
        verifyCalled();
        return new HttpResponse(null, { status: 200 });
      }),
    );

    // alert 모킹
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await import('./index');

    await vi.waitFor(() => {
      expect(verifyCalled).toHaveBeenCalled();
      expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('정상 작동'));
    });
  });

  it('주기적으로 이벤트를 전송(flush)해야 한다', async () => {
    const token = 'periodic-token';
    vi.stubGlobal('location', {
      search: `?utmate-auth=${token}`,
    });

    const flushCalled = vi.fn();
    server.use(
      http.post(`${SERVER_URL}/sdk/replay_logs`, () => {
        flushCalled();
        return new HttpResponse(null, { status: 200 });
      }),
    );

    await import('./index');

    // rrweb 이벤트 시뮬레이션
    const mockEvent = { type: 1, data: {}, timestamp: Date.now() };
    globalThis.simulateRRWebEvent(mockEvent);

    // setInterval을 트리거하기 위해 시간을 가속
    vi.advanceTimersByTime(EVENT_SEND_INTERVAL);

    await vi.waitFor(() => {
      expect(flushCalled).toHaveBeenCalled();
    });
  });

  it('visibilitychange 이벤트를 처리해야 한다', async () => {
    const token = 'visibility-token';
    vi.stubGlobal('location', {
      search: `?utmate-auth=${token}`,
    });

    const flushCalled = vi.fn();
    server.use(
      http.post(`${SERVER_URL}/sdk/replay_logs`, () => {
        flushCalled();
        return new HttpResponse(null, { status: 200 });
      }),
    );

    await import('./index');

    // 큐에 이벤트 추가
    globalThis.simulateRRWebEvent({ type: 1 });

    // visibilityState 모킹
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    document.dispatchEvent(new Event('visibilitychange'));

    await vi.waitFor(() => {
      expect(flushCalled).toHaveBeenCalled();
    });
  });

  it('pagehide 이벤트를 처리해야 한다', async () => {
    const token = 'pagehide-token';
    vi.stubGlobal('location', {
      search: `?utmate-auth=${token}`,
    });

    const flushCalled = vi.fn();
    server.use(
      http.post(`${SERVER_URL}/sdk/replay_logs`, () => {
        flushCalled();
        return new HttpResponse(null, { status: 200 });
      }),
    );

    await import('./index');

    // 큐에 이벤트 추가
    globalThis.simulateRRWebEvent({ type: 1 });

    window.dispatchEvent(new Event('pagehide'));

    await vi.waitFor(() => {
      expect(flushCalled).toHaveBeenCalled();
    });
  });

  it('부모 창으로부터의 flush 요청을 처리해야 한다', async () => {
    const token = 'msg-token';
    vi.stubGlobal('location', {
      search: `?utmate-auth=${token}`,
    });

    const flushCalled = vi.fn();
    server.use(
      http.post(`${SERVER_URL}/sdk/replay_logs`, () => {
        flushCalled();
        return new HttpResponse(null, { status: 200 });
      }),
    );

    await import('./index');

    // rrweb 이벤트 시뮬레이션
    const mockEvent = { type: 1, data: {}, timestamp: Date.now() };
    globalThis.simulateRRWebEvent(mockEvent);

    // window.opener 모킹
    const postMessageSpy = vi.fn();
    vi.stubGlobal('opener', {
      postMessage: postMessageSpy,
    });

    // SDK가 리스닝하는 윈도우에 메시지 전송
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { type: 'UTM_SDK_FLUSH_REQUEST' },
      }),
    );

    await vi.waitFor(() => {
      expect(flushCalled).toHaveBeenCalled();
      expect(postMessageSpy).toHaveBeenCalledWith(
        { type: 'UTM_SDK_FLUSH_COMPLETE', success: true },
        '*',
      );
    });
  });
});
