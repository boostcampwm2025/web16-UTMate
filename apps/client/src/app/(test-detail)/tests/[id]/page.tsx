import { notFound, redirect } from 'next/navigation';

import { getTestByIdonServer} from '@/features/(test-detail)/api';
import { TestForm } from '@/features/(test-detail)/components/TestForm';
import { ApiError } from '@/shared/constants/api';

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
