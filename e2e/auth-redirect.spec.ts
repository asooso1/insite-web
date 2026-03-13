import { test, expect } from "@playwright/test";

/**
 * 인증 리다이렉트 동작 테스트
 * 미들웨어: 토큰 없으면 /login?redirect=<path> 로 리다이렉트
 *
 * globalSetup이 storageState를 저장하더라도,
 * 이 suite는 쿠키 없는 상태(미인증)로 실행해야 함
 */

// 미인증 상태 강제: 전역 storageState 무시
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("인증 리다이렉트", () => {
  // 보호 경로들 - 인증 없이 접근 시 /login으로 리다이렉트되어야 함
  const PROTECTED_ROUTES = [
    "/work-orders",
    "/facilities",
    "/users",
    "/clients",
    "/materials",
    "/boards",
    "/patrols",
    "/reports",
    "/licenses",
    "/settings",
  ];

  for (const route of PROTECTED_ROUTES) {
    test(`${route} - 미인증 접근 시 /login으로 리다이렉트`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login/);
    });
  }

  test("레거시 URL /workorder → /work-orders 리다이렉트", async ({ page }) => {
    // 리다이렉트 후 /login으로 다시 리다이렉트됨 (미인증)
    await page.goto("/workorder");
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirect 파라미터 포함 확인", async ({ page }) => {
    await page.goto("/work-orders");
    await expect(page).toHaveURL(/redirect=%2Fwork-orders/);
  });

  test("로그인 페이지 - 공개 접근 가능", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL("/login");
    await expect(page.getByRole("button", { name: "LOGIN" })).toBeVisible();
  });
});
