import { CLIENT_BASE_URL } from '@/shared/constants/api';
import { TestStatus } from '@/features/(test-manage)/types';
import { clientFetcher } from '@/shared/utils/fetcher/clientFetcher';

import type { GetTestsResponse, Test } from '@/features/(test-manage)/types';


export const getMyTestList = async (): Promise<GetTestsResponse> => {
  return clientFetcher<GetTestsResponse>(`${CLIENT_BASE_URL}/tests?scope=me`);
};

export const createTest = async (title: Test['title']): Promise<string> => {
  return clientFetcher<string>(`${CLIENT_BASE_URL}/tests`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
};

export const deleteTest = async (testId: string): Promise<void> => {
  return clientFetcher<void>(`${CLIENT_BASE_URL}/tests/${testId}`, {
    method: 'DELETE',
  });
};

export const updateTestStatus = async (testId: string, status: TestStatus): Promise<void> => {
  return clientFetcher<void>(`${CLIENT_BASE_URL}/tests/${testId}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
};
