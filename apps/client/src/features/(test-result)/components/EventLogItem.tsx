'use client';

import { formatRelativeTime } from '@/features/(test-result)/utils/format';
import type { GroupedInteractionLog } from '@/features/(test-result)/utils/log';
import { getEventLabel } from '@/features/(test-result)/utils/log';

interface EventLogItemProps extends GroupedInteractionLog {
  startTime: number;
  onLogClick: (relativeMs: number) => void;
}

export function EventLogItem({ log, count, endTime, scrollDirection, startTime, onLogClick, targetInfo }: EventLogItemProps) {
  const relativeMs = log.timestamp - startTime;

  const handleLogClick = () => {
    onLogClick(relativeMs);
  };

  return (
    <button
      type="button"
      className="w-full cursor-pointer rounded border border-gray-200 bg-gray-50 p-2 text-left transition-colors hover:bg-gray-100"
      onClick={handleLogClick}
    >
      <div className="font-medium">
        {getEventLabel(log)}
        {scrollDirection && <span className="ml-1 text-gray-600">({scrollDirection})</span>}
        {count > 1 && <span className="ml-2 text-blue-600">({count}회 연속)</span>}
      </div>
      {targetInfo && (
        <div className="mt-1 text-xs text-gray-600">
          {targetInfo}
        </div>
      )}
      <div className="flex gap-2 text-xs text-gray-500">
        <span>{formatRelativeTime(log.timestamp, startTime)}</span>
        <span className="text-gray-300">|</span>
        <span>
          {new Date(log.timestamp).toLocaleTimeString()}
          {count > 1 && endTime && <span> ~ {new Date(endTime).toLocaleTimeString()}</span>}
        </span>
      </div>
    </button>
  );
}

