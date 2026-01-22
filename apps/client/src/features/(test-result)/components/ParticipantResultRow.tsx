import Link from 'next/link';

import type { ParticipantResult } from '../types';
import { TableCell, TableRow } from '@/shared/components/ui/table';
import { MissionResultItem } from './MissionResultItem';

interface ParticipantResultRowProps {
  testId: string;
  participant: ParticipantResult;
}

export function ParticipantResultRow({ testId, participant }: ParticipantResultRowProps) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell className="w-[150px]">
        {participant.participantId}
      </TableCell>
      <TableCell className="w-[150px] italic">
        {participant.persona}
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap justify-start gap-3 pl-8">
        {participant.missionResults.map((result) => (
          <Link
            key={result.missionId}
            href={`/tests/${testId}/result/mission-result/${result.missionId}`}
          >
            <MissionResultItem
              order={result.missionOrder}
              status={result.status}
            />
          </Link>
        ))}
        </div>
      </TableCell>
    </TableRow>
  );
}
