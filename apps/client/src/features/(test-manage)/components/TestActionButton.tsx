'use client';

import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { deleteTest, updateTestStatus } from '@/features/(test-manage)/api';
import { TestStatus } from '@/features/(test-manage)/types';
import { useConfirmStore } from '@/shared/stores/useConfrimStore';

interface TestActionButtonProps {
  testId: string;
  testStatus: TestStatus;
}

export function TestActionButton({ testId, testStatus }: TestActionButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { confirm, setLoading, close } = useConfirmStore();

  const handleStatusChange = async (status: TestStatus) => {
    const actionLabel = status === TestStatus.PUBLISHED ? '공개' : '종료';
    const confirmed = await confirm(
      `테스트 ${actionLabel}`,
      `정말로 이 테스트를 ${actionLabel}하시겠습니까?`,
    );

    if (!confirmed) return;

    setLoading(true);
    const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 800));
    try {
      await updateTestStatus(testId, status);
      await minLoadingTime;
      await queryClient.invalidateQueries({ queryKey: ['tests'] });
      close();
    } catch (error) {
      await confirm(
        `테스트 ${actionLabel} 실패`,
        error instanceof Error ? error.message : `테스트 ${actionLabel}에 실패했습니다.`,
        { isAlert: true },
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    await handleStatusChange(TestStatus.PUBLISHED);
  };

  const handleArchive = async () => {
    await handleStatusChange(TestStatus.ARCHIVED);
  };

  const handleDelete = async () => {
    const confirmed = await confirm(
      '테스트 삭제',
      '정말로 이 테스트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      {
        isAlert: true,
      },
    );

    if (!confirmed) return;

    setLoading(true);
    const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 800));
    try {
      await deleteTest(testId);
      await minLoadingTime;
      await queryClient.invalidateQueries({ queryKey: ['tests'] });
      close();
    } catch (error) {
      await confirm(
        '테스트 삭제 실패',
        error instanceof Error ? error.message : '테스트 삭제에 실패했습니다.',
        { isAlert: true },
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTestParticipateLinkCheck = async () => {
    const isDev = process.env.NODE_ENV === 'development';
    const baseUrl = isDev ? 'http://localhost:3000' : 'https://utmate.me';
    const url = `${baseUrl}/participate/${testId}/`;

    //TODO : 테스트 링크 복사 기능 추가
    const confirmed = await confirm('참여 링크 확인', `참여 링크: ${url}`);

    if (!confirmed) return;
  };

  const handleUpdate = () => {
    router.push(`/tests/${testId}?mode=edit`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full text-gray-400 transition-colors hover:text-gray-600"
          disabled={isUpdating}
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleUpdate} className="cursor-pointer text-base">
          수정
        </DropdownMenuItem>
        {testStatus === TestStatus.DRAFT && (
          <DropdownMenuItem
            onClick={handlePublish}
            disabled={isUpdating}
            className="cursor-pointer text-base"
          >
            공개
          </DropdownMenuItem>
        )}
        {testStatus === TestStatus.PUBLISHED && (
          <DropdownMenuItem
            onClick={handleTestParticipateLinkCheck}
            disabled={isUpdating}
            className="cursor-pointer text-base"
          >
            참여 링크 확인
          </DropdownMenuItem>
        )}
        {testStatus === TestStatus.PUBLISHED && (
          <DropdownMenuItem
            onClick={handleArchive}
            disabled={isUpdating}
            className="cursor-pointer text-base"
          >
            종료
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          variant="destructive"
          onClick={handleDelete}
          disabled={isUpdating}
          className="cursor-pointer text-base"
        >
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
