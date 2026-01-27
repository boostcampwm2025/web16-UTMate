'use client';

import { useState, useRef, useCallback } from 'react';
import type rrwebPlayer from 'rrweb-player';
import type { eventWithTime } from '@rrweb/types';

import { EventLogPlayer } from '@/features/(test-result)/components/EventLogPlayer';
import { EventLogViewer } from '@/features/(test-result)/components/EventLogViewer';
import { useEventListener } from '@/shared/hooks/useEventListener';

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

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!replayer) return;

      switch (event.code) {
        // 스페이스바 일시정지 또는 재생
        case 'Space':
          event.preventDefault();
          replayer.toggle();
          break;
        // 왼쪽 화살표 5초 이전으로 이동
        case 'ArrowLeft': {
          event.preventDefault();
          const currentTime = replayer.getCurrentTime();

          if (currentTime < 5000) {
            replayer.goto(0);
          } else {
            replayer.goto(currentTime - 5000);
          }
          break;
        }
        // 오른쪽 화살표 5초 이후로 이동
        case 'ArrowRight': {
          event.preventDefault();
          const currentTime = replayer.getCurrentTime();
          const meta = replayer.getMetaData();
          const totalTime = meta.totalTime;

          if (currentTime + 5000 > totalTime) {
            replayer.goto(totalTime);
          } else {
            replayer.goto(currentTime + 5000);
          }
          break;
        }
      }
    },
    [replayer],
  );

  useEventListener('keydown', handleKeyDown);

  return (
    <main className="grid h-full min-h-0 grid-cols-3 gap-6 p-6">
      <section className="col-span-2 flex h-full flex-col space-y-2">
        <h3 className="text-lg font-semibold">리플레이</h3>
        <div className="min-h-0 flex-1">
          <EventLogPlayer logs={eventLogs} onPlayerReady={handlePlayerReady} />
        </div>
      </section>
      <section className="col-span-1 flex h-full flex-col space-y-2">
        <h3 className="text-lg font-semibold">로그</h3>
        <div className="min-h-0 flex-1">
          <EventLogViewer logs={eventLogs} onLogClick={handleLogClick} />
        </div>
      </section>
    </main>
  );
}
