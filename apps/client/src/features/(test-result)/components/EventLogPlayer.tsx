'use client';

import { useEffect, useRef } from 'react';
import type { eventWithTime } from '@rrweb/types';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';

interface EventLogPlayerProps {
  logs: eventWithTime[];
  onPlayerReady?: (player: rrwebPlayer) => void;
}

export function EventLogPlayer({ logs, onPlayerReady }: EventLogPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<rrwebPlayer | null>(null);
  const prevLogsRef = useRef<eventWithTime[] | null>(null);

  useEffect(() => {
    if (!playerRef.current || logs.length < 2) return;

    // logs가 완전히 달라질 때만 새로 생성
    const isSameLogs =
      prevLogsRef.current &&
      prevLogsRef.current.length === logs.length &&
      prevLogsRef.current.every((e, i) => e === logs[i]);

    if (instanceRef.current && isSameLogs) {
      // 이미 같은 로그로 생성된 인스턴스가 있으면 재사용
      if (onPlayerReady) onPlayerReady(instanceRef.current);
      return;
    }

    // 새로 생성
    playerRef.current.innerHTML = '';
    const player = new rrwebPlayer({
      target: playerRef.current,
      props: {
        events: logs,
        width: 800,
        height: 600,
      },
    });
    instanceRef.current = player;
    prevLogsRef.current = logs;
    if (onPlayerReady) onPlayerReady(player);
  }, [logs, onPlayerReady]);

  return <div ref={playerRef}></div>;
}
