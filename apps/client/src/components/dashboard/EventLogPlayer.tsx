import { useEffect, useRef } from 'react';
import type { eventWithTime } from '@rrweb/types';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';

export function EventLogPlayer({ logs }: { logs: eventWithTime[] }) {
  const player = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // rrwebPlayer는 최소 2개 이상의 이벤트가 필요합니다.
    if (player.current && logs.length > 1) {
      new rrwebPlayer({
        target: player.current,
        props: {
          events: logs,
        },
      });
    }
  }, [logs]);

  return <div ref={player}></div>;
}
