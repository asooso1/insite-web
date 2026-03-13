import { test, expect } from "@playwright/test";

// 로그인 페이지는 미인증 상태에서 테스트
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("로그인 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("로그인 폼이 표시되어야 함", async ({ page }) => {
    // 로고 확인 (Layer_2 ID를 가진 로고 SVG)
    await expect(page.locator("#Layer_2")).toBeVisible();

    // 입력 필드 확인
    await expect(page.getByPlaceholder("아이디를 입력해 주세요.")).toBeVisible();
    await expect(page.getByPlaceholder("비밀번호를 입력해 주세요.")).toBeVisible();

    // 로그인 버튼 확인
    await expect(page.getByRole("button", { name: "LOGIN" })).toBeVisible();

    // 링크 확인
    await expect(page.getByText("Forgot password")).toBeVisible();
    await expect(page.getByText("개인정보처리방침")).toBeVisible();
  });

  test("필수 필드 유효성 검사", async ({ page }) => {
    // 빈 폼으로 로그인 시도
    await page.getByRole("button", { name: "LOGIN" }).click();

    // 에러 메시지 확인
    await expect(page.getByText("아이디를 입력해 주세요.")).toBeVisible();
    await expect(page.getByText("비밀번호를 입력해 주세요.")).toBeVisible();
  });

  test("아이디만 입력 시 비밀번호 유효성 검사", async ({ page }) => {
    await page.getByPlaceholder("아이디를 입력해 주세요.").fill("testuser");
    await page.getByRole("button", { name: "LOGIN" }).click();

    await expect(page.getByText("비밀번호를 입력해 주세요.")).toBeVisible();
  });

  test("이미 로그인된 상태에서 /login 접속 → /login 표시", async ({ page, context }) => {
    // 미들웨어는 auth-token 쿠키 존재 여부만 확인 (JWT 서명 검증은 csp-was API 호출 시 수행)
    // 따라서 임의의 값을 쿠키에 설정해도 미들웨어는 통과됨 (쿠키 존재 = 로그인 상태로 인식)
    const mockToken = "mock-token-for-middleware-test";
    await context.addCookies([
      {
        name: "auth-token",
        value: mockToken,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      },
    ]);

    // /login 접속
    await page.goto("/login");

    // 미들웨어는 로그인된 상태에서도 /login 페이지를 표시 (리다이렉트 안 함)
    await expect(page).toHaveURL("/login");
    await expect(page.getByRole("button", { name: "LOGIN" })).toBeVisible();
  });
});
