'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { MissionResultSidebar } from '@/features/(test-result)/components/MissionResultSidebar';
import { MissionResultHeader } from '@/features/(test-result)/components/MissionResultHeader';
import { EventLogContainer } from '@/features/(test-result)/components/EventLogContainer';
import { getMissionResultById, getMissionResultLogsByUrl} from '@/features/(test-result)/apis/client';
import { parseJsonlToEvents } from '@/features/(test-result)/utils/parse';

export default function MissionResultDetailPage() {
  const params = useParams();
  const { id: testId, missionResultId } = params as { id: string; missionResultId: string };

  const { data: missionResultData } = useQuery({
    queryKey: ['missionResult', missionResultId],
    queryFn: () => getMissionResultById(missionResultId as string),
  });

  //TODO :용량 클탠데 캐시관리 어떻게 해야할지
  const { data: eventLogs } = useQuery({
    queryKey: ['eventLogs', missionResultId, missionResultData?.presignedUrl],
    queryFn: () => getMissionResultLogsByUrl(missionResultData!.presignedUrl),
    enabled: !!missionResultData?.presignedUrl,
    select: (text) => parseJsonlToEvents(text),
  });


  if (!missionResultData || !eventLogs) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <MissionResultHeader testId={testId} missionResultData={missionResultData} />
      {/* Body: 남은 높이를 채우도록 flex-1 + min-h-0 */}
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar - 테스트 정보 */}
        <MissionResultSidebar missionResultData={missionResultData} />
        {/* Main Content - 리플레이 & 이벤트 로그 */}
        <div className="flex-1 min-h-0">
          <EventLogContainer eventLogs={eventLogs} />
        </div>
      </div>
    </div>
  );
}

