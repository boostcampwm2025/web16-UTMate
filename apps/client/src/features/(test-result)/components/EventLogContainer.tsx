'use client';

import { useRef, useLayoutEffect } from 'react';
//더 커스텀하려면 rrweb-player 패키지가 아니라 @rrweb/player를 사용해야 함(기본 UI가 제공되지 않고, 인터페이스도 다름)
import rrwebPlayer from 'rrweb-player';
import { useEventListener } from 'usehooks-ts';
import type { eventWithTime } from '@rrweb/types';

import { EventLogViewer } from '@/features/(test-result)/components/EventLogViewer';

import type { AnalyzerResult } from '../types';

import './EventLogPlayer.css';

interface EventLogContainerProps {
  eventLogs: eventWithTime[];
  analysisData?: AnalyzerResult;
}

export function EventLogContainer({ eventLogs, analysisData }: EventLogContainerProps) {
  const playerRootRef = useRef<HTMLDivElement>(null);
  const replayer = useRef<rrwebPlayer | null>(null);

  useLayoutEffect(() => {
    if (!playerRootRef.current) return;

    playerRootRef.current.innerHTML = '';

    const player = new rrwebPlayer({
      target: playerRootRef.current,
      props: {
        events: eventLogs,
        width: playerRootRef.current.offsetWidth,
        height: playerRootRef.current.offsetHeight - 80,
        autoPlay: false,
      },
    });
    replayer.current = player;

    return () => {
      replayer.current = null;
      if (playerRootRef.current) {
        playerRootRef.current.innerHTML = '';
      }
    };
  }, [eventLogs]);

  const handleLogClick = (ms: number) => {
    if (!replayer.current) return;
    replayer.current.goto(ms, true);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!replayer.current) return;

    switch (event.code) {
      case 'Space':
        event.preventDefault();
        replayer.current.toggle();
        break;
    }
  };

  useEventListener('keydown', handleKeyDown);

  return (
    <div className="flex h-full w-full flex-col p-6">
      <div className="grid h-full min-h-0 grid-cols-3 gap-6">
        {/* Left Column: Player */}
        <div className="col-span-2 flex min-h-0 flex-col">
          <h2 className="mb-4 text-lg font-bold text-gray-800">리플레이</h2>
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border">
            <div className="h-full w-full" ref={playerRootRef} />
          </div>
        </div>

        {/* Right Column: Event Logs */}
        <div className="col-span-1 flex min-h-0 flex-col">
          <h2 className="mb-4 text-lg font-bold text-gray-800">이벤트 로그</h2>
          <div className="bg-card min-h-0 flex-1 rounded-xl border">
            <EventLogViewer
              logs={eventLogs}
              analysisData={analysisData}
              onLogClick={handleLogClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
