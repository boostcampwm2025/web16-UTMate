'use client';

import { useState } from 'react';

import { Plus, Minus } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';

import { addMemberToTest, findUserByUsername, removeMemberFromTest } from '../api/client';

import type { UserSummary } from '../types';

interface MemberModalProps {
  testId: string;
  owner: UserSummary;
  members: UserSummary[];
}

export function MemberManager({ testId, members, owner }: MemberModalProps) {
  const [input, setInput] = useState('');
  const [memberList, setMemberList] = useState<UserSummary[]>(members);
  const [error, setError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<UserSummary | null>(null);

  // 검색 버튼 클릭 시 (실제 구현시 API 연동 필요)
  const handleSearch = async () => {
    try {
      const findUser = await findUserByUsername(input.trim());
      if (!findUser) {
        setError('일치하는 사용자가 없습니다.');
        setSearchResult(null);
        return;
      }

      setSearchResult(findUser);
      setError(null);
    } catch (error: any) {
      setError(error.message || '사용자 검색에 실패했습니다. 다시 시도해주세요.');
      setSearchResult(null);
      return;
    }
  };

  // 멤버 추가
  const handleAdd = async (user: UserSummary) => {
    if (user.publicId === owner.publicId || memberList.some((m) => m.publicId === user.publicId)) {
      setError('이미 추가된 멤버입니다.');
      return;
    }

    try {
      await addMemberToTest(testId, user.publicId);
      setMemberList([...memberList, user]);
      setSearchResult(null);
      setInput('');
      setError(null);
    } catch (error) {
      setError('멤버 추가에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 멤버 삭제
  const handleRemove = async (user: UserSummary) => {
    try {
      await removeMemberFromTest(testId, user.publicId);
      setMemberList(memberList.filter((m) => m.publicId !== user.publicId));
    } catch (error) {
      setError('멤버 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="mt-4 flex flex-col space-y-2">
      {/* 검색 영역 */}
      <div className="mb-2 flex gap-2">
        <Input
          type="text"
          placeholder="닉네임 또는 이메일 입력"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <Button className="h-10" onClick={handleSearch}>
          검색
        </Button>
      </div>
      {error && <div className="text-destructive text-sm">{error}</div>}
      {/* 검색 결과 */}
      {searchResult && <div className="text-base font-semibold">검색 결과</div>}
      {searchResult && (
        <div key={searchResult.publicId}>
          <div className="flex items-center gap-4 rounded-lg bg-gray-100 px-4 py-3">
            <Avatar className="size-14">
              <AvatarImage src={searchResult.avatarUrl} alt={searchResult.username} />
            </Avatar>
            <div className="flex-1">
              <div className="text-lg font-semibold">{searchResult.username}</div>
            </div>
            <Button
              variant="outline"
              className="h-10 rounded-full"
              onClick={() => handleAdd(searchResult)}
              aria-label={`${searchResult.username}님을 멤버로 추가`}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      )}
      {/* 기존 멤버 목록 */}
      <div className="mb-6">
        <div className="space-y-3">
          {/* 소유자 */}
          <div>
            <div className="mb-2 text-base font-semibold">기존 멤버 목록</div>
            <div className="flex items-center gap-4 rounded-lg bg-gray-100 px-4 py-3">
              <Avatar className="size-14">
                <AvatarImage src={owner.avatarUrl} alt={owner.username} />
              </Avatar>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-800">{owner.username}</div>
                <Badge variant="outline" className="bg-white">
                  소유자
                </Badge>
              </div>
            </div>
          </div>
          {/* 멤버들 */}
          <ul>
            {memberList.map((m) => (
              <li
                key={m.publicId}
                className="flex items-center gap-4 rounded-lg bg-gray-50 px-4 py-3"
              >
                <Avatar className="size-14">
                  <AvatarImage src={m.avatarUrl} alt={m.username} />
                </Avatar>
                <div className="flex-1">
                  <div className="text-xl font-bold text-gray-800">{m.username}</div>
                  <div className="mt-1 flex gap-2">
                    <Badge variant="outline" className="bg-white">
                      편집자
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="h-10 rounded-full"
                  onClick={() => handleRemove(m)}
                  aria-label={`${m.username}님을 멤버에서 제거`}
                >
                  <Minus className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
