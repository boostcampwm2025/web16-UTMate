'use client';


import type { MissionResultWithParticipant } from '../types';
import { MissionResultSummary } from './MissionResultSummary';
import { MissionResultList } from './MissionResultList';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getTestMissionsResultById } from '../apis';

interface MissionResultDetailProps {
  testId: string;
  selectedMissionId: number;
}

export function MissionResultDetail({
  testId,
  selectedMissionId,
}: MissionResultDetailProps) {

  const { data: missionLogs } = useSuspenseQuery({
    queryKey: ['missionResult', selectedMissionId],
    queryFn: () => getTestMissionsResultById(selectedMissionId),
  });

  return (
    <div className="mt-8 space-y-8">
      {/* 미션 결과 요약 */}
      <MissionResultSummary missionLogs={missionLogs} />
      <MissionResultList testId={testId} missionLogs={missionLogs} />
    </div>
  );
}
