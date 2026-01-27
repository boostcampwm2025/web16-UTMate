import { useState } from 'react';
import { UserSummary } from '../types';
import { addMemberToTest, findUserByUsername, removeMemberFromTest } from '../api/client';

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

  return (
    <div className="rounded-xl bg-white p-6">
      {/* 검색 영역 */}
      <div className="mb-2 flex gap-2">
        <input
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-lg focus:ring focus:outline-none"
          type="text"
          placeholder="닉네임 또는 이메일 입력"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <button
          className="rounded-lg bg-gray-800 px-5 py-2 text-lg font-semibold text-white hover:bg-gray-900"
          onClick={handleSearch}
        >
          검색
        </button>
      </div>
      {error && <div className="mb-6 text-xs text-red-500">{error}</div>}
      {/* 검색 결과 */}
      {searchResult && <div className="mb-2 text-base font-bold">검색 결과</div>}
      {searchResult && (
        <div key={searchResult.publicId} className="mt-2">
          <div className="flex items-center gap-4 rounded-lg bg-gray-50 px-4 py-3">
            <img
              src={searchResult.avatarUrl || '/default-avatar.png'}
              alt={searchResult.username}
              className="h-14 w-14 rounded-full border-2 border-gray-200 bg-white"
            />
            <div className="flex-1">
              <div className="text-xl font-bold">{searchResult.username}</div>
            </div>
            <button
              className="rounded bg-blue-500 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
              onClick={() => handleAdd(searchResult)}
            >
              추가
            </button>
          </div>
        </div>
      ))}
      {/* 기존 멤버 목록 */}
      <div className="mb-6">
        <div className="mb-2 text-base font-bold">기존 멤버 목록</div>
        <div className="space-y-3">
          {/* 소유자 */}
          <div className="flex items-center gap-4 rounded-lg bg-gray-50 px-4 py-3">
            <img
              src={owner.avatarUrl || '/default-avatar.png'}
              alt={owner.username}
              className="h-14 w-14 rounded-full border-2 border-gray-200 bg-white"
            />
            <div className="flex-1">
              <div className="text-xl font-bold">{owner.username}</div>
              <div className="mt-1 flex gap-2">
                <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700">
                  소유자
                </span>
              </div>
            </div>
          </div>
          {/* 멤버들 */}
          {memberList.map((m) => (
            <div
              key={m.publicId}
              className="flex items-center gap-4 rounded-lg bg-gray-50 px-4 py-3"
            >
              <img
                src={m.avatarUrl || '/default-avatar.png'}
                alt={m.username}
                className="h-14 w-14 rounded-full border-2 border-gray-200 bg-white"
              />
              <div className="flex-1">
                <div className="text-xl font-bold">{m.username}</div>
                <div className="mt-1 flex gap-2">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    편집자
                  </span>
                </div>
              </div>
              <button
                className="rounded bg-gray-200 px-4 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-red-500 hover:text-white"
                onClick={() => handleRemove(m)}
              >
                제거
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
