'use client';

import Link from 'next/link';

import { useSuspenseQuery } from '@tanstack/react-query';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card';
import { generateNicknameFromId } from '@/shared/utils/nickname';
import { AnimalAvatar } from '@/shared/components/AnimalAvatar';

import { formatDistanceToNow } from '../utils/dates';
import { getTestParticipantsResults } from '../apis/client';
import type { ParticipantResult } from '../types';
import { PersonaTag } from './PersonaTag';

export function TestParticipantsResults({ testId }: { testId: string }) {
  const { data: participants } = useSuspenseQuery({
    queryKey: ['testParticipantsResults', testId],
    queryFn: () => getTestParticipantsResults(testId),
  });

  return (
    <div>
      <h2 className="mb-4 ml-2 text-xl font-semibold">참여자 목록</h2>
      <div className="flex flex-col gap-4">
        {participants.map((participant) => (
          <ParticipantItem
            key={participant.participantId}
            testId={testId}
            participant={participant}
          />
        ))}
      </div>
    </div>
  );
}

function ParticipantItem({
  testId,
  participant,
}: {
  testId: string;
  participant: ParticipantResult;
}) {
  const successCount = participant.missionResults.filter((r) => r.status === 'SUCCESS').length;
  const failCount = participant.missionResults.filter((r) => r.status === 'FAILED').length;
  const pendingCount = participant.missionResults.filter((r) => r.status === 'PENDING').length;

  const nickname = generateNicknameFromId(participant.participantId);
  const animalName = nickname.split(' ')[1];

  return (
    <Link href={`/tests/${testId}/result/participants/${participant.participantId}`} aria-label={`${nickname} 참여자 상세 결과 보기`}>
      <Card className="hover:bg-accent/50 flex cursor-pointer flex-col transition-all md:flex-row">
        <CardHeader className="flex-1">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <AnimalAvatar name={animalName} />
            {nickname}
            <PersonaTag tags={participant.personaTags} />
          </CardTitle>
          <CardDescription className="mt-1">
            <p className="tex-xs text-muted-foreground mt-1">
              {formatDistanceToNow(participant.joinedAt)}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="my-auto">
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center gap-1">
              <div className="text-muted-foreground text-xs">성공</div>
              <div className="font-semibold text-green-600">{successCount}</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-muted-foreground text-xs">실패</div>
              <div className="font-semibold text-red-600">{failCount}</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-muted-foreground text-xs">이탈</div>
              <div className="font-semibold text-gray-500">{pendingCount}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
