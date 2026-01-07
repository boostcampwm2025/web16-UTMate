import type { TestMission } from '@/features/(test-manage)/types';
import { cn } from '@/shared/utils';

interface SidebarMissionTabProps {
  missions: TestMission[];
  selectedMissionIndex: number;
  onMissionClick: (missionId: number) => void;
}

export function SidebarMissionTab({
  missions,
  selectedMissionIndex,
  onMissionClick,
}: SidebarMissionTabProps) {
  if (!missions || missions.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 ml-6 space-y-1 border-l-2 border-gray-200 pl-4">
      {missions.map((mission, index) => (
        <SidebarMissionItem
          key={mission.id}
          mission={mission}
          index={index}
          isActive={selectedMissionIndex === index}
          onMissionClick={onMissionClick}
        />
      ))}
    </div>
  );
}

interface SidebarMissionItemProps {
  mission: TestMission;
  index: number;
  isActive: boolean;
  onMissionClick: (missionId: number) => void;
}

function SidebarMissionItem({ mission, index, isActive, onMissionClick }: SidebarMissionItemProps) {
  const displayName = mission.description ? mission.description : `미션 ${index + 1}`;

  const handleMissionClick = () => {
    onMissionClick(mission.id);
  };

  return (
    <button
      onClick={handleMissionClick}
      className={cn(
        'flex w-full cursor-pointer items-center gap-2 rounded-md border p-2 text-left font-medium transition-colors hover:bg-gray-100',
        isActive && 'bg-gray-100',
      )}
    >
      {displayName}
    </button>
  );
}
