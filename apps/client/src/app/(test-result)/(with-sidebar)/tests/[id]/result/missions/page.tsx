import { QueryBoundary } from '@/shared/components/QueryBoundary';
import { TestMissionResults } from '@/features/(test-result)/components/TestMissionResults';

export default async function MissionResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: testId } = await params;

  //TODO: 404 처리
  //TODO: 401 처리

  return (
    <QueryBoundary>
      <TestMissionResults testId={testId} />
    </QueryBoundary>
  );
}
