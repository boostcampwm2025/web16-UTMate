'use client';

import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { INTEREST_OPTIONS, GENDER_OPTIONS, AGE_GROUP_OPTIONS } from '@/features/(auth)/constants/interests';
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">테스트 설정</h2>
        <p className="text-muted-foreground mt-2">
          테스트에 참여할 타겟 사용자 페르소나를 설정하세요. 설정하지 않으면 모든 사용자가 참여할 수 있습니다.
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
              className={`flex-1 rounded-lg border-2 p-4 text-center font-medium transition-colors ${
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
              className={`flex-1 rounded-lg border-2 p-4 text-center font-medium transition-colors ${
                !isPublic
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input hover:bg-accent'
              }`}
            >
              비공개
            </button>
          </div>
          <p className="text-muted-foreground mt-3 text-sm">
            {isPublic
              ? '모든 사용자가 이 테스트를 검색하고 참여할 수 있습니다.'
              : '링크를 공유한 사용자만 이 테스트에 참여할 수 있습니다.'}
          </p>
        </CardContent>
      </Card>

      {/* 성별 설정 */}
      <Card>
        <CardHeader>
          <CardTitle>성별</CardTitle>
          <CardDescription>공개/비공개 여부를 선택해주세요 (비공개가 디폴트)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => toggleGender('모두')}
              className={`flex-1 rounded-lg border-2 p-4 text-center font-medium transition-colors ${
                targetGender.length === 0
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input hover:bg-accent'
              }`}
            >
              모두
            </button>
            {GENDER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleGender(option.value)}
                className={`flex-1 rounded-lg border-2 p-4 text-center font-medium transition-colors ${
                  targetGender.includes(option.value)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input hover:bg-accent'
                }`}
              >
                {option.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => toggleGender('여')}
              className={`flex-1 rounded-lg border-2 p-4 text-center font-medium transition-colors ${
                targetGender.includes('여')
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input hover:bg-accent'
              }`}
            >
              여
            </button>
          </div>
          <p className="text-muted-foreground mt-3 text-sm">
            공개/비공개 여부를 선택해주세요 (비공개가 디폴트)
          </p>
        </CardContent>
      </Card>

      {/* 연령대 설정 */}
      <Card>
        <CardHeader>
          <CardTitle>연령대</CardTitle>
          <CardDescription>여러개 선택할 수 있게</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onTargetAgeGroupChange([])}
              className={`rounded-lg border-2 px-6 py-3 font-medium transition-colors ${
                targetAgeGroup.length === 0
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input hover:bg-accent'
              }`}
            >
              모두
            </button>
            {AGE_GROUP_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleAgeGroup(option.value)}
                className={`rounded-lg border-2 px-6 py-3 font-medium transition-colors ${
                  targetAgeGroup.includes(option.value)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input hover:bg-accent'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 관심사 설정 */}
      <Card>
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
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  targetInterests.includes(option.key)
                    ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-muted-foreground mt-3 text-sm">
            선택한 관심사: {targetInterests.length === 0 ? '모두' : `${targetInterests.length}개`}
          </p>
        </CardContent>
      </Card>

      <div className="text-muted-foreground rounded-lg border bg-blue-50 p-4 text-sm">
        <p className="font-medium">💡 타겟 설정 안내</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>기본 zod 스키마 위 필드 추가</li>
          <li>타겟 테스터는 공개인 경우에만 표시/비공개 설정하는 것도 고려</li>
          <li>프론트 constant를 저리하도록 기존 api에 담아서 PUT /api/tests isPublic:boolean에 제공하면 됨</li>
        </ul>
      </div>
    </div>
  );
}
