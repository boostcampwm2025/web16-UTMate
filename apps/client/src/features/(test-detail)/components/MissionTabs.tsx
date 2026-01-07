import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

import type { TestMission } from '@/features/(test-manage)/types';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils';

import { MAX_MISSIONS } from '../constants';

interface MissionTabsProps {
  missions: TestMission[];
  selectedMissionIndex: number;
  onSelectedMissionIndexChange: (index: number) => void;
  onAddMission: () => void;
  onMoveMission: (fromIndex: number, toIndex: number) => void;
}

export function MissionTabs({
  missions,
  selectedMissionIndex,
  onSelectedMissionIndexChange,
  onAddMission,
  onMoveMission,
}: MissionTabsProps) {
  const handleMissionTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const index = Number(e.currentTarget.dataset.index);
    onSelectedMissionIndexChange(index);
  };

  const handleAddMission = () => {
    if (missions.length >= MAX_MISSIONS) return;
    onAddMission();
    // 새로 추가된 미션으로 자동 선택
    onSelectedMissionIndexChange(missions.length);
  };

  const handleMoveMissionLeft = () => {
    if (selectedMissionIndex > 0) {
      onMoveMission(selectedMissionIndex, selectedMissionIndex - 1);
      onSelectedMissionIndexChange(selectedMissionIndex - 1);
    }
  };

  const handleMoveMissionRight = () => {
    if (selectedMissionIndex < missions.length - 1) {
      onMoveMission(selectedMissionIndex, selectedMissionIndex + 1);
      onSelectedMissionIndexChange(selectedMissionIndex + 1);
    }
  };

  const canMoveLeft = selectedMissionIndex > 0;
  const canMoveRight = selectedMissionIndex < missions.length - 1;
  const canAddMission = missions.length < MAX_MISSIONS;

  return (
    <div className="flex items-center justify-between">
      {/* 미션 탭 목록 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {missions.map((mission, index) => {
          const displayName = `미션 ${index + 1}`;
          const isSelected = selectedMissionIndex === index;

          return (
            <Button
              key={mission.id}
              data-index={index}
              onClick={handleMissionTabClick}
              variant="outline"
              size="sm"
              className={cn('shrink-0 shadow-none', isSelected && 'bg-gray-200 hover:bg-gray-200')}
            >
              <span className="truncate">{displayName}</span>
            </Button>
          );
        })}
      </div>

      {/* 컨트롤 버튼 */}
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            onClick={handleMoveMissionLeft}
            disabled={!canMoveLeft}
            variant="outline"
            size="sm"
            className="px-2"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            onClick={handleMoveMissionRight}
            disabled={!canMoveRight}
            variant="outline"
            size="sm"
            className="px-2"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <Button onClick={handleAddMission} size="sm" disabled={!canAddMission}>
          <Plus className="mr-2 size-4" />
          미션 추가
        </Button>
      </div>
    </div>
  );
}
