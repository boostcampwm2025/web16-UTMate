import { record } from '@rrweb/record';
import type { eventWithTime } from '@rrweb/types';
import pako from 'pako';

import { EVENT_SEND_INTERVAL, SERVER_URL } from './constants';

interface IIds {
  sessionId: string;
  missionId: string;
}

/**
 * URL에서 session_id, mission_id를 추출하거나 세션 스토리지에서 가져옵니다.
 * @return [sessionId, missionId]
 */
function getIdsFromUrl(): IIds | undefined {
  // URLSearchParams를 사용하여 쿼리 파라미터 추출
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get('session_id');
  const missionId = searchParams.get('mission_id');
  if (sessionId && missionId) {
    sessionStorage.setItem('session_id', sessionId);
    sessionStorage.setItem('mission_id', missionId);
    return { sessionId, missionId };
  }

  // 세션 스토리지에서 추출
  const sessionIdStored = sessionStorage.getItem('session_id');
  const missionIdStored = sessionStorage.getItem('mission_id');
  if (sessionIdStored && missionIdStored) {
    return { sessionId: sessionIdStored, missionId: missionIdStored };
  }

  // 둘 다 없으면 undefined 반환
  return undefined;
}

/**
 * 이벤트 큐에 쌓인 이벤트를 서버로 전송합니다.
 * @param ids 미션 및 세션 아이디
 * @param events 전송할 이벤트 배열
 * @param isUnload keepalive 옵션 설정 여부
 */
async function sendEventsToServer(ids: IIds, events: eventWithTime[], isUnload = false) {
  const jsonl = events.map((e) => JSON.stringify(e)).join('\n') + '\n';
  const compressed = pako.gzip(jsonl);

  const response = await fetch(`${SERVER_URL}/sdk/replay_logs`, {
    method: 'POST',
    // fetch의 keepalive 옵션은 http keep-alive와 다른 개념임에 유의
    keepalive: isUnload,
    headers: {
      'Content-Type': 'application/gzip',
      'X-Session-Id': ids.sessionId,
      'X-Mission-Id': ids.missionId,
      'Content-Encoding': 'gzip',
    },
    body: compressed,
  });

  if (!response.ok) {
    throw new Error(`Failed to send events: ${response.status}`);
  }
}

/**
 * 큐의 이벤트를 복사해 서버로 전송하고, 성공 시 원본 큐를 비웁니다.
 * 전송 실패 시 복사본을 다시 큐 앞에 되돌립니다.
 * @param ids 미션 및 세션 아이디
 * @param eventQueue 이벤트 큐
 * @param isUnload keepalive 옵션 설정 여부
 * @returns
 */
async function flushEvents(ids: IIds, eventQueue: eventWithTime[], isUnload = false) {
  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue.length = 0; // 큐 초기화

  try {
    await sendEventsToServer(ids, events, isUnload);
  } catch (error) {
    // 실패 시 이벤트를 다시 큐에 넣음
    eventQueue.unshift(...events);
  }
}

/** SDK 설치 검증 요청 처리
 * @param testId 테스트 식별자
 */
async function verifySdkInstallation(testId: string) {
  try {
    if (!testId) {
      alert('유효하지 않은 테스트 ID입니다. 창을 닫고 다시 시도해주세요.');
      return;
    }

    const response = await fetch(`${SERVER_URL}/sdk/tests/${testId}/verify-sdk`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('SDK 설치 확인에 실패했습니다.');
    }

    alert('SDK 정상 작동이 확인되었습니다. 창을 닫아주세요.');
  } catch (error) {
    alert('SDK 설치 확인 중 오류가 발생했습니다. 창을 닫고 다시 시도해주세요.');
  }
}

// 즉시 실행 함수로 SDK 초기화
(async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const verifySdkInstallationParam = searchParams.get('utm-sdk-verify');

  // sdk-verify 파라미터가 있으면 SDK 설치 검증 모드로 동작
  if (verifySdkInstallationParam === 'true') {
    await verifySdkInstallation(searchParams.get('test-id')!);
    return;
  }

  // URL 혹은 세션 스토리지에 session_id, mission_id가 없으면 종료
  const ids = getIdsFromUrl();
  if (!ids) {
    return;
  }

  const eventQueue: eventWithTime[] = [];

  record({
    emit(event) {
      eventQueue.push(event);
    },
  });

  // 주기적으로 이벤트 전송
  setInterval(async () => {
    await flushEvents(ids, eventQueue);
  }, EVENT_SEND_INTERVAL);

  // 화면 이탈 시 남은 이벤트 전송
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'hidden') {
      await flushEvents(ids, eventQueue, true);
    }
  });
})().catch(() => {});
