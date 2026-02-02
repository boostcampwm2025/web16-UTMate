import Link from 'next/link';
import { Rocket } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

/**
 * Hero Section - 랜딩 페이지의 메인 히어로 섹션
 * UT의 의미와 핵심 가치 제안을 전달
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 배경 장식 */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary/5 absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-secondary/5 absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* 배지 */}
          <div className="bg-background/60 mb-8 inline-flex items-center rounded-full border px-4 py-2 text-sm backdrop-blur-sm">
            <span className="text-primary font-semibold">Usability Testing Platform</span>
          </div>

          {/* 메인 타이틀 */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">
              사용자 경험을
            </span>
            <br />
            <span className="from-primary to-primary/60 bg-linear-to-r bg-clip-text text-transparent">
              데이터로 증명하세요
            </span>
          </h1>

          {/* 서브 타이틀 */}
          <p className="text-muted-foreground mb-4 text-xl sm:text-2xl">
            <span className="text-foreground font-semibold">UTMate</span>는
          </p>
          <p className="text-muted-foreground mb-12 text-lg leading-relaxed sm:text-xl">
            실제 사용자의 행동 패턴과 피드백을 수집하여
            <br className="hidden sm:block" />더 나은 서비스를 만들 수 있도록 돕는 플랫폼입니다
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/workspace">
                <Rocket className="mr-2 size-4" />
                제작자로 시작하기
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href="/search">참여자로 시작하기</Link>
            </Button>
          </div>

          {/* 통계 */}
          <div className="mt-16 grid grid-cols-2 gap-8">
            <div>
              <div className="text-primary text-3xl font-bold">실시간</div>
              <div className="text-muted-foreground text-sm">분석 리포트</div>
            </div>
            <div>
              <div className="text-primary text-3xl font-bold">간편한</div>
              <div className="text-muted-foreground text-sm">테스트 설정</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
