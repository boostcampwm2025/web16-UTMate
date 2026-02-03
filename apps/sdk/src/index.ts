import { SERVER_URL } from './constants';

/**
 * URL에서 인증 토큰을 추출하거나 세션 스토리지에서 가져옵니다.
 */
function getAuthFromUrl(): string | undefined {
  const searchParams = new URLSearchParams(window.location.search);
  const auth = searchParams.get('utmate-auth');

  if (auth) {
    sessionStorage.setItem('utmate-auth', auth);
  }

  const authStored = sessionStorage.getItem('utmate-auth');
  return authStored || undefined;
}

/**
 * SDK 설치 검증 요청 처리
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

/**
 * 레코더 스크립트를 동적으로 로드합니다.
 */
async function loadRecorderScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const scriptSrc =
      process.env.NODE_ENV === 'production'
        ? 'https://utmate.me/sdk/utmate-recorder.iife.js'
        : '/utmate-recorder.iife.js';

    script.src = scriptSrc;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load recorder script'));
    document.head.appendChild(script);
  });
}

/**
 * SDK 초기화 함수
 *
 * @example
 * ```html
 * <script src="https://utmate.me/sdk/utmate-sdk.iife.js"></script>
 * <script>
 *   UtmateSDK.init(); // 수동 호출
 * </script>
 * ```
 */
async function init() {
  const searchParams = new URLSearchParams(window.location.search);
  const verifySdkInstallationParam = searchParams.get('utm-sdk-verify');

  // SDK 설치 검증 모드
  if (verifySdkInstallationParam === 'true') {
    await verifySdkInstallation(searchParams.get('test-id')!);
    return;
  }

  // auth 토큰 확인
  const auth = getAuthFromUrl();
  if (!auth) {
    return;
  }

  try {
    // recorder 스크립트 동적 로드
    await loadRecorderScript();

    // 전역 객체에서 initRecorder 가져오기
    const windowWithRecorder = window as Window & {
      UTMateRecorder?: { initRecorder: (config: { auth: string }) => void };
    };

    if (windowWithRecorder.UTMateRecorder) {
      windowWithRecorder.UTMateRecorder.initRecorder({ auth });
    }
  } catch (error) {
    console.error('Failed to initialize UTMate recorder:', error);
  }
}

init().catch(() => {});
