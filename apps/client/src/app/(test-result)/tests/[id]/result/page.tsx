import { QueryBoundary } from '@/shared/components/QueryBoundary';
import { TestBasicInfo } from '@/features/(test-result)/components/TestBasicInfo';
import { TestMissionsSummary } from '@/features/(test-result)/components/TestMissionsSummary';
import { TestMainFeedback } from '@/features/(test-result)/components/TestMainFeedback';

export default async function TestResultSummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: testId } = await params;

  return (
    <div className="space-y-6">
      {/* 테스트 기본 정보 */}
      <QueryBoundary>
        <TestBasicInfo testId={testId} />
      </QueryBoundary>

      {/* 미션별 성공률 */}
      <QueryBoundary>
        <TestMissionsSummary testId={testId} />
      </QueryBoundary>

      {/* 주요 피드백 */}
      <QueryBoundary>
        <TestMainFeedback testId={testId} />
      </QueryBoundary>
    </div>
  );
}
