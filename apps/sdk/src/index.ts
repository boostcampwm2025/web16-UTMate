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
      const events = [...eventQueue];
      eventQueue = []; // 큐 초기화

      const jsonl = events.map((e) => JSON.stringify(e)).join('\n') + '\n';
      const compressed = pako.gzip(jsonl);

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

  /**
   * URL 파라미터에서 session_id와 mission_id를 추출합니다.
   */
  function getIdsFromUrl(): { sessionId: string | null; missionId: string | null } {
    const searchParams = new URLSearchParams(window.location.search);
    return {
      sessionId: searchParams.get('session_id'),
      missionId: searchParams.get('mission_id'),
    };
  }

  async function sendEvents() {
    if (eventQueue.length === 0) return;

    const events = [...eventQueue];
    eventQueue = []; // 큐 초기화

    const jsonl = events.map((e) => JSON.stringify(e)).join('\n') + '\n';
    // eslint-disable-next-line no-console
    console.log('[LWT] Sending events:', jsonl);
    const compressed = pako.gzip(jsonl);

    const { sessionId, missionId } = getIdsFromUrl();

    await fetch(EVENT_SEND_URL, {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/gzip',
        'X-Session-Id': sessionId || '',
        'X-Mission-Id': missionId || '',
        credentials: 'include',
        // 다음 헤더가 들어가면 서버가 자동으로 해제함으로 포함하면 안됨 'Content-Encoding': 'gzip',
      },
      body: compressed,
    });
  }
})();
