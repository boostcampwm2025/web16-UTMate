import { record } from '@rrweb/record';
import type { eventWithTime } from '@rrweb/types';
import pako from 'pako';

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
    if (document.visibilityState === 'hidden' && eventQueue.length > 0) {
      const jsonString = JSON.stringify({ events: eventQueue });
      const compressed = pako.gzip(jsonString);
      const blob = new Blob([compressed], { type: 'application/gzip' });
      navigator.sendBeacon(EVENT_SEND_URL, blob);
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

    const jsonString = JSON.stringify({ events });
    const compressed = pako.gzip(jsonString);

    await fetch(EVENT_SEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/gzip',
        credentials: 'include', //서로 다른 도메인(크로스 도메인)에 요청을 보낼 때 요청에 credential 정보(쿠키 등)를 담아서 보낼 지를 결정하는 항목
        // 다음 헤더가 들어가면 서버가 자동으로 해제함으로 포함하면 안됨 'Content-Encoding': 'gzip',
      },
      body: compressed,
    });
  }
})();
