import { CLIENT_BASE_URL, SERVER_BASE_URL } from '@/shared/constants/api';
import type { TestDetail } from '@/features/(test-manage)/types';
import { clientFetcher } from '@/shared/utils/fetcher/clientFetcher';
import { serverFetcher } from '@/shared/utils/fetcher/serverFetcher';

export const getTestById = async (id: string): Promise<TestDetail> => {
  return clientFetcher<TestDetail>(`${CLIENT_BASE_URL}/tests/${id}`);
};

export const getTestByIdonServer = async (id: string): Promise<TestDetail> => {
  return serverFetcher<TestDetail>(`${SERVER_BASE_URL}/tests/${id}`);
};