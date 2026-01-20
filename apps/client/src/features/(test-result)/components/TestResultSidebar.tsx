'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/shared/utils';

export function TestResultSidebar() {
  const params = useParams();
  const pathname = usePathname();
  const testId = params.id as string;

  // 현재 활성화된 메뉴 확인
  const isActive = (path: string) => {
    if (path === `/tests/${testId}/result` && pathname === path) {
      return true;
    }
    if (path !== `/tests/${testId}/result` && pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  const navItems = [
    {
      label: '서머리',
      href: `/tests/${testId}/result`,
    },
    {
      label: '미션별 보기',
      href: `/tests/${testId}/result/missions`,
    },
    {
      label: '참여자별 보기',
      href: `/tests/${testId}/result/participants`,
    },
  ];

  return (
    <aside className="bg-sidebar w-64 shrink-0 overflow-y-auto border-r p-4">
      <div className="space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex h-12 items-center rounded-lg px-4 font-medium transition-colors',
              isActive(item.href)
                ? 'bg-primary text-primary-foreground'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
            )}
          >
            {item.label}
          </Link>
        ))}

        <button
          disabled
          className="flex h-12 w-full items-center rounded-lg border border-gray-300 bg-white px-4 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          공유
        </button>
      </div>
    </aside>
  );
}
