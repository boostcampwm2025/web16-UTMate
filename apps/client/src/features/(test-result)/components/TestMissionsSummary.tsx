"use client";

import { useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { getTestParticipantsResults } from '../apis';

interface TestMissionsSummaryProps {
  testId: string;
}

export function TestMissionsSummary({ testId }: TestMissionsSummaryProps) {
  const { data: participantsData } = useSuspenseQuery({
    queryKey: ['testMissionsSummary', testId],
    queryFn: () => getTestParticipantsResults(testId),
  });

  // 미션별 성공률을 계산
  const missionStats = useMemo(() => {
    const statsMap: Record<number, { successCount: number; totalCount: number }> = {};

    participantsData.forEach((participant) => {
      participant.missionResults.forEach((result) => {
        if (!statsMap[result.missionId]) {
          statsMap[result.missionId] = { successCount: 0, totalCount: 0 };
        }
        
        // 해당 미션에 도달한 전체 횟수(성공+실패+이탈 등)를 카운트
        statsMap[result.missionId].totalCount += 1;
        
        // 성공인 경우만 카운트
        if (result.status === 'SUCCESS') {
          statsMap[result.missionId].successCount += 1;
        }
      });
    });

    // 가공된 맵을 배열로 변환하고 미션 번호 순으로 정렬합니다.
    return Object.entries(statsMap)
      .map(([id, stats]) => ({
        id: Number(id),
        successRate: stats.totalCount > 0 
          ? Math.round((stats.successCount / stats.totalCount) * 100) 
          : 0,
      }))
      .sort((a, b) => a.id - b.id);
  }, [participantsData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>미션별 성공률</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {missionStats.map((mission) => (
            <div key={mission.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {mission.id}번 미션
                </span>
                <span className="text-sm font-bold">{mission.successRate}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${mission.successRate}%` }}
                />
              </div>
            </div>
          ))}
          {missionStats.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              분석할 미션 결과 데이터가 없습니다.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}