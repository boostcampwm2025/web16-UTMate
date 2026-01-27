'use client';

import { useEffect, useRef, useState } from 'react';
import type { eventWithTime } from '@rrweb/types';
import rrwebPlayer from 'rrweb-player';
import '@/styles/rrweb-player-custom.css';

interface EventLogPlayerProps {
  logs: eventWithTime[];
  onPlayerReady?: (player: rrwebPlayer) => void;
}

export function EventLogPlayer({ logs, onPlayerReady }: EventLogPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<rrwebPlayer | null>(null);
  const prevLogsRef = useRef<eventWithTime[] | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // 컨테이너 크기 감지하여 플레이어 크기 조절
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        // 16:9 비율 유지하면서 부모 너비에 맞춤
        const height = (width * 9) / 16;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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
        width: dimensions.width,
        height: dimensions.height,
      },
    });
    instanceRef.current = player;
    prevLogsRef.current = logs;
    if (onPlayerReady) onPlayerReady(player);
  }, [logs, onPlayerReady, dimensions]);

  return (
    <div ref={containerRef} className="w-full">
      <div ref={playerRef}></div>
    </div>
  );
}
