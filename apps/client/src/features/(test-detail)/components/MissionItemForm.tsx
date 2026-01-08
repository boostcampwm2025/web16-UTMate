import { Trash2 } from 'lucide-react';

import type { TestMission } from '@/features/(test-manage)/types';
import { Button } from '@/shared/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

interface MissionItemFormProps {
  mission: TestMission;
  missionIndex: number;
  onUpdateMission: (id: number, mission: Partial<TestMission>) => void;
  onDeleteMission: (id: number) => void;
}

export function MissionItemForm({
  mission,
  missionIndex,
  onUpdateMission,
  onDeleteMission,
}: MissionItemFormProps) {
  const handleDeleteMission = () => {
    onDeleteMission(mission.id);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateMission(mission.id, { name: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateMission(mission.id, { description: e.target.value });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateMission(mission.id, { url: e.target.value });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateMission(mission.id, {
      estimatedDuration: e.target.value ? Number(e.target.value) : undefined,
    });
  };

  return (
    <div
      key={mission.id}
      id={`mission-${mission.id}`}
      className="rounded-lg border bg-white p-6 transition-all"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">미션 {missionIndex + 1}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDeleteMission}
          className="group text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="size-4" />
          <span className="ml-1 hidden group-hover:inline">삭제</span>
        </Button>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`mission-name-${mission.id}`}>미션 이름 *</FieldLabel>
          <Input
            type="text"
            id={`mission-name-${mission.id}`}
            placeholder="카페 예약하기"
            value={mission.name}
            onChange={handleNameChange}
            className="h-10"
            required
          />
          <FieldDescription>미션의 이름을 입력해주세요.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor={`mission-description-${mission.id}`}>미션 설명 *</FieldLabel>
          <Textarea
            id={`mission-description-${mission.id}`}
            placeholder="당신은 두바이쫀득쿠키를 구매하려고 합니다. 두바이쫀득쿠키를 판매하는 카페를 찾아 예약을 진행해주세요. "
            value={mission.description}
            onChange={handleDescriptionChange}
            rows={3}
          />
          <FieldDescription>미션에 대한 자세한 설명을 입력해주세요.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor={`mission-url-${mission.id}`}>대상 URL *</FieldLabel>
          <Input
            type="url"
            id={`mission-url-${mission.id}`}
            placeholder="https://maps.com/search"
            value={mission.url}
            onChange={handleUrlChange}
            className="h-10"
            required
          />
          <FieldDescription>테스트 참여자가 미션을 시작할 URL을 입력해주세요.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor={`mission-duration-${mission.id}`}>예상 소요시간</FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              id={`mission-duration-${mission.id}`}
              min="1"
              value={mission.estimatedDuration || ''}
              onChange={handleDurationChange}
              className="h-10 w-24"
            />
            <span className="text-sm text-gray-600">분</span>
          </div>
          <FieldDescription>미션에 소요되는 예상 시간을 입력해주세요. (선택사항)</FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  );
}
