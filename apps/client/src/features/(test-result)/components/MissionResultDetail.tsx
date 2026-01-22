'use client';

import type { MissionResultWithParticipant } from '../types';
import { MissionResultSummary } from './MissionResultSummary';
import { MissionResultList } from './MissionResultList';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getTestMissionsResultById } from '../apis/client';
import { MissionInfo } from './MissionInfo';

interface MissionResultDetailProps {
  testId: string;
  mId: string;
}

export function MissionResultDetail({ testId, mId }: MissionResultDetailProps) {
  const { data: missionLogs } = useSuspenseQuery({
    queryKey: ['missionResult', mId],
    queryFn: () => getTestMissionsResultById(mId),
  });

  return (
    <div className="mt-8 space-y-8">
      {/* 미션 정보 */}
      <MissionInfo missionLogs={missionLogs} />
      {/* 미션 결과 요약 */}
      <MissionResultSummary missionLogs={missionLogs} />
      {/* 미션 결과 리스트 */}
      <MissionResultList testId={testId} missionLogs={missionLogs} />
    </div>
  );
}
