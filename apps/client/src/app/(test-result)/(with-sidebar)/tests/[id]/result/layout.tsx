import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';

import { TestResultSidebar } from '@/features/(test-result)/components/TestResultSidebar';
import {getTestByIdonServer}  from '@/features/(test-detail)/api/server';
import { Button } from '@/shared/components/ui/button';
import { ApiError } from '@/shared/constants/api';
import type { TestDetail } from '@/features/(test-manage)/types';


export default async function TestResultLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: testId } = await params;

  let testDetail: TestDetail;
  try {
    testDetail = await getTestByIdonServer(testId);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.statusCode === 404 || error.statusCode === 403 ) {
        notFound();
      } else if (error.statusCode === 401) {
        redirect('/login');
      }
    }
    throw error;
  }

  if (!testDetail) {
    return notFound();
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top Header */}
      <header className="flex h-16 shrink-0 items-center justify-start gap-3 border-b bg-background px-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/workspace">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">{testDetail.title}</h1>
      </header>

      {/* Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        <TestResultSidebar />
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">{children}</main>
      </div>
    </div>
  );
}
