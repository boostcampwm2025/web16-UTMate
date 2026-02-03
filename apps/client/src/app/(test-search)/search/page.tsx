import { TestSearchPage } from '@/features/(test-search)/components/TestSearchPage';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '테스트 찾기 | UTMate',
  description: '다양한 사용성 테스트를 찾아보고 참여해보세요.',
};

export default function Page() {
  return (
    <Suspense fallback={<div></div>}>
      <TestSearchPage />
    </Suspense>
  );
}
