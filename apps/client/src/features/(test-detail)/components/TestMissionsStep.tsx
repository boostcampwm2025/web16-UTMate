import type {
  UseFormRegister,
  FieldErrors,
  FieldArrayWithId,
  Control,
  UseFormSetValue,
} from 'react-hook-form';

import { MissionItemForm } from './MissionItemForm';
import type { TestFormValues } from '../schemas/testForm';

interface TestMissionsStepProps {
  fields: FieldArrayWithId<TestFormValues, 'missions', 'id'>[];
  selectedMissionIndex: number;
  register: UseFormRegister<TestFormValues>;
  control: Control<TestFormValues>;
  setValue: UseFormSetValue<TestFormValues>;
  errors: FieldErrors<TestFormValues>;
  onSelectedMissionIndexChange: (index: number) => void;
  onDeleteMission: (publicId: string) => void;
}

export function TestMissionsStep({
  fields,
  selectedMissionIndex,
  register,
  control,
  setValue,
  errors,
  onSelectedMissionIndexChange,
  onDeleteMission,
}: TestMissionsStepProps) {
  const handleDeleteMission = (publicId: string) => {
    onDeleteMission(publicId);
    // 삭제 후 이전 미션으로 선택 (없으면 0)
    if (selectedMissionIndex >= fields.length - 1) {
      onSelectedMissionIndexChange(Math.max(0, fields.length - 2));
    }
  };

  const selectedField = fields[selectedMissionIndex];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="mb-2 text-2xl font-bold">미션 설정</h2>
        <p className="text-gray-600">테스트 참여자가 수행할 미션을 입력해주세요.</p>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">아직 미션이 없습니다</h3>
            <p className="text-gray-600">좌측의 + 버튼을 눌러 미션을 추가해주세요.</p>
          </div>
        </div>
      ) : (
        selectedField && (
          <MissionItemForm
            field={selectedField}
            missionIndex={selectedMissionIndex}
            register={register}
            control={control}
            setValue={setValue}
            errors={errors}
            onDeleteMission={handleDeleteMission}
          />
        )
      )}
    </div>
  );
}
