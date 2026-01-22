import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';

import { TestResultSidebar } from '@/features/(test-result)/components/TestResultSidebar';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default async function TestResultLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: testId } = await params;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top Header */}
      <header className="flex h-16 shrink-0 items-center justify-start gap-3 border-b bg-white px-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/workspace">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">{testId}번 테스트의 결과입니다</h1>
      </header>

      {/* Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        <Suspense
          fallback={
            <aside className="bg-background w-64 shrink-0 overflow-y-auto border-r p-2">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </aside>
          }
        >
          <TestResultSidebar />
        </Suspense>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">{children}</main>
      </div>
    </div>
  );
}
