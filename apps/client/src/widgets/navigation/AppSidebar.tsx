'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/shared/components/ui/sidebar';
import { HomeIcon } from '@/shared/components/icons/HomeIcon';
import { TestIcon } from '@/shared/components/icons/TestIcon';
import { UsersIcon } from '@/shared/components/icons/UsersIcon';
import { CreditIcon } from '@/shared/components/icons/CreditIcon';
import { SettingsIcon } from '@/shared/components/icons/SettingsIcon';

/**
 * AppSidebar - shadcn/ui Sidebar를 사용한 앱 사이드바
 *
 * 메뉴 구성:
 * - Home (대시보드)
 * - 테스트 관리 (내가 만든 테스트)
 * - 공개 테스트 (다른 사람들의 테스트)
 * - 크레딧 (Beta)
 * - Settings
 */

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: 'Home',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    title: '테스트 관리',
    href: '/tests',
    icon: TestIcon,
  },
  {
    title: '공개 테스트',
    href: '/tests/public',
    icon: UsersIcon,
  },
  {
    title: '크레딧',
    href: '/credits',
    icon: CreditIcon,
    badge: 'Beta',
  },
];

const bottomNavItems: NavItem[] = [
  {
    title: 'Settings',
    href: '/settings',
    icon: SettingsIcon,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        {/* 메인 네비게이션 */}
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 하단 네비게이션 */}
      <SidebarFooter>
        <SidebarMenu>
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
