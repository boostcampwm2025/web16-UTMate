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
            missionLogs.missionResults.map((missionResult) => (
              <TableRow
                key={missionResult.id}
                onClick={() => handleRowClick(missionResult.id)}
                className="cursor-pointer"
              >
                <TableCell>{missionResult.id}</TableCell>
                <TableCell className="text-center">{new Date().toLocaleString() || '-'}</TableCell>
                <TableCell className="text-center">
                  {missionResult.status === 'SUCCESS' ? (
                    <span className="inline-flex items-center font-bold text-green-600">O</span>
                  ) : missionResult.status === 'FAILED' ? (
                    <span className="inline-flex items-center font-bold text-red-600">X</span>
                  ) : missionResult.status === 'PENDING' ? (
                    <span className="inline-flex items-center font-bold text-gray-500">이탈</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {missionResult.feedback || (
                    <span className="text-gray-300 italic">피드백 없음</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
