'use client';

import Link from 'next/link';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getTestMissionsResults } from '../apis/client';
import type { MissionDetail } from '../types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card';

export function TestMissionResultList({ testId }: { testId: string }) {
  const { data: missionsData } = useSuspenseQuery({
    queryKey: ['testMissionsResults', testId],
    queryFn: () => getTestMissionsResults(testId),
  });

  return (
    <div>
      <h3 className="mb-4 ml-2 text-xl font-semibold">미션 목록</h3>
      <div className="flex flex-col gap-4">
        {missionsData.missions && missionsData.missions.length > 0 ? (
          missionsData.missions.map((mission) => (
            <TestMissionResultItem key={mission.id} testId={testId} mission={mission} />
          ))
        ) : (
          <p className="text-muted-foreground py-4 text-center text-sm">아직 미션이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

interface TestMissionResultItemProps {
  testId: string;
  mission: MissionDetail;
}

function TestMissionResultItem({ testId, mission }: TestMissionResultItemProps) {
  return (
    <Link href={`/tests/${testId}/result/missions/${mission.id}`}>
      <Card className="flex cursor-pointer flex-col md:flex-row">
        <CardHeader className="flex-1">
          <CardTitle className="text-base font-semibold">{mission.name}</CardTitle>
          <CardDescription className="mt-1">
            <p>{mission.description}</p>
            <p>예상 소요 시간: {mission.estimatedDuration}분</p>
            <p>시작 주소: {mission.missionUrl}</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="my-auto">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-xs">성공률</div>
              <div className="text-sm font-semibold">{mission.successRate}%</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-xs">이탈율</div>
              <div className="text-sm font-semibold">{mission.dropRate}%</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-xs">결과 수</div>
              <div className="text-sm font-semibold">{mission.missionResults.length}개</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-xs">평균 소요시간</div>
              {/* TODO: 단위 체크 후 추가 */}
              <div className="text-sm font-semibold">{mission.averageDuration}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
