'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { CalendarIcon, UsersIcon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { TestStatusBadge } from '@/shared/components/TestStatusBadge';
import { TestStatus } from '@/features/(test-manage)/types';

import { getTestResultSummary } from '../apis/client';

export function TestBasicInfo({ testId }: { testId: string }) {
  const { data: testSummary } = useSuspenseQuery({
    queryKey: ['testSummary', testId],
    queryFn: () => getTestResultSummary(testId),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold gap-2 flex items-center">{testSummary.title}<TestStatusBadge status={testSummary.status} /></CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{testSummary.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <UsersIcon className="w-4 h-4" />
          <span className="text-sm text-muted-foreground">{testSummary.status === TestStatus.PUBLISHED ? '지금까지' : '총'} {testSummary.totalParticipants}명이 참여했어요.</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4"/>
          <span className="text-sm text-muted-foreground">{testSummary.startDate} {testSummary.endDate ? `~ ${testSummary.endDate}` : ''}</span>
        </div>
      </CardContent>
    </Card>
  );
}
