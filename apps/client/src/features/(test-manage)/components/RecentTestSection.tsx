'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { getMyTestList } from '@/features/(test-manage)/api/client';
import { TestTable } from './TestTable';
import { CreateTestButton } from './CreateTestButton';

export function RecentTestSection() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['tests'],
    queryFn: getMyTestList,
  });

  const tests = data ?? [];
  const isSuccess = !isPending && !isError;

  return (
    <div className="mb-12">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">내 테스트</h2>
        </div>
        <div className="flex gap-2">
          <CreateTestButton />
        </div>
      </div>

      {isPending && (
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-16">
          <div className="text-center">
            <Loader2 className="text-primary mx-auto mb-4 h-8 w-8 animate-spin" />
            <p className="text-sm text-gray-600">테스트를 불러오는 중...</p>
          </div>
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-destructive h-6 w-6 shrink-0" />
            <div>
              <h3 className="text-destructive-foreground text-sm font-medium">
                테스트를 불러오는데 실패했습니다
              </h3>
              <p className="text-destructive mt-1 text-sm">
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

      {isSuccess && tests.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-medium text-gray-900">테스트가 없습니다</h3>
            <p className="mt-2 text-sm text-gray-500">새로운 테스트를 생성하여 시작해보세요.</p>
          </div>
        </div>
      )}

      {isSuccess && tests.length > 0 && <TestTable tests={tests} />}
    </div>
  );
}
