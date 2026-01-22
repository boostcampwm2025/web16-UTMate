'use client';

import { useState, useRef, useCallback } from 'react';
import type rrwebPlayer from 'rrweb-player';
import type { eventWithTime } from '@rrweb/types';

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { EventLogPlayer } from '@/features/(test-result)/components/EventLogPlayer';
import { EventLogViewer } from '@/features/(test-result)/components/EventLogViewer';

interface EventLogContainerProps {
  eventLogs: eventWithTime[];
}

export function EventLogContainer({ eventLogs }: EventLogContainerProps) {
  const [replayer, setReplayer] = useState<rrwebPlayer | null>(null);
  const pendingGoto = useRef<number | null>(null);

  const handlePlayerReady = useCallback((player: rrwebPlayer) => {
    setReplayer(player);
    // 플레이어가 준비되었을 때 대기 중인 이동 명령 수행
    if (pendingGoto.current !== null) {
      player.goto(pendingGoto.current);
      pendingGoto.current = null;
    }
  }, []);

  const handleLogClick = useCallback(
    (relativeMs: number) => {
      if (replayer) {
        replayer.goto(relativeMs);
      } else {
        pendingGoto.current = relativeMs;
      }
    },
    [replayer],
  );

  return (
    <main className="grid h-full min-h-0 grid-cols-3 gap-6 p-6">
      <section className="col-span-2 h-full">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>리플레이</CardTitle>
          </CardHeader>
          <CardContent>
            <EventLogPlayer logs={eventLogs} onPlayerReady={handlePlayerReady} />
          </CardContent>
        </Card>
      </section>
      <section className="col-span-1 h-full">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>로그</CardTitle>
          </CardHeader>
          <CardContent>
            <EventLogViewer logs={eventLogs} onLogClick={handleLogClick} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}