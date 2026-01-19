import Link from 'next/link';

import type { ParticipantResult } from '../types';
import { MissionResultItem } from './MissionResultItem';

interface ParticipantResultRowProps {
  testId: string;
  participant: ParticipantResult;
}

export function ParticipantResultRow({ testId, participant }: ParticipantResultRowProps) {
  return (
    <div className="grid grid-cols-[150px_150px_1fr] items-center gap-4 py-2">
      <div className="text-sm font-medium text-gray-700">{participant.participantId}</div>
      <div className="text-sm font-medium text-gray-700 italic">{participant.persona}</div>
      <div className="flex flex-wrap justify-start gap-3 pl-8">
        {participant.missionResults.map((result) => (
          <Link href={`/tests/${testId}/result/mission-result/${result.missionId}`}>
            <MissionResultItem
              key={result.missionId}
              order={result.missionOrder}
              status={result.status}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
