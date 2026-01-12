import type { Metadata } from 'next';

import { QueryClientProviders } from '@/shared/providers/QueryClientProvider';
import { MSWProvider } from '@/shared/providers/MswProvider';

import '@/styles/globals.css';

// 서버 사이드 MSW 초기화 (SSR/SSG용)
if (
  process.env.NODE_ENV === 'development' &&
  typeof window === 'undefined' &&
  process.env.NEXT_PUBLIC_MSW_ENABLED === 'true'
) {
  const { server } = await import('@/shared/api/mocks/node');
  server.listen({ onUnhandledRequest: 'bypass' });
}

export const metadata: Metadata = {
  title: 'UTMate',
  description: '당신을 위한 사용성 테스트 솔루션',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <MSWProvider>
          <QueryClientProviders>{children}</QueryClientProviders>
        </MSWProvider>
      </body>
    </html>
  );
}
