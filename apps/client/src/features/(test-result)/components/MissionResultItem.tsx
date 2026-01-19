import { cn } from '@/shared/utils';
import type { ParticipantMissionStatus } from '../types';

interface MissionResultItemProps {
  order: number;
  status: ParticipantMissionStatus;
}

const statusConfig = {
  SUCCESS: {
    bg: 'bg-[#C1E9C6]',
    border: 'border-[#2D5A27]',
    text: '성공',
  },
  FAILURE: {
    bg: 'bg-[#F9C1C1]',
    border: 'border-[#A82B2B]',
    text: '실패',
  },
  DROPPED: {
    bg: 'bg-[#8E949E]',
    border: 'border-[#374151]',
    text: '이탈',
  },
  IN_PROGRESS: {
    bg: 'bg-white',
    border: 'border-black',
    text: '진행중',
  },
};

export function MissionResultItem({ order, status }: MissionResultItemProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'flex h-[75px] w-[85px] shrink-0 flex-col items-center justify-center rounded-xl border-2 text-[13px] font-bold shadow-sm transition-transform hover:scale-105',
        config.bg,
        config.border,
      )}
    >
      <span>{order}번 미션</span>
      <span>{config.text}</span>
    </div>
  );
}
