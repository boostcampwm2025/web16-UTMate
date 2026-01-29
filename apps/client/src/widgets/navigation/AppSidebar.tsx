'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Users, CreditCard, Calendar } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/shared/components/ui/sidebar';

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
  disabled?: boolean;
}

const navItems: NavItem[] = [
  {
    title: '홈',
    href: '/',
    icon: Home,
  },
  {
    title: '테스트 관리',
    href: '/workspace',
    icon: FileText,
  },
  {
    title: '테스트 참여',
    href: '/search',
    icon: Users,
    badge: 'New',
  },
  {
    title: '리워드',
    href: '/credits',
    icon: CreditCard,
    disabled: true,
    badge: 'Coming Soon',
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="bg-background">
      <SidebarContent>
        {/* 메인 네비게이션 */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                if (item.disabled) {
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        size="lg"
                        tooltip={item.title}
                        disabled
                        className="cursor-not-allowed opacity-50 group-data-[collapsible=icon]:justify-center"
                      >
                        <Icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.badge && (
                        <SidebarMenuBadge className="bg-muted text-muted-foreground">
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      size="lg"
                      tooltip={item.title}
                      isActive={isActive}
                      className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary group-data-[collapsible=icon]:justify-center"
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge className="bg-primary/10 text-primary">
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 하단 Trigger */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={isCollapsed ? '열기' : '닫기'}
              asChild
              className="border-input hover:bg-accent hover:text-accent-foreground h-8 w-8 justify-center border bg-transparent"
            >
              <SidebarTrigger />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
