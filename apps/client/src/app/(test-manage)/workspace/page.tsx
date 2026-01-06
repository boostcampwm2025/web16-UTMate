import { RecentTestSection } from '@/features/(test-manage)/components/RecentTestSection';

//TODO : 로그인한 사용자만 접근 가능하도록 프록시에서 처리
export default function WorkspacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-700">
      {/* Header */}
      <div className="px-8 py-12">
        {/* TODO : 사용자 이름 동적으로 출력 */}
        <h1 className="text-3xl font-bold text-white">환영합니다, userName님</h1>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-8 pb-12">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <RecentTestSection />
        </div>
      </div>
    </div>
  );
}
