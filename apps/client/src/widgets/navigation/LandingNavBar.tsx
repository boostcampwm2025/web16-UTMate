'use client';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';

/**
 * LandingNavBar - 랜딩 페이지 전용 네비게이션 바
 *
 * 구성 요소:
 * - 로고/서비스명 (UTMate)
 * - 로그인 버튼 (GitHub OAuth)
 *
 * 로그인되지 않은 사용자를 위한 심플한 네비게이션
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function LandingNavBar() {
  const handleLogin = () => {
    // GitHub OAuth 로그인 페이지로 이동
    window.location.href = `${API_URL}/api/auth/github`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 lg:px-6">
        {/* 로고/서비스명 */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">UT</span>
          </div>
          <span className="text-lg font-bold">UTMate</span>
        </Link>

        {/* 로그인 버튼 */}
        <Button onClick={handleLogin} size="lg">
          로그인
        </Button>
      </div>
    </header>
  );
}
