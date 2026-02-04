import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { QueryClientProviders } from '@/shared/providers/QueryClientProvider';
import { MSWProvider } from '@/shared/providers/MswProvider';
import { WebVitalsCollector } from '@/shared/components/WebVitalsCollector';
import { DialogProvider } from '@/shared/providers/DialogProvider';

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
  title: 'UTMate | 사용성 테스트 플랫폼',
  description: '세상에서 제일 쉬운 사용성 테스트 플랫폼, UTMate',
  keywords: [
    'UT',
    'usability testing',
    'user testing',
    'UX',
    'remote testing',
    '사용성 테스트',
    'UTMate',
  ],
  openGraph: {
    title: 'UTMate | 사용성 테스트 플랫폼',
    description: '세상에서 제일 쉬운 사용성 테스트 플랫폼, UTMate',
    url: 'https://utmate.me',
    siteName: 'UTMate',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UTMate | 사용성 테스트 플랫폼',
    description: '세상에서 제일 쉬운 사용성 테스트 플랫폼, UTMate',
  },
  icons: {
    icon: '/favicon.ico',
  },
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
          <NuqsAdapter>
            <QueryClientProviders>
              {children}
              <DialogProvider />
            </QueryClientProviders>
          </NuqsAdapter>
        </MSWProvider>

        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID as string} />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && <WebVitalsCollector />}
      </body>
      <script async src="https://utmate.me/sdk/utmate-sdk.iife.js"></script>
    </html>
  );
}
