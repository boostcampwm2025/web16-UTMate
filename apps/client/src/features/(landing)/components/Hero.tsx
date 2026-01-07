import Link from 'next/link';
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
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* 배지 */}
          <div className="mb-8 inline-flex items-center rounded-full border bg-background/60 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="font-semibold text-primary">User Testing Platform</span>
          </div>

          {/* 메인 타이틀 */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">
              사용자 경험을
            </span>
            <br />
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              데이터로 증명하세요
            </span>
          </h1>

          {/* 서브 타이틀 */}
          <p className="mb-4 text-xl text-muted-foreground sm:text-2xl">
            <span className="font-semibold text-foreground">UT (User Testing)</span>는
          </p>
          <p className="mb-12 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            실제 사용자의 행동 패턴과 피드백을 수집하여
            <br className="hidden sm:block" />
            더 나은 서비스를 만들 수 있도록 돕는 플랫폼입니다
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/login">
                지금 시작하기
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="#features">
                서비스 알아보기
              </Link>
            </Button>
          </div>

          {/* 통계 */}
          <div className="mt-16 grid grid-cols-2 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary">실시간</div>
              <div className="text-sm text-muted-foreground">분석 리포트</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">간편한</div>
              <div className="text-sm text-muted-foreground">테스트 설정</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
