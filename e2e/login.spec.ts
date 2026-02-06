import { test, expect } from "@playwright/test";

test.describe("로그인 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("로그인 폼이 표시되어야 함", async ({ page }) => {
    // 로고 확인
    await expect(page.locator("svg")).toBeVisible();

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
});
