import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { clientFetcher } from './clientFetcher';
import { ApiError, CLIENT_BASE_URL } from '@/shared/constants/api';

// fetch 모킹
global.fetch = vi.fn();

describe('clientFetcher', () => {
  const mockUrl = `${CLIENT_BASE_URL}/test`;
  const mockResponseData = { data: 'test' };

  beforeEach(() => {
    vi.clearAllMocks();
    // 기본적으로 성공 응답을 반환하도록 설정
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponseData,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('성공 시 데이터를 반환해야 한다', async () => {
    const result = await clientFetcher(mockUrl);
    expect(result).toEqual(mockResponseData);
    expect(global.fetch).toHaveBeenCalledWith(mockUrl, expect.objectContaining({
      credentials: 'include',
    }));
  });

  it('401 이외의 에러 발생 시 ApiError를 던져야 한다', async () => {
    const errorData = { message: 'Bad Request', statusCode: 400, code: 'BAD_REQUEST' };
    (global.fetch as Mock).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => errorData,
    });

    await expect(clientFetcher(mockUrl)).rejects.toThrow(ApiError);
    await expect(clientFetcher(mockUrl)).rejects.toThrow('Bad Request');
  });

  describe('토큰 갱신 로직 (401 & TOKEN_EXPIRED)', () => {
    const tokenExpiredResponse = {
      ok: false,
      status: 401,
      json: async () => ({ message: 'Token Expired', statusCode: 401, code: 'TOKEN_EXPIRED' }),
    };

    it('토큰 만료 시 재발급 요청 후 원래 요청을 재시도해야 한다', async () => {
      // 첫 번째 요청: 401 Token Expired
      // 두 번째 요청: 재발급 (성공)
      // 세 번째 요청: 원래 요청 재시도 (성공)
      (global.fetch as Mock)
        .mockResolvedValueOnce(tokenExpiredResponse) // 1. 원래 요청 실패
        .mockResolvedValueOnce({ // 2. 재발급 요청 성공
          ok: true,
          json: async () => ({ accessToken: 'new_token' }),
        })
        .mockResolvedValueOnce({ // 3. 재시도 성공
          ok: true,
          json: async () => mockResponseData,
        });

      const result = await clientFetcher(mockUrl);

      expect(result).toEqual(mockResponseData);
      expect(global.fetch).toHaveBeenCalledTimes(3);
      
      // 1. 첫 요청
      expect(global.fetch).toHaveBeenNthCalledWith(1, mockUrl, expect.any(Object));
      // 2. 재발급 요청
      expect(global.fetch).toHaveBeenNthCalledWith(2, `${CLIENT_BASE_URL}/auth/reissue`, expect.objectContaining({
        method: 'POST',
      }));
      // 3. 재시도
      expect(global.fetch).toHaveBeenNthCalledWith(3, mockUrl, expect.any(Object));
    });

    it('토큰 갱신 실패 시 에러를 던져야 한다', async () => {
      // 1. 원래 요청 실패 (401)
      // 2. 재발급 요청 실패 (401 or 500 etc)
      (global.fetch as Mock)
        .mockResolvedValueOnce(tokenExpiredResponse)
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({ message: 'Refresh Token Invalid', statusCode: 401 }),
        });

      await expect(clientFetcher(mockUrl)).rejects.toThrow(ApiError);
      // fetch는 총 2번 호출되어야 함 (원래 요청 + 재발급 요청)
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('동시에 여러 요청 실패 시 토큰 갱신은 한 번만 수행하고 모두 재시도해야 한다 (Queue 동작)', async () => {
      // 시나리오: 3개의 요청이 동시에 401을 받음
      // 1. req1 -> 401 -> 갱신 시작 (isRefreshing = true)
      // 2. req2 -> 401 -> 큐에 등록
      // 3. req3 -> 401 -> 큐에 등록
      // 4. 갱신 완료 -> req1, req2, req3 재시도

      // Mock 설정이 좀 복잡함: 호출 순서에 따라 응답을 다르게 줘야 함
      // fetch가 호출될 때마다 카운트를 세거나, 호출된 URL을 보고 판단
      let callCount = 0;

      (global.fetch as Mock).mockImplementation(async (url) => {
        callCount++;
        
        // 1, 2, 3번째 호출은 모두 원본 요청 (실패)
        if (url === mockUrl) {
           // 재발급 성공 전에는 실패, 후에는 성공
           // 하지만 여기서는 "동시성"을 시뮬레이션하기 위해
           // 단순히 처음 3번은 실패, 그 이후는 성공으로 처리하면 안 됨 (재발급 요청이 중간에 끼어듦)
           // 따라서 내부 상태를 둬야 함.
        }
        return { ok: true, json: async () => ({}) };
      });

      // 더 확실한 테스트를 위해 mockImplementation을 정교하게 작성
      let refreshCalled = false;
      
      (global.fetch as Mock).mockImplementation(async (url) => {
        if (url === `${CLIENT_BASE_URL}/auth/reissue`) {
          refreshCalled = true;
          return { ok: true, json: async () => ({}) };
        }

        if (url === mockUrl) {
          if (!refreshCalled) {
            return tokenExpiredResponse;
          } else {
            return { ok: true, json: async () => mockResponseData };
          }
        }
      });

      // Promise.all로 3개의 요청을 동시에 실행
      const results = await Promise.all([
        clientFetcher(mockUrl),
        clientFetcher(mockUrl),
        clientFetcher(mockUrl),
      ]);

      expect(results).toEqual([mockResponseData, mockResponseData, mockResponseData]);
      
      // 호출 횟수 검증:
      // 3번 실패 (초기 요청) + 1번 재발급 + 3번 성공 (재시도) = 총 7번
      expect(global.fetch).toHaveBeenCalledTimes(7);
      
      // 재발급 요청은 딱 1번만 호출되었는지 확인
      const refreshCalls = (global.fetch as Mock).mock.calls.filter(args => args[0] === `${CLIENT_BASE_URL}/auth/reissue`);
      expect(refreshCalls.length).toBe(1);
    });
  });
});
