import { CLIENT_BASE_URL, SERVER_BASE_URL, ApiError } from '@/shared/constants/api';
import type { ApiErrorResponse } from '@/shared/types/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface FetchOptions extends Omit<RequestInit, 'method' | 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  _isRetry?: boolean; // 401 에러시 토큰 재갱신을 1회만하여 무한 루프 방지
}

const IS_SERVER = typeof window === 'undefined';

/**
 * 환경별 Base URL 결합 (슬래시 중복 방지)
 */
function buildFullUrl(url: string, params?: FetchOptions['params']): string {
  const baseUrl = IS_SERVER ? SERVER_BASE_URL : CLIENT_BASE_URL;
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;

  const fullUrl = new URL(`${cleanBaseUrl}${cleanUrl}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        fullUrl.searchParams.append(key, String(value));
      }
    });
  }

  return fullUrl.toString();
}

/**
 * 토큰 획득 로직 (서버 환경 전용)
 */
async function getAuthHeader(): Promise<string | null> {
  if (IS_SERVER) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    return token ? `access_token=${token}` : null;
  }
  return null; // 클라이언트는 credentials: 'include'로 쿠키가 자동 전송됨
}

/**
 * 공통 응답 처리기
 */
async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiErrorResponse;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        message: `Error: ${response.status}`,
        statusCode: response.status,
      };
    }
    throw new ApiError(errorData.message, errorData.statusCode);
  }

  // 빈 응답 처리 (204 No Content, 빈 body 등)
  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

/**
 * 메인 Request 함수
 */
async function request<T>(url: string, options: FetchOptions & { method: HttpMethod }): Promise<T> {
  const { method, params, body, headers: customHeaders, _isRetry, ...rest } = options;

  const fullUrl = buildFullUrl(url, params);
  const headers = new Headers(customHeaders);

  if (body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // 서버 환경일 때만 쿠키 수동 주입
  if (IS_SERVER) {
    const authCookie = await getAuthHeader();
    if (authCookie) headers.set('Cookie', authCookie);
  }

  const response = await fetch(fullUrl, {
    ...rest,
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  // 401 Unauthorized 처리
  if (response.status === 401 && !_isRetry) {
    const refreshed = await tryTokenRefresh();

    if (refreshed) {
      return request<T>(url, { ...options, _isRetry: true });
    }

    if (!IS_SERVER) {
      window.location.href = '/login';
    }
    throw new ApiError('토큰이 만료되었습니다. 다시 로그인해주세요.', 401);
  }

  return parseResponse<T>(response);
}

/**
 * Refresh Token으로 Access Token 갱신 시도
 */
async function tryTokenRefresh(): Promise<boolean> {
  try {
    const baseUrl = IS_SERVER ? SERVER_BASE_URL : CLIENT_BASE_URL;
    const res = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * HTTP Client
 */
export const httpClient = {
  get: <T>(url: string, opts?: FetchOptions) => request<T>(url, { ...opts, method: 'GET' }),
  post: <T>(url: string, opts?: FetchOptions) => request<T>(url, { ...opts, method: 'POST' }),
  put: <T>(url: string, opts?: FetchOptions) => request<T>(url, { ...opts, method: 'PUT' }),
  patch: <T>(url: string, opts?: FetchOptions) => request<T>(url, { ...opts, method: 'PATCH' }),
  delete: <T>(url: string, opts?: FetchOptions) => request<T>(url, { ...opts, method: 'DELETE' }),
};
