'use client';

import { Copy, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { verifySdkInstallation } from '@/shared/api/test';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';

const SDK_URL = process.env.NEXT_PUBLIC_SDK_DOMAIN || 'https://utmate.me/sdk/utmate-sdk.iife.js';
const SDK_CODE = `<script async src="${SDK_URL}"></script>`;

interface TestSdkStepProps {
  testId: string;
  initialSdkStatus: boolean;
}

export function TestSdkStep({ testId, initialSdkStatus }: TestSdkStepProps) {
  const [sdkStatus, setSdkStatus] = useState(initialSdkStatus);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleVerifySdk = async () => {
    try {
      setIsVerifying(true);
      setVerifyError(null);
      const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 800));
      const response = await verifySdkInstallation(testId);
      await minLoadingTime;
      setSdkStatus(response.sdkStatus);
    } catch (err) {
      console.error('SDK 연동 확인 실패:', err);
    } finally {
      setIsVerifying(false);
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
              <code>{SDK_CODE}</code>
            </pre>
            <CopyToClipboardButton text={SDK_CODE} className="absolute top-2 right-2" />
          </div>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">2. SDK 연동 확인</h3>
          <p className="mb-4 text-sm text-gray-600">아래 버튼을 눌러서 확인하세요</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleVerifySdk} disabled={isVerifying}>
              {isVerifying && <Loader2 className="mr-2 size-4 animate-spin" />}확인
            </Button>
            {sdkStatus ? (
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="text-success mr-2 size-4" />
                SDK 연동이 확인되었습니다.
              </div>
            ) : (
              <div className="flex items-center text-sm text-gray-600">
                <XCircle className="text-destructive mr-2 size-4" />
                SDK 연동이 확인되지 않았습니다.
              </div>
            )}
            {verifyError && (
              <div className="flex items-center text-sm text-gray-600">
                <XCircle className="text-destructive mr-2 size-4" />
                {verifyError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
