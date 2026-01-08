import { CLIENT_BASE_URL } from '@/shared/constants/api';
import type { TestDetail } from '@/features/(test-manage)/types';
import type { ApiErrorResponse } from '@/shared/types/api';

export const getTestById = async (id: string): Promise<TestDetail> => {
  const response = await fetch(`${CLIENT_BASE_URL}/tests/${id}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new Error(error.message || '테스트를 불러오는데 실패했습니다.');
  }
  return response.json();
};
