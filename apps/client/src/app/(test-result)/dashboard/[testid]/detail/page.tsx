'use client';

import { notFound, useParams, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import type rrwebPlayer from 'rrweb-player';

import { getMissionResult, getMissionResultLogs } from '@/features/(test-result)/apis';
import { EventLogViewer } from '@/features/(test-result)/components/EventLogViewer';
import { EventLogPlayer } from '@/features/(test-result)/components/EventLogPlayer';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

export default function TestDashboardPage() {
  const { testid } = useParams();

  const searchParams = useSearchParams();

  const missionResultId = searchParams.get('missionResultId');

  // TODO: 현재는 테스트ID가 1인 경우만 허용하고
  // 해당 데이터를 하드코딩해서 보여주고 있습니다. 나중에 API로 대체해야 합니다.
  if (testid !== '1' || !missionResultId) {
    notFound();
  }

  const { data: missionResult } = useQuery({
    queryKey: ['missionResult', missionResultId],
    queryFn: () => getMissionResult(testid, missionResultId),
  });

  const { data: missionResultLogs } = useQuery({
    queryKey: ['missionResultLogs', missionResultId],
    queryFn: () => getMissionResultLogs(missionResult?.logUrl),
    enabled: !!missionResult?.logUrl,
  });

  const [replayer, setReplayer] = useState<rrwebPlayer | null>(null);
  const pendingGoto = useRef<number | null>(null);

  return (
    <div className="flex flex-col gap-2 divide-y divide-gray-200">
      <div className="p-4 flex flex-row gap-2 items-center">
        <Link href={`/dashboard/${testid}`}>
          <Button variant="outline">
            <ArrowLeftIcon className="w-4 h-4" />
          </Button>
        </Link>
        <h2 className="text-xl font-semibold">사용성 테스트 {testid}</h2>
      </div>
      <div className="p-4">
        <div className="flex gap-4 justify-between">
          <EventLogViewer
            logs={missionResultLogs ?? []}
            onLogClick={(relativeMs) => {
              if (replayer) {
                replayer.goto(relativeMs);
              } else {
                pendingGoto.current = relativeMs;
              }
            }}
          />
          <EventLogPlayer
            logs={missionResultLogs ?? []}
            onPlayerReady={(player) => {
              setReplayer((prev) => {
                if (prev === player) return prev;
                return player;
              });
              if (pendingGoto.current !== null) {
                player.goto(pendingGoto.current);
                pendingGoto.current = null;
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
