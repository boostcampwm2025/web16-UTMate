import { CLIENT_BASE_URL } from '@/shared/constants/api';
import { TestStatus } from '@/features/(test-manage)/types';
import { clientFetcher } from '@/shared/utils/fetcher/clientFetcher';

import type { GetTestsResponse, Test, UserSummary } from '@/features/(test-manage)/types';

export const getMyTestList = async (): Promise<GetTestsResponse> => {
  return clientFetcher<GetTestsResponse>(`${CLIENT_BASE_URL}/tests?scope=me`);
};

export const createTest = async (title: Test['title']): Promise<{ testId: string }> => {
  return clientFetcher<{ testId: string }>(`${CLIENT_BASE_URL}/tests`, {
    method: 'POST',
    body: JSON.stringify({ title }),
    headers: {
      'Content-Type': 'application/json',
    },
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
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const findUserByUsername = async (username: string) => {
  return clientFetcher<UserSummary>(
    `${CLIENT_BASE_URL}/users?username=${encodeURIComponent(username)}`,
  );
};

export const addMemberToTest = async (testId: string, memberId: string) => {
  return clientFetcher<void>(`${CLIENT_BASE_URL}/tests/${testId}/members`, {
    method: 'POST',
    body: JSON.stringify({ memberId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const removeMemberFromTest = async (testId: string, memberId: string) => {
  return clientFetcher<void>(`${CLIENT_BASE_URL}/tests/${testId}/members/${memberId}`, {
    method: 'DELETE',
  });
};
