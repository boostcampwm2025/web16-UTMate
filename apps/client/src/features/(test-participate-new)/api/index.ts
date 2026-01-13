import type { TestInfo } from '../types';

import { API_BASE_URL } from '@/shared/constants/api';

export async function getTestForParticipation(testId: string): Promise<TestInfo | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/tests/${testId}`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch test');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching test:', error);
    throw error;
  }
}
