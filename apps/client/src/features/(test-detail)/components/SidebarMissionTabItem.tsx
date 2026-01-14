import type { TestMission } from '@/features/(test-manage)/types';
import { cn } from '@/shared/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface SidebarMissionTabItemProps {
  mission: TestMission;
  index: number;
  isActive: boolean;
  isInvalid?: boolean;
  totalMissions: number;
  onMissionClick: (missionPublicId: string) => void;
  onMoveMission: (fromIndex: number, toIndex: number) => void;
}

export function SidebarMissionTabItem({
  mission,
  index,
  isActive,
  isInvalid,
  totalMissions,
  onMissionClick,
  onMoveMission,
}: SidebarMissionTabItemProps) {
  const displayName = mission.name ? mission.name : `미션 ${index + 1}`;

  const handleMissionClick = () => {
    onMissionClick(mission.publicId);
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index > 0) {
      onMoveMission(index, index - 1);
    }
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index < totalMissions - 1) {
      onMoveMission(index, index + 1);
    }
  };

  return (
    <div
      className={cn(
        'flex min-h-10 w-full items-center gap-2 rounded-md border px-2 py-2 text-gray-600 transition-colors hover:bg-gray-100',
        isActive && 'border-gray-300 bg-gray-200 hover:bg-gray-200',
        isInvalid && 'border-destructive',
      )}
    >
      <button
        onClick={handleMissionClick}
        className="flex flex-1 cursor-pointer items-center gap-2 text-left font-medium wrap-break-word"
      >
        {displayName}
      </button>

      {isActive && (
        <div className="flex gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMoveUp}
            disabled={index === 0}
            className="h-6 w-6 p-0"
            title={index === 0 ? '비활성화' : `${displayName}을 위로 이동합니다`}
          >
            <ChevronUp className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMoveDown}
            disabled={index === totalMissions - 1}
            className="h-6 w-6 p-0"
            title={index === totalMissions - 1 ? '비활성화' : `${displayName}을 아래로 이동합니다`}
          >
            <ChevronDown className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
