import { cookies } from 'next/headers';

import { SERVER_BASE_URL } from '@/shared/constants/api';
import type { TestDetail } from '@/features/(test-manage)/types';
import type { ApiErrorResponse } from '@/shared/types/api';

export const getTestById = async (id: string): Promise<TestDetail> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token');

  const response = await fetch(`${SERVER_BASE_URL}/tests/${id}`, {
    credentials: 'include',
    headers: {
      Cookie: accessToken ? `access_token=${accessToken.value}` : '',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiErrorResponse;
    throw new Error(error.message || '테스트를 불러오는데 실패했습니다.');
  }
  return response.json();
};
