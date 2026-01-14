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
import { deleteTest } from '@/features/(test-manage)/api';

interface TestActionButtonProps {
  testId: string;
}

export function TestActionButton({ testId }: TestActionButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('정말로 이 테스트를 삭제하시겠습니까?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTest(testId);
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    } catch (error) {
      alert(error instanceof Error ? error.message : '테스트 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
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
          disabled={isDeleting}
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleUpdate} className="cursor-pointer text-base">
          수정
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="cursor-pointer text-base"
        >
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
