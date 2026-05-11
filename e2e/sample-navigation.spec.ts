/**
 * E2E 테스트 예시 — GNB 네비게이션
 *
 * 테스트 피라미드의 E2E 층.
 * "이 화면에서 이거 누르면 이게 보인다" — 이것만 검증.
 * 컴포넌트 내부 동작(드래그 정밀도, 스크롤 발생 등)은 Component 테스트로 내린다.
 */
import { test, expect } from '@playwright/test';

test.describe('GNB 네비게이션', () => {
  test('대시보드 페이지로 이동한다', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('설정 페이지로 이동한다', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL(/\/settings/);
  });
});
