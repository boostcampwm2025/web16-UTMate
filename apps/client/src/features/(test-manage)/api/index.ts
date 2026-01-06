import { BASE_URL } from '@/shared/constants/api';
import type { GetTestsResponse, Test } from '@/features/(test-manage)/types';

export const getMyTestList = async (): Promise<GetTestsResponse> => {
  const response = await fetch(`${BASE_URL}/tests?scope=me`);

  if (!response.ok) {
    throw new Error('Failed to fetch test list');
  }
  return response.json();
};

export const getTestById = async (id: string): Promise<Test> => {
  const response = await fetch(`${BASE_URL}/tests/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Test not found');
    }
    throw new Error('Failed to fetch test');
  }
  return response.json();
};

export const createTest = async (): Promise<Test> => {
  const response = await fetch(`${BASE_URL}/tests`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to create test');
  }

  return response.json();
};
