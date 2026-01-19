import { QueryBoundary } from '@/shared/components/QueryBoundary';
import { TestParticipantsResults } from '@/features/(test-result)/components/TestParticipantsResults';

export default async function ParticipantsResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: testId } = await params;

  //TODO: 404 처리
  //TODO: 401 처리

  return (
    <QueryBoundary>
      <TestParticipantsResults testId={testId} />
    </QueryBoundary>
  );
}
