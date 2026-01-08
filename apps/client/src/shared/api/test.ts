import { CLIENT_BASE_URL } from '@/shared/constants/api';
import type { ApiErrorResponse } from '@/shared/types/api';
import type { TestDetail } from '@/features/(test-manage)/types';
import type { TestMission } from '@/features/(test-manage)/types';

interface UpdateTestParams {
  name?: string;
  integrationUrl?: string;
  missions?: TestMission[];
}

export const updateTest = async (id: number, data: UpdateTestParams): Promise<TestDetail> => {
  const response = await fetch(`${CLIENT_BASE_URL}/tests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new Error(error.message || '테스트를 업데이트하는데 실패했습니다.');
  }

  return response.json();
};
