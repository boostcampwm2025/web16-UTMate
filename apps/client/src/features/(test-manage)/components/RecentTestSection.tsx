'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { getMyTestList } from '@/features/(test-manage)/api';
import { TestTable } from './TestTable';

export function RecentTestSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tests'],
    queryFn: getMyTestList,
  });

  const tests = data?.tests ?? [];
  return (
    <div className="mb-12">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">테스트</h2>
        </div>
        <div className="flex gap-2">
          <Button size="lg">새 테스트</Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-16">
          <div className="text-center">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-gray-600">테스트를 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 shrink-0 text-destructive" />
            <div>
              <h3 className="text-sm font-medium text-destructive-foreground">
                테스트를 불러오는데 실패했습니다
              </h3>
              <p className="mt-1 text-sm text-destructive">
                {error.message || '알 수 없는 오류가 발생했습니다.'}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => window.location.reload()}
              >
                다시 시도
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {!isLoading && !error && tests.length > 0 && <TestTable tests={tests} />}

      {/* Empty State */}
      {!isLoading && !error && tests.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-medium text-gray-900">테스트가 없습니다</h3>
            <p className="mt-2 text-sm text-gray-500">새로운 테스트를 생성하여 시작해보세요.</p>
            <Button size="lg" className="mt-4">
              새 테스트 만들기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
