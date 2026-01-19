'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/shared/utils';

import { getTestParticipantsResults } from '../apis';
import type { ParticipantMissionStatus } from '../types';
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
        <CardTitle>{totalParticipants}명이 테스트에 참여했어요</CardTitle>
      </CardHeader>
      <CardContent>
      {/* Header */}
      <div className="mb-8 grid grid-cols-[150px_150px_1fr] gap-4 border-b pb-4">
        <div className="text-base font-bold text-gray-800">참여자 목록</div>
        <div className="text-base font-bold text-gray-800">참여자 페르소나</div>
        <div className="text-center text-base font-bold text-gray-800">미션 결과 목록</div>
      </div>

      {/* Rows */}
      <div className="space-y-6">
        {participants.map((participant) => (
          <ParticipantResultRow
            key={participant.participantId}
            testId={testId}
            participant={participant}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-16 flex justify-center gap-6 border-t pt-8">
        {(['SUCCESS', 'FAILURE', 'DROPPED', 'IN_PROGRESS'] as const).map(
          (status) => (
            <div key={status} className="flex items-center gap-2">
              <div
                className={cn('h-4 w-4 rounded border', getStatusStyles(status))}
              />
              <span className="text-xs font-medium text-gray-600">
                {getStatusText(status)}
              </span>
            </div>
          )
        )}
      </div>
      </CardContent>
    </Card>
  );
}

const getStatusText = (status: ParticipantMissionStatus) => {
    switch (status) {
      case 'SUCCESS':
        return '성공';
      case 'FAILURE':
        return '실패';
      case 'DROPPED':
        return '이탈';
      case 'IN_PROGRESS':
        return '진행중';
    }
  };

  const getStatusStyles = (status: ParticipantMissionStatus) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-[#C1E9C6] border-[#2D5A27]';
      case 'FAILURE':
        return 'bg-[#F9C1C1] border-[#A82B2B]';
      case 'DROPPED':
        return 'bg-[#8E949E] border-[#374151]';
      case 'IN_PROGRESS':
        return 'bg-white border-black';
    }
  };
