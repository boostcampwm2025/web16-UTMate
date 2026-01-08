'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { createTest } from '@/features/(test-manage)/api';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';

export function CreateTestButton() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [testName, setTestName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateTest = async () => {
    // 유효성 검사
    if (!testName.trim()) {
      setError('테스트 이름을 입력해주세요.');
      return;
    }

    if (testName.length < 2) {
      setError('테스트 이름은 최소 2자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // API 호출
      const test = await createTest();

      // 성공 시 쿼리 무효화
      await queryClient.invalidateQueries({ queryKey: ['tests'] });

      // 초기화 및 닫기
      setTestName('');
      setIsOpen(false);

      // 생성된 테스트 상세 페이지로 이동
      router.push(`/tests/${test.publicId}?mode=create`);
    } catch (err) {
      // 에러 처리
      const errorMessage =
        err instanceof Error ? err.message : '테스트 생성에 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
      console.error('테스트 생성 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    // Loading 중에는 Dialog를 닫을 수 없음
    if (loading && !open) {
      return;
    }

    setIsOpen(open);
    if (!open) {
      // Dialog 닫을 때 초기화
      setTestName('');
      setError('');
    }
  };

  const handleTestNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestName(e.target.value);
    if (error) setError('');
  };

  const handleCancel = () => {
    if (loading) return;
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg">새 테스트</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 테스트 생성하기</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field data-invalid={!!error}>
            <FieldLabel htmlFor="test-name">테스트 이름</FieldLabel>
            <Input
              id="test-name"
              placeholder="예: 주식모으기 서비스 테스트"
              value={testName}
              onChange={handleTestNameChange}
              aria-invalid={!!error}
              autoComplete="off"
              disabled={loading}
            />
            <FieldDescription>테스트를 식별할 수 있는 이름을 입력해주세요.</FieldDescription>
            {error && <FieldError>{error}</FieldError>}
          </Field>
        </FieldGroup>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            취소
          </Button>
          <Button variant="default" disabled={loading} onClick={handleCreateTest}>
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            생성하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
