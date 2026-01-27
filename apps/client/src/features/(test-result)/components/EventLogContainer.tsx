'use client';

import { useRef, useEffect, useLayoutEffect } from 'react';
import rrwebPlayer from 'rrweb-player';
import type { eventWithTime } from '@rrweb/types';

import { EventLogViewer } from '@/features/(test-result)/components/EventLogViewer';
import { useEventListener } from '@/shared/hooks/useEventListener';
import './EventLogPlayer.css';

interface EventLogContainerProps {
  eventLogs: eventWithTime[];
}

export function EventLogContainer({ eventLogs }: EventLogContainerProps) {
  const playerRootRef = useRef<HTMLDivElement>(null);
  const replayer = useRef<rrwebPlayer | null>(null);
  const playerContainerRef = useRef<{ width: number; height: number }>(null);

  useLayoutEffect(() => {
    if (!playerRootRef.current) return;
    playerContainerRef.current = {
      width: playerRootRef.current.offsetWidth,
      height: playerRootRef.current.offsetHeight - 100,
    };
  }, [eventLogs]);

  useEffect(() => {
    if (!playerRootRef.current) return;

    const player = new rrwebPlayer({
      target: playerRootRef.current,
      props: {
        events: eventLogs,
        width: playerContainerRef.current?.width,
        height: playerContainerRef.current?.height,
        autoPlay: false,
      },
    });
    replayer.current = player;

    return () => {
      // Clean up the player instance
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const playerInstance = replayer.current as any;
      if (playerInstance) {
        if (typeof playerInstance.$destroy === 'function') {
          playerInstance.$destroy();
        } else if (typeof playerInstance.destroy === 'function') {
          playerInstance.destroy();
        }
      }
      replayer.current = null;
      if (playerRootRef.current) {
        playerRootRef.current.innerHTML = '';
      }
    };
  }, [eventLogs]);

  const handleLogClick = (ms: number) => {
    if (!replayer.current) return;
    console.log(replayer.current);
    replayer.current.goto(ms, true);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!replayer.current) return;

    switch (event.code) {
      case 'Space':
        event.preventDefault();
        console.log(replayer.current);
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
            <EventLogViewer logs={eventLogs} onLogClick={handleLogClick} />
          </div>
        </div>
      </div>
    </div>
  );
}
