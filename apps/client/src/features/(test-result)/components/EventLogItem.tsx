import {
  MousePointerClick,
  Keyboard,
  Monitor,
  MoreHorizontal,
  Activity,
  LucideIcon,
  Angry,
  Hourglass,
  Mouse,
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
  scroll: Mouse,
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

const ANALYSIS_EVENT_CONFIG = {
  rageClick: {
    label: '분노 클릭',
    detailInfo: '짧은 시간 동안 다수의 클릭 발생',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
  mouseThrashing: {
    label: '마우스 흔들기',
    detailInfo: '불규칙한 마우스 움직임 감지',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  idle: {
    label: '유휴 시간',
    detailInfo: '일정 시간 동안 활동 없음',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
} as const;

export function EventLogItem({ item, startTime, onLogClick }: EventLogItemProps) {
  const relativeMs = item.timestamp - startTime;

  const handleLogClick = () => {
    onLogClick(relativeMs);
  };

  const iconKey = getIconKey(item);
  const IconComponent = EVENT_ICONS[iconKey] || EVENT_ICONS.default;

  // 기본 스타일 및 데이터 설정
  let label = '';
  let subLabel = '';
  let detailInfo: string | undefined;
  let iconBgClass = 'bg-slate-100';
  let iconColorClass = 'text-slate-600';

  if (item.type === 'rrweb') {
    const logData = item.data;
    label = getEventLabel(logData.log);
    if (logData.scrollDirection) {
      subLabel = `(${logData.scrollDirection})`;
    }
    detailInfo = logData.targetInfo;
  } else {
    // 분석 데이터 설정 (Config 활용)
    const config = ANALYSIS_EVENT_CONFIG[item.type as keyof typeof ANALYSIS_EVENT_CONFIG];
    if (config) {
      label = config.label;
      detailInfo = config.detailInfo;
      iconBgClass = config.iconBg;
      iconColorClass = config.iconColor;
    }
  }

  return (
    <div
      className={cn(
        'group flex w-full cursor-pointer flex-col gap-3 rounded-xl border bg-white p-4 transition-colors',
        'hover:bg-slate-50',
      )}
      onClick={handleLogClick}
      title="클릭하여 이벤트 발생시점으로 이동"
    >
      <div className="flex w-full items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
              iconBgClass,
              iconColorClass,
            )}
          >
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-slate-900">
              {label}
              {subLabel && <span className="ml-1 font-normal text-slate-500">{subLabel}</span>}
            </span>
            {detailInfo && <span className="text-sm font-medium text-slate-500">{detailInfo}</span>}
          </div>
        </div>
        <span className="shrink-0 text-xs font-medium text-slate-400">
          {formatRelativeTime(item.timestamp, startTime)}
        </span>
      </div>
    </div>
  );
}
