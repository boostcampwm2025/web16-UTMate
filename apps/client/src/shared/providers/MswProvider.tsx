'use client';

import { type ReactNode, useEffect } from 'react';

export function MSWProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    async function enableMocking() {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        const { worker } = await import('@/shared/api/mocks/browser');
        await worker.start({ onUnhandledRequest: 'bypass' });
      }
    }

    enableMocking();
  }, []);

  return <>{children}</>;
}
