'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';

export function TestResultSidebar() {
  const params = useParams();
  const pathname = usePathname();
  const testId = params.id as string;

  // 현재 경로에 따라 제목 결정
  const getTitle = () => {
    if (pathname.includes('/missions')) {
      return `${testId}번 테스트의 미션별 결과입니다`;
    }
    if (pathname.includes('/participants')) {
      return `${testId}번 테스트의 참여자별 결과입니다`;
    }
    return `${testId}번 테스트의 결과입니다`;
  };

  // 현재 활성화된 메뉴 확인
  const isActive = (path: string) => {
    if (path === `/tests/${testId}/result` && pathname === path) {
      return true;
    }
    if (path !== `/tests/${testId}/result` && pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <aside className="w-64 shrink-0 border-r bg-sidebar p-4 overflow-y-auto">
      <div className="space-y-3">
        <Link
          href={`/tests/${testId}/result`}
          className={`flex h-12 items-center rounded-lg px-4 font-medium transition-colors ${
            isActive(`/tests/${testId}/result`)
              ? 'bg-primary text-primary-foreground'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
          scroll={true}
        >
          서머리
        </Link>

        <Link
          href={`/tests/${testId}/result/missions`}
          className={`flex h-12 items-center rounded-lg px-4 font-medium transition-colors ${
            isActive(`/tests/${testId}/result/missions`)
              ? 'bg-primary text-primary-foreground'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
          scroll={true}
        >
          미션별 보기
        </Link>

        <Link
          href={`/tests/${testId}/result/participants`}
          className={`flex h-12 items-center rounded-lg px-4 font-medium transition-colors ${
            isActive(`/tests/${testId}/result/participants`)
              ? 'bg-primary text-primary-foreground'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
          scroll={true}
        >
          참여자별 보기
        </Link>

        <button
          disabled
          className="flex h-12 w-full items-center rounded-lg border border-gray-300 bg-white px-4 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          공유
        </button>
      </div>
    </aside>
  );
}
