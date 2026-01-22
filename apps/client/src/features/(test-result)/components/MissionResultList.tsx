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
import type { MissionDetail } from '../types';

interface MissionResultListProps {
  testId: string;
  missionLogs: MissionDetail;
}

export function MissionResultList({ testId, missionLogs }: MissionResultListProps) {
  const router = useRouter();

  const handleRowClick = (participantId: string) => {
    router.push(`/tests/${testId}/result/mission-result/${participantId}`);
  };

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-gray-800">로그 목록</h3>
      <Table className="w-full text-left">
        <TableCaption className="sr-only">미션 로그 목록</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>아이디</TableHead>
            <TableHead>일시</TableHead>
            <TableHead>성공여부</TableHead>
            <TableHead>피드백</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {missionLogs.missionResults.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                해당 미션에 대한 결과가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            missionLogs.missionResults.map((log) => (
              <TableRow
                key={log.participantId}
                onClick={() => handleRowClick(log.participantId)}
                className="cursor-pointer"
              >
                <TableCell>{log.participantId}</TableCell>
                <TableCell className="text-center">{log.createdAt || '-'}</TableCell>
                <TableCell className="text-center">
                  {log.status === 'SUCCESS' ? (
                    <span className="inline-flex items-center font-bold text-green-600">O</span>
                  ) : log.status === 'FAILED' ? (
                    <span className="inline-flex items-center font-bold text-red-600">X</span>
                  ) : log.status === 'PENDING' ? (
                    <span className="inline-flex items-center font-bold text-gray-500">이탈</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {log.feedback || <span className="text-gray-300 italic">피드백 없음</span>}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
