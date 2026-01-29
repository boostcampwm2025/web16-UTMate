import { SidebarProvider } from '@/shared/components/ui/sidebar';
import { GlobalNavigationBar } from '@/widgets/navigation/GlobalNavigationBar';
import { AppSidebar } from '@/widgets/navigation/AppSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <GlobalNavigationBar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
