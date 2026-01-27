import { notFound } from 'next/navigation';

import { TestParticipateClient } from './TestParticipateClient';

import { SERVER_BASE_URL as API_BASE_URL } from '@/shared/constants/api';
import type { TestInfo } from '@/features/(test-participate)/types';

interface PageProps {
  params: Promise<{
    testId: string;
  }>;
}

/**
 * 서버에서 테스트 정보 fetch
 */
async function getTestInfo(testId: string): Promise<TestInfo | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/tests/${testId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch test');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching test:', error);
    return null;
  }
}

export default async function TestParticipatePage({ params }: PageProps) {
  const { testId } = await params;

  // 서버에서 테스트 정보 fetch
  const testInfo = await getTestInfo(testId);

  // 테스트가 존재하지 않으면 404 페이지 표시
  if (!testInfo) {
    notFound();
  }

  // 클라이언트 컴포넌트에 초기 데이터 전달
  return <TestParticipateClient initialTestInfo={testInfo} />;
}
