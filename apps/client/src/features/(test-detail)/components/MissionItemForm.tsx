import type {
  UseFormRegister,
  FieldErrors,
  FieldArrayWithId,
  Control,
  UseFormSetValue,
} from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { useDialogStore } from '@/shared/stores/useDialogStore';

import type { TestFormValues } from '../schemas/testForm';

interface MissionItemFormProps {
  field: FieldArrayWithId<TestFormValues, 'missions', 'id'>;
  missionIndex: number;
  register: UseFormRegister<TestFormValues>;
  control: Control<TestFormValues>;
  setValue: UseFormSetValue<TestFormValues>;
  errors: FieldErrors<TestFormValues>;
  onDeleteMission: (publicId: string) => void;
}

export function MissionItemForm({
  field,
  missionIndex,
  register,
  control,
  setValue,
  errors,
  onDeleteMission,
}: MissionItemFormProps) {
  const { confirm } = useDialogStore();
  const missionUrl = useWatch({
    control,
    name: `missions.${missionIndex}.missionUrl`,
    defaultValue: field.missionUrl || '',
  });

  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value && !/^https?:\/\//i.test(value)) {
      setValue(`missions.${missionIndex}.missionUrl`, `https://${value}`, {
        shouldValidate: true,
      });
    }
  };

  const hasUrlError = !!errors.missions?.[missionIndex]?.missionUrl;
  const isValidUrl = missionUrl && !hasUrlError;

  const handleDeleteMission = async () => {
    const confirmed = await confirm(
      '미션을 삭제하시겠습니까?',
      '이 작업은 되돌릴 수 없습니다.',
      null,
      { isAlert: true, confirmText: '삭제' },
    );

    if (confirmed) {
      onDeleteMission(field.publicId || '');
    }
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
        <Button
          variant="ghost"
          size="sm"
          className="group text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleDeleteMission}
        >
          <Trash2 className="size-4" />
          <span className="ml-1 hidden group-hover:inline">삭제</span>
        </Button>
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
          <div className="relative">
            <Input
              type="url"
              id={`mission-url-${field.id}`}
              placeholder="예: www.stocks.com 또는 https://www.stocks.com"
              {...register(`missions.${missionIndex}.missionUrl`, {
                onBlur: handleUrlBlur,
              })}
              className="h-10 pr-10"
              aria-invalid={!!missionErrors?.missionUrl}
            />
            {missionUrl && (
              <div className="absolute top-1/2 right-3 -translate-y-1/2">
                {isValidUrl ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
              </div>
            )}
          </div>
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
