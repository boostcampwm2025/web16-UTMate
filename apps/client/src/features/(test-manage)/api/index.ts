import { BASE_URL } from '@/shared/constants/api';
import type { GetTestsResponse } from '@/features/(test-manage)/types';

export const getTests = async (): Promise<GetTestsResponse> => {
  const response = await fetch(`${BASE_URL}/tests`);
  return response.json();
};
