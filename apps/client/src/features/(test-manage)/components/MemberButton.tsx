import { Settings } from 'lucide-react';
import { UserSummary } from '../types';
import { MemberManager } from './MemberManager';
import { useDialogStore } from '@/shared/stores/useDialogStore';

interface MemberButtonProps {
  testId: string;
  owner: UserSummary;
  members: UserSummary[];
}

export function MemberButton({ testId, owner, members }: MemberButtonProps) {
  const { confirm } = useDialogStore();
  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    await confirm(
      '테스트 멤버 관리',
      '공유 받을 멤버를 추가 삭제 할 수 있습니다.',
      <MemberManager testId={testId} owner={owner} members={members} />,
      { hasCancel: false },
    );
  };

  const allMembers = [owner, ...members];
  // 아바타 그룹을 컨테이너 중앙에 오도록 left 오프셋 계산
  const avatarCount = Math.min(allMembers.length, 4);
  const avatarSize = 28; // h-7 w-7 = 28px
  const overlap = 12; // 겹치는 정도
  const groupWidth = avatarCount > 1 ? avatarSize + (avatarCount - 1) * overlap : avatarSize;
  const containerWidth = 64;
  const startLeft = (containerWidth - groupWidth) / 2;

  return (
    <div className="relative inline-flex h-8 items-center gap-2" onClick={handleClick}>
      <div
        className="flex h-8 items-center justify-center"
        style={{
          width: `${containerWidth}px`,
          minWidth: `${containerWidth}px`,
          maxWidth: `${containerWidth}px`,
          position: 'relative',
        }}
      >
        {allMembers.slice(0, 4).map((user, idx) => (
          <img
            key={user.publicId}
            src={user.avatarUrl}
            alt={user.username}
            className="h-7 w-7 rounded-full border-2 border-white bg-white"
            style={{
              zIndex: 10 - idx,
              position: 'absolute',
              left: `${startLeft + idx * overlap}px`,
              top: '50%',
              transform: 'translateY(-50%)',
              transition: 'left 0.1s',
            }}
          />
        ))}
      </div>
    </div>
  );
}
