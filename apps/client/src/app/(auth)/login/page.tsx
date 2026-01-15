import { LoginForm } from '@/features/(auth)/components/LoginForm';
import { UTMateCarousel } from '@/features/(auth)/components/UTMateCarousel';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-2xl border border-border shadow-2xl lg:grid-cols-2">
        {/* 왼쪽: 로그인 폼 */}
        <div className="flex flex-col justify-center bg-card p-8 sm:p-12 lg:p-16">
          <div className="mx-auto w-full max-w-md space-y-8">
            {/* 로고/헤더 */}
            <div className="text-center lg:text-left">
              <div className="mb-4 inline-flex items-center justify-center lg:justify-start">
                {/* TODO : UTMate 로고 이미지 */}
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  UTMate
                </span>{' '}
                로그인
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                GitHub 계정으로 간편하게 시작하세요
              </p>
            </div>

            {/* 로그인 폼 */}
            <div>
              <LoginForm />
            </div>

            {/* 푸터 텍스트 */}
            <p className="text-center text-xs text-muted-foreground lg:text-left">
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
          </div>
        </div>

        {/* 오른쪽: UTMate Carousel */}
        <div className="hidden bg-linear-to-br from-primary/5 via-background to-secondary/5 lg:block">
          <UTMateCarousel />
        </div>
      </div>
    </div>
  );
}
