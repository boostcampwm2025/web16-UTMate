'use client';

import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Label } from '@/shared/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  INTEREST_OPTIONS,
  GENDER_OPTIONS,
  AGE_GROUP_OPTIONS,
} from '@/features/(auth)/constants/interests';
import type { Interest } from '@/features/(auth)/types';
import type { TestFormValues } from '../schemas/testForm';

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

  // 모두 선택/해제 핸들러
  const handleAgeGroupSelectAll = () => {
    const allSelected = AGE_GROUP_OPTIONS.every((opt) => targetAgeGroup.includes(opt.value));
    if (allSelected) {
      onTargetAgeGroupChange([]);
    } else {
      onTargetAgeGroupChange(AGE_GROUP_OPTIONS.map((opt) => opt.value));
    }
  };

  const handleInterestSelectAll = () => {
    const allSelected = INTEREST_OPTIONS.every((opt) => targetInterests.includes(opt.key));
    if (allSelected) {
      onToggleInterest(INTEREST_OPTIONS[0].key); // 첫 항목만 남기기 위해 전체 해제 후 하나씩
      INTEREST_OPTIONS.forEach((opt) => {
        if (targetInterests.includes(opt.key)) {
          onToggleInterest(opt.key);
        }
      });
    } else {
      INTEREST_OPTIONS.forEach((opt) => {
        if (!targetInterests.includes(opt.key)) {
          onToggleInterest(opt.key);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">테스트 설정</h2>
        <p className="text-muted-foreground mt-2">
          테스트에 참여할 타겟 사용자 페르소나를 설정하세요.
        </p>
      </div>

      {/* 공개 범위 */}
      <Card>
        <CardHeader>
          <CardTitle>공개 범위</CardTitle>
          <CardDescription>테스트 공개 여부를 선택하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onIsPublicChange(true)}
              className={`flex-1 cursor-pointer rounded-lg border-2 p-4 text-center font-medium transition-colors ${
                isPublic
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input hover:bg-accent'
              }`}
            >
              공개
            </button>
            <button
              type="button"
              onClick={() => onIsPublicChange(false)}
              className={`flex-1 cursor-pointer rounded-lg border-2 p-4 text-center font-medium transition-colors ${
                !isPublic
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input hover:bg-accent'
              }`}
            >
              비공개
            </button>
          </div>
          <p
            className={`mt-3 text-sm ${isPublic ? 'text-muted-foreground' : 'font-semibold text-blue-600'}`}
          >
            {isPublic
              ? '모든 사용자가 이 테스트를 검색하고 참여할 수 있습니다.'
              : '링크를 공유한 사용자만 이 테스트에 참여할 수 있습니다.'}
          </p>
        </CardContent>
      </Card>

      {/* 성별 설정 - 공개인 경우에만 활성화 */}
      <Card className={!isPublic ? 'opacity-50' : ''}>
        <CardHeader>
          <CardTitle>
            성별 <span className="text-destructive">*</span>
          </CardTitle>
          <CardDescription>중복선택 가능 (필수)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {GENDER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleGender(option.value)}
                disabled={!isPublic}
                className={`flex-1 cursor-pointer rounded-lg border-2 p-4 text-center font-medium transition-colors ${
                  targetGender.includes(option.value)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input hover:bg-accent'
                } ${!isPublic ? 'cursor-not-allowed' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 연령대 설정 - 공개인 경우에만 활성화 */}
      <Card className={!isPublic ? 'opacity-50' : ''}>
        <CardHeader>
          <CardTitle>
            연령대 <span className="text-destructive">*</span>
          </CardTitle>
          <CardDescription>중복선택 가능 (필수)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAgeGroupSelectAll}
              disabled={!isPublic}
              className={`cursor-pointer rounded-lg border-2 px-6 py-3 font-medium transition-colors ${
                targetAgeGroup.length === AGE_GROUP_OPTIONS.length
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input hover:bg-accent'
              } ${!isPublic ? 'cursor-not-allowed' : ''}`}
            >
              {targetAgeGroup.length === AGE_GROUP_OPTIONS.length ? '모두 취소' : '모두 선택'}
            </button>
            {AGE_GROUP_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleAgeGroup(option.value)}
                disabled={!isPublic}
                className={`cursor-pointer rounded-lg border-2 px-6 py-3 font-medium transition-colors ${
                  targetAgeGroup.includes(option.value)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input hover:bg-accent'
                } ${!isPublic ? 'cursor-not-allowed' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 관심사 설정 - 공개인 경우에만 활성화 */}
      <Card className={!isPublic ? 'opacity-50' : ''}>
        <CardHeader>
          <CardTitle>관심사</CardTitle>
          <CardDescription>타겟 사용자의 관심사를 선택하세요 (복수 선택 가능)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => onToggleInterest(option.key)}
                disabled={!isPublic}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  targetInterests.includes(option.key)
                    ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                } ${!isPublic ? 'cursor-not-allowed' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-muted-foreground mt-3 text-sm">
            선택한 관심사:{' '}
            {targetInterests.length === 0
              ? '관심사를 선택하지 않을 시 매칭에 어려움이 있을 수 있습니다.'
              : `${targetInterests.length}개`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
