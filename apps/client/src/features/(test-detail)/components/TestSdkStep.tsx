'use client';

import { Copy } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';

interface TestSdkStepProps {
  testPublicId: string;
}

export function TestSdkStep({ testPublicId }: TestSdkStepProps) {
  const [copied, setCopied] = useState(false);

  const sdkCode = `<script src="https://cdn.utmate.com/sdk.js"></script>
<script>
  UTMate.init({
    testId: '${testPublicId}',
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
        <p className="text-gray-600">
          스크립트를 웹사이트에 추가하고 사용자 로그를 확인하세요. 해당 스크립트는 테스트 환경에서만
          실행됩니다.
        </p>
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
              className="absolute top-2 right-2"
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
    </div>
  );
}
