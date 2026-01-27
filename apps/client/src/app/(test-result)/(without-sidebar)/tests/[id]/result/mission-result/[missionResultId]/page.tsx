'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { MissionResultSidebar } from '@/features/(test-result)/components/MissionResultSidebar';
import { MissionResultHeader } from '@/features/(test-result)/components/MissionResultHeader';
import { EventLogContainer } from '@/features/(test-result)/components/EventLogContainer';
import {
  getMissionResultById,
  getMissionResultLogsByUrl,
  getTestMissionsResultById,
} from '@/features/(test-result)/apis/client';
import { parseJsonlToEvents } from '@/features/(test-result)/utils/parse';

export default function MissionResultDetailPage() {
  const params = useParams();
  const { id: testId, missionResultId } = params as { id: string; missionResultId: string };

  const { data: missionResultData } = useQuery({
    queryKey: ['missionResult', missionResultId],
    queryFn: () => getMissionResultById(missionResultId as string),
  });

  // 미션 상세 정보 가져오기
  const { data: missionDetail } = useQuery({
    queryKey: ['missionDetail', missionResultData?.missionId],
    queryFn: () => getTestMissionsResultById(missionResultData!.missionId),
    enabled: !!missionResultData?.missionId,
  });

  //TODO :용량 클탠데 캐시관리 어떻게 해야할지
  const { data: eventLogs } = useQuery({
    queryKey: ['eventLogs', missionResultId, missionResultData?.presignedUrl],
    queryFn: () => getMissionResultLogsByUrl(missionResultData!.presignedUrl),
    enabled: !!missionResultData?.presignedUrl,
    select: (text) => parseJsonlToEvents(text),
  });

  //TODO : 렌더링 로직 개선하기 (useSuspenseQuery로 리팩토링 고려)
  if (!missionResultData || !eventLogs || !missionDetail) {
    return null;
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
          <EventLogContainer eventLogs={eventLogs} />
        </div>
      </div>
    </div>
  );
}
