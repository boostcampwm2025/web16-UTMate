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

          {/*TODO : 세로 스크롤용 더미 섹션입니다. 이후에 제거해주세요 */}
          {/* Dummy Section 1 */}
          <div className="mt-8 rounded-lg border bg-white p-8">
            <div className="mb-6">
              <div className="mb-2 h-8 w-48 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-96 animate-pulse rounded bg-gray-100" />
            </div>
            <div className="space-y-4">
              <div className="h-32 animate-pulse rounded-lg bg-gray-100" />
              <div className="h-32 animate-pulse rounded-lg bg-gray-100" />
              <div className="h-32 animate-pulse rounded-lg bg-gray-100" />
            </div>
          </div>

          {/* Dummy Section 2 */}
          <div className="mt-8 rounded-lg border bg-white p-8">
            <div className="mb-6">
              <div className="mb-2 h-8 w-64 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-80 animate-pulse rounded bg-gray-100" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-48 animate-pulse rounded-lg bg-gray-100" />
              <div className="h-48 animate-pulse rounded-lg bg-gray-100" />
              <div className="h-48 animate-pulse rounded-lg bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
