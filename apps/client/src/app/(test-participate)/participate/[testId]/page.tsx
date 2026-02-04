import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

import { TestParticipateClient } from '@/features/(test-participate)/components/TestParticipateClient';
import { getTestInfo } from '@/features/(test-participate)/api/server';
import { ApiError } from '@/shared/constants/api';
import type { TestInfo } from '@/features/(test-participate)/types';

type Props = {
  params: Promise<{ testId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { testId } = await params;

  try {
    // 서버컴포넌트 내의 fetch 요청은 자동으로 메모이제이션 됨 https://nextjs.org/docs/app/api-reference/functions/generate-metadata#returns
    const testInfo = await getTestInfo(testId);
    const previousImages = (await parent).openGraph?.images || [];

    if (!testInfo) {
      return {
        title: '테스트 참여 | UTMate',
      };
    }

    return {
      title: `${testInfo.title}`,
      description: testInfo.description,
      openGraph: {
        title: `${testInfo.title}`,
        description: testInfo.description,
        images: [...previousImages],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${testInfo.title}`,
        description: testInfo.description,
      },
    };
  } catch (error) {
    return {
      title: '테스트 참여 | UTMate',
      description: '사용성 테스트 참여하기',
    };
  }
}

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
