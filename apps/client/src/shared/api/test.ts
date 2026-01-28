import { CLIENT_BASE_URL } from '@/shared/constants/api';
import type { ApiErrorResponse } from '@/shared/types/api';
import type { TestDetail } from '@/features/(test-manage)/types';
import type { Interest } from '@/features/(auth)/types';
import { ApiError } from '@/shared/constants/api';
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
  // 타겟 페르소나 설정
  isPublic: boolean;
  targetGender: string[]; // 필수
  targetAgeGroup: string[]; // 필수
  targetInterests?: Interest[]; // 선택사항
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

export const verifySdkInstallation = async (testId: string): Promise<{ sdkStatus: boolean }> => {
  const response = await fetch(`${CLIENT_BASE_URL}/tests/${testId}/verify-sdk`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new ApiError(error.message || 'SDK 연동 확인에 실패했습니다.', error.statusCode);
  }
  return response.json();
};
