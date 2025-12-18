import { useMemo } from 'react';
import type { eventWithTime } from '@rrweb/types';
import { EventType, IncrementalSource } from '@rrweb/types';

export function EventLogViewer({ logs }: { logs: eventWithTime[] }) {
  // 클릭, 스크롤 등 주요 인터랙션 이벤트만 필터링
  const filteredLogs = useMemo(
    () =>
      logs.filter((log) => {
        if (log.type === EventType.IncrementalSnapshot) {
          const source = log.data.source;
          return (
            source === IncrementalSource.MouseInteraction ||
            source === IncrementalSource.Scroll ||
            source === IncrementalSource.TouchMove ||
            source === IncrementalSource.Input
          );
        }
        return false;
      }),
    [logs],
  );

  return (
    <div className="p-4 space-y-2">
      <div className="text-sm text-gray-600 mb-2">총 {filteredLogs.length}개의 인터랙션 이벤트</div>
      {filteredLogs.map((log, index) => (
        <div
          key={`${log.timestamp}-${index}`}
          className="p-2 bg-gray-50 rounded border border-gray-200"
        >
          <div className="font-medium">{getEventLabel(log)}</div>
          <div className="text-xs text-gray-500">
            시간: {new Date(log.timestamp).toLocaleTimeString()}
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
