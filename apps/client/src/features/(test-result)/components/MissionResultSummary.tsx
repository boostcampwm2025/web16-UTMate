import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { MissionDetail } from '../types';

interface MissionResultSummaryProps {
  missionLogs: MissionDetail;
}

export function MissionResultSummary({ missionLogs }: MissionResultSummaryProps) {
  const summaryCards = useMemo(
    () => [
      {
        title: '성공률',
        value: `${missionLogs.successRate}%`,
      },
      { title: '이탈율', value: `${missionLogs.dropRate}%` },
      { title: '총 참여자 수', value: missionLogs.missionResults.length },
      { title: '평균 소요시간', value: (missionLogs.averageDuration / 1000).toFixed(1) + 's' },
      { title: '평균 Idle 시간', value: (missionLogs.averageIdleTime / 1000).toFixed(1) + 's' },
      { title: '평균 Rage Click 수', value: missionLogs.averageRageClickCount.toFixed(1) },
      {
        title: '평균 Mouse Thrashing 수',
        value: missionLogs.averageMouseThrashingCount.toFixed(1),
      },
    ],
    [missionLogs],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>미션 결과 요약</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} title={card.title} value={card.value} />
        ))}
      </CardContent>
    </Card>
  );
}

interface SummaryCardProps {
  title: string;
  value: string | number;
}

export const SummaryCard = ({ title, value }: SummaryCardProps) => {
  return (
    <Card className="border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-gray-700">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-blue-600">{value}</div>
      </CardContent>
    </Card>
  );
};
