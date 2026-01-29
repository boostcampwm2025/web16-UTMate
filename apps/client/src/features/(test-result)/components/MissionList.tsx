'use client';

import Link from 'next/link';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getTestMissionsResults } from '../apis/client';
import type { MissionDetail } from '../types';

export function MissionList({ testId }: { testId: string }) {
  const { data: missionsData } = useSuspenseQuery({
    queryKey: ['testMissionsResults', testId],
    queryFn: () => getTestMissionsResults(testId),
  });

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-gray-800">미션 목록</h3>
      <div className="space-y-4">
        {missionsData.missions && missionsData.missions.length > 0 ? (
          missionsData.missions.map((mission) => (
            <MissionItem key={mission.id} testId={testId} mission={mission} />
          ))
        ) : (
          <p className="text-muted-foreground py-4 text-center text-sm">아직 미션이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

interface MissionItemProps {
  testId: string;
  mission: MissionDetail;
}

function MissionItem({ testId, mission }: MissionItemProps) {
  return (
    <Link
      href={`/tests/${testId}/result/missions/${mission.id}`}
      className="hover:bg-accent hover:text-accent-foreground block rounded-lg border p-4 transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold">
              {mission.missionOrder + 1}번 미션: {mission.name}
            </span>
          </div>
          {mission.description && (
            <p className="text-muted-foreground mt-1 text-sm">{mission.description}</p>
          )}
          <div className="text-muted-foreground mt-2 flex gap-4 text-sm">
            <span>성공률: {mission.successRate}%</span>
            <span>결과 수: {mission.missionResults.length}개</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
