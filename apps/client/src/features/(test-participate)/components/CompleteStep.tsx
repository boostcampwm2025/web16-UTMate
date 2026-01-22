'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

import { useTestParticipateStore } from '../stores/useTestParticipateStore';

interface CompleteStepProps {
  testId: string;
}

export function CompleteStep({ testId }: CompleteStepProps) {
  const router = useRouter();
  const store = useTestParticipateStore(testId);
  const clearSession = store((state) => state.clearSession);

  const handleGoHome = () => {
    // 먼저 페이지 이동 후 세션 정리 (깜빡임 방지)
    router.push('/');
    // 페이지 이동 후 세션 정리
    setTimeout(() => {
      clearSession();
    }, 100);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl">참여해주셔서 감사합니다!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 감사 메시지 */}
        <div className="space-y-4 text-center">
          <div className="text-6xl">🎉</div>
          <div className="space-y-2">
            <p className="text-lg font-medium">테스트가 성공적으로 완료되었습니다.</p>
            <p className="text-muted-foreground text-sm">
              귀하의 소중한 데이터는 테스트를 만든 사람에게 큰 도움이 될 것입니다.
            </p>
            <p className="text-muted-foreground text-sm">다음에도 이용 부탁드립니다.</p>
          </div>
        </div>

        {/* 돌아가기 버튼 */}
        <Button className="w-full" size="lg" onClick={handleGoHome}>
          홈으로 돌아가기
        </Button>
      </CardContent>
    </Card>
  );
}
