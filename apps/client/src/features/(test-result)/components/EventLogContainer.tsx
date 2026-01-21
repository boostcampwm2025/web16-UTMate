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
  
    const handleLogClick = useCallback((relativeMs: number) => {
      if (replayer) {
        replayer.goto(relativeMs);
      } else {
        pendingGoto.current = relativeMs;
      }
    }, [replayer]);
  
    return (
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <section>
            <Card>
              <CardHeader><CardTitle>세션 리플레이</CardTitle></CardHeader>
              <CardContent>
                <EventLogPlayer logs={eventLogs} onPlayerReady={handlePlayerReady} />
              </CardContent>
            </Card>
          </section>
          <section>
            <Card>
              <CardHeader><CardTitle>사용 이력 타임라인</CardTitle></CardHeader>
              <CardContent>
                <EventLogViewer logs={eventLogs} onLogClick={handleLogClick} />
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    );
  }