import { useState } from 'react';

export interface UseUrlInputOptions {
  initialValue?: string;
}

export interface UseUrlInputReturn {
  urlValue: string;
  isValidUrl: boolean;
  handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUrlBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * URL 입력 필드에 대한 유효성 검증 및 자동 정규화 기능을 제공하는 커스텀 hook
 *
 * @param options - 초기값을 설정할 수 있는 옵션
 * @returns URL 상태와 이벤트 핸들러
 */
export function useUrlInput({ initialValue = '' }: UseUrlInputOptions = {}): UseUrlInputReturn {
  // initialValue가 비어있으면 'https://' 기본값 설정
  const defaultValue = initialValue || 'https://';
  const [urlValue, setUrlValue] = useState(defaultValue);
  const [isValidUrl, setIsValidUrl] = useState(validateUrl(normalizeUrl(initialValue)));

  /**
   * URL 입력 변경 핸들러
   */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrlValue(value);

    // 유효성 검증
    const normalized = normalizeUrl(value);
    const valid = validateUrl(normalized);
    setIsValidUrl(valid);
  };

  /**
   * URL 입력 필드 blur 시 자동 정규화
   */
  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value) {
      const normalized = normalizeUrl(value);
      setUrlValue(normalized);
      setIsValidUrl(validateUrl(normalized));

      // react-hook-form에 정규화된 값 전달
      e.target.value = normalized;
    }
  };

  return {
    urlValue,
    isValidUrl,
    handleUrlChange,
    handleUrlBlur,
  };
}

/**
 * URL 유효성 검증 함수
 */
function validateUrl(url: string): boolean {
  if (!url.trim()) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * URL 정규화 함수 - http(s):// 프로토콜이 없으면 https:// 자동 추가
 */
function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';

  // 이미 프로토콜이 있으면 그대로 반환
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // 프로토콜이 없으면 https:// 추가
  return `https://${trimmed}`;
}
