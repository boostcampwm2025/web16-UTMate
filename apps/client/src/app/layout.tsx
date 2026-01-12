import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';

import { QueryClientProviders } from '@/shared/providers/QueryClientProvider';
import { MSWProvider } from '@/shared/providers/MswProvider';
import { WebVitalsCollector } from '@/shared/components/WebVitalsCollector';

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
  title: 'UT MVP',
  description: 'User Testing MVP',
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
        <WebVitalsCollector />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID as string} />
      </body>
    </html>
  );
}
