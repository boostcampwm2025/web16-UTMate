import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-primary-50 via-white to-secondary-50">
      <main className="flex flex-col items-center gap-8 p-8">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-5xl font-bold bg-linear-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            UT MVP
          </h1>
          <p className="text-gray-600">사용자 테스트 플랫폼</p>
        </div>

        <div className="flex gap-4 mt-8">
          <Link
            href="/test"
            className="px-8 py-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            테스트 시작하기
          </Link>
        </div>
      </main>
    </div>
  );
}
