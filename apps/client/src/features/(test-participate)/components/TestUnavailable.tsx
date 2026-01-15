import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface TestUnavailableProps {
  status: 'DRAFT' | 'COMPLETED' | 'PAUSED';
}

const statusMessages = {
  DRAFT: {
    emoji: '📝',
    title: '테스트 준비 중입니다',
    description: '이 테스트는 아직 준비 중이며 참여할 수 없습니다.',
  },
  COMPLETED: {
    emoji: '✅',
    title: '종료된 테스트입니다',
    description: '이 테스트는 이미 종료되어 더 이상 참여할 수 없습니다.',
  },
  PAUSED: {
    emoji: '⏸️',
    title: '일시 중지된 테스트입니다',
    description: '이 테스트는 일시적으로 중지되어 참여할 수 없습니다.',
  },
};

export function TestUnavailable({ status }: TestUnavailableProps) {
  const message = statusMessages[status];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{message.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl">{message.emoji}</div>
            <p className="text-muted-foreground mt-4 text-sm">{message.description}</p>
          </div>

          <Link href="/">
            <Button className="w-full" size="lg">
              홈으로 돌아가기
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
