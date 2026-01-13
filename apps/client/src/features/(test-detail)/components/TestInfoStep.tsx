'use client';

import type { UseFormRegister, FieldErrors } from 'react-hook-form';

import { Button } from '@/shared/components/ui/button';
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

interface TestInfoStepProps {
  register: UseFormRegister<TestFormValues>;
  errors: FieldErrors<TestFormValues>;
  onNext: () => void | Promise<void>;
}

export function TestInfoStep({ register, errors, onNext }: TestInfoStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold">테스트 기본 정보</h2>
        <p className="text-gray-600">테스트의 기본 정보를 설정해주세요.</p>
      </div>

      <FieldGroup>
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="test-title">테스트 이름 *</FieldLabel>
          <Input
            id="test-title"
            placeholder="예: 주식모으기 서비스 테스트"
            {...register('title')}
            aria-invalid={!!errors.title}
            autoComplete="off"
          />
          <FieldDescription>테스트를 식별할 수 있는 이름을 입력해주세요.</FieldDescription>
          {errors.title && <FieldError>{errors.title.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="test-description">테스트 설명</FieldLabel>
          <Textarea
            id="test-description"
            placeholder="테스트에 대한 설명을 입력해주세요."
            {...register('description')}
            rows={3}
          />
          <FieldDescription>테스트의 목적과 내용을 간단히 설명해주세요.</FieldDescription>
          {errors.description && <FieldError>{errors.description.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.url}>
          <FieldLabel htmlFor="test-url">서비스 URL *</FieldLabel>
          <Input
            id="test-url"
            placeholder="https://www.utmate.me"
            {...register('url')}
            autoComplete="off"
            aria-invalid={!!errors.url}
          />
          <FieldDescription>테스트할 서비스의 URL을 입력해주세요.</FieldDescription>
          {errors.url && <FieldError>{errors.url.message}</FieldError>}
        </Field>
      </FieldGroup>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-end border-t pt-6">
        <Button onClick={() => void onNext()}>다음</Button>
      </div>
    </div>
  );
}
