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
import { Textarea } from '@/shared/components/ui/textarea';

interface TestInfoStepProps {
  title: string;
  description: string;
  url: string;
  error: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onNext: () => void | Promise<void>;
}

export function TestInfoStep({
  title,
  description,
  url,
  error,
  onTitleChange,
  onDescriptionChange,
  onUrlChange,
  onNext,
}: TestInfoStepProps) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTitleChange(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onDescriptionChange(e.target.value);
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
          <FieldLabel htmlFor="test-title">테스트 이름 *</FieldLabel>
          <Input
            id="test-title"
            placeholder="예: 주식모으기 서비스 테스트"
            value={title}
            onChange={handleTitleChange}
            aria-invalid={!!error}
            autoComplete="off"
          />
          <FieldDescription>테스트를 식별할 수 있는 이름을 입력해주세요.</FieldDescription>
          {error && <FieldError>{error}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="test-description">테스트 설명</FieldLabel>
          <Textarea
            id="test-description"
            placeholder="테스트에 대한 설명을 입력해주세요."
            value={description}
            onChange={handleDescriptionChange}
            rows={3}
          />
          <FieldDescription>테스트의 목적과 내용을 간단히 설명해주세요.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="test-url">서비스 URL *</FieldLabel>
          <Input
            id="test-url"
            placeholder="https://www.utmate.me"
            value={url}
            onChange={handleUrlChange}
            autoComplete="off"
            required
          />
          <FieldDescription>
            테스트할 서비스의 URL을 입력해주세요.
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
