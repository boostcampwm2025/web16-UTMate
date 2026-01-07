import { BASE_URL } from '@/shared/constants/api';
import type { GetTestsResponse } from '@/features/(test-manage)/types';

export const getMyTestList = async (): Promise<GetTestsResponse> => {
  const response = await fetch(`${BASE_URL}/tests?scope=me`);

  if (!response.ok) {
    throw new Error('Failed to fetch test list');
  }
  return response.json();
};
