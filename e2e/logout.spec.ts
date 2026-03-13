import { test, expect } from "@playwright/test";

/**
 * 로그아웃 플로우 E2E 테스트
 * - POST /api/auth/logout → auth-token 쿠키 삭제
 * - 이후 보호 경로 접근 시 /login으로 리다이렉트
 */

// 로그아웃 테스트는 쿠키가 있는 상태(로그인됨)에서 시작
// 단, 실제 JWT가 없으므로 미들웨어 통과용 임의 쿠키 사용
test.describe("로그아웃", () => {
  test.beforeEach(async ({ page, context }) => {
    // 미들웨어는 쿠키 존재 여부만 확인하므로 임의 토큰으로 로그인 상태 시뮬레이션
    await context.addCookies([
      {
        name: "auth-token",
        value: "mock-token-for-logout-test",
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      },
    ]);
  });

  test("로그아웃 API 호출 시 쿠키가 삭제되어야 함", async ({ page }) => {
    // 로그아웃 API 직접 호출
    const response = await page.request.post("/api/auth/logout");
    expect(response.ok()).toBe(true);

    // 쿠키 삭제 확인
    const cookies = await page.context().cookies();
    const authCookie = cookies.find((c) => c.name === "auth-token");
    expect(authCookie).toBeUndefined();
  });

  test("로그아웃 후 보호 경로 접근 시 /login으로 리다이렉트", async ({ page }) => {
    // 로그아웃
    await page.request.post("/api/auth/logout");

    // 보호 경로 접근 시도
    await page.goto("/work-orders");
    await expect(page).toHaveURL(/\/login/);
  });

  test("로그아웃 후 /login 직접 접속 가능", async ({ page }) => {
    // 로그아웃
    await page.request.post("/api/auth/logout");

    // 로그인 페이지 접속
    await page.goto("/login");
    await expect(page).toHaveURL("/login");
    await expect(page.getByRole("button", { name: "LOGIN" })).toBeVisible();
  });
});
