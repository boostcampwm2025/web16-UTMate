import type { Metadata, ResolvingMetadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { getTestByIdonServer } from '@/features/(test-detail)/api/server';
import { TestForm } from '@/features/(test-detail)/components/TestForm';
import { ApiError } from '@/shared/constants/api';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 동적으로 메타데이터 생성
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;

  try {
    // 서버컴포넌트 내의 fetch 요청은 자동으로 메모이제이션 됨 https://nextjs.org/docs/app/api-reference/functions/generate-metadata#returns
    const test = await getTestByIdonServer(id);
    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: `${test.title} | UTMate`,
      description: test.description,
      openGraph: {
        title: `${test.title} | UTMate`,
        description: test.description,
        images: [...previousImages],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${test.title} | UTMate`,
        description: test.description,
      },
    };
  } catch (error) {
    return {
      title: 'UTMate',
      description: '사용성 테스트 상세',
    };
  }
}

export default async function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    //TODO : 테스트 개별 조회도 리액트 쿼리로 관리하도록 설정 필요
    const initialData = await getTestByIdonServer(id);

    return <TestForm initialData={initialData} />;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.statusCode === 404 || error.statusCode === 403) {
        notFound();
      } else if (error.statusCode === 401) {
        redirect('/login');
      } else {
        throw error;
      }
    }

    throw error;
  }
}
