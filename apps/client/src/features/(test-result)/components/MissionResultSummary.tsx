import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { MissionResultWithParticipant } from '../types';

interface MissionResultSummaryProps {
  missionLogs: MissionResultWithParticipant[];
}

export function MissionResultSummary({ missionLogs }: MissionResultSummaryProps) {
  //TODO : 통계 계산로직 분리
  const stats = useMemo(() => {
    const total = missionLogs.length;
    if (total === 0) {
      return {
        success: 0,
        totalCount: 0,
        successRate: 0,
        avgDuration: '0분 0초',
        dropRate: 0,
      };
    }

    const successCount = missionLogs.filter((l) => l.status === 'SUCCESS').length;
    const failureCount = missionLogs.filter((l) => l.status === 'FAILED').length;
    const dropCount = missionLogs.filter((l) => l.status === 'PENDING').length;
    const successLogsWithDuration = missionLogs.filter((l) => l.status === 'SUCCESS' && l.duration);

    const avgDurationSeconds =
      successLogsWithDuration.length > 0
        ? Math.round(
            successLogsWithDuration.reduce((acc, curr) => acc + (curr.duration || 0), 0) /
              successLogsWithDuration.length,
          )
        : 0;

    const totalAttempts = successCount + failureCount;
    const successRate = totalAttempts > 0 ? Math.round((successCount / totalAttempts) * 100) : 0;
    const dropRate = Math.round((dropCount / total) * 100);

    return {
      success: successCount,
      totalCount: totalAttempts,
      successRate,
      avgDuration: `${Math.floor(avgDurationSeconds / 60)}분 ${avgDurationSeconds % 60}초`,
      dropRate,
    };
  }, [missionLogs]);

  const summaryCards = useMemo(
    () => [
      {
        title: '성공률(성공/성공+실패)',
        value: `${stats.success}/${stats.totalCount} ${stats.successRate}%`,
      },
      { title: '평균 소요시간', value: stats.avgDuration },
      { title: '이탈율', value: stats.dropRate },
    ],
    [stats],
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
