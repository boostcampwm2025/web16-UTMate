import { BASE_URL } from '@/shared/constants/api';
import type {
  GetTestsResponse,
  Test,
  TestDetail,
  TestMission,
} from '@/features/(test-manage)/types';

export const getMyTestList = async (): Promise<GetTestsResponse> => {
  const response = await fetch(`${BASE_URL}/tests?scope=me`);

  if (!response.ok) {
    throw new Error('Failed to fetch test list');
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

export interface UpdateTestParams {
  name?: string;
  integrationUrl?: string;
  missions?: TestMission[];
}

export const updateTest = async (id: number, data: UpdateTestParams): Promise<TestDetail> => {
  const response = await fetch(`${BASE_URL}/tests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update test');
  }

  return response.json();
};
