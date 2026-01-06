import { notFound } from 'next/navigation';

import { getTestById } from '@/features/(test-manage)/api';
import { TestForm } from '@/features/(test-detail)/components/TestForm';

export default async function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const initialData = await getTestById(id);

    return <TestForm initialData={initialData} />;
  } catch (error) {
    //TODO : 예외 처리 제대로 하기
    if (error instanceof Error && error.message === 'Test not found') {
      notFound();
    }

    throw error;
  }
}
