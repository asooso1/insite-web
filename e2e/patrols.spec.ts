import { test, expect } from "./fixtures";
// 인증 상태는 storageState(global-setup)로 자동 로드됨 - 반복 로그인 불필요

test.describe("순찰 관리 페이지", () => {
  test.beforeEach(async ({ page }) => {
    // 인증 후 순찰 페이지 접속
    await page.goto("/patrols");
  });

  test("순찰 관리 페이지가 로드되어야 함", async ({ page }) => {
    // 페이지 제목 확인
    await expect(page.getByRole("heading", { name: "순찰 관리" })).toBeVisible();

    // 설명 텍스트 확인
    await expect(
      page.getByText("순찰 계획 및 팀을 관리합니다.")
    ).toBeVisible();
  });

  test("페이지 헤더 구조 확인", async ({ page }) => {
    // 제목 확인
    const heading = page.getByRole("heading", { name: "순찰 관리" });
    await expect(heading).toBeVisible();

    // 설명 텍스트 확인
    const description = page.getByText("순찰 계획 및 팀을 관리합니다.");
    await expect(description).toBeVisible();

    // 새 순찰 계획 버튼 확인
    const createButton = page.getByRole("button", { name: /새 순찰 계획/ });
    await expect(createButton).toBeVisible();
  });

  test("순찰 계획 탭이 기본으로 활성화되어야 함", async ({ page }) => {
    // 순찰 계획 탭 확인
    const plansTab = page.locator('button:has-text("순찰 계획")');
    await expect(plansTab).toBeVisible();

    // 순찰 계획 탭이 활성화되었는지 확인 (border-primary 클래스)
    const activeTab = plansTab.locator("..");
    await expect(activeTab).toHaveClass(/border-primary/);
  });

  test("순찰 팀 탭 표시 확인", async ({ page }) => {
    // 순찰 팀 탭 확인
    const teamsTab = page.locator('button:has-text("순찰 팀")');
    await expect(teamsTab).toBeVisible();

    // 순찰 팀 탭 클릭
    await teamsTab.click();

    // 순찰 팀 탭이 활성화되었는지 확인
    await expect(teamsTab.locator("..")).toHaveClass(/border-primary/);

    // 테이블이 렌더링됨
    await expect(page.locator("table")).toBeVisible();
  });

  test("탭 전환 시 페이지 초기화 확인", async ({ page }) => {
    // 순찰 계획 탭에서 페이지 상태 설정
    const pagination = page.locator('button:has-text("다음")');

    // 순찰 팀 탭으로 전환
    await page.locator('button:has-text("순찰 팀")').click();

    // 다시 순찰 계획 탭으로 전환
    await page.locator('button:has-text("순찰 계획")').click();

    // 첫 번째 페이지가 표시되어야 함
    const firstButton = page.locator('button:has-text("처음")');
    if (await firstButton.isVisible()) {
      await expect(firstButton).toBeDisabled();
    }
  });

  test("새 순찰 계획 버튼 표시 확인", async ({ page }) => {
    // 새 순찰 계획 버튼 확인
    const createButton = page.getByRole("button", { name: /새 순찰 계획/ });
    await expect(createButton).toBeVisible();

    // 버튼에 아이콘 포함 확인
    const icon = createButton.locator("svg");
    await expect(icon).toBeVisible();
  });

  test("새 순찰 계획 버튼 클릭 → /patrols/new 이동", async ({ page }) => {
    // 새 순찰 계획 버튼 클릭
    await page.getByRole("button", { name: /새 순찰 계획/ }).click();

    // URL 확인
    await expect(page).toHaveURL("/patrols/new");
  });

  test("순찰 팀 탭에서 새 순찰 팀 버튼 클릭 → /patrols/teams/new 이동", async ({
    page,
  }) => {
    // 순찰 팀 탭으로 전환
    await page.locator('button:has-text("순찰 팀")').click();

    // 새 순찰 팀 버튼 클릭
    await page.getByRole("button", { name: /새 순찰 팀/ }).click();

    // URL 확인
    await expect(page).toHaveURL("/patrols/teams/new");
  });

  test("순찰 계획 테이블 구조 확인", async ({ page }) => {
    // 테이블 확인
    const table = page.locator("table");
    await expect(table).toBeVisible();

    // 테이블 헤더 확인
    const headerCells = page.locator("table thead th");
    await expect(headerCells).toContainText("No");
    await expect(headerCells).toContainText("상태");
    await expect(headerCells).toContainText("계획명");
    await expect(headerCells).toContainText("팀명");
    await expect(headerCells).toContainText("유형");
    await expect(headerCells).toContainText("시작일");
    await expect(headerCells).toContainText("종료일");
  });

  test("순찰 팀 테이블 구조 확인", async ({ page }) => {
    // 순찰 팀 탭으로 전환
    await page.locator('button:has-text("순찰 팀")').click();

    // 테이블 확인
    const table = page.locator("table");
    await expect(table).toBeVisible();

    // 테이블 헤더 확인
    const headerCells = page.locator("table thead th");
    await expect(headerCells).toContainText("No");
    await expect(headerCells).toContainText("상태");
    await expect(headerCells).toContainText("팀명");
    await expect(headerCells).toContainText("차량번호");
    await expect(headerCells).toContainText("팀원 수");
    await expect(headerCells).toContainText("담당 건물");
  });

  test("순찰 계획 상태 배지 표시 확인", async ({ page }) => {
    // 테이블에 데이터가 있는지 확인
    const tableRows = page.locator("table tbody tr");
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 첫 번째 행의 상태 배지 확인
      const statusCell = tableRows.first().locator("td").nth(1);
      await expect(statusCell).toBeVisible();

      // 상태 배지 스타일 확인
      const badge = statusCell.locator("span");
      await expect(badge).toBeVisible();
    }
  });

  test("순찰 팀 상태 배지 표시 확인", async ({ page }) => {
    // 순찰 팀 탭으로 전환
    await page.locator('button:has-text("순찰 팀")').click();

    // 테이블에 데이터가 있는지 확인
    const tableRows = page.locator("table tbody tr");
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 첫 번째 행의 상태 배지 확인
      const statusCell = tableRows.first().locator("td").nth(1);
      await expect(statusCell).toBeVisible();

      // 상태 배지 스타일 확인
      const badge = statusCell.locator("span");
      await expect(badge).toBeVisible();
    }
  });

  test("계획명 링크 클릭 → 상세 페이지 이동", async ({ page }) => {
    // 테이블에 데이터가 있는지 확인
    const tableRows = page.locator("table tbody tr");
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 첫 번째 행의 계획명 링크 클릭
      const nameLink = tableRows.first().locator("td").nth(2).locator("button");

      if (await nameLink.isVisible()) {
        await nameLink.click();

        // /patrols/[id] 형식의 URL로 이동되었는지 확인
        const url = page.url();
        expect(url).toMatch(/\/patrols\/\d+$/);
      }
    }
  });

  test("순찰 팀명 링크 클릭 → 팀 상세 페이지 이동", async ({ page }) => {
    // 순찰 팀 탭으로 전환
    await page.locator('button:has-text("순찰 팀")').click();

    // 테이블에 데이터가 있는지 확인
    const tableRows = page.locator("table tbody tr");
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 첫 번째 행의 팀명 링크 클릭
      const nameLink = tableRows.first().locator("td").nth(2).locator("button");

      if (await nameLink.isVisible()) {
        await nameLink.click();

        // /patrols/teams/[id] 형식의 URL로 이동되었는지 확인
        const url = page.url();
        expect(url).toMatch(/\/patrols\/teams\/\d+$/);
      }
    }
  });

  test("페이지네이션 표시 확인", async ({ page }) => {
    // 데이터가 충분한 경우 페이지네이션이 표시되어야 함
    const pagination = page.locator('button:has-text("처음")');

    if (await pagination.isVisible()) {
      // 페이지네이션 버튼들 확인
      await expect(page.locator('button:has-text("처음")')).toBeVisible();
      await expect(page.locator('button:has-text("이전")')).toBeVisible();
      await expect(page.locator('button:has-text("다음")')).toBeVisible();
      await expect(page.locator('button:has-text("마지막")')).toBeVisible();

      // 페이지 정보 확인 (예: "1 / 5")
      await expect(page.locator("span:has-text(/\\d+ \\//)")).toBeVisible();
    }
  });

  test("데이터 없을 때 EmptyState 표시 - 순찰 계획", async ({ page }) => {
    // 데이터가 없는 경우 EmptyState 확인
    const emptyTitle = page.locator('text="순찰 계획이 없습니다"');
    const createButton = page.locator('button:has-text("새 순찰 계획")');

    // 테이블에 데이터가 없으면 EmptyState가 표시되어야 함
    const table = page.locator("table tbody tr");
    const hasData = (await table.count()) > 0;

    if (!hasData) {
      await expect(emptyTitle).toBeVisible();
      await expect(createButton).toBeVisible();
    }
  });

  test("데이터 없을 때 EmptyState 표시 - 순찰 팀", async ({ page }) => {
    // 순찰 팀 탭으로 전환
    await page.locator('button:has-text("순찰 팀")').click();

    // 데이터가 없는 경우 EmptyState 확인
    const emptyTitle = page.locator('text="순찰 팀이 없습니다"');
    const createButton = page.locator('button:has-text("새 순찰 팀")');

    // 테이블에 데이터가 없으면 EmptyState가 표시되어야 함
    const table = page.locator("table tbody tr");
    const hasData = (await table.count()) > 0;

    if (!hasData) {
      await expect(emptyTitle).toBeVisible();
      await expect(createButton).toBeVisible();
    }
  });

  test("로우 액션 메뉴 표시 확인", async ({ page }) => {
    // 테이블에 데이터가 있는지 확인
    const tableRows = page.locator("table tbody tr");
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 첫 번째 행의 액션 버튼 확인
      const actionButton = tableRows
        .first()
        .locator("button:has-text('메뉴 열기')");

      if (await actionButton.isVisible()) {
        const icon = actionButton.locator("svg");
        await expect(icon).toBeVisible();
      }
    }
  });

  test("순찰 계획 상세 보기 메뉴 클릭 → 상세 페이지 이동", async ({
    page,
  }) => {
    // 테이블에 데이터가 있는지 확인
    const tableRows = page.locator("table tbody tr");
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 첫 번째 행의 액션 버튼 클릭
      const actionButton = tableRows
        .first()
        .locator("button:has-text('메뉴 열기')");

      if (await actionButton.isVisible()) {
        await actionButton.click();

        // 상세 보기 메뉴 클릭
        await page.getByText("상세 보기").click();

        // /patrols/[id] 페이지로 이동되었는지 확인
        const url = page.url();
        expect(url).toMatch(/\/patrols\/\d+$/);
      }
    }
  });

  test("순찰 계획 수정 메뉴 클릭 → 수정 페이지 이동", async ({ page }) => {
    // 테이블에 데이터가 있는지 확인
    const tableRows = page.locator("table tbody tr");
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 첫 번째 행의 액션 버튼 클릭
      const actionButton = tableRows
        .first()
        .locator("button:has-text('메뉴 열기')");

      if (await actionButton.isVisible()) {
        await actionButton.click();

        // 수정 메뉴 클릭
        await page.getByText("수정").click();

        // /patrols/[id]/edit 페이지로 이동되었는지 확인
        const url = page.url();
        expect(url).toMatch(/\/patrols\/\d+\/edit$/);
      }
    }
  });

  test("순찰 팀 상세 보기 메뉴 클릭 → 상세 페이지 이동", async ({ page }) => {
    // 순찰 팀 탭으로 전환
    await page.locator('button:has-text("순찰 팀")').click();

    // 테이블에 데이터가 있는지 확인
    const tableRows = page.locator("table tbody tr");
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 첫 번째 행의 액션 버튼 클릭
      const actionButton = tableRows
        .first()
        .locator("button:has-text('메뉴 열기')");

      if (await actionButton.isVisible()) {
        await actionButton.click();

        // 상세 보기 메뉴 클릭
        await page.getByText("상세 보기").click();

        // /patrols/teams/[id] 페이지로 이동되었는지 확인
        const url = page.url();
        expect(url).toMatch(/\/patrols\/teams\/\d+$/);
      }
    }
  });

  test("순찰 팀 수정 메뉴 클릭 → 수정 페이지 이동", async ({ page }) => {
    // 순찰 팀 탭으로 전환
    await page.locator('button:has-text("순찰 팀")').click();

    // 테이블에 데이터가 있는지 확인
    const tableRows = page.locator("table tbody tr");
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 첫 번째 행의 액션 버튼 클릭
      const actionButton = tableRows
        .first()
        .locator("button:has-text('메뉴 열기')");

      if (await actionButton.isVisible()) {
        await actionButton.click();

        // 수정 메뉴 클릭
        await page.getByText("수정").click();

        // /patrols/teams/[id]/edit 페이지로 이동되었는지 확인
        const url = page.url();
        expect(url).toMatch(/\/patrols\/teams\/\d+\/edit$/);
      }
    }
  });

  test("팀원 수 표시 확인", async ({ page }) => {
    // 순찰 팀 탭으로 전환
    await page.locator('button:has-text("순찰 팀")').click();

    // 테이블에 데이터가 있는지 확인
    const tableRows = page.locator("table tbody tr");
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 첫 번째 행의 팀원 수 셀 확인
      const teamMembersCell = tableRows.first().locator("td").nth(4);
      const text = await teamMembersCell.textContent();

      // "Xman" 형식으로 표시되어야 함
      expect(text).toMatch(/\d+명/);
    }
  });

  test("담당 건물 수 표시 확인", async ({ page }) => {
    // 순찰 팀 탭으로 전환
    await page.locator('button:has-text("순찰 팀")').click();

    // 테이블에 데이터가 있는지 확인
    const tableRows = page.locator("table tbody tr");
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 첫 번째 행의 담당 건물 셀 확인
      const buildingsCell = tableRows.first().locator("td").nth(5);
      const text = await buildingsCell.textContent();

      // "X개" 형식으로 표시되어야 함
      expect(text).toMatch(/\d+개/);
    }
  });

  test("로그인하지 않은 상태에서 순찰 페이지 접근 시 로그인 페이지로 리다이렉트", async ({
    context,
  }) => {
    // 새로운 페이지 (쿠키 없음)
    const page = await context.newPage();
    await page.goto("/patrols");

    // 로그인 페이지로 리다이렉트되었는지 확인
    await expect(page).toHaveURL("/login");

    await page.close();
  });

  test("총 데이터 건수 표시 확인", async ({ page }) => {
    // 데이터가 충분한 경우 총 건수가 표시되어야 함
    const totalCount = page.locator('text=/총 \\d+건/');

    if (await totalCount.isVisible()) {
      // 총 건수 정보 확인
      await expect(totalCount).toBeVisible();
      // 정규식으로 "총 XXX건" 형식 확인
      const text = await totalCount.textContent();
      expect(text).toMatch(/총 \d+건/);
    }
  });
});
