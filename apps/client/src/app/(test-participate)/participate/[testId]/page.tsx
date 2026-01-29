import { notFound } from 'next/navigation';

import { TestParticipateClient } from '@/features/(test-participate)/components/TestParticipateClient';
import { getTestInfo } from '@/features/(test-participate)/api/server';
import { ApiError } from '@/shared/constants/api';
import type { TestInfo } from '@/features/(test-participate)/types';

export default async function TestParticipatePage({
  params,
}: {
  params: Promise<{
    testId: string;
  }>;
}) {
  const { testId } = await params;

  let testInfo: TestInfo | null = null;

  try {
    testInfo = await getTestInfo(testId);
    if (!testInfo) {
      notFound();
    }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.statusCode === 404) {
        notFound();
      } else {
        throw error;
      }
    }

    throw error;
  }

  // 클라이언트 컴포넌트에 초기 데이터 전달
  return <TestParticipateClient initialTestInfo={testInfo} />;
}
