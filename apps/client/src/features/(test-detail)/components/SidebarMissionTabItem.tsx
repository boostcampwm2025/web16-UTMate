import type { TestMission } from '@/features/(test-manage)/types';
import { cn } from '@/shared/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface SidebarMissionTabItemProps {
  mission: TestMission;
  index: number;
  isActive: boolean;
  totalMissions: number;
  onMissionClick: (missionId: number) => void;
  onMoveMission: (fromIndex: number, toIndex: number) => void;
}

export function SidebarMissionTabItem({
  mission,
  index,
  isActive,
  totalMissions,
  onMissionClick,
  onMoveMission,
}: SidebarMissionTabItemProps) {
  const displayName = mission.description ? mission.description : `미션 ${index + 1}`;

  const handleMissionClick = () => {
    onMissionClick(mission.id);
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
        'flex h-10 w-full items-center gap-2 rounded-md border px-2 transition-colors',
        isActive && 'bg-gray-100',
      )}
    >
      <button
        onClick={handleMissionClick}
        className="flex-1 text-left font-medium hover:text-gray-700"
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
            title="위로 이동"
          >
            <ChevronUp className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMoveDown}
            disabled={index === totalMissions - 1}
            className="h-6 w-6 p-0"
            title="아래로 이동"
          >
            <ChevronDown className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
