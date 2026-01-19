import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { TestResultSidebar } from '@/features/(test-result)/components/TestResultSidebar';
import { Button } from '@/shared/components/ui/button';

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
        <TestResultSidebar />
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
