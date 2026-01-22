import { RecentTestSection } from '@/features/(test-manage)/components/RecentTestSection';

//TODO : 로그인한 사용자만 접근 가능하도록 프록시에서 처리
export default function WorkspacePage() {
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Background Color - Top Section Only */}
      <div className="bg-primary absolute top-0 right-0 left-0 h-64" />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="px-8 py-12">
          {/* TODO : 사용자 이름 동적으로 출력 */}
          <h1 className="text-primary-foreground text-3xl font-bold">환영합니다.</h1>
        </div>

        {/* Main Content */}
        <div className="mx-auto px-8 pb-12">
          <div className="rounded-lg border bg-white p-8">
            <RecentTestSection />
          </div>
        </div>
      </div>
    </div>
  );
}
