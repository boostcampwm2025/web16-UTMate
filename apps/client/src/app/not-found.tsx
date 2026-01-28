'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-6xl">404</div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-6 text-sm">
          요청하신 페이지가 존재하지 않거나 이동했을 수 있습니다.
          <br />
          URL을 다시 확인해주세요.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            홈으로 돌아가기
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-muted-foreground text-sm transition hover:text-gray-700"
          >
            이전 페이지로
          </button>
        </div>
      </div>
    </div>
  );
}
