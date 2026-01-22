'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

import { getTestParticipantsResults } from '../apis/client';
import { ParticipantResultRow } from './ParticipantResultRow';

export function TestParticipantsResults({ testId }: { testId: string }) {
  const { data: participants } = useSuspenseQuery({
    queryKey: ['testParticipantsResults', testId],
    queryFn: () => getTestParticipantsResults(testId),
  });

  const totalParticipants = participants.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>총 {totalParticipants}명이 테스트에 참여했어요</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption className="sr-only">참여자별 미션 결과 목록</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">
                참여자 목록
              </TableHead>
              <TableHead className="w-[150px]">
                참여자 페르소나
              </TableHead>
              <TableHead className="text-center">
                미션 결과 목록
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant) => (
              <ParticipantResultRow
                key={participant.participantId}
                testId={testId}
                participant={participant}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
