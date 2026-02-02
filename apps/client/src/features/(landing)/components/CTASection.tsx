import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';

/**
 * CTA Section - Call to Action 섹션
 * 사용자에게 서비스 이용을 유도
 */
export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-r from-primary to-primary/80 py-24">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute left-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:24px_24px]" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:32px_32px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            지금 바로 시작해보세요
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/90 sm:text-xl">
            5분이면 첫 번째 사용성 테스트를 시작할 수 있습니다.
            <br className="hidden sm:block" />
            복잡한 설정 없이 GitHub 로그인만으로 간편하게 시작하세요.
          </p>

          {/* CTA 버튼 */}
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="w-full max-w-xs bg-white text-primary hover:bg-white/90"
          >
            <Link href="/login" aria-label="로그인 페이지로 이동하여 무료로 시작하기">
              무료로 시작하기
            </Link>
          </Button>

          {/* 추가 정보 */}
          <div className="mt-12 flex flex-col items-center justify-center gap-6 text-sm text-primary-foreground/80 sm:flex-row sm:gap-12">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>설치 과정 없음</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>즉시 사용 가능</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
