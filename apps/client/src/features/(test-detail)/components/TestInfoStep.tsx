'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';

interface TestInfoStepProps {
  name: string;
  integrationUrl: string;
  error: string;
  onNameChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onNext: () => void | Promise<void>;
}

export function TestInfoStep({
  name,
  integrationUrl,
  error,
  onNameChange,
  onUrlChange,
  onNext,
}: TestInfoStepProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(e.target.value);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUrlChange(e.target.value);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold">테스트 기본 정보</h2>
        <p className="text-gray-600">테스트의 기본 정보를 설정해주세요.</p>
      </div>

      <FieldGroup>
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor="test-name">테스트 이름 *</FieldLabel>
          <Input
            id="test-name"
            placeholder="예: 주식모으기 서비스 테스트"
            value={name}
            onChange={handleNameChange}
            aria-invalid={!!error}
            autoComplete="off"
          />
          <FieldDescription>테스트를 식별할 수 있는 이름을 입력해주세요.</FieldDescription>
          {error && <FieldError>{error}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="integration-url">서비스 URL</FieldLabel>
          <Input
            id="integration-url"
            placeholder="https://www.utmate.me"
            value={integrationUrl}
            onChange={handleUrlChange}
            autoComplete="off"
          />
          <FieldDescription>
            운영 중인 서비스의 URL을 입력해주세요. 통계 및 서비스 개선에 사용됩니다.
          </FieldDescription>
        </Field>
      </FieldGroup>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-end border-t pt-6">
        <Button onClick={() => void onNext()}>다음</Button>
      </div>
    </div>
  );
}
