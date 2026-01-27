'use client';

import { useMemo } from 'react';
import type { eventWithTime } from '@rrweb/types';

import { EventLogItem } from '@/features/(test-result)/components/EventLogItem';
import { groupLogsByType } from '@/features/(test-result)/utils/log';

interface EventLogViewerProps {
  logs: eventWithTime[];
  onLogClick: (timestamp: number) => void;
}

export function EventLogViewer({ logs, onLogClick }: EventLogViewerProps) {
  const groupedLogs = useMemo(() => groupLogsByType(logs), [logs]);

  // 전체 로그 중 가장 빠른 시간을 기준 시간으로 설정 (logs[0]이 항상 가장 빠르다는 보장이 없을 수 있어 min 사용)
  const startTime = useMemo(() => {
    if (logs.length === 0) return 0;
    return logs.reduce(
      (min, log) => (log.timestamp < min ? log.timestamp : min),
      logs[0].timestamp,
    );
  }, [logs]);

  return (
    <div className="h-full w-full space-y-2 p-4">
      <div className="text-muted-foreground text-sm">
        이벤트를 클릭하면 해당 타임스탬프로 이동합니다
      </div>
      <ol className="h-full w-full space-y-2 overflow-y-auto">
        {groupedLogs.map((entry, index) => (
          <li key={`${entry.log.timestamp}-${index}`}>
            <EventLogItem
              log={entry.log}
              count={entry.count}
              endTime={entry.endTime}
              scrollDirection={entry.scrollDirection}
              targetInfo={entry.targetInfo}
              startTime={startTime}
              onLogClick={onLogClick}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
