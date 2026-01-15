import { CLIENT_BASE_URL } from '@/shared/constants/api';
import type { ApiErrorResponse } from '@/shared/types/api';
import type { TestDetail } from '@/features/(test-manage)/types';

export interface UpdateTestMission {
  publicId?: string;
  order: number;
  name: string;
  description: string;
  url: string;
  estimatedDuration: number;
}

interface UpdateTestParams {
  title: string;
  description: string;
  url: string;
  missions: UpdateTestMission[];
}

export const updateTest = async (publicId: string, data: UpdateTestParams): Promise<void> => {
  const response = await fetch(`${CLIENT_BASE_URL}/tests/${publicId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new Error(error.message || '테스트를 업데이트하는데 실패했습니다.');
  }
};
