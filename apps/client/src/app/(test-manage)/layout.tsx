import { SidebarProvider } from '@/shared/components/ui/sidebar';
import { GlobalNavigationBar } from '@/widgets/navigation/GlobalNavigationBar';
import { AppSidebar } from '@/widgets/navigation/AppSidebar';

/**
 * Test Manage Layout - 테스트 관리 페이지 레이아웃
 */

export default function TestManageLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <GlobalNavigationBar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
