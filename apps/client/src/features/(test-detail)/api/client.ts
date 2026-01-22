import { CLIENT_BASE_URL } from '@/shared/constants/api';
import { clientFetcher } from '@/shared/utils/fetcher/clientFetcher';
import type { TestDetail } from '@/features/(test-manage)/types';

export const getTestById = async (id: string): Promise<TestDetail> => {
  return clientFetcher<TestDetail>(`${CLIENT_BASE_URL}/tests/${id}`);
};

