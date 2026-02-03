'use client';

import { useRouter } from 'next/navigation';

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
import { formatTimestamp } from '../utils/format';
import type { MissionDetail } from '../types';
import { PersonaTag } from './PersonaTag';

interface MissionResultListProps {
  testId: string;
  missionLogs: MissionDetail;
}

export function MissionResultList({ testId, missionLogs }: MissionResultListProps) {
  const router = useRouter();

  const handleRowClick = (missionResultId: string) => {
    router.push(`/tests/${testId}/result/mission-result/${missionResultId}`);
  };

  return (
    <Table className="w-full text-left">
      <TableCaption className="sr-only">미션 로그 목록</TableCaption>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>참여자</TableHead>
          <TableHead>사용 환경</TableHead>
          <TableHead>이상현상</TableHead>
          <TableHead className="text-center">결과</TableHead>
          <TableHead>피드백</TableHead>
          <TableHead className="text-right">소요시간</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!missionLogs.missionResults || missionLogs.missionResults.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-muted-foreground py-8 text-center">
              해당 미션에 대한 결과가 없습니다.
            </TableCell>
          </TableRow>
        ) : (
          missionLogs.missionResults.map((missionResult) => {
            const nickname = generateNicknameFromId(missionResult.participantId);
            const animalName = nickname.split(' ')[1];

            return (
              <TableRow
                key={missionResult.id}
                onClick={() => handleRowClick(missionResult.id)}
                className="cursor-pointer transition-colors hover:bg-gray-50/50"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRowClick(missionResult.id);
                  }
                }}
                aria-label={`${nickname} 참여자의 미션 결과 상세 보기`}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <AnimalAvatar name={animalName} />
                    {nickname}
                    <PersonaTag tags={missionResult.personaTags} />
                  </div>
                </TableCell>

                <TableCell>
                  <UAInfoDisplay uaInfo={missionResult.uaInfo} compact />
                </TableCell>

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
                  {missionResult.duration != null ? formatTimestamp(missionResult.duration) : '-'}
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
