'use client';

import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { Button } from '@/shared/components/ui/button';
import {
  INTEREST_OPTIONS,
  GENDER_OPTIONS,
  AGE_GROUP_OPTIONS,
} from '@/features/(auth)/constants/interests';
import type { Interest } from '@/features/(auth)/types';
import type { TestFormValues } from '../schemas/testForm';
import { cn } from '@/shared/utils';

interface TestSettingsStepProps {
  register: UseFormRegister<TestFormValues>;
  errors: FieldErrors<TestFormValues>;
  targetGender: string[];
  targetAgeGroup: string[];
  targetInterests: Interest[];
  onTargetGenderChange: (values: string[]) => void;
  onTargetAgeGroupChange: (values: string[]) => void;
  onToggleInterest: (interest: Interest) => void;
  isPublic: boolean;
  onIsPublicChange: (value: boolean) => void;
}

export function TestSettingsStep({
  targetGender,
  targetAgeGroup,
  targetInterests,
  onTargetGenderChange,
  onTargetAgeGroupChange,
  onToggleInterest,
  isPublic,
  onIsPublicChange,
}: TestSettingsStepProps) {
  const toggleGender = (gender: string) => {
    if (targetGender.includes(gender)) {
      onTargetGenderChange(targetGender.filter((g) => g !== gender));
    } else {
      onTargetGenderChange([...targetGender, gender]);
    }
  };

  const toggleAgeGroup = (ageGroup: string) => {
    if (targetAgeGroup.includes(ageGroup)) {
      onTargetAgeGroupChange(targetAgeGroup.filter((a) => a !== ageGroup));
    } else {
      onTargetAgeGroupChange([...targetAgeGroup, ageGroup]);
    }
  };

  const isAllGenderSelected =
    GENDER_OPTIONS.length > 0 && GENDER_OPTIONS.every((opt) => targetGender.includes(opt.value));

  const handleGenderSelectAll = () => {
    if (isAllGenderSelected) {
      onTargetGenderChange([]);
    } else {
      onTargetGenderChange(GENDER_OPTIONS.map((opt) => opt.value));
    }
  };

  const isAllAgeGroupSelected =
    AGE_GROUP_OPTIONS.length > 0 &&
    AGE_GROUP_OPTIONS.every((opt) => targetAgeGroup.includes(opt.value));

  const handleAgeGroupSelectAll = () => {
    if (isAllAgeGroupSelected) {
      onTargetAgeGroupChange([]);
    } else {
      onTargetAgeGroupChange(AGE_GROUP_OPTIONS.map((opt) => opt.value));
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">테스트 설정</h2>
        <p className="text-gray-500">테스트 공개범위와 타겟 사용자를 설정하세요.</p>
      </div>

      <FieldGroup className="gap-10">
        {/* 공개 범위 */}
        <Field>
          <FieldLabel className="text-base">공개 범위 *</FieldLabel>
          <div className="flex w-full gap-3">
            <SelectionButton
              selected={!isPublic}
              onClick={() => onIsPublicChange(false)}
              className="flex-1"
            >
              비공개
            </SelectionButton>
            <SelectionButton
              selected={isPublic}
              onClick={() => onIsPublicChange(true)}
              className="flex-1"
            >
              공개
            </SelectionButton>
          </div>
          <FieldDescription>
            {isPublic
              ? '모든 사용자가 테스트를 검색하고 참여할 수 있어요.'
              : '테스트 링크를 공유받은 사용자만 테스트에 참여할 수 있어요.'}
          </FieldDescription>
        </Field>

        {/* 관심사 설정 */}
        <Field className={cn(!isPublic && 'opacity-50 transition-opacity')}>
          <FieldLabel className="text-base">주제</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((option) => (
              <Button
                key={option.key}
                type="button"
                variant={targetInterests.includes(option.key) ? 'default' : 'outline'}
                size="sm"
                onClick={() => onToggleInterest(option.key)}
                disabled={!isPublic}
                className={cn(
                  'border-primary rounded-full border px-4 font-medium shadow-none',
                  !targetInterests.includes(option.key) &&
                    'border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
                  !isPublic && 'cursor-not-allowed opacity-50',
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <FieldDescription>
            테스트 주제를 선택하면 타겟 사용자의 관심사 기반으로 테스트를 추천해드려요.
          </FieldDescription>
        </Field>
      </FieldGroup>

      {/* 성별 설정 */}
      <Field className={cn(!isPublic && 'opacity-50 transition-opacity')}>
        <FieldLabel className="text-base">성별 *</FieldLabel>
        <div className="flex w-full gap-3">
          <SelectionButton
            selected={isAllGenderSelected}
            onClick={handleGenderSelectAll}
            disabled={!isPublic}
            className="flex-1"
          >
            모두
          </SelectionButton>
          {GENDER_OPTIONS.map((option) => (
            <SelectionButton
              key={option.value}
              selected={targetGender.includes(option.value)}
              onClick={() => toggleGender(option.value)}
              disabled={!isPublic}
              className="flex-1"
            >
              {option.label}
            </SelectionButton>
          ))}
        </div>
        <FieldDescription>중복선택이 가능해요</FieldDescription>
      </Field>

      {/* 연령대 설정 */}
      <Field className={cn(!isPublic && 'opacity-50 transition-opacity')}>
        <FieldLabel className="text-base">연령대 *</FieldLabel>
        <div className="grid grid-cols-4 gap-3">
          <SelectionButton
            selected={isAllAgeGroupSelected}
            onClick={handleAgeGroupSelectAll}
            disabled={!isPublic}
            className="col-span-1"
          >
            모두
          </SelectionButton>
          {AGE_GROUP_OPTIONS.map((option) => (
            <SelectionButton
              key={option.value}
              selected={targetAgeGroup.includes(option.value)}
              onClick={() => toggleAgeGroup(option.value)}
              disabled={!isPublic}
              className="col-span-1"
            >
              {option.label}
            </SelectionButton>
          ))}
        </div>
        <FieldDescription>중복선택이 가능해요</FieldDescription>
      </Field>
    </div>
  );
}

const SelectionButton = ({
  selected,
  onClick,
  children,
  disabled = false,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) => (
  <Button
    type="button"
    variant={selected ? 'default' : 'outline'}
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'h-12 w-full text-base font-medium transition-all',
      !selected && 'text-gray-600 hover:text-gray-900',
      disabled && 'cursor-not-allowed opacity-50',
      className,
    )}
  >
    {children}
  </Button>
);
