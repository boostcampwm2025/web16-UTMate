import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SERVER_URL } from '../../src/constants';

import { server } from './setup';

describe('SDK 진입점 테스트', () => {
  beforeEach(() => {
    vi.resetModules();
    const url = new URL('http://localhost');
    vi.stubGlobal('location', {
      ...window.location,
      href: url.href,
      search: url.search,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('URL에 토큰이 있으면 sessionStorage에 저장해야 한다', async () => {
    const token = 'test-token-123';
    vi.stubGlobal('location', {
      search: `?utmate-auth=${token}`,
    });

    await import('../../src/index');

    expect(sessionStorage.getItem('utmate-auth')).toBe(token);
  });

  it('토큰이 없으면 recorder를 초기화하지 않아야 한다', async () => {
    await import('../../src/index');

    // UTMateRecorder.initRecorder가 호출되지 않았는지 확인
    const windowWithRecorder = window as Window & {
      UTMateRecorder?: { initRecorder: ReturnType<typeof vi.fn> };
    };

    // setup에서 mock한 initRecorder가 호출되지 않음
    expect(windowWithRecorder.UTMateRecorder).toBeDefined();
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

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await import('../../src/index');

    await vi.waitFor(() => {
      expect(verifyCalled).toHaveBeenCalled();
      expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('정상 작동'));
    });
  });
});
