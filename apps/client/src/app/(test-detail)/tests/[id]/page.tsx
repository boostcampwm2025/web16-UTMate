import { notFound } from 'next/navigation';

import { getTestById } from '@/features/(test-detail)/api';
import { TestForm } from '@/features/(test-detail)/components/TestForm';

export default async function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const initialData = await getTestById(id);

    return <TestForm initialData={initialData} />;
  } catch (error) {
    //TODO : 예외 처리 제대로 하기
    //TODO: 로그인 한 유저만 접속가능하게 처리(proxy에서 처리하거나 여기서 처리)
    if (error instanceof Error && error.message === 'Test not found') {
      notFound();
    }

    throw error;
  }
}
