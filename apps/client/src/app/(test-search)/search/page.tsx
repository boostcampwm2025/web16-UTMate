import { TestSearchPage } from '@/features/(test-search)/components/TestSearchPage';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div></div>}>
      <TestSearchPage />
    </Suspense>
  );
}
