import { QueryBoundary } from '@/shared/components/QueryBoundary';
import { MissionResultDetail } from '@/features/(test-result)/components/MissionResultDetail';

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string; missionId: string }>;
}) {
  const { id: testId, missionId } = await params;

  return (
    <QueryBoundary>
      <MissionResultDetail testId={testId} missionId={missionId} />
    </QueryBoundary>
  );
}
