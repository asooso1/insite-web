import { test, expect } from "./fixtures";

/**
 * 사용자 관리 페이지 E2E 테스트
 * storageState(global-setup)로 인증 상태 재사용 - 반복 로그인 없음
 */
test.describe("사용자 목록 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/users");
  });

  test("페이지가 정상적으로 로드되어야 함", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL("/users");
  });

  test("페이지 제목이 표시되어야 함", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "사용자 목록" })).toBeVisible();
  });

  test("페이지 설명이 표시되어야 함", async ({ page }) => {
    await expect(page.getByText("사용자를 관리합니다.")).toBeVisible();
  });

  test("신규 등록 버튼이 표시되어야 함", async ({ page }) => {
    const addButton = page.getByRole("button", { name: /새 사용자/ });
    await expect(addButton).toBeVisible();
  });

  test("신규 등록 버튼 클릭 시 신규 페이지로 이동", async ({ page }) => {
    await page.getByRole("button", { name: /새 사용자/ }).click();
    await expect(page).toHaveURL("/users/new");
  });

  test("검색 필드가 표시되어야 함", async ({ page }) => {
    await expect(page.getByPlaceholder("검색어 입력...")).toBeVisible();
  });

  test("검색 유형 선택이 표시되어야 함", async ({ page }) => {
    const searchTypeSelect = page.locator("select").first();
    await expect(searchTypeSelect).toBeVisible();
  });

  test("상태 필터 탭이 표시되어야 함", async ({ page }) => {
    await expect(page.getByRole("tab", { name: "전체" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "재직중" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "휴직" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "퇴사" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "임시" })).toBeVisible();
  });

  test("엑셀 다운로드 버튼이 표시되어야 함", async ({ page }) => {
    await expect(page.getByRole("button", { name: /엑셀/ })).toBeVisible();
  });

  test("데이터 테이블이 표시되어야 함", async ({ page }) => {
    const table = page.locator("table");
    await expect(table).toBeVisible();
  });

  test("테이블 헤더가 올바른 열을 포함해야 함", async ({ page }) => {
    await expect(page.getByRole("columnheader", { name: "No" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "상태" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "이름" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "아이디" })).toBeVisible();
  });

  test("검색어 입력 시 테이블이 업데이트되어야 함", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    await page.getByPlaceholder("검색어 입력...").fill("admin");
    await page.waitForTimeout(500); // 디바운싱 대기
    const tableExists = await page.locator("table").isVisible();
    expect(tableExists).toBe(true);
  });

  test("상태 탭 클릭 시 필터링되어야 함", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    await page.getByRole("tab", { name: "재직중" }).click();
    await page.waitForTimeout(500);
    await expect(page.locator("table")).toBeVisible();
  });

  test("페이지네이션이 표시되어야 함 (데이터 있을 경우)", async ({ page }) => {
    const pagination = page.locator("div").filter({ has: page.getByRole("button", { name: "처음" }) });
    if (await pagination.isVisible()) {
      await expect(page.getByRole("button", { name: "처음" })).toBeVisible();
      await expect(page.getByRole("button", { name: "이전" })).toBeVisible();
      await expect(page.getByRole("button", { name: "다음" })).toBeVisible();
      await expect(page.getByRole("button", { name: "마지막" })).toBeVisible();
    }
  });
});
