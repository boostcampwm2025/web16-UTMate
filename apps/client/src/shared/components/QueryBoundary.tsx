'use client';

import { Suspense, ReactNode } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { AlertCircle, RotateCcw } from 'lucide-react';

import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';

interface QueryBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: (props: FallbackProps) => ReactNode;
}

/**
 * React Query와 Suspense, ErrorBoundary를 통합한 경계 컴포넌트
 */
export function QueryBoundary({
  children,
  fallback = <DefaultFallback />,
  errorFallback = (props) => <DefaultErrorFallback {...props} />,
}: QueryBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} fallbackRender={errorFallback}>
          <Suspense fallback={fallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

/**
 * 기본 로딩 폴백 컴포넌트 (스켈레톤 UI)
 */
export function DefaultFallback() {
  return <Skeleton className="h-50 w-full rounded-xl" />;
}

/**
 * 기본 에러 폴백 컴포넌트
 */
export function DefaultErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="border-destructive/20 bg-destructive/5 flex w-full flex-col items-center space-y-4 rounded-xl border-2 border-dashed p-6 text-center">
      <div className="bg-destructive/10 rounded-full p-3">
        <AlertCircle className="text-destructive h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-destructive font-semibold">데이터 로딩 에러</h3>
        <p className="text-muted-foreground max-w-[280px] text-sm">
          {(error as unknown as { message: string })?.message ||
            '알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.'}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={resetErrorBoundary}
        className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive gap-2"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        다시 시도
      </Button>
    </div>
  );
}
