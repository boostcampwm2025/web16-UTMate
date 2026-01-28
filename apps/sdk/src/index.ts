import { record } from '@rrweb/record';
import type { eventWithTime } from '@rrweb/types';
import pako from 'pako';

import { EVENT_SEND_INTERVAL, SERVER_URL } from './constants';

/**
 * URL에서 인증 토큰 ( 미션 결과 publicId )를 추출하거나 세션 스토리지에서 가져옵니다.
 *
 * @return 인증 토큰 ( 미션 결과 publicId )
 */
function getIdsFromUrl(): string | undefined {
  // URLSearchParams를 사용하여 쿼리 파라미터 추출
  const searchParams = new URLSearchParams(window.location.search);
  const auth = searchParams.get('utmate-auth');

  if (auth) {
    sessionStorage.setItem('utmate-auth', auth);
  }

  // 세션 스토리지에서 추출
  const authStored = sessionStorage.getItem('utmate-auth');
  return authStored || undefined;
}

/**
 * 이벤트 큐에 쌓인 이벤트를 서버로 전송합니다.
 *
 * @param auth 인증 토큰 ( 미션 결과 publicId )
 * @param events 전송할 이벤트 배열
 * @param isUnload keepalive 옵션 설정 여부
 */
async function sendEventsToServer(auth: string, events: eventWithTime[], isUnload = false) {
  const jsonl = events.map((e) => JSON.stringify(e)).join('\n') + '\n';
  const compressed = pako.gzip(jsonl);

  const response = await fetch(`${SERVER_URL}/sdk/replay_logs`, {
    method: 'POST',
    // fetch의 keepalive 옵션은 http keep-alive와 다른 개념임에 유의
    keepalive: isUnload,
    headers: {
      'Content-Type': 'application/gzip',
      Authorization: `Bearer ${auth}`,
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
 *
 * @param auth 인증 토큰 ( 미션 결과 publicId )
 * @param eventQueue 이벤트 큐
 * @param isUnload keepalive 옵션 설정 여부
 * @returns
 */
async function flushEvents(auth: string, eventQueue: eventWithTime[], isUnload = false) {
  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue.length = 0; // 큐 초기화

  try {
    await sendEventsToServer(auth, events, isUnload);
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

  // URL 혹은 세션 스토리지에 인증 정보가 없으면 종료
  const auth = getIdsFromUrl();
  if (!auth) {
    return;
  }

  const eventQueue: eventWithTime[] = [];

  record({
    emit(event) {
      eventQueue.push(event);
    },
    // 입력 필드 텍스트 마스킹 (보안) - 실제 입력 값은 마스킹하지만 이벤트는 기록
    maskAllInputs: true,
    // 클릭, 스크롤, 마우스 이동 등 모든 인터랙션 기록
    recordCanvas: false, // 성능상 canvas는 제외
    recordCrossOriginIframes: false,
    // 샘플링 설정 (성능 최적화)
    sampling: {
      // 마우스 이동은 기록
      mousemove: true,
      // 마우스 인터랙션 (클릭, 포커스 등)
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
      // 스크롤 이벤트 샘플링 (ms)
      scroll: 150,
      // 입력 이벤트는 마지막 값만 (성능 최적화)
      input: 'last',
    },
  });

  // 주기적으로 이벤트 전송
  setInterval(async () => {
    await flushEvents(auth, eventQueue);
  }, EVENT_SEND_INTERVAL);

  // 화면 이탈 시 남은 이벤트 전송
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'hidden') {
      await flushEvents(auth, eventQueue, true);
    }
  });

  // 페이지 언로드 시 남은 이벤트 전송 (창 닫기, 탭 닫기 등)
  window.addEventListener('pagehide', () => {
    flushEvents(auth, eventQueue, true).catch(() => {});
  });

  // 부모 창에서 flush 요청을 받으면 이벤트 전송 후 완료 메시지 반환
  window.addEventListener('message', async (event) => {
    if (event.data?.type === 'UTM_SDK_FLUSH_REQUEST') {
      try {
        await flushEvents(auth, eventQueue, false);
        // 부모 창에 완료 메시지 전송
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
})().catch(() => {});
