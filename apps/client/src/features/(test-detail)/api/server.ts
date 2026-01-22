import {  SERVER_BASE_URL } from '@/shared/constants/api';
import { serverFetcher } from '@/shared/utils/fetcher/serverFetcher';

import type { TestDetail } from '@/features/(test-manage)/types';

export const getTestByIdonServer = async (id: string): Promise<TestDetail> => {
  return serverFetcher<TestDetail>(`${SERVER_BASE_URL}/tests/${id}`);
};