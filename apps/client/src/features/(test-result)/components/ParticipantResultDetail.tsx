'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { AnimalAvatar } from '@/shared/components/AnimalAvatar';
import { generateNicknameFromId } from '@/shared/utils/nickname';

import { MissionStatusBadge } from './MissionStatusBadge';
import { UAInfoDisplay } from './UAInfoDisplay';
import { AnomalyTags } from './AnomalyTags';
import { getParticipantDetail } from '../apis/client';
import { formatDate } from '../utils/dates';
import { PersonaTag } from './PersonaTag';
import { formatDurationFromMilliSeconds } from '../utils/format';

interface ParticipantResultDetailProps {
  testId: string;
  participantId: string;
}

export function ParticipantResultDetail({ testId, participantId }: ParticipantResultDetailProps) {
  const router = useRouter();
  const { data: participant } = useSuspenseQuery({
    queryKey: ['participantDetail', testId, participantId],
    queryFn: () => getParticipantDetail(testId, participantId),
  });

  const completedCount = participant.missionResults.filter((r) => r.status === 'SUCCESS').length;
  const totalCount = participant.missionResults.length;
  const successRate = Math.round((completedCount / totalCount) * 100);

  const handleRowClick = (missionResultId: string) => {
    router.push(`/tests/${testId}/result/mission-result/${missionResultId}`);
  };

  const nickname = generateNicknameFromId(participant.participantId);
  const animalName = nickname.split(' ')[1];

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <Card className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="ml-6 space-y-3">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <AnimalAvatar name={animalName} />
            {nickname}
            <PersonaTag tags={participant.personaTags} />
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{formatDate(participant.joinedAt)} 참여</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 rounded-xl p-6">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-500">완료한 미션</div>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-2xl font-bold text-gray-900">{completedCount}</span>
              <span className="text-sm text-gray-400">/ {totalCount}</span>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-200" />
          <div className="text-center">
            <div className="text-sm font-medium text-gray-500">성공률</div>
            <div className="text-primary mt-1 text-2xl font-bold">{successRate}%</div>
          </div>
        </div>
      </Card>

      {/* UA Info and Feedback Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">사용 환경</CardTitle>
          </CardHeader>
          <CardContent>
            <UAInfoDisplay uaInfo={participant.uaInfo} />
          </CardContent>
        </Card>

        {participant.feedback && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">전체 피드백</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-gray-700">{participant.feedback}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mission Results Table */}
      <Table className="w-full text-left">
        <TableCaption className="sr-only">미션 목록</TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>미션명</TableHead>
            <TableHead>이상현상</TableHead>
            <TableHead className="text-center">결과</TableHead>
            <TableHead>피드백</TableHead>
            <TableHead className="text-right">소요시간</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participant.missionResults.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
                미션 수행 기록이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            participant.missionResults.map((missionResult) => {
              const isClickable = missionResult.status === 'SUCCESS' || missionResult.status === 'FAILED';

              return (
                <TableRow
                  key={missionResult.missionResultId}
                  onClick={() => isClickable && handleRowClick(missionResult.missionResultId)}
                  className={
                    isClickable
                      ? 'cursor-pointer transition-colors hover:bg-gray-50/50'
                      : 'cursor-not-allowed opacity-60'
                  }
                  role={isClickable ? 'button' : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleRowClick(missionResult.missionResultId);
                    }
                  }}
                  aria-label={
                    isClickable
                      ? `${missionResult.missionTitle} 미션 결과 상세 보기`
                      : `${missionResult.missionTitle} 미션 (상세 보기 불가)`
                  }
                >
                  <TableCell className="font-medium">{missionResult.missionTitle}</TableCell>
                  <TableCell>
                    <AnomalyTags
                      totalIdleTime={missionResult.totalIdleTime}
                      rageClickCount={missionResult.rageClickCount}
                      mouseThrashingCount={missionResult.mouseThrashingCount}
                      compact
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <MissionStatusBadge status={missionResult.status} />
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div
                      className="text-muted-foreground truncate text-sm"
                      title={missionResult.feedback || ''}
                    >
                      {missionResult.feedback || (
                        <span className="text-gray-300 italic">피드백 없음</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {missionResult.duration
                      ? formatDurationFromMilliSeconds(missionResult.duration)
                      : '-'}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
