import { record } from '@rrweb/record';
import type { eventWithTime } from '@rrweb/types';

import { compress } from './utils/compression';
import { EVENT_SEND_INTERVAL, SERVER_URL } from './constants';

export interface IRecorderConfig {
  auth: string;
}

/**
 * 이벤트를 서버로 전송합니다.
 */
async function sendEventsToServer(auth: string, events: eventWithTime[], isUnload = false) {
  const jsonl = events.map((e) => JSON.stringify(e)).join('\n') + '\n';
  const compressed = await compress(jsonl);

  const response = await fetch(`${SERVER_URL}/sdk/replay_logs`, {
    method: 'POST',
    keepalive: isUnload,
    headers: {
      'Content-Type': 'application/gzip',
      Authorization: `Bearer ${auth}`,
      'Content-Encoding': 'gzip',
    },
    body: compressed as BodyInit,
  });

  if (!response.ok) {
    throw new Error(`Failed to send events: ${response.status}`);
  }
}

/**
 * 큐의 이벤트를 서버로 전송합니다.
 */
async function flushEvents(auth: string, eventQueue: eventWithTime[], isUnload = false) {
  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue.length = 0;

  try {
    await sendEventsToServer(auth, events, isUnload);
  } catch (error) {
    eventQueue.unshift(...events);
    throw error;
  }
}

/**
 * 레코더를 초기화하고 이벤트 기록을 시작합니다.
 */
export function initRecorder(config: IRecorderConfig) {
  const { auth } = config;

  const eventQueue: eventWithTime[] = [];

  record({
    emit(event) {
      eventQueue.push(event);
    },
    maskAllInputs: true,
    recordCanvas: false,
    recordCrossOriginIframes: false,
    sampling: {
      mousemove: true,
      mouseInteraction: {
        MouseUp: false,
        MouseDown: false,
        Click: true,
        ContextMenu: true,
        DblClick: true,
        Focus: true,
        Blur: true,
        TouchStart: true,
        TouchEnd: true,
      },
      scroll: 150,
      input: 'last',
    },
  });

  // 주기적으로 이벤트 전송
  setInterval(async () => {
    await flushEvents(auth, eventQueue, false).catch(() => {
      // 실패는 flushEvents 내부에서 처리됨 (큐에 다시 추가)
    });
  }, EVENT_SEND_INTERVAL);

  // 화면 이탈 시 남은 이벤트 전송
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'hidden') {
      await flushEvents(auth, eventQueue, true);
    }
  });

  // 페이지 언로드 시 남은 이벤트 전송
  window.addEventListener('pagehide', () => {
    flushEvents(auth, eventQueue, true).catch(() => {});
  });

  // 부모 창에서 flush 요청 처리
  window.addEventListener('message', async (event: MessageEvent) => {
    if (event.data?.type === 'UTM_SDK_FLUSH_REQUEST') {
      try {
        await flushEvents(auth, eventQueue, false);
        if (window.opener) {
          window.opener.postMessage({ type: 'UTM_SDK_FLUSH_COMPLETE', success: true }, '*');
        }
      } catch {
        if (window.opener) {
          window.opener.postMessage({ type: 'UTM_SDK_FLUSH_COMPLETE', success: false }, '*');
        }
      }
    }
  });
}
