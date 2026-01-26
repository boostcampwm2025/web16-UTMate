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
import { generateNicknameFromId } from '@/shared/utils/nickname';
import { formatDistanceToNow } from '../utils/dates';
import { formatTimestamp } from '../utils/format';
import type { MissionDetail } from '../types';

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
    <div>
      <h3 className="mb-4 text-lg font-bold text-gray-800">로그 목록</h3>
      <Table className="w-full text-left">
        <TableCaption className="sr-only">미션 로그 목록</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>참여자</TableHead>

            <TableHead className="text-center">성공여부</TableHead>
            <TableHead>피드백</TableHead>
            <TableHead className="text-right">소요시간</TableHead>
            <TableHead className="text-right">일시</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!missionLogs.missionResults || missionLogs.missionResults.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                해당 미션에 대한 결과가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            missionLogs.missionResults.map((missionResult) => (
              <TableRow
                key={missionResult.id}
                onClick={() => handleRowClick(missionResult.id)}
                className="cursor-pointer"
              >
                <TableCell>{generateNicknameFromId(missionResult.participantId)}</TableCell>

                <TableCell className="text-center">
                  {missionResult.status === 'SUCCESS' ? (
                    <span className="mx-auto inline-flex items-center font-bold text-green-600">
                      O
                    </span>
                  ) : missionResult.status === 'FAILED' ? (
                    <span className="mx-auto inline-flex items-center font-bold text-red-600">
                      X
                    </span>
                  ) : missionResult.status === 'PENDING' ? (
                    <span className="mx-auto inline-flex items-center font-bold text-gray-500">
                      이탈
                    </span>
                  ) : (
                    <span className="mx-auto text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {missionResult.feedback || (
                    <span className="text-gray-300 italic">피드백 없음</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {missionResult.duration != null
                    ? formatTimestamp(missionResult.duration)
                    : '-'}
                </TableCell>
                {/* TODO : 응답에 일시 추가 */}
                <TableCell className="text-right">-</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
