import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function ParticipateNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">테스트를 찾을 수 없습니다</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl">🔍</div>
            <p className="text-muted-foreground mt-4 text-sm">
              요청하신 테스트가 존재하지 않거나 삭제되었습니다.
            </p>
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
