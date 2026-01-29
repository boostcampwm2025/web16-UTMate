'use client';

import { type ReactNode, useEffect } from 'react';

export function MSWProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    async function enableMocking() {
      if (
        typeof window !== 'undefined' &&
        process.env.NODE_ENV === 'development' &&
        process.env.NEXT_PUBLIC_MSW_ENABLED === 'true'
      ) {
        const { worker } = await import('@/shared/api/mocks/browser');
        await worker.start({ onUnhandledRequest: 'bypass' });
      }
    }

    enableMocking();
  }, []);

  return <>{children}</>;
}
