import { CLIENT_BASE_URL } from '@/shared/constants/api';
import type { GetTestsResponse, Test } from '@/features/(test-manage)/types';
import type { ApiErrorResponse } from '@/shared/types/api';

export const getMyTestList = async (): Promise<GetTestsResponse> => {
  const response = await fetch(`${CLIENT_BASE_URL}/tests?scope=me`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new Error(error.message || '테스트 목록을 불러오는데 실패했습니다.');
  }
  return response.json();
};

export const createTest = async (title: string): Promise<Test> => {
  const response = await fetch(`${CLIENT_BASE_URL}/tests`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new Error(error.message || '테스트를 생성하는데 실패했습니다.');
  }

  return response.json();
};

export const deleteTest = async (testId: string): Promise<void> => {
  const response = await fetch(`${CLIENT_BASE_URL}/tests/${testId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new Error(error.message || '테스트를 삭제하는데 실패했습니다.');
  }
};
