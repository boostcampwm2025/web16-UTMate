import { QueryBoundary } from '@/shared/components/QueryBoundary';
import { ParticipantResultDetail } from '@/features/(test-result)/components/ParticipantResultDetail';

export default async function ParticipantDetailPage({
  params,
}: {
  params: Promise<{ id: string; participantId: string }>;
}) {
  const { id: testId, participantId } = await params;

  return (
    <QueryBoundary>
      <ParticipantResultDetail testId={testId} participantId={participantId} />
    </QueryBoundary>
  );
}
