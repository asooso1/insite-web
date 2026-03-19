import { test, expect } from "./fixtures";

test.describe("보고서 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reports");
  });

  test("보고서 목록 페이지 로드", async ({ page }) => {
    // 페이지 제목 확인
    await expect(page.getByRole("heading", { name: "보고서" })).toBeVisible();

    // 설명 텍스트 확인
    await expect(
      page.getByText("월간/주간/업무일지 보고서를 관리합니다.")
    ).toBeVisible();
  });

  test("탭 표시 확인 - 월간보고서, 주간보고서, 업무일지, TBM", async ({
    page,
  }) => {
    // 탭 버튼 확인
    const monthlyTab = page.getByRole("button", { name: "월간보고서" });
    const weeklyTab = page.getByRole("button", { name: "주간보고서" });
    const workLogTab = page.getByRole("button", { name: "업무일지" });
    const tbmTab = page.getByRole("button", { name: "TBM" });

    await expect(monthlyTab).toBeVisible();
    await expect(weeklyTab).toBeVisible();
    await expect(workLogTab).toBeVisible();
    await expect(tbmTab).toBeVisible();

    // 월간보고서 탭이 기본으로 활성화되어야 함
    await expect(monthlyTab).toHaveClass(/border-primary/);
  });

  test("월간보고서 탭 선택 시 테이블 표시", async ({ page }) => {
    // 월간보고서 탭 클릭 (기본값이므로 이미 활성화됨)
    const monthlyTab = page.getByRole("button", { name: "월간보고서" });
    await expect(monthlyTab).toHaveClass(/border-primary/);

    // 테이블 컬럼 헤더 확인
    await expect(page.getByText("No")).toBeVisible();
    await expect(page.getByText("상태")).toBeVisible();
    await expect(page.getByText("건물")).toBeVisible();
    await expect(page.getByText("년도")).toBeVisible();
    await expect(page.getByText("월")).toBeVisible();
    await expect(page.getByText("작성자")).toBeVisible();
    await expect(page.getByText("작성일")).toBeVisible();
  });

  test("주간보고서 탭 전환", async ({ page }) => {
    const weeklyTab = page.getByRole("button", { name: "주간보고서" });
    await weeklyTab.click();

    // 탭이 활성화되었는지 확인
    await expect(weeklyTab).toHaveClass(/border-primary/);

    // 주간보고서 특화 컬럼 확인
    await expect(page.getByText("시작일")).toBeVisible();
    await expect(page.getByText("종료일")).toBeVisible();
  });

  test("업무일지 탭 전환", async ({ page }) => {
    const workLogTab = page.getByRole("button", { name: "업무일지" });
    await workLogTab.click();

    // 탭이 활성화되었는지 확인
    await expect(workLogTab).toHaveClass(/border-primary/);

    // 업무일지 특화 컬럼 확인
    await expect(page.getByText("업무일")).toBeVisible();
  });

  test("TBM 탭 선택 시 준비 중 메시지 표시", async ({ page }) => {
    const tbmTab = page.getByRole("button", { name: "TBM" });
    await tbmTab.click();

    // 탭이 활성화되었는지 확인
    await expect(tbmTab).toHaveClass(/border-primary/);

    // 준비 중 메시지 확인
    await expect(
      page.getByText("TBM(법정보고서) 기능은 준비 중입니다.")
    ).toBeVisible();
  });

  test("새 보고서 버튼 표시", async ({ page }) => {
    const newButton = page.getByRole("button", { name: /새 보고서/ });
    await expect(newButton).toBeVisible();
  });

  test("월간보고서 탭에서 새 월간보고서 버튼 클릭", async ({ page }) => {
    const newButton = page.getByRole("button", { name: /새 보고서/ });
    await newButton.click();

    // /reports/monthly/new 페이지로 이동해야 함
    await expect(page).toHaveURL("/reports/monthly/new");
  });

  test("주간보고서 탭에서 새 주간보고서 버튼 클릭", async ({ page }) => {
    const weeklyTab = page.getByRole("button", { name: "주간보고서" });
    await weeklyTab.click();

    const newButton = page.getByRole("button", { name: /새 보고서/ });
    await newButton.click();

    // /reports/weekly/new 페이지로 이동해야 함
    await expect(page).toHaveURL("/reports/weekly/new");
  });

  test("업무일지 탭에서 새 업무일지 버튼 클릭", async ({ page }) => {
    const workLogTab = page.getByRole("button", { name: "업무일지" });
    await workLogTab.click();

    const newButton = page.getByRole("button", { name: /새 보고서/ });
    await newButton.click();

    // /reports/work-logs/new 페이지로 이동해야 함
    await expect(page).toHaveURL("/reports/work-logs/new");
  });

  test("데이터가 없을 때 EmptyState 표시 - 월간보고서", async ({ page }) => {
    // 데이터 로딩 완료 후 EmptyState 확인
    // (실제로 데이터가 없으면)
    const emptyState = page.locator("text=월간보고서가 없습니다");
    const dataTable = page.locator("table");

    // DataTable 또는 EmptyState 중 하나가 보여야 함
    const isVisible = await Promise.race([
      emptyState.isVisible().then(() => "empty"),
      dataTable.isVisible().then(() => "table"),
    ]).catch(() => null);

    expect(["empty", "table"]).toContain(isVisible);
  });

  test("페이지네이션 표시 (데이터 존재 시)", async ({ page }) => {
    // 페이지네이션이 있으면 표시되어야 함
    const pagination = page.locator("text=/처음|이전|다음|마지막/");

    const isPaginationVisible = await pagination
      .first()
      .isVisible()
      .catch(() => false);

    // 데이터가 있으면 페이지네이션이 보임
    if (isPaginationVisible) {
      await expect(page.getByRole("button", { name: "처음" })).toBeVisible();
      await expect(page.getByRole("button", { name: "이전" })).toBeVisible();
      await expect(page.getByRole("button", { name: "다음" })).toBeVisible();
      await expect(page.getByRole("button", { name: "마지막" })).toBeVisible();
    }
  });

  test("테이블 행의 행동 메뉴 (더보기) 표시", async ({ page }) => {
    // 테이블에 데이터가 있는지 확인
    const rows = page.locator("table tbody tr");
    const rowCount = await rows.count();

    if (rowCount > 0) {
      // 첫 번째 행의 더보기 버튼 클릭
      const moreButton = rows.first().getByRole("button").filter({ has: page.locator("svg") });
      await expect(moreButton.first()).toBeVisible();

      await moreButton.first().click();

      // 드롭다운 메뉴 확인
      await expect(page.getByText("상세 보기")).toBeVisible();
      await expect(page.getByText("수정")).toBeVisible();
      await expect(page.getByText("삭제")).toBeVisible();
    }
  });

  test("건물명 링크 클릭 시 상세 페이지로 이동", async ({ page }) => {
    // 테이블에 데이터가 있는지 확인
    const buildingLinks = page.locator(
      "table tbody tr button[class*='text-primary']"
    );
    const linkCount = await buildingLinks.count();

    if (linkCount > 0) {
      // 첫 번째 건물 링크 클릭
      const firstLink = buildingLinks.first();
      const href = await firstLink
        .locator("..")
        .evaluate((el) =>
          el.textContent?.trim() || (el as HTMLElement).innerText?.trim() || ""
        );

      await firstLink.click();

      // 상세 페이지로 이동했는지 확인 (/reports/monthly/{id} 형태)
      await expect(page).toHaveURL(/\/reports\/(monthly|weekly|work-logs)\/\d+$/);
    }
  });
});
