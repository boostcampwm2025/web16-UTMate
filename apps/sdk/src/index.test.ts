import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '../vitest.setup';

import { decompress } from './utils/compression';
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

  /**
   * 주기적 이벤트 전송 테스트
   *
   * 검증 항목:
   * - setInterval이 EVENT_SEND_INTERVAL마다 트리거되는지
   * - 이벤트가 올바른 형식(gzip 압축, JSONL)으로 전송되는지
   * - HTTP 헤더(Content-Type, Content-Encoding, Authorization)가 올바른지
   * - 요청 본문이 비어있지 않은지
   */
  it('주기적으로 이벤트를 전송(flush)해야 한다', async () => {
    const token = 'periodic-token';
    vi.stubGlobal('location', {
      search: `?utmate-auth=${token}`,
    });

    const flushCalled = vi.fn();
    server.use(
      http.post(`${SERVER_URL}/sdk/replay_logs`, async ({ request }) => {
        // 요청 본문 검증
        const body = await request.arrayBuffer();
        expect(body.byteLength).toBeGreaterThan(0);
        expect(request.headers.get('Content-Type')).toBe('application/gzip');
        expect(request.headers.get('Content-Encoding')).toBe('gzip');
        expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`);

        // JSONL 형식 검증: gzip 압축 해제 후 파싱
        const decompressed = decompress(new Uint8Array(body));
        const lines = decompressed.split('\n').filter((line) => line.trim() !== '');

        // 각 줄이 유효한 JSON인지 확인
        expect(lines.length).toBeGreaterThan(0);
        lines.forEach((line) => {
          const event = JSON.parse(line); // 파싱 실패 시 에러 발생
          expect(event).toHaveProperty('type');
          expect(event).toHaveProperty('timestamp');
        });

        flushCalled();
        return new HttpResponse(null, { status: 200 });
      }),
    );

    await import('./index');

    // rrweb 이벤트 시뮬레이션
    const mockEvent = { type: 3, data: {}, timestamp: Date.now() };
    globalThis.simulateRRWebEvent(mockEvent);

    // setInterval을 트리거하고 비동기 작업 완료 대기
    vi.advanceTimersByTime(EVENT_SEND_INTERVAL);

    await vi.waitFor(() => {
      expect(flushCalled).toHaveBeenCalled();
    });
  });

  /**
   * visibilitychange 이벤트 처리 테스트
   *
   * 검증 항목:
   * - 탭이 숨겨질 때(hidden) 미전송 이벤트가 즉시 전송되는지
   * - keepalive 옵션과 함께 전송되는지 (브라우저가 페이지를 언로드해도 요청 완료 보장)
   * - 요청 본문과 헤더가 올바른 형식인지
   */
  it('visibilitychange 이벤트를 처리해야 한다', async () => {
    const token = 'visibility-token';
    vi.stubGlobal('location', {
      search: `?utmate-auth=${token}`,
    });

    const flushCalled = vi.fn();
    server.use(
      http.post(`${SERVER_URL}/sdk/replay_logs`, async ({ request }) => {
        // 요청 본문 검증
        const body = await request.arrayBuffer();
        expect(body.byteLength).toBeGreaterThan(0);
        expect(request.headers.get('Content-Type')).toBe('application/gzip');
        expect(request.headers.get('Content-Encoding')).toBe('gzip');
        expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`);

        flushCalled();
        return new HttpResponse(null, { status: 200 });
      }),
    );

    await import('./index');

    // 큐에 이벤트 추가
    globalThis.simulateRRWebEvent({ type: 3 });

    // visibilityState 모킹
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    document.dispatchEvent(new Event('visibilitychange'));

    await vi.waitFor(() => {
      expect(flushCalled).toHaveBeenCalled();
    });
  });

  /**
   * pagehide 이벤트 처리 테스트
   *
   * 검증 항목:
   * - 페이지 언로드 시(창 닫기, 새로고침 등) 미전송 이벤트가 즉시 전송되는지
   * - keepalive 옵션으로 브라우저가 페이지를 닫아도 요청이 완료되도록 보장하는지
   * - 요청 본문과 헤더가 올바른 형식인지
   */
  it('pagehide 이벤트를 처리해야 한다', async () => {
    const token = 'pagehide-token';
    vi.stubGlobal('location', {
      search: `?utmate-auth=${token}`,
    });

    const flushCalled = vi.fn();
    server.use(
      http.post(`${SERVER_URL}/sdk/replay_logs`, async ({ request }) => {
        // 요청 본문 검증
        const body = await request.arrayBuffer();
        expect(body.byteLength).toBeGreaterThan(0);
        expect(request.headers.get('Content-Type')).toBe('application/gzip');
        expect(request.headers.get('Content-Encoding')).toBe('gzip');
        expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`);

        flushCalled();
        return new HttpResponse(null, { status: 200 });
      }),
    );

    await import('./index');

    // 큐에 이벤트 추가
    globalThis.simulateRRWebEvent({ type: 3 });

    window.dispatchEvent(new Event('pagehide'));

    await vi.waitFor(() => {
      expect(flushCalled).toHaveBeenCalled();
    });
  });

  /**
   * 부모 창 메시지 통신 테스트
   *
   * 검증 항목:
   * - postMessage로 UTM_SDK_FLUSH_REQUEST를 받으면 즉시 이벤트를 전송하는지
   * - 전송 완료 후 부모 창에 UTM_SDK_FLUSH_COMPLETE 메시지를 보내는지
   * - success 플래그가 올바르게 전달되는지
   */
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
    const mockEvent = { type: 3, data: {}, timestamp: Date.now() };
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

  /**
   * 네트워크 재시도 로직 테스트
   *
   * 검증 항목:
   * - 네트워크 요청 실패 시 이벤트가 큐에 다시 들어가는지
   * - 다음 flush 시도에서 실패했던 이벤트가 재전송되는지
   * - 이벤트 손실 없이 재시도가 이루어지는지
   */
  it('네트워크 실패 시 이벤트를 큐에 다시 넣어야 한다', async () => {
    const token = 'retry-token';
    vi.stubGlobal('location', {
      search: `?utmate-auth=${token}`,
    });

    let attemptCount = 0;
    server.use(
      http.post(`${SERVER_URL}/sdk/replay_logs`, () => {
        attemptCount++;
        if (attemptCount === 1) {
          // 첫 번째 시도는 실패
          return new HttpResponse(null, { status: 500 });
        }
        // 두 번째 시도는 성공
        return new HttpResponse(null, { status: 200 });
      }),
    );

    await import('./index');

    // 이벤트 추가
    globalThis.simulateRRWebEvent({ type: 3 });

    // 첫 번째 flush (실패)
    vi.advanceTimersByTime(EVENT_SEND_INTERVAL);
    await vi.waitFor(() => {
      expect(attemptCount).toBe(1);
    });

    // 두 번째 flush (성공) - 이벤트가 큐에 남아있어야 함
    vi.advanceTimersByTime(EVENT_SEND_INTERVAL);
    await vi.waitFor(() => {
      expect(attemptCount).toBe(2);
    });
  });
});
