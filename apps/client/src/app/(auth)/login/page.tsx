import Link from 'next/link';
import type { Metadata } from 'next';

import { LoginForm } from '@/features/(auth)/components/LoginForm';
import { UTMateCarousel } from '@/features/(auth)/components/UTMateCarousel';

export const metadata: Metadata = {
  title: '로그인 | UTMate',
  description: 'UTMate에 로그인하고 더 많은 서비스를 이용해보세요.',
};

export default function LoginPage() {
  return (
    <div className="bg-background grid min-h-screen w-full lg:grid-cols-2">
      {/* 왼쪽: 로그인 폼 영역 */}
      <div className="relative flex flex-col bg-white px-8 lg:px-16 xl:px-24">
        {/* 상단 헤더 (로고 ) */}
        <div className="flex items-center justify-between pt-8 pb-12">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-primary text-2xl font-black tracking-tighter">UT</span>
          </Link>
        </div>

        <div className="my-auto flex w-full max-w-[420px] flex-col self-center pb-20">
          <div className="mb-10 text-left">
            <p className="mb-2 text-sm font-semibold tracking-wide text-gray-400">
              돌아오신 것을 환영합니다
            </p>
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="from-primary to-primary/70 bg-linear-to-r bg-clip-text text-transparent">
                UTMate
              </span>{' '}
              로그인
            </h1>
          </div>

          <div className="space-y-8">
            {/* 로그인 폼 */}
            <LoginForm />
            {/* 서비스 약관 및 개인정보 처리방침 */}
            {/* TODO : 서비스 약관 및 개인정보 처리방침 링크 추가 & 문구를 더 부드럽게? */}
            {/* <div className="text-center">
              <p className="text-muted-foreground text-center text-xs lg:text-left">
                로그인하면{' '}
                <a href="#" className="text-primary hover:underline">
                  서비스 약관
                </a>
                과{' '}
                <a href="#" className="text-primary hover:underline">
                  개인정보 처리방침
                </a>
                에 동의하는 것으로 간주됩니다.
              </p>
            </div> */}
          </div>
        </div>
      </div>

      <UTMateCarousel />
    </div>
  );
}
