import { record } from '@rrweb/record';
import type { eventWithTime } from '@rrweb/types';
import pako from 'pako';

import { EVENT_SEND_INTERVAL, SERVER_URL } from './constants';

const DEBUG = true;
const log = (...args: unknown[]) => DEBUG && console.log('[UTMate SDK]', ...args);

interface IIds {
  participantId: string;
  missionId: string;
}

/**
 * URL에서 participant-id, mission-id를 추출하거나 세션 스토리지에서 가져옵니다.
 * @return [participantId, missionId]
 */
function getIdsFromUrl(): IIds | undefined {
  log('getIdsFromUrl called, URL:', window.location.href);
  log('search params:', window.location.search);

  // URLSearchParams를 사용하여 쿼리 파라미터 추출
  const searchParams = new URLSearchParams(window.location.search);
  const participantId = searchParams.get('participant-id');
  const missionId = searchParams.get('mission-id');
  log('URL params - participantId:', participantId, 'missionId:', missionId);

  if (participantId && missionId) {
    sessionStorage.setItem('participant-id', participantId);
    sessionStorage.setItem('mission-id', missionId);
    log('IDs found in URL, saved to sessionStorage');
    return { participantId, missionId };
  }

  // 세션 스토리지에서 추출
  const participantIdStored = sessionStorage.getItem('participant-id');
  const missionIdStored = sessionStorage.getItem('mission-id');
  log('sessionStorage - participantId:', participantIdStored, 'missionId:', missionIdStored);

  if (participantIdStored && missionIdStored) {
    log('IDs found in sessionStorage');
    return { participantId: participantIdStored, missionId: missionIdStored };
  }

  // 둘 다 없으면 undefined 반환
  log('No IDs found, SDK will not start');
  return undefined;
}

/**
 * 이벤트 큐에 쌓인 이벤트를 서버로 전송합니다.
 * @param ids 미션 및 세션 아이디
 * @param events 전송할 이벤트 배열
 * @param isUnload keepalive 옵션 설정 여부
 */
async function sendEventsToServer(ids: IIds, events: eventWithTime[], isUnload = false) {
  log('sendEventsToServer called, events count:', events.length);
  log('Sending to:', `${SERVER_URL}/sdk/replay_logs`);

  const jsonl = events.map((e) => JSON.stringify(e)).join('\n') + '\n';
  const compressed = pako.gzip(jsonl);

  const response = await fetch(`${SERVER_URL}/sdk/replay_logs`, {
    method: 'POST',
    // fetch의 keepalive 옵션은 http keep-alive와 다른 개념임에 유의
    keepalive: isUnload,
    headers: {
      'Content-Type': 'application/gzip',
      'X-Participant-Id': ids.participantId,
      'X-Mission-Id': ids.missionId,
      'Content-Encoding': 'gzip',
    },
    body: compressed,
  });

  if (!response.ok) {
    log('Send failed with status:', response.status);
    throw new Error(`Failed to send events: ${response.status}`);
  }
  log('Send successful');
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
  log('verifySdkInstallation called, testId:', testId);
  try {
    if (!testId) {
      log('Invalid testId');
      alert('유효하지 않은 테스트 ID입니다. 창을 닫고 다시 시도해주세요.');
      return;
    }

    log('Sending verify request to:', `${SERVER_URL}/sdk/tests/${testId}/verify-sdk`);
    const response = await fetch(`${SERVER_URL}/sdk/tests/${testId}/verify-sdk`, {
      method: 'POST',
    });

    if (!response.ok) {
      log('Verify failed with status:', response.status);
      throw new Error('SDK 설치 확인에 실패했습니다.');
    }

    log('Verify successful');
    alert('SDK 정상 작동이 확인되었습니다. 창을 닫아주세요.');
  } catch (error) {
    log('Verify error:', error);
    alert('SDK 설치 확인 중 오류가 발생했습니다. 창을 닫고 다시 시도해주세요.');
  }
}

// 즉시 실행 함수로 SDK 초기화
(async () => {
  log('SDK initializing...');
  log('SERVER_URL:', SERVER_URL);

  const searchParams = new URLSearchParams(window.location.search);
  const verifySdkInstallationParam = searchParams.get('utm-sdk-verify');

  // sdk-verify 파라미터가 있으면 SDK 설치 검증 모드로 동작
  if (verifySdkInstallationParam === 'true') {
    log('Verify mode detected');
    await verifySdkInstallation(searchParams.get('test-id')!);
    return;
  }

  // URL 혹은 세션 스토리지에 participant-id, mission-id가 없으면 종료
  const ids = getIdsFromUrl();
  if (!ids) {
    log('SDK disabled - no valid IDs');
    return;
  }

  log('Starting recording with IDs:', ids);
  const eventQueue: eventWithTime[] = [];

  record({
    emit(event) {
      eventQueue.push(event);
    },
  });
  log('rrweb recording started');

  // 주기적으로 이벤트 전송
  setInterval(async () => {
    log('Interval tick, queue size:', eventQueue.length);
    await flushEvents(ids, eventQueue);
  }, EVENT_SEND_INTERVAL);

  // 화면 이탈 시 남은 이벤트 전송
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'hidden') {
      log('Page hidden, flushing events');
      await flushEvents(ids, eventQueue, true);
    }
  });

  log('SDK initialized successfully');
})().catch((error) => {
  log('SDK initialization error:', error);
});
