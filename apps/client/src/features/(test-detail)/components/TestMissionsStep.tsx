import { Plus, Trash2 } from 'lucide-react';

import type { TestMission } from '@/features/(test-manage)/types';
import { Button } from '@/shared/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

interface TestMissionsStepProps {
  missions: TestMission[];
  selectedMissionIndex: number;
  onSelectedMissionIndexChange: (index: number) => void;
  onAddMission: () => void;
  onUpdateMission: (id: number, mission: Partial<TestMission>) => void;
  onDeleteMission: (id: number) => void;
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
  onPrev,
  onNext,
}: TestMissionsStepProps) {
  const handleAddMission = () => {
    onAddMission();
    // 새로 추가된 미션으로 자동 선택
    onSelectedMissionIndexChange(missions.length);
  };

  const handleDeleteMission = (id: number) => {
    const index = missions.findIndex((m) => m.id === id);
    onDeleteMission(id);
    // 삭제 후 이전 미션으로 선택 (없으면 0)
    if (selectedMissionIndex >= missions.length - 1) {
      onSelectedMissionIndexChange(Math.max(0, missions.length - 2));
    }
  };

  const selectedMission = missions[selectedMissionIndex];

  const handleMissionTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const index = Number(e.currentTarget.dataset.index);
    onSelectedMissionIndexChange(index);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold">미션 설정</h2>
          <p className="text-gray-600">테스트 참가자가 수행할 미션을 추가하고 관리하세요.</p>
        </div>
        <Button onClick={handleAddMission}>
          <Plus className="mr-2 size-4" />
          미션 추가
        </Button>
      </div>

      {/* 미션 탭 목록 */}
      {missions.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {missions.map((mission, index) => {
            const hasName = mission.name && mission.name.trim();
            const displayName = hasName ? mission.name : `미션 ${index + 1}`;
            const isSelected = selectedMissionIndex === index;

            return (
              <Button
                key={mission.id}
                data-index={index}
                onClick={handleMissionTabClick}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                className="shrink-0"
              >
                <span className="truncate">{displayName}</span>
              </Button>
            );
          })}
        </div>
      )}

      {missions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">아직 미션이 없습니다</h3>
            <p className="text-sm text-gray-500">첫 번째 미션을 추가하여 테스트를 시작하세요.</p>
            <Button variant="outline" onClick={handleAddMission}>
              <Plus className="mr-2 size-4" />
              미션 추가
            </Button>
          </div>
        </div>
      ) : (
        selectedMission && (
          <div
            key={selectedMission.id}
            id={`mission-${selectedMission.id}`}
            className="rounded-lg border bg-white p-6 transition-all"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">미션 {selectedMissionIndex + 1}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteMission(selectedMission.id)}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="mr-1 size-4" />
                삭제
              </Button>
            </div>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`mission-name-${selectedMission.id}`}>미션 이름 *</FieldLabel>
                <Input
                  id={`mission-name-${selectedMission.id}`}
                  placeholder="예: 로그인 페이지 찾기"
                  value={selectedMission.name}
                  onChange={(e) => onUpdateMission(selectedMission.id, { name: e.target.value })}
                />
                <FieldDescription>참가자에게 보여질 미션 제목입니다.</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor={`mission-description-${selectedMission.id}`}>
                  미션 설명
                </FieldLabel>
                <Textarea
                  id={`mission-description-${selectedMission.id}`}
                  placeholder="미션에 대한 자세한 설명을 입력하세요"
                  value={selectedMission.description}
                  onChange={(e) =>
                    onUpdateMission(selectedMission.id, { description: e.target.value })
                  }
                  rows={3}
                  className="resize-none"
                />
                <FieldDescription>참가자가 무엇을 해야 하는지 설명합니다.</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor={`mission-url-${selectedMission.id}`}>대상 URL *</FieldLabel>
                <Input
                  id={`mission-url-${selectedMission.id}`}
                  placeholder="https://example.com/login"
                  value={selectedMission.url}
                  onChange={(e) => onUpdateMission(selectedMission.id, { url: e.target.value })}
                  required
                />
                <FieldDescription>미션을 수행할 페이지 URL입니다.</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor={`mission-duration-${selectedMission.id}`}>
                  예상 소요시간
                </FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    id={`mission-duration-${selectedMission.id}`}
                    min="1"
                    value={selectedMission.estimatedDuration || ''}
                    onChange={(e) =>
                      onUpdateMission(selectedMission.id, {
                        estimatedDuration: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-24"
                  />
                  <span className="text-sm text-gray-600">분</span>
                </div>
                <FieldDescription>
                  참가자가 미션을 완료하는데 걸리는 예상 시간입니다. (선택사항)
                </FieldDescription>
              </Field>
            </FieldGroup>
          </div>
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
