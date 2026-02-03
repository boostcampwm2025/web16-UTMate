'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Loader2, FileQuestion } from 'lucide-react';

import { MissionResultSidebar } from '@/features/(test-result)/components/MissionResultSidebar';
import { MissionResultHeader } from '@/features/(test-result)/components/MissionResultHeader';
import { EventLogContainer } from '@/features/(test-result)/components/EventLogContainer';
import {
  getMissionResultById,
  getMissionResultLogsByUrl,
  getTestMissionsResultById,
} from '@/features/(test-result)/apis/client';
import { parseJsonlToEvents } from '@/features/(test-result)/utils/parse';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';

export default function MissionResultDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id: testId, missionResultId } = params as { id: string; missionResultId: string };

  const { data: missionResultData, isLoading: isMissionResultLoading } = useQuery({
    queryKey: ['missionResult', missionResultId],
    queryFn: () => getMissionResultById(missionResultId as string),
  });

  // 미션 상세 정보 가져오기
  const { data: missionDetail, isLoading: isMissionDetailLoading } = useQuery({
    queryKey: ['missionDetail', missionResultData?.missionId],
    queryFn: () => getTestMissionsResultById(missionResultData!.missionId),
    enabled: !!missionResultData?.missionId,
  });

  //TODO :용량 클탠데 캐시관리 어떻게 해야할지
  const { data: eventLogs, isLoading: isEventLogsLoading } = useQuery({
    queryKey: ['eventLogs', missionResultId, missionResultData?.presignedUrl],
    queryFn: () => getMissionResultLogsByUrl(missionResultData!.presignedUrl),
    enabled: !!missionResultData?.presignedUrl,
    select: (text) => parseJsonlToEvents(text),
  });

  if (isMissionResultLoading || isMissionDetailLoading) {
    return <MissionResultDetailPageSkeleton />;
  }

  if (!missionResultData || !missionDetail) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="flex max-w-md flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <FileQuestion className="h-10 w-10 text-gray-500" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">아직 데이터가 없습니다</h2>
          <p className="text-muted-foreground mb-8 text-base">
            요청하신 미션 결과 데이터를 찾을 수 없습니다.
            <br />
            잠시 후 다시 시도하거나 목록으로 돌아가주세요.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              이전으로
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <MissionResultHeader testId={testId} missionResultData={missionResultData} />
      {/* Body: 남은 높이를 채우도록 flex-1 + min-h-0 */}
      <div className="flex min-h-0 flex-1">
        {/* Left Sidebar - 테스트 정보 */}
        <MissionResultSidebar missionResultData={missionResultData} missionDetail={missionDetail} />
        {/* Main Content - 리플레이 & 이벤트 로그 */}
        <div className="min-h-0 flex-1">
          {isEventLogsLoading ? (
            <div className="flex h-full w-full flex-col items-center justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <p className="mt-4 text-gray-500">로그를 불러오는 중입니다...</p>
            </div>
          ) : !eventLogs ? (
            <div className="flex h-full w-full flex-col items-center justify-center p-6">
              <p className="text-gray-500">로그 데이터가 없습니다.</p>
            </div>
          ) : (
            <EventLogContainer
              eventLogs={eventLogs}
              analysisData={missionResultData.analysisData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const MissionResultDetailPageSkeleton = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <div className="h-16 w-full border-b bg-white px-4 py-3">
        <Skeleton className="h-full w-48" />
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="w-80 border-r bg-white p-6">
          <Skeleton className="mb-4 h-8 w-3/4" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-2 h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="flex-1 p-6">
          <div className="grid h-full grid-cols-3 gap-6">
            {/* Center: Player Skeleton */}
            <div className="col-span-2 flex flex-col space-y-4">
              <Skeleton className="h-8 w-32" />
              <div className="flex flex-1 flex-col overflow-hidden rounded-xl border bg-white">
                <Skeleton className="flex-1" /> {/* Video Area */}
                <div className="h-12 border-t bg-gray-50 px-4 py-2">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-6 w-6 rounded-full" /> {/* Play Button */}
                    <Skeleton className="h-2 flex-1 rounded-full" /> {/* Progress Bar */}
                    <Skeleton className="h-4 w-12" /> {/* Time */}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Event Logs Skeleton */}
            <div className="col-span-1 flex flex-col space-y-4">
              <Skeleton className="h-8 w-32" />
              <div className="flex-1 rounded-xl border bg-white p-4">
                {/* Summary Badges */}
                <div className="mb-6 flex space-x-2">
                  <Skeleton className="h-20 flex-1 rounded-lg" />
                  <Skeleton className="h-20 flex-1 rounded-lg" />
                  <Skeleton className="h-20 flex-1 rounded-lg" />
                </div>
                {/* Log Cards */}
                <div className="space-y-3">
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
