import { test, expect } from '@playwright/test';

/**
 * 로그인 페이지 스모크 테스트
 * 배포 직후 핵심 UI가 정상적으로 렌더링되는지 확인합니다.
 */
test.describe('로그인 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle(/로그인 \| UTMate/);
  });

  test('GitHub 로그인 버튼이 렌더링된다', async ({ page }) => {
    const loginBtn = page.getByRole('link', { name: /GitHub로 로그인/i });

    await expect(loginBtn).toBeVisible();
    await expect(loginBtn).toHaveAttribute('href', /auth\/github/);
  });
});

test.describe('정적 자산', () => {
  test('CSS, 이미지, JS 등 정적 자산이 404/500 없이 로드된다', async ({ page }) => {
    const failedRequests: string[] = [];

    // 페이지 로드 중 실패한 네트워크 요청 수집
    page.on('response', (response) => {
      const url = response.url();
      const status = response.status();
      const isStaticAsset = /\.(css|js|png|jpg|jpeg|svg|webp|avif|woff2?|ico)(\?.*)?$/.test(url);

      if (isStaticAsset && status >= 400) {
        failedRequests.push(`[${status}] ${url}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(failedRequests, `로드 실패한 정적 자산:\n${failedRequests.join('\n')}`).toHaveLength(0);
  });
});
