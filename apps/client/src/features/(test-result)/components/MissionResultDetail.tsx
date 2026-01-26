'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { MissionResultList } from './MissionResultList';
import { getTestMissionsResultById } from '../apis/client';
import { MissionInfo } from './MissionInfo';

interface MissionResultDetailProps {
  testId: string;
  missionId: string;
}

export function MissionResultDetail({ testId, missionId }: MissionResultDetailProps) {
  const { data: missionLogs } = useSuspenseQuery({
    queryKey: ['missionResult', missionId],
    queryFn: () => getTestMissionsResultById(missionId),
  });

  return (
    <div className="mt-8 space-y-8">
      {/* 미션 정보 */}
      <MissionInfo missionLogs={missionLogs} />
      {/* 미션 결과 리스트 */}
      <MissionResultList testId={testId} missionLogs={missionLogs} />
    </div>
  );
}
