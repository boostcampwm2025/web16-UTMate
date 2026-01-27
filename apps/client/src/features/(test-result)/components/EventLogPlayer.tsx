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
  const currentTimeRef = useRef<number>(0); // 현재 재생 위치 저장

  // 컨테이너 크기 감지하여 플레이어 크기 조절
  useEffect(() => {
    if (!containerRef.current) return;

    let timeoutId: NodeJS.Timeout;

    const resizeObserver = new ResizeObserver((entries) => {
      // debounce: 300ms 동안 추가 resize 없으면 실행
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        for (const entry of entries) {
          const { width } = entry.contentRect;
          // 16:9 비율 유지하면서 부모 너비에 맞춤
          const height = (width * 9) / 16;
          setDimensions({ width, height });
        }
      }, 300);
    });

    resizeObserver.observe(containerRef.current);

    // 초기 크기 설정
    const initialWidth = containerRef.current.clientWidth;
    if (initialWidth > 0) {
      const initialHeight = (initialWidth * 9) / 16;
      setDimensions({ width: initialWidth, height: initialHeight });
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!playerRef.current || logs.length < 2) return;

    // 기존 player가 있으면 현재 재생 위치 저장
    if (instanceRef.current) {
      try {
        // rrweb-player 내부의 Replayer 인스턴스에서 현재 시간 가져오기
        const replayer = instanceRef.current.getReplayer();
        const currentTime = (replayer as any)?.timer?.timeOffset || 0;
        currentTimeRef.current = currentTime;
      } catch (error) {
        console.warn('[EventLogPlayer] Failed to save current time:', error);
      }
    }

    // dimensions가 변경되면 무조건 재생성 (크기 변경 반영)
    playerRef.current.innerHTML = '';
    const player = new rrwebPlayer({
      target: playerRef.current,
      props: {
        events: logs,
        width: dimensions.width,
        height: dimensions.height,
      },
    });

    // 새로 생성된 player에 이전 재생 위치 복원
    if (currentTimeRef.current > 0) {
      setTimeout(() => {
        try {
          player.goto(currentTimeRef.current);
        } catch (error) {
          console.warn('[EventLogPlayer] Failed to restore time:', error);
        }
      }, 100); // player 초기화 대기
    }

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
