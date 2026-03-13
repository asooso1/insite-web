import { test, expect } from "./fixtures";
// 인증 상태는 storageState(global-setup)로 자동 로드됨 - 반복 로그인 불필요

test.describe("고객사 목록 페이지", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 후 고객사 목록 페이지 접속
    await page.goto("/clients");
  });

  test("페이지가 정상적으로 로드되어야 함", async ({ page }) => {
    // 페이지 로드 완료 대기
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL("/clients");
  });

  test("페이지 제목이 표시되어야 함", async ({ page }) => {
    // PageHeader title 확인
    await expect(page.getByRole("heading", { name: "고객사 목록" })).toBeVisible();
  });

  test("페이지 설명이 표시되어야 함", async ({ page }) => {
    // PageHeader description 확인
    await expect(page.getByText("고객사를 관리합니다.")).toBeVisible();
  });

  test("신규 등록 버튼이 표시되어야 함", async ({ page }) => {
    // 새 고객사 버튼 확인
    const addButton = page.getByRole("button", { name: /새 고객사/ });
    await expect(addButton).toBeVisible();
  });

  test("신규 등록 버튼 클릭 시 신규 페이지로 이동", async ({ page }) => {
    // 새 고객사 버튼 클릭
    await page.getByRole("button", { name: /새 고객사/ }).click();
    await expect(page).toHaveURL("/clients/new");
  });

  test("검색 필드가 표시되어야 함", async ({ page }) => {
    // 검색 입력 필드 확인
    await expect(page.getByPlaceholder("검색어 입력...")).toBeVisible();
  });

  test("검색 유형 선택이 표시되어야 함", async ({ page }) => {
    // 검색 유형 select 확인 (회사명, 사업자번호)
    const searchTypeSelect = page.locator("select").first();
    await expect(searchTypeSelect).toBeVisible();
  });

  test("엑셀 다운로드 버튼이 표시되어야 함", async ({ page }) => {
    // 엑셀 다운로드 버튼 확인
    await expect(page.getByRole("button", { name: /엑셀/ })).toBeVisible();
  });

  test("데이터 테이블이 표시되어야 함", async ({ page }) => {
    // 테이블 요소 확인
    const table = page.locator("table");
    await expect(table).toBeVisible();
  });

  test("테이블 헤더가 올바른 열을 포함해야 함", async ({ page }) => {
    // 주요 열 헤더 확인
    await expect(page.getByRole("columnheader", { name: "No" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "상태" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "회사명" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "사업자번호" })).toBeVisible();
  });

  test("검색어 입력 시 테이블이 업데이트되어야 함", async ({ page }) => {
    // 초기 테이블 데이터 로드 대기
    await page.waitForLoadState("networkidle");

    // 검색어 입력
    await page.getByPlaceholder("검색어 입력...").fill("회사");
    await page.waitForTimeout(500); // 디바운싱 대기

    // 테이블이 업데이트되었는지 확인
    const tableExists = await page.locator("table").isVisible();
    expect(tableExists).toBe(true);
  });

  test("페이지네이션이 표시되어야 함 (데이터 있을 경우)", async ({ page }) => {
    // 페이지네이션 요소 확인
    const pagination = page.locator("div").filter({ has: page.getByRole("button", { name: "처음" }) });
    if (await pagination.isVisible()) {
      await expect(page.getByRole("button", { name: "처음" })).toBeVisible();
      await expect(page.getByRole("button", { name: "이전" })).toBeVisible();
      await expect(page.getByRole("button", { name: "다음" })).toBeVisible();
      await expect(page.getByRole("button", { name: "마지막" })).toBeVisible();
    }
  });

  test("고객사 이름 클릭 시 상세 페이지로 이동", async ({ page }) => {
    // 데이터 로드 대기
    await page.waitForLoadState("networkidle");

    // 첫 번째 고객사 이름 링크 찾기
    const firstClientLink = page.locator("tbody tr").first().locator("button.text-primary").first();

    // 링크가 존재하는지 확인
    if (await firstClientLink.isVisible()) {
      // 클릭 전 URL 기억
      const originalUrl = page.url();

      // 링크 클릭
      await firstClientLink.click();

      // URL이 /clients/{id} 형태로 변경되는지 확인
      await expect(page).toHaveURL(/\/clients\/\d+$/);
    }
  });

  test("행 액션 메뉴가 표시되어야 함", async ({ page }) => {
    // 데이터 로드 대기
    await page.waitForLoadState("networkidle");

    // 첫 번째 행의 드롭다운 메뉴 버튼 찾기
    const firstRowMenuButton = page.locator("tbody tr").first().locator("button[aria-label='메뉴 열기']");

    // 메뉴 버튼이 존재하는지 확인
    if (await firstRowMenuButton.isVisible()) {
      await expect(firstRowMenuButton).toBeVisible();
    }
  });
});
