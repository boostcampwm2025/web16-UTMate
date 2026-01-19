'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { getTestSummary } from '../apis';

export function TestBasicInfo({ testId }: { testId: string }) {
  const { data: summaryData } = useSuspenseQuery({
    queryKey: ['testSummary', testId],
    queryFn: () => getTestSummary(testId),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{summaryData.title} 결과</CardTitle>
        <CardDescription>{summaryData.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{summaryData.status}</p>
        <p className="text-muted-foreground">총 {summaryData.totalParticipants}명이 참여했어요</p>
        <p className="text-muted-foreground">
          {summaryData.startDate} ~ {summaryData.endDate}
        </p>
      </CardContent>
    </Card>
  );
}
