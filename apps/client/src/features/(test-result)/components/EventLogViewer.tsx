import { useMemo } from 'react';
import type { eventWithTime } from '@rrweb/types';
import { EventType, IncrementalSource } from '@rrweb/types';

interface EventLogViewerProps {
  logs: eventWithTime[];
  onLogClick?: (timestamp: number) => void;
}

export function EventLogViewer({ logs, onLogClick }: EventLogViewerProps) {
  // 클릭, 스크롤 등 주요 인터랙션 이벤트만 필터링하고 연속된 스크롤은 그룹화 (방향 구분)
  const groupedLogs = useMemo(() => {
    const result: {
      log: eventWithTime;
      count: number;
      endTime?: number;
      scrollDirection?: 'Up' | 'Down';
      lastScrollY?: number;
    }[] = [];
    let lastEntry: (typeof result)[0] | null = null;

    logs.forEach((log) => {
      if (log.type !== EventType.IncrementalSnapshot) return;

      const source = log.data.source;
      const isInteraction =
        source === IncrementalSource.MouseInteraction ||
        source === IncrementalSource.Scroll ||
        source === IncrementalSource.TouchMove ||
        source === IncrementalSource.Input;

      if (!isInteraction) return;

      // 스크롤 이벤트 처리
      if (source === IncrementalSource.Scroll) {
        const currentY = (log.data as any).y || 0; // rrweb 타입 정의에 따라 다를 수 있음

        // 이전 로그가 스크롤이고, 방향이 같다면 합침
        if (
          lastEntry &&
          lastEntry.log.type === EventType.IncrementalSnapshot &&
          lastEntry.log.data.source === IncrementalSource.Scroll
        ) {
          const prevY = lastEntry.lastScrollY ?? (lastEntry.log.data as any).y ?? 0;
          const direction = currentY > prevY ? 'Down' : currentY < prevY ? 'Up' : undefined;

          // 방향이 없거나(제자리), 이전 방향과 같다면 합침
          // 또는 이전 방향이 아직 정해지지 않았다면(첫 이벤트 후 두번째), 현재 방향으로 설정하고 합침
          if (!direction || direction === lastEntry.scrollDirection || !lastEntry.scrollDirection) {
            lastEntry.count++;
            lastEntry.endTime = log.timestamp;
            lastEntry.lastScrollY = currentY;
            if (direction) lastEntry.scrollDirection = direction; // 방향 확정
            return;
          }
        }

        // 새로운 스크롤 그룹 시작
        const newEntry = {
          log,
          count: 1,
          endTime: log.timestamp,
          scrollDirection: undefined, // 첫 이벤트로는 방향 모름 (다음 이벤트와 비교해야 함)
          lastScrollY: currentY,
        };
        result.push(newEntry);
        lastEntry = newEntry;
      } else {
        // 스크롤 외 다른 이벤트
        const newEntry = { log, count: 1, endTime: log.timestamp };
        result.push(newEntry);
        lastEntry = newEntry;
      }
    });

    return result;
  }, [logs]);

  // 전체 로그 중 가장 빠른 시간을 기준 시간으로 설정
  const startTime = logs.length > 0 ? logs[0].timestamp : 0;

  const formatRelativeTime = (timestamp: number) => {
    const diff = timestamp - startTime;
    const totalSeconds = Math.floor(diff / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 space-y-2 h-96 overflow-y-auto border rounded-md w-full">
      <div className="text-sm text-gray-600 mb-2">
        총 {groupedLogs.length}개의 인터랙션 그룹 (원본 {logs.length}개)
      </div>
      {groupedLogs.map((entry, index) => (
        <div
          key={`${entry.log.timestamp}-${index}`}
          className="p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => onLogClick?.(entry.log.timestamp - startTime)}
        >
          <div className="font-medium">
            {getEventLabel(entry.log)}
            {entry.scrollDirection && (
              <span className="text-gray-600 ml-1">({entry.scrollDirection})</span>
            )}
            {entry.count > 1 && <span className="text-blue-600 ml-2">({entry.count}회 연속)</span>}
          </div>
          <div className="text-xs text-gray-500 flex gap-2">
            <span>{formatRelativeTime(entry.log.timestamp)}</span>
            <span className="text-gray-300">|</span>
            <span>
              {new Date(entry.log.timestamp).toLocaleTimeString()}
              {entry.count > 1 && entry.endTime && (
                <span> ~ {new Date(entry.endTime).toLocaleTimeString()}</span>
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

const getEventLabel = (log: eventWithTime) => {
  if (log.type === EventType.IncrementalSnapshot) {
    switch (log.data.source) {
      case IncrementalSource.MouseInteraction:
        return `클릭`;
      case IncrementalSource.Scroll:
        return `스크롤`;
      case IncrementalSource.TouchMove:
        return `터치`;
      case IncrementalSource.Input:
        return `입력`;
      default:
        return `기타(${log.data.source})`;
    }
  }
  return `이벤트 타입(${log.type})`;
};
