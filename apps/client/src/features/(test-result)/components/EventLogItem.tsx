'use client';

import { MousePointerClick, ScrollText, Keyboard, Monitor, MoreHorizontal } from 'lucide-react';

import { formatRelativeTime } from '@/features/(test-result)/utils/format';
import type { GroupedInteractionLog } from '@/features/(test-result)/utils/log';
import { getEventLabel } from '@/features/(test-result)/utils/log';
import { Button } from '@/shared/components/ui/button';

interface EventLogItemProps extends GroupedInteractionLog {
  startTime: number;
  onLogClick: (relativeMs: number) => void;
}

function getEventIcon(log: GroupedInteractionLog['log']) {
  // rrweb event types: 0: DomContentLoaded, 1: Load, 2: FullSnapshot, 3: IncrementalSnapshot
  if (log.type === 2) return <Monitor className="h-4 w-4" />;

  // IncrementalSnapshot
  if (log.type === 3) {
    const source = log.data?.source;
    // 0: Mutation, 1: MouseMove, 2: MouseInteraction, 3: Scroll, 4: ViewportResize, 5: Input
    if (source === 2) return <MousePointerClick className="h-4 w-4" />;
    if (source === 3) return <ScrollText className="h-4 w-4" />;
    if (source === 5) return <Keyboard className="h-4 w-4" />;
  }

  return <MoreHorizontal className="h-4 w-4" />;
}

export function EventLogItem({
  log,
  count,
  // endTime,
  scrollDirection,
  startTime,
  onLogClick,
  targetInfo,
}: EventLogItemProps) {
  const relativeMs = log.timestamp - startTime;

  const handleLogClick = () => {
    onLogClick(relativeMs);
  };

  const Icon = getEventIcon(log);

  return (
    <Button
      variant="outline"
      className="flex h-auto w-full cursor-pointer flex-col items-stretch justify-start gap-2 py-3 whitespace-normal"
      onClick={handleLogClick}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            {Icon}
          </div>
          <span className="font-semibold text-slate-900">
            {getEventLabel(log)}
            {scrollDirection && (
              <span className="ml-1 font-normal text-slate-500">({scrollDirection})</span>
            )}
          </span>
        </div>
        <span className="text-xs font-medium text-slate-400 tabular-nums">
          {formatRelativeTime(log.timestamp, startTime)}
        </span>
      </div>
      {targetInfo && (
        <div className="ml-10 flex items-center gap-2 text-sm text-slate-500">
          <span className="line-clamp-1">{targetInfo}</span>
        </div>
      )}
    </Button>
  );
}
