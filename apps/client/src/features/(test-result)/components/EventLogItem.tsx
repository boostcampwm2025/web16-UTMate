import {
  MousePointerClick,
  ScrollText,
  Keyboard,
  Monitor,
  MoreHorizontal,
  Activity,
  LucideIcon,
  Angry,
  Hourglass,
} from 'lucide-react';

import { formatRelativeTime } from '@/features/(test-result)/utils/format';
import type { EventLogDisplayItem } from '@/features/(test-result)/utils/log';
import { getEventLabel } from '@/features/(test-result)/utils/log';
import { cn } from '@/shared/utils';
import { Button } from '@/shared/components/ui/button';

interface EventLogItemProps {
  item: EventLogDisplayItem;
  startTime: number;
  onLogClick: (relativeMs: number) => void;
}

const EVENT_ICONS: Record<string, LucideIcon> = {
  rageClick: Angry,
  mouseThrashing: Activity,
  idle: Hourglass,
  // rrweb sources
  click: MousePointerClick,
  scroll: ScrollText,
  keyboard: Keyboard,
  monitor: Monitor,
  default: MoreHorizontal,
};

function getIconKey(item: EventLogDisplayItem): string {
  if (item.type !== 'rrweb') {
    return item.type;
  }

  const { log } = item.data;
  // FullSnapshot
  if (log.type === 2) return 'monitor';

  // IncrementalSnapshot
  if (log.type === 3) {
    const source = log.data?.source;
    if (source === 2) return 'click'; // MouseInteraction
    if (source === 3) return 'scroll'; // Scroll
    if (source === 5) return 'keyboard'; // Input
  }

  return 'default';
}

export function EventLogItem({ item, startTime, onLogClick }: EventLogItemProps) {
  const relativeMs = item.timestamp - startTime;

  const handleLogClick = () => {
    onLogClick(relativeMs);
  };

  const iconKey = getIconKey(item);
  const IconComponent = EVENT_ICONS[iconKey] || EVENT_ICONS.default;

  // 라벨 및 부가 정보
  let label = '';
  let subLabel = '';
  let detailInfo: string | undefined;
  let iconColorClass = 'text-slate-500'; // 기본 아이콘 색상

  if (item.type === 'rrweb') {
    const logData = item.data;
    label = getEventLabel(logData.log);
    if (logData.scrollDirection) {
      subLabel = `(${logData.scrollDirection})`;
    }
    detailInfo = logData.targetInfo;
  } else {
    // 분석 데이터 라벨링 및 색상 처리
    if (item.type === 'rageClick') {
      label = '레이지 클릭';
      iconColorClass = 'text-red-500';
      detailInfo = '짧은 시간 동안 다수의 클릭 발생';
    } else if (item.type === 'mouseThrashing') {
      label = '마우스 흔들기';
      iconColorClass = 'text-orange-500';
      detailInfo = '불규칙한 마우스 움직임 감지';
    } else if (item.type === 'idle') {
      label = '유휴 시간';
      iconColorClass = 'text-blue-500';
      detailInfo = '일정 시간 동안 활동 없음';
    }
  }

  return (
    <Button
      variant="outline"
      className={cn(
        'group flex h-auto w-full cursor-pointer flex-col items-stretch justify-start gap-2 py-3 whitespace-normal',
        'hover:bg-accent hover:text-accent-foreground',
      )}
      onClick={handleLogClick}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-white',
              iconColorClass,
            )}
          >
            <IconComponent className="h-4 w-4" />
          </div>
          <span className="font-semibold text-slate-900">
            {label}
            {subLabel && <span className="ml-1 font-normal text-slate-500">{subLabel}</span>}
          </span>
        </div>
        <span className="text-xs font-medium text-slate-400 tabular-nums">
          {formatRelativeTime(item.timestamp, startTime)}
        </span>
      </div>
      {detailInfo && (
        <div className="ml-10 flex items-center gap-2 text-sm text-slate-500">
          <span className="line-clamp-1">{detailInfo}</span>
        </div>
      )}
    </Button>
  );
}
