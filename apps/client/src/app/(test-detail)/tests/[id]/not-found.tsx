import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';

//TODO : 스타일 수정
export default function TestNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-xl text-gray-600">테스트를 찾을 수 없습니다</p>
        <p className="mt-2 text-gray-500">존재하지 않거나 삭제된 테스트입니다.</p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
