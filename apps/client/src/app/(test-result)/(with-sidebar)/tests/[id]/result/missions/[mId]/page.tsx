import { QueryBoundary } from '@/shared/components/QueryBoundary';
import { TestMissionResults } from '@/features/(test-result)/components/TestMissionResults';
import { MissionResultDetail } from '@/features/(test-result)/components/MissionResultDetail';

type params = {
  testId: string;
  mId: string;
};

export default async function MissionResultsPage({ params }: { params: Promise<params> }) {
  const { testId, mId } = await params;

  //TODO: 404 처리
  //TODO: 401 처리

  return (
    <QueryBoundary>
      <MissionResultDetail testId={testId} mId={mId} />
    </QueryBoundary>
  );
}
