'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { SearchIcon } from '@/shared/components/icons/SearchIcon';
import { BellIcon } from '@/shared/components/icons/BellIcon';
import { getCurrentUser, logout } from '@/features/(auth)/apis';
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

export function GlobalNavigationBar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        // 인증 실패 시 로그인 페이지로 리다이렉트
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/'); // 랜딩 페이지로 리다이렉트
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  if (isLoading || !user) {
    return null; // 또는 스켈레톤 UI
  }

  const userInitials = user.username
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        {/* Sidebar Toggle 버튼 */}
        <SidebarTrigger />

        {/* 로고/서비스명 */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">UT</span>
          </div>
          <span className="hidden text-lg font-bold sm:inline-block">UTMate</span>
        </Link>

        {/* 검색 바 */}
        <div className="relative ml-auto flex-1 md:max-w-sm lg:max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="테스트 검색..."
            className="w-full pl-9"
          />
        </div>

        {/* 알림 아이콘 */}
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {/* 알림 배지 (새 알림이 있을 때만 표시) */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* 사용자 프로필 드롭다운 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatarUrl} alt={user.username} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.username}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  ID: {user.publicId}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">프로필</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">설정</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
