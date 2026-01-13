import { sendGAEvent as originalSendGAEvent } from '@next/third-parties/google';

export function sendGAEvent(eventName: string, params: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'production') {
    originalSendGAEvent('event', eventName, params);
  } else {
    console.log('[GA Debug]', eventName, params);
  }
}
