import { Mission, MissionStatus, SuccessCriteriaType } from '@/types/test';

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

const STATUS_STYLES: Record<MissionStatus, string> = {
  pending: 'border-gray-300 bg-white text-gray-500',
  in_progress: 'border-primary-400 bg-primary-50 text-primary-700 ring-2 ring-primary-200',
  completed: 'border-success-400 bg-success-50 text-success-700',
  skipped: 'border-gray-300 bg-gray-100 text-gray-400 opacity-50',
};

export default function MissionItem({ mission, status, isCurrent, onClick }: MissionItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        h-20 border-2 rounded-lg flex flex-col items-center justify-center
        text-center text-xs p-1 cursor-pointer transition-all shadow-sm
        hover:shadow-md
        ${STATUS_STYLES[status]}
        ${isCurrent ? 'scale-105' : 'hover:scale-102'}
      `}
      disabled={status === 'skipped'}
    >
      <div className="text-2xl mb-1">{MISSION_TYPE_ICONS[mission.successCriteriaType] || '📋'}</div>
      <span className="font-medium leading-tight">#{mission.orderNumber}</span>
    </button>
  );
}
