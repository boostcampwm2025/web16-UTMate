import Link from 'next/link';

import { getCurrentUseronServer } from '@/features/(auth)/apis/server';
import { Logo } from '@/shared/components/Logo';
import { UserProfileDropdown } from './UserProfileDropdown';
import { Button } from '@/shared/components/ui/button';
import type { User } from '@/features/(auth)/types';


/**
 * GlobalNavigationBar - 로그인 후 상단 네비게이션 바
 *
 * 구성 요소:
 * - Sidebar Toggle 버튼 (접기/펼치기)
 * - 로고/서비스명 (UTMate)
 * - 검색 기능
 * - 알림 아이콘
 * - 사용자 프로필 드롭다운 (프로필, 설정, 로그아웃)
 */

export async function GlobalNavigationBar() {

  let user: User | null = null;
  try {
  user = await getCurrentUseronServer();
  } catch (error) {
    user = null;
  }

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
        {/* 로고/서비스명 */}
        <Link href="/workspace" className="flex items-center gap-2">
          <Logo size="lg" />
        </Link>

        {/* 사용자 프로필 드롭다운 */}
        {user && <UserProfileDropdown user={user} />}
        {!user && <Link href="/login"><Button>로그인</Button></Link>}
      </div>
    </header>
  );
}
