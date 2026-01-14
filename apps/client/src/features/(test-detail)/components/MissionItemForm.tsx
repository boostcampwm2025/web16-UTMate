import type { UseFormRegister, FieldErrors, FieldArrayWithId } from 'react-hook-form';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

import type { TestFormValues } from '../schemas/testForm';
import { MissionItemDeleteButton } from './MissionItemDeleteButton';

interface MissionItemFormProps {
  field: FieldArrayWithId<TestFormValues, 'missions', 'id'>;
  missionIndex: number;
  register: UseFormRegister<TestFormValues>;
  errors: FieldErrors<TestFormValues>;
  onDeleteMission: (publicId: string) => void;
}

export function MissionItemForm({
  field,
  missionIndex,
  register,
  errors,
  onDeleteMission,
}: MissionItemFormProps) {
  const handleDeleteMission = () => {
    onDeleteMission(field.publicId || '');
  };

  const missionErrors = errors.missions?.[missionIndex];

  return (
    <div
      key={field.id}
      id={`mission-${field.publicId}`}
      className="rounded-lg border bg-white p-6 transition-all"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">미션 {missionIndex + 1}</h3>
        <MissionItemDeleteButton
          publicId={field.publicId || ''}
          onDeleteMission={handleDeleteMission}
        />
      </div>

      <FieldGroup>
        <Field data-invalid={!!missionErrors?.name}>
          <FieldLabel htmlFor={`mission-name-${field.id}`}>미션 이름 *</FieldLabel>
          <Input
            type="text"
            id={`mission-name-${field.id}`}
            placeholder="하루에 만원씩 주식 모으기"
            {...register(`missions.${missionIndex}.name`)}
            className="h-10"
            aria-invalid={!!missionErrors?.name}
          />
          <FieldDescription>미션의 이름을 입력해주세요.</FieldDescription>
          {missionErrors?.name && <FieldError>{missionErrors.name.message}</FieldError>}
        </Field>

        <Field data-invalid={!!missionErrors?.description}>
          <FieldLabel htmlFor={`mission-description-${field.id}`}>미션 설명 *</FieldLabel>
          <Textarea
            id={`mission-description-${field.id}`}
            placeholder="당신은 삼성전자 주식을 매일 1만원씩 모으려고 합니다. 해당 미션을 진행해주세요."
            {...register(`missions.${missionIndex}.description`)}
            rows={3}
            aria-invalid={!!missionErrors?.description}
          />
          <FieldDescription>미션에 대한 자세한 설명을 입력해주세요.</FieldDescription>
          {missionErrors?.description && (
            <FieldError>{missionErrors.description.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!missionErrors?.missionUrl}>
          <FieldLabel htmlFor={`mission-url-${field.id}`}>대상 URL *</FieldLabel>
          <Input
            type="url"
            id={`mission-url-${field.id}`}
            placeholder="https://www.stocks.com"
            {...register(`missions.${missionIndex}.missionUrl`)}
            className="h-10"
            aria-invalid={!!missionErrors?.missionUrl}
          />
          <FieldDescription>테스트 참여자가 미션을 시작할 URL을 입력해주세요.</FieldDescription>
          {missionErrors?.missionUrl && <FieldError>{missionErrors.missionUrl.message}</FieldError>}
        </Field>

        <Field data-invalid={!!missionErrors?.estimatedDuration}>
          <FieldLabel htmlFor={`mission-duration-${field.id}`}>예상 소요시간 *</FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              id={`mission-duration-${field.id}`}
              min="1"
              {...register(`missions.${missionIndex}.estimatedDuration`, {
                valueAsNumber: true,
              })}
              className="h-10 w-24"
              aria-invalid={!!missionErrors?.estimatedDuration}
            />
            <span className="text-sm text-gray-600">분</span>
          </div>
          <FieldDescription>미션에 소요되는 예상 시간을 입력해주세요.</FieldDescription>
          {missionErrors?.estimatedDuration && (
            <FieldError>{missionErrors.estimatedDuration.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
    </div>
  );
}
