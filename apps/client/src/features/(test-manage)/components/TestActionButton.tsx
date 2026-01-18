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
import { useDialogStore } from '@/shared/stores/useDialogStore';

import { TestParticipateLinkCheck } from './TestParticipateLinkCheck';

interface TestActionButtonProps {
  testId: string;
  testStatus: TestStatus;
}

export function TestActionButton({ testId, testStatus }: TestActionButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { confirm, setLoading, close } = useDialogStore();

  const handlePublish = async () => {
    const confirmed = await confirm('테스트 공개', '한번 공개된 테스트는 수정이 불가능합니다.');

    if (!confirmed) return;

    setLoading(true);
    const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 800));
    try {
      await updateTestStatus(testId, TestStatus.PUBLISHED);
      await minLoadingTime;
      await queryClient.invalidateQueries({ queryKey: ['tests'] });
      close();

      await confirm(
        '테스트 공개',
        '테스트가 공개되었습니다. 테스트 참여링크는 작업 > 참여 링크 확인 버튼을 통해 확인할 수 있습니다.',
        <TestParticipateLinkCheck testId={testId} />,
        { hasCancel: false },
      );
    } catch (error) {
      await confirm(
        '테스트 공개 실패',
        error instanceof Error ? error.message : '테스트 공개에 실패했습니다.',
        null,
        { isAlert: true, hasCancel: false },
      );
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    const confirmed = await confirm('테스트 종료', '한번 종료된 테스트는 다시 공개할 수 없습니다.');

    if (!confirmed) return;

    setLoading(true);
    const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 800));
    try {
      await updateTestStatus(testId, TestStatus.ARCHIVED);
      await minLoadingTime;
      await queryClient.invalidateQueries({ queryKey: ['tests'] });
      close();
    } catch (error) {
      await confirm(
        '테스트 종료 실패',
        error instanceof Error ? error.message : '테스트 종료에 실패했습니다.',
        null,
        { isAlert: true, hasCancel: false },
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm(
      '테스트 삭제',
      '정말로 이 테스트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      null,
      { isAlert: true },
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
        null,
        { isAlert: true, hasCancel: false },
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTestParticipateLinkCheck = async () => {
    const confirmed = await confirm(
      '참여 링크 확인',
      '참여 링크를 테스트 참여자에게 공유하여 테스트를 시작하세요.',
      <TestParticipateLinkCheck testId={testId} />,
    );

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
