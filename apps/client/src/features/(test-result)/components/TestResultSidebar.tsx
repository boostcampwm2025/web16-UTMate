'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Target, Users, Share2 } from 'lucide-react';

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
      title: '요약',
      href: `/tests/${testId}/result`,
      icon: LayoutDashboard,
    },
    {
      title: '미션별 보기',
      href: `/tests/${testId}/result/missions`,
      icon: Target,
    },
    {
      title: '참여자별 보기',
      href: `/tests/${testId}/result/participants`,
      icon: Users,
    },
  ];

  return (
    <aside className="bg-background w-64 shrink-0 overflow-y-auto border-r p-2">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors h-12',
                  'hover:bg-accent hover:text-accent-foreground',
                  active && 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}

          <button
            disabled
            className={cn(
              'flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors h-12',
              'text-muted-foreground opacity-50',
            )}
          >
            <Share2 className="h-4 w-4" />
            <span>공유</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
