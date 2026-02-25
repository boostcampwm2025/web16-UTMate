import { defineConfig, devices } from '@playwright/test';

/**
 * E2E 테스트 설정
 * 배포된 URL에 접속하여 핵심 페이지가 정상 동작하는지 확인합니다.
 * baseURL은 환경변수 E2E_BASE_URL에서 주입받습니다 (CI: GitHub Variables).
 */
export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  // CI 환경에서는 실패 시 재시도 1회
  retries: process.env.CI ? 1 : 0,
  // CI 환경에서는 단일 워커로 실행
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    // CI에서 HTML 리포트를 아티팩트로 업로드하기 위해 생성
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    // 배포 URL (환경변수에서 주입)
    baseURL: process.env.E2E_BASE_URL,
    // 실패 시 스크린샷 캡처
    screenshot: 'only-on-failure',
    // 재시도 시 트레이스 기록
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
