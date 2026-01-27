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
import { useUrlInput } from '../hooks/useUrlInput';

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
  const { urlValue, isValidUrl, handleUrlChange, handleUrlBlur } = useUrlInput({
    initialValue: field.missionUrl || '',
  });

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
          <div className="relative">
            <Input
              type="url"
              id={`mission-url-${field.id}`}
              placeholder="예: www.stocks.com 또는 https://www.stocks.com"
              {...register(`missions.${missionIndex}.missionUrl`, {
                onChange: handleUrlChange,
                onBlur: handleUrlBlur,
              })}
              value={urlValue}
              className="h-10 pr-10"
              aria-invalid={!!missionErrors?.missionUrl}
            />
            {urlValue && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isValidUrl ? (
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                )}
              </div>
            )}
          </div>
          <FieldDescription>
            테스트 참여자가 미션을 시작할 URL을 입력해주세요.
            {urlValue && !isValidUrl && (
              <span className="text-yellow-700"> (http:// 또는 https://가 자동으로 추가됩니다)</span>
            )}
          </FieldDescription>
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
