import { QueryBoundary } from '@/shared/components/QueryBoundary';
import { TestMissionResultList } from '@/features/(test-result)/components/TestMissionResultList';

export default async function MissionResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: testId } = await params;

  //TODO: 404 처리
  //TODO: 401 처리

  return (
    <QueryBoundary>
      <TestMissionResultList testId={testId} />
    </QueryBoundary>
  );
}
