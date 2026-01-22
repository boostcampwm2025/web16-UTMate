import { QueryBoundary } from '@/shared/components/QueryBoundary';
import { TestBasicInfo } from '@/features/(test-result)/components/TestBasicInfo';
import { TestMissionsSummary } from '@/features/(test-result)/components/TestMissionsSummary';
import { TestMainFeedback } from '@/features/(test-result)/components/TestMainFeedback';

export default async function TestResultSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: testId } = await params;

  //TODO: 404 처리
  //TODO: 401 처리

  return (
    <div className="flex flex-col h-full gap-6">
      {/* 테스트 기본 정보 */}
      <QueryBoundary>
        <TestBasicInfo testId={testId} />
      </QueryBoundary>

      {/* 하단 2열 레이아웃: 미션 통계 / 주요 피드백 */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 flex-1 min-h-0">
        {/* 미션 통계 */}
        <QueryBoundary>
          <TestMissionsSummary testId={testId} />
        </QueryBoundary>

        {/* 주요 피드백 */}
        <QueryBoundary>
          <TestMainFeedback testId={testId} />
        </QueryBoundary>
      </div>
    </div>
  );
}
