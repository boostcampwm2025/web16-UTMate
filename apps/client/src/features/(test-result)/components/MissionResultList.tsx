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
import { Badge } from '@/shared/components/ui/badge';
import { generateNicknameFromId } from '@/shared/utils/nickname';
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
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="p-6 pb-2">
        <h3 className="text-lg font-bold text-gray-800">로그 목록</h3>
      </div>
      <div className="p-6 pt-0">
        <Table className="w-full text-left">
          <TableCaption className="sr-only">미션 로그 목록</TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>참여자</TableHead>
              <TableHead className="text-center">결과</TableHead>
              <TableHead>피드백</TableHead>
              <TableHead className="text-right">소요시간</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!missionLogs.missionResults || missionLogs.missionResults.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  해당 미션에 대한 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              missionLogs.missionResults.map((missionResult) => (
                <TableRow
                  key={missionResult.id}
                  onClick={() => handleRowClick(missionResult.id)}
                  className="cursor-pointer transition-colors hover:bg-gray-50/50"
                >
                  <TableCell className="font-medium">
                    {generateNicknameFromId(missionResult.participantId)}
                  </TableCell>

                  <TableCell className="text-center">
                    {missionResult.status === 'SUCCESS' ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 shadow-none">
                        성공
                      </Badge>
                    ) : missionResult.status === 'FAILED' ? (
                      <Badge variant="destructive" className="shadow-none">
                        실패
                      </Badge>
                    ) : missionResult.status === 'PENDING' ? (
                      <Badge variant="secondary" className="text-gray-500 bg-gray-100 hover:bg-gray-200 shadow-none">
                        진행중
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-400 border-gray-200">
                        -
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate text-sm text-muted-foreground" title={missionResult.feedback || ''}>
                      {missionResult.feedback || (
                        <span className="text-gray-300 italic">피드백 없음</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {missionResult.duration != null
                      ? formatTimestamp(missionResult.duration)
                      : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
