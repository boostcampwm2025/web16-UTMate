import { notFound, redirect } from 'next/navigation';

import { getTestById } from '@/features/(test-detail)/api';
import { TestForm } from '@/features/(test-detail)/components/TestForm';
import { ApiError } from '@/shared/constants/api';

export default async function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const initialData = await getTestById(id);

    return <TestForm initialData={initialData} />;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.code === 404) {
        notFound();
      } else if (error.code === 401) {
        redirect('/login');
      } else {
        throw error;
      }
    }

    throw error;
  }
}
