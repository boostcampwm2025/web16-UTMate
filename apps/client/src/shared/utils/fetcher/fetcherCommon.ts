import { ApiError } from "../../constants/api";
import type { ApiErrorResponse } from "../../types/api";

export type FetchOptions = Parameters<typeof fetch>[1];

export const getErrorData = async (response: Response): Promise<ApiErrorResponse> => {
  try {
    return await response.json();
  } catch {
    return {
      message: `Error: ${response.status}`,
      statusCode: response.status,
    };
  }
};


export const handleBadResponse = async (response: Response) => {
    const errorData = await getErrorData(response);
    throw new ApiError(errorData.message, errorData.statusCode, errorData.code);
};

/**
 * 성공 응답을 파싱합니다.
 * 빈 본문이나 비JSON 응답도 안전하게 처리합니다.
 */
export const parseResponse = async <T>(response: Response): Promise<T> => {
  // 응답 본문이 비어있거나 JSON이 아닌 경우 처리 (예: sendStatus(200))
  const contentType = response.headers.get('content-type');
  const hasJsonContent = contentType && contentType.includes('application/json');
  
  if (!hasJsonContent) {
    // 응답 본문이 비어있거나 JSON이 아닌 경우, void 타입이면 undefined 반환
    return undefined as T;
  }

  // 응답 본문이 비어있는 경우 처리
  const text = await response.text();
  if (!text || text.trim() === '') {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    // JSON 파싱 실패 시 undefined 반환
    return undefined as T;
  }
};
