import type { Metadata } from 'next';

import { QueryClientProviders } from '@/providers/QueryClientProvider';

import './globals.css';

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
        <QueryClientProviders>{children}</QueryClientProviders>
      </body>
    </html>
  );
}
