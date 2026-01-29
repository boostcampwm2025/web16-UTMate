import { SERVER_BASE_URL } from '@/shared/constants/api';
import type { TestInfo } from '@/features/(test-participate)/types';
import { serverFetcher } from '@/shared/utils/fetcher/serverFetcher';

export async function getTestInfo(testId: string): Promise<TestInfo | null> {
  try {
    return await serverFetcher<TestInfo>(`${SERVER_BASE_URL}/tests/${testId}`, {
      cache: 'no-store',
    });
  } catch (error) {
    console.error('Error fetching test:', error);
    return null;
  }
}
