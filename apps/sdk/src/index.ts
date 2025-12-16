import { record } from '@rrweb/record';
import type { eventWithTime } from '@rrweb/types';

import { EVENT_SEND_INTERVAL, EVENT_SEND_URL } from './constants';

(() => {
  if (!checkIsLwt()) {
    return;
  }

  let eventQueue: eventWithTime[] = [];

  record({
    emit(event) {
      eventQueue.push(event);
    },
  });

  // save events every 5 seconds
  setInterval(async () => {
    await sendEvents();
  }, EVENT_SEND_INTERVAL);

  // 세션 종료시 이벤트 전송
  // https://developer.mozilla.org/ko/docs/Web/API/Navigator/sendBeacon 참고
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      navigator.sendBeacon(EVENT_SEND_URL, JSON.stringify({ events: eventQueue }));
    }
  });

  /**
   * lwt 파라미터가 true인지 여부를 확인합니다.
   * @returns lwt 파라미터가 true인지 여부
   */
  function checkIsLwt(): boolean {
    const searchParams = new URLSearchParams(window.location.search);
    const isLwt = searchParams.get('lwt') === 'true';
    return isLwt;
  }

  async function sendEvents() {
    if (eventQueue.length === 0) return;

    const events = [...eventQueue];
    eventQueue = []; // 큐 초기화

    const body = JSON.stringify({ events });

    await fetch(EVENT_SEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        withCredentials: 'true',
      },
      body,
    });
  }
})();
