import type {
  Mission,
  MissionStatus,
  SuccessCriteriaType,
} from '@/features/(test-participate)/types';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils';

interface MissionItemProps {
  mission: Mission;
  status: MissionStatus;
  isCurrent: boolean;
  onClick: () => void;
}

const MISSION_TYPE_ICONS: Record<SuccessCriteriaType, string> = {
  BUTTON_CLICK: '👆',
  URL_CHANGE: '🧭',
  INPUT_FILL: '⌨️',
  SCROLL: '📜',
  CUSTOM: '⚙️',
};

export default function MissionItem({ mission, status, isCurrent, onClick }: MissionItemProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        'h-20 border-2 rounded-lg flex flex-col items-center justify-center',
        'text-center text-xs p-1 cursor-pointer transition-all shadow-sm hover:shadow-md',
        // 상태별 스타일
        status === 'pending' && 'border-gray-300 bg-white text-gray-500',
        status === 'in_progress' &&
          'border-primary-400 bg-primary-50 text-primary-700 ring-2 ring-primary-200',
        status === 'completed' && 'border-success-400 bg-success-50 text-success-700',
        status === 'skipped' && 'border-gray-300 bg-gray-100 text-gray-400 opacity-50',
        // 현재 미션 여부에 따른 스타일
        isCurrent ? 'scale-105' : 'hover:scale-102',
      )}
      disabled={status === 'skipped'}
    >
      <div className="text-2xl mb-1">{MISSION_TYPE_ICONS[mission.successCriteriaType] || '📋'}</div>
      <span className="font-medium leading-tight">#{mission.orderNumber}</span>
    </Button>
  );
}
