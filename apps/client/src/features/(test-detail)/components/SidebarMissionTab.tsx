import { Plus } from 'lucide-react';
import type { FieldErrors } from 'react-hook-form';

import type { TestMission } from '@/features/(test-manage)/types';
import { Button } from '@/shared/components/ui/button';

import { SidebarMissionTabItem } from './SidebarMissionTabItem';
import type { TestFormValues } from '../schemas/testForm';

interface SidebarMissionTabProps {
  missions: TestMission[];
  selectedMissionIndex: number;
  errors?: FieldErrors<TestFormValues>['missions'];
  onMissionClick: (missionPublicId: string) => void;
  onAddMission: () => void;
  onMoveMission: (fromIndex: number, toIndex: number) => void;
}

export function SidebarMissionTab({
  missions,
  selectedMissionIndex,
  errors,
  onMissionClick,
  onAddMission,
  onMoveMission,
}: SidebarMissionTabProps) {
  const handleAddMission = () => {
    onAddMission();
  };

  const isMaxMissions = missions && missions.length >= 5;

  return (
    <div className="mt-2 ml-6 space-y-1 border-l-2 border-gray-200 pl-4">
      {missions &&
        missions.length > 0 &&
        missions.map((mission, index) => (
          <SidebarMissionTabItem
            key={mission.publicId}
            mission={mission}
            index={index}
            isActive={selectedMissionIndex === index}
            isInvalid={!!errors?.[index]}
            totalMissions={missions.length}
            onMissionClick={onMissionClick}
            onMoveMission={onMoveMission}
          />
        ))}
      <Button
        variant="outline"
        onClick={handleAddMission}
        disabled={isMaxMissions}
        className="h-10 w-full border border-dotted bg-gray-50 shadow-none"
      >
        {!isMaxMissions && missions.length < 5 ? (
          <Plus className="size-4" />
        ) : (
          '더 이상 추가할 수 없습니다'
        )}
      </Button>
    </div>
  );
}
