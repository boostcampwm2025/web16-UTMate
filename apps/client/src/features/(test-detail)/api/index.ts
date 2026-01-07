import { BASE_URL } from '@/shared/constants/api';
import type { TestDetail } from '@/features/(test-manage)/types';

export const getTestById = async (id: string): Promise<TestDetail> => {
  const response = await fetch(`${BASE_URL}/tests/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Test not found');
    }
    throw new Error('Failed to fetch test');
  }
  return response.json();
};
