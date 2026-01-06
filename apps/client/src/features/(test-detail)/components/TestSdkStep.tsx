'use client';

import { Copy, Loader2 } from 'lucide-react';
import { useState } from 'react';

import type { Test } from '@/features/(test-manage)/types';
import { Button } from '@/shared/components/ui/button';

interface TestSdkStepProps {
  test: Test;
  onPrev: () => void;
  onSave: () => Promise<void>;
  loading: boolean;
}

export function TestSdkStep({ test, onPrev, onSave, loading }: TestSdkStepProps) {
  const [copied, setCopied] = useState(false);

  const sdkCode = `<script src="https://cdn.utmate.com/sdk.js"></script>
<script>
  UTMate.init({
    testId: '${test.id}',
  });
</script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sdkCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold">SDK 연동</h2>
        <p className="text-gray-600">대충 SDK를 왜 연결해야하는지 설명</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">1. SDK 코드를 웹사이트에 추가</h3>
          <p className="mb-4 text-sm text-gray-600">
            아래 코드를 테스트할 웹사이트의 {`<head>`} 태그 안에 추가하세요.
          </p>

          {/* TODO: SDK 배포 우리 SDK에 맞게 내용 수정 */}
          <div className="relative">
            <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
              <code>{sdkCode}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="absolute right-2 top-2"
            >
              {copied ? (
                <>✓ 복사됨</>
              ) : (
                <>
                  <Copy className="mr-1 size-4" />
                  복사
                </>
              )}
            </Button>
          </div>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">2. SDK 연동 확인</h3>
          <p className="mb-4 text-sm text-gray-600">아래 버튼을 눌러서 확인하세요</p>
          {/* TODO: SDK 연동 확인 API 구현 후 연동 */}
          <Button variant="outline" size="sm">
            확인
          </Button>
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={onPrev}>
          이전
        </Button>
        <Button onClick={onSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
          저장하기
        </Button>
      </div>
    </div>
  );
}
