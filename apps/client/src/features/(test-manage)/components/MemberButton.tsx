'use client';

import { PlusIcon } from 'lucide-react';

import { useDialogStore } from '@/shared/stores/useDialogStore';
import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { MemberManager } from './MemberManager';

import type { UserSummary } from '../types';

interface MemberButtonProps {
  isDemo: boolean;
  testId: string;
  owner: UserSummary;
  members: UserSummary[];
}

export function MemberButton({ isDemo, testId, owner, members }: MemberButtonProps) {
  const { confirm } = useDialogStore();
  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isDemo) return;

    await confirm(
      '테스트 멤버 관리',
      '테스트 멤버를 추가하여 테스트를 공유할 수 있습니다.',
      <MemberManager testId={testId} owner={owner} members={members} />,
      { hasCancel: false },
    );
  };

  const allMembers = [owner, ...members];

  return (
    <div className="flex justify-center -space-x-2" onClick={handleClick}>
      {allMembers.slice(0, 4).map((user, idx) => (
        <Tooltip key={user.publicId}>
          <TooltipTrigger asChild>
            <Avatar className="size-9">
              <AvatarImage src={user.avatarUrl} alt={user.username} />
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>{user.username}</TooltipContent>
        </Tooltip>
      ))}
      <Tooltip>
        <TooltipTrigger asChild>
          {!isDemo && (
            <Button
              variant="outline"
              className="z-10 size-9 rounded-full"
              onClick={handleClick}
              aria-label="멤버 추가"
            >
              <PlusIcon className="size-4" />
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent>테스트에 멤버를 추가하여 테스트를 공유할 수 있습니다.</TooltipContent>
      </Tooltip>
    </div>
  );
}
