'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils';

import { getParticipantDetail } from '../apis/client';
import type { ParticipantMissionResult } from '../types';

interface ParticipantResultDetailProps {
  testId: string;
  participantId: string;
}

const statusConfig = {
  PENDING: {
    label: '대기',
    icon: Clock,
    className: 'bg-gray-100 text-gray-700',
  },
  SUCCESS: {
    label: '성공',
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-700',
  },
  COMPLETED: {
    label: '완료',
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-700',
  },
  FAILED: {
    label: '실패',
    icon: XCircle,
    className: 'bg-red-100 text-red-700',
  },
  IN_PROGRESS: {
    label: '진행중',
    icon: AlertCircle,
    className: 'bg-blue-100 text-blue-700',
  },
  SKIPPED: {
    label: '건너뜀',
    icon: AlertCircle,
    className: 'bg-yellow-100 text-yellow-700',
  },
};

function MissionResultCard({
  testId,
  missionResult,
  index,
}: {
  testId: string;
  missionResult: ParticipantMissionResult;
  index: number;
}) {
  const config = statusConfig[missionResult.status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <Link href={`/tests/${testId}/result/mission-result/${missionResult.missionResultId}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">미션 {index + 1}</CardTitle>
            <Badge className={cn('gap-1', config.className)}>
              <Icon className="h-3 w-3" />
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {missionResult.feedback ? (
            <p className="text-muted-foreground line-clamp-2 text-sm">{missionResult.feedback}</p>
          ) : (
            <p className="text-muted-foreground text-sm italic">피드백 없음</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function ParticipantResultDetail({ testId, participantId }: ParticipantResultDetailProps) {
  const { data: participant } = useSuspenseQuery({
    queryKey: ['participantDetail', testId, participantId],
    queryFn: () => getParticipantDetail(testId, participantId),
  });

  const completedCount = participant.missionResults.filter(
    (r) => r.status === 'SUCCESS',
  ).length;
  const totalCount = participant.missionResults.length;

  return (
    <div className="space-y-6">
      {/* 참여자 정보 헤더 */}
      <Card>
        <CardHeader>
          <CardTitle>참여자 상세 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-muted-foreground text-sm">
              페르소나: {participant.persona}
            </div>
            <div className="text-muted-foreground text-sm">
              완료된 미션: {completedCount} / {totalCount}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 미션 결과 목록 */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">미션별 결과</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {participant.missionResults.map((missionResult, index) => (
            <MissionResultCard
              key={missionResult.missionResultId}
              testId={testId}
              missionResult={missionResult}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
