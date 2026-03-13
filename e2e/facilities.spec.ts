import { test, expect } from "./fixtures";

test.describe("시설 관리 - 시설 목록", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/facilities");
  });

  test("페이지가 로드되고 URL이 올바름", async ({ page }) => {
    await expect(page).toHaveURL("/facilities");
  });

  test("페이지 헤더(제목 + 설명)가 표시됨", async ({ page }) => {
    // PageHeader 컴포넌트의 제목
    await expect(page.getByRole("heading", { name: "시설 목록" })).toBeVisible({
      timeout: 10000,
    });

    // 설명 텍스트
    await expect(page.getByText("시설을 관리합니다.")).toBeVisible();
  });

  test("신규 시설 등록 버튼이 표시됨", async ({ page }) => {
    const newButton = page.getByRole("button", { name: /새 시설/ });
    await expect(newButton).toBeVisible();

    // 버튼 클릭 시 /facilities/new으로 이동 검증
    await newButton.click();
    await expect(page).toHaveURL("/facilities/new");
  });

  test("상태 필터 탭들이 표시됨", async ({ page }) => {
    // 상태 탭: 전체, 운영중, 운영전, 점검중, 운영완료, 폐기
    const tabs = ["전체", "운영중", "운영전", "점검중", "운영완료", "폐기"];

    for (const tabLabel of tabs) {
      const tab = page.getByRole("tab", { name: tabLabel });
      await expect(tab).toBeVisible();
    }
  });

  test("검색 입력 필드가 표시됨", async ({ page }) => {
    const searchInput = page.getByPlaceholder("시설명 검색...");
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute("type", "text");
  });

  test("엑셀 다운로드 버튼이 표시됨", async ({ page }) => {
    const excelButton = page.getByRole("button", { name: /엑셀/ });
    await expect(excelButton).toBeVisible();
  });

  test("데이터 테이블이 렌더링됨 (콘텐츠 또는 빈 상태)", async ({ page }) => {
    // 로딩 상태 기다림
    await page.waitForLoadState("networkidle");

    // DataTable이 있는지 확인 (테이블 또는 빈 상태)
    const table = page.locator("table");
    const emptyState = page.getByText(/시설이 없습니다|새 시설을 등록/);

    const tableVisible = await table.isVisible().catch(() => false);
    const emptyStateVisible = await emptyState.isVisible().catch(() => false);

    expect(tableVisible || emptyStateVisible).toBeTruthy();
  });

  test("상태 탭 클릭으로 필터링 동작", async ({ page }) => {
    // 페이지 로드 대기
    await page.waitForLoadState("networkidle");

    // "운영중" 탭 클릭
    const operatingTab = page.getByRole("tab", { name: "운영중" });
    await operatingTab.click();

    // 탭이 활성화됨
    await expect(operatingTab).toHaveAttribute("data-state", "active");

    // 테이블 또는 빈 상태가 업데이트됨 (또는 로딩 상태 표시)
    await page.waitForLoadState("networkidle");
    const table = page.locator("table");
    const emptyState = page.getByText(/시설이 없습니다|새 시설을 등록/);

    const tableVisible = await table.isVisible().catch(() => false);
    const emptyStateVisible = await emptyState.isVisible().catch(() => false);

    expect(tableVisible || emptyStateVisible).toBeTruthy();
  });

  test("검색 입력으로 필터링 동작", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    const searchInput = page.getByPlaceholder("시설명 검색...");

    // 검색 키워드 입력
    await searchInput.fill("공조");

    // API 호출 대기
    await page.waitForLoadState("networkidle");

    // 테이블 또는 빈 상태가 표시됨
    const table = page.locator("table");
    const emptyState = page.getByText(/시설이 없습니다|새 시설을 등록/);

    const tableVisible = await table.isVisible().catch(() => false);
    const emptyStateVisible = await emptyState.isVisible().catch(() => false);

    expect(tableVisible || emptyStateVisible).toBeTruthy();
  });

  test("페이지 구조가 API 오류 후에도 렌더링됨", async ({ page }) => {
    // API 요청 인터셉트 및 실패 시뮬레이션
    await page.route("**/api/facilities**", (route) => {
      route.abort("failed");
    });

    // 페이지 새로고침
    await page.reload();

    // 에러 상태에서도 페이지 구조는 렌더링되어야 함
    await expect(page.getByRole("heading", { name: "시설 목록" })).toBeVisible();
    await expect(page.getByText("데이터를 불러올 수 없습니다")).toBeVisible();
    await expect(page.getByRole("button", { name: /다시 시도/ })).toBeVisible();
  });
});
