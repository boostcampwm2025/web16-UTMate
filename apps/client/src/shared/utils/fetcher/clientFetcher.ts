import { CLIENT_BASE_URL, ApiError } from "@/shared/constants/api";
import { getErrorData } from "./fetcherCommon";
import type { FetchOptions } from "./fetcherCommon";

interface RetryQueueItem {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  url: string;
  options?: FetchOptions;
}

let isRefreshing = false;
const refreshAndRetryQueue: RetryQueueItem[] = [];

/**
 * 토큰 갱신 중 들어온 요청을 큐에 적재
 */
const addToQueue = (url: string, options?: FetchOptions) => {
  return new Promise((resolve, reject) => {
    refreshAndRetryQueue.push({
      resolve: resolve as (value: unknown) => void,
      reject,
      url,
      options,
    });
  });
};

/**
 * 큐에 쌓인 요청들을 일괄 처리
 * error가 없으면 재시도(resolve), 있으면 에러 전파(reject)
 */
const processQueue = (error: Error | null) => {
  refreshAndRetryQueue.forEach((req) => {
    if (error) {
      req.reject(error);
    } else {
      clientFetcher(req.url, req.options)
        .then(req.resolve)
        .catch(req.reject);
    }
  });
  refreshAndRetryQueue.length = 0;
};

/**
 * 리프레시 토큰으로 액세스 토큰 갱신 요청
 */
const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${CLIENT_BASE_URL}/auth/reissue`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new ApiError('토큰 갱신 실패', response.status);
    }
    return true;
  } catch (error) {
    throw error;
  }
};

export const clientFetcher = async <T>(url: string, options: FetchOptions = {}): Promise<T> => {
  const mergedOptions = {
    credentials: 'include' as RequestCredentials,
    ...options,
  };

  const response = await fetch(url, mergedOptions);

  if (!response.ok) {
    const errorData = await getErrorData(response);

    // 2. 401 토큰 만료 체크 (백엔드 에러코드: TOKEN_EXPIRED)
    if (response.status === 401 && errorData.code === 'TOKEN_EXPIRED') {
      // 이미 갱신 중이라면 큐에 넣고 대기
      if (isRefreshing) {
        return addToQueue(url, options) as Promise<T>;
      }

      isRefreshing = true;

      try {
        await refreshAccessToken();
        
        // 갱신 성공: 큐 처리 후 현재 요청 재시도
        processQueue(null);
        return clientFetcher<T>(url, options);
      } catch (refreshError: any) {
        // 갱신 실패: 큐에 있는 모든 요청 에러 처리
        processQueue(refreshError);
        
        // 현재 요청도 에러 처리
        throw new ApiError(errorData.message, errorData.statusCode, errorData.code);
      } finally {
        isRefreshing = false;
      }
    }

    // 3. 그 외 에러 처리
    throw new ApiError(errorData.message, errorData.statusCode, errorData.code);
  }

  return response.json() as T;
};
