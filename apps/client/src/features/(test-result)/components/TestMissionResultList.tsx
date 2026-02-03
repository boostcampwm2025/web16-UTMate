'use client';

import Link from 'next/link';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getTestMissionsResults } from '../apis/client';
import type { MissionDetail } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Clock, FileText, Globe } from 'lucide-react';
import { formatDurationFromMilliSeconds } from '../utils/format';

export function TestMissionResultList({ testId }: { testId: string }) {
  const { data: missionsData } = useSuspenseQuery({
    queryKey: ['testMissionsResults', testId],
    queryFn: () => getTestMissionsResults(testId),
  });

  return (
    <div>
      <h2 className="mb-4 ml-2 text-xl font-semibold">미션 목록</h2>
      <div className="flex flex-col gap-4">
        {missionsData.missions && missionsData.missions.length > 0 ? (
          missionsData.missions.map((mission, index) => (
            <TestMissionResultItem
              key={mission.id}
              testId={testId}
              mission={mission}
              index={index}
            />
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
  index: number;
}

function TestMissionResultItem({ testId, mission, index }: TestMissionResultItemProps) {
  return (
    <Link href={`/tests/${testId}/result/missions/${mission.id}`} aria-label={`${mission.name} 미션 상세 결과 보기`}>
      <Card className="flex cursor-pointer flex-col md:p-2">
        <CardHeader className="p-4 md:p-6 md:pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            {mission.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-6 p-4 md:grid-cols-12 md:items-start md:p-6 md:pt-2">
          <div className="flex flex-col gap-3 text-sm md:col-span-7 lg:col-span-5">
            <div className="flex flex-col gap-1.5">
              <div className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <FileText className="h-4 w-4" />
                설명
              </div>
              <p className="text-foreground/90 pl-5 leading-relaxed">{mission.description}</p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="flex flex-col gap-1.5">
                <div className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Clock className="h-4 w-4" />
                  예상 소요 시간
                </div>
                <p className="text-muted-foreground pl-5 font-medium">
                  {mission.estimatedDuration}분
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Globe className="h-4 w-4" />
                  시작 주소
                </div>
                <p className="text-muted-foreground pl-5 break-all">{mission.missionUrl}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:col-span-5 md:grid-cols-4 lg:col-span-7">
            <MetricCard label="성공률" value={`${mission.successRate}%`} />
            <MetricCard label="이탈율" value={`${mission.dropRate}%`} />
            <MetricCard label="결과 수" value={`${mission.missionResults.length}개`} />
            <MetricCard
              label="평균 소요시간"
              value={`${formatDurationFromMilliSeconds(mission.averageDuration)}`}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
}

export const MetricCard = ({ label, value }: MetricCardProps) => {
  return (
    <div className="flex min-w-20 flex-col items-start justify-center rounded-2xl bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100">
      <div className="mb-2 text-sm font-medium text-gray-500">{label}</div>
      <div className="text-xl font-semibold text-gray-700">{value}</div>
    </div>
  );
};
