'use client';

import { useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { getTestById } from '@/features/(test-detail)/api/client';
import { testParticipantsResultsQuery } from '../queries';
import { calculateMissionStats } from '../utils/stats';
import type { Mission } from '@/features/(test-participate)/types';

interface TestMissionsSummaryProps {
  testId: string;
}

export function TestMissionsSummary({ testId }: TestMissionsSummaryProps) {
  const { data: participantsData } = useSuspenseQuery({
    ...testParticipantsResultsQuery(testId),
  });

  const { data: testDetail } = useSuspenseQuery({
    queryKey: ['testDetail', testId],
    queryFn: () => getTestById(testId),
  });

  // 미션별 성공률 계산 && 미션 정보 결합
  const missionsWithStats = useMemo(() => {
     const missionStats = calculateMissionStats(participantsData);
     const missions = testDetail.missions || [];
     return missions.map((mission) => {
      const stats = missionStats.find((s) => s.id === mission.order + 1);
      return {
        ...mission,
        order: mission.order + 1,
        successRate: stats?.successRate ?? 0,
        hasData: !!stats,
      };
    });
  }, [participantsData, testDetail.missions]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">미션별 성공률</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {/* TODO : 개별미션보기 링크 추가 */}
        <div className="space-y-4">
          {missionsWithStats.map((mission) => (
            <MissionSummaryItem key={mission.publicId} mission={mission} />
          ))}
          {missionsWithStats.length === 0 && (
            <p className="text-muted-foreground py-4 text-center text-sm">
              아직 미션 결과가 없습니다.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface MissionWithStats extends Mission {
  order: number;
  successRate: number;
  hasData: boolean;
}

interface MissionSummaryItemProps {
  mission: MissionWithStats;
}

export function MissionSummaryItem({ mission }: MissionSummaryItemProps) {
  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-center">
      {/* 왼쪽: 미션 정보 */}
      <div className="space-y-1">
        <div className="flex items-center">
          <span className="text-base font-medium">{mission.order}번 미션</span>
        </div>
        {mission.description && (
          <p className="text-sm text-muted-foreground">{mission.description}</p>
        )}
      </div>
      
      {/* 오른쪽: Progress 바 */}
      <div className="flex flex-col gap-2 lg:items-end">
        {mission.hasData ? (
          <>
            <span className="text-base font-semibold lg:text-right">{mission.successRate}%</span>
            <Progress value={mission.successRate} className="h-2 w-full lg:min-w-[200px]" />
          </>
        ) : (
          <>
            <span className="text-base font-semibold lg:text-right text-muted-foreground">데이터 없음</span>
            <div className="h-2 w-full rounded-full bg-gray-100 lg:min-w-[200px]" />
          </>
        )}
      </div>
    </div>
  );
}
