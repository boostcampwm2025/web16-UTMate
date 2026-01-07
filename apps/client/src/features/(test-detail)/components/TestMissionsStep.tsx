import type { TestMission } from '@/features/(test-manage)/types';
import { Button } from '@/shared/components/ui/button';

import { MissionItemForm } from './MissionItemForm';
import { MissionTabs } from './MissionTabs';

interface TestMissionsStepProps {
  missions: TestMission[];
  selectedMissionIndex: number;
  onSelectedMissionIndexChange: (index: number) => void;
  onAddMission: () => void;
  onUpdateMission: (id: number, mission: Partial<TestMission>) => void;
  onDeleteMission: (id: number) => void;
  onMoveMission: (fromIndex: number, toIndex: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function TestMissionsStep({
  missions,
  selectedMissionIndex,
  onSelectedMissionIndexChange,
  onAddMission,
  onUpdateMission,
  onDeleteMission,
  onMoveMission,
  onPrev,
  onNext,
}: TestMissionsStepProps) {
  const handleDeleteMission = (id: number) => {
    const index = missions.findIndex((m) => m.id === id);
    onDeleteMission(id);
    // 삭제 후 이전 미션으로 선택 (없으면 0)
    if (selectedMissionIndex >= missions.length - 1) {
      onSelectedMissionIndexChange(Math.max(0, missions.length - 2));
    }
  };

  const selectedMission = missions[selectedMissionIndex];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="mb-2 text-2xl font-bold">미션 설정</h2>
        <p className="text-gray-600">테스트 참여자가 수행할 미션을 입력해주세요.</p>
      </div>

      {/* 미션 탭 컴포넌트 */}
      <MissionTabs
        missions={missions}
        selectedMissionIndex={selectedMissionIndex}
        onSelectedMissionIndexChange={onSelectedMissionIndexChange}
        onAddMission={onAddMission}
        onMoveMission={onMoveMission}
      />

      {missions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">아직 미션이 없습니다</h3>
          </div>
        </div>
      ) : (
        selectedMission && (
          <MissionItemForm
            mission={selectedMission}
            missionIndex={selectedMissionIndex}
            onUpdateMission={onUpdateMission}
            onDeleteMission={handleDeleteMission}
          />
        )
      )}

      <div className="border-t pt-6">
        {/* 네비게이션 버튼 */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            이전
          </Button>
          <Button onClick={onNext}>다음</Button>
        </div>
      </div>
    </div>
  );
}
