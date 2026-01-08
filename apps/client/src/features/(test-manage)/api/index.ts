import { CLIENT_BASE_URL } from '@/shared/constants/api';
import type {
  GetTestsResponse,
  Test,
  TestDetail,
  TestMission,
} from '@/features/(test-manage)/types';
import type { ApiErrorResponse } from '@/shared/types/api';

export const getMyTestList = async (): Promise<GetTestsResponse> => {
  const response = await fetch(`${CLIENT_BASE_URL}/tests?scope=me`);

  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new Error(error.message || '테스트 목록을 불러오는데 실패했습니다.');
  }
  return response.json();
};

export const createTest = async (): Promise<Test> => {
  const response = await fetch(`${CLIENT_BASE_URL}/tests`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new Error(error.message || '테스트를 생성하는데 실패했습니다.');
  }

  return response.json();
};

export const deleteTest = async (testId: number): Promise<void> => {
  const response = await fetch(`${CLIENT_BASE_URL}/tests/${testId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new Error(error.message || '테스트를 삭제하는데 실패했습니다.');
  }
};
