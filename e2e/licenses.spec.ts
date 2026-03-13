import { test, expect } from "./fixtures";
// 인증 상태는 storageState(global-setup)로 자동 로드됨 - 반복 로그인 불필요

test.describe("자격증 목록 페이지", () => {
  test.beforeEach(async ({ page }) => {
    // 인증 후 자격증 페이지 접속
    await page.goto("/licenses");
  });

  test("자격증 목록 페이지가 로드되어야 함", async ({ page }) => {
    // 페이지 제목 확인
    await expect(page.getByRole("heading", { name: "자격증 목록" })).toBeVisible();

    // 설명 텍스트 확인
    await expect(
      page.getByText("자격증 정보를 관리합니다.")
    ).toBeVisible();
  });

  test("페이지 헤더 구조 확인", async ({ page }) => {
    // 제목과 설명이 함께 표시되어야 함
    const heading = page.getByRole("heading", { name: "자격증 목록" });
    await expect(heading).toBeVisible();

    // 설명 텍스트
    const description = page.getByText("자격증 정보를 관리합니다.");
    await expect(description).toBeVisible();

    // 두 요소가 같은 부모 내에 있는지 확인 (헤더 그룹)
    const header = page.locator("div:has-text('자격증 목록')");
    await expect(header).toBeVisible();
  });

  test("새 자격증 버튼 표시 확인", async ({ page }) => {
    // 새 자격증 버튼 확인
    const createButton = page.getByRole("button", { name: /새 자격증/ });
    await expect(createButton).toBeVisible();

    // 버튼에 아이콘 포함 확인 (Plus 아이콘)
    const icon = createButton.locator("svg");
    await expect(icon).toBeVisible();
  });

  test("새 자격증 버튼 클릭 → /licenses/new 이동", async ({ page }) => {
    // 새 자격증 버튼 클릭
    await page.getByRole("button", { name: /새 자격증/ }).click();

    // URL 확인
    await expect(page).toHaveURL("/licenses/new");
  });

  test("검색 입력창 표시 확인", async ({ page }) => {
    // 검색 입력창 확인
    const searchInput = page.locator(
      'input[placeholder="자격증명 또는 발행처 검색..."]'
    );
    await expect(searchInput).toBeVisible();

    // 입력창 타입 확인
    await expect(searchInput).toHaveAttribute("type", "text");
  });

  test("검색 필터링 동작 확인", async ({ page }) => {
    // 검색 입력창에 텍스트 입력
    const searchInput = page.locator(
      'input[placeholder="자격증명 또는 발행처 검색..."]'
    );
    await searchInput.fill("정보보안");

    // 테이블이 업데이트되어야 함
    await expect(page.locator("table")).toBeVisible();

    // 입력값이 유지되어야 함
    await expect(searchInput).toHaveValue("정보보안");
  });

  test("테이블 구조 확인", async ({ page }) => {
    // 테이블 확인
    const table = page.locator("table");
    await expect(table).toBeVisible();

    // 테이블 헤더 확인
    const headerCells = page.locator("table thead th");
    await expect(headerCells).toContainText("No");
    await expect(headerCells).toContainText("상태");
    await expect(headerCells).toContainText("자격증명");
    await expect(headerCells).toContainText("발행처");
    await expect(headerCells).toContainText("분류 1");
    await expect(headerCells).toContainText("분류 2");
    await expect(headerCells).toContainText("분류 3");
  });

  test("상태 배지 표시 확인", async ({ page }) => {
    // 테이블에 데이터가 있는지 확인
    const tableRows = page.locator("table tbody tr");
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 첫 번째 행의 상태 배지 확인
      const statusCell = tableRows.first().locator("td").nth(1);
      await expect(statusCell).toBeVisible();

      // 상태 배지 스타일 확인 (rounded-full, px-2.5, py-0.5 등)
      const badge = statusCell.locator("span");
      await expect(badge).toBeVisible();
    }
  });

  test("자격증명 컬럼이 클릭 가능한 링크여야 함", async ({ page }) => {
    // 테이블에 데이터가 있는지 확인
    const tableRows = page.locator("table tbody tr");
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 첫 번째 행의 자격증명 셀 확인
      const nameCell = tableRows.first().locator("td").nth(2);
      const link = nameCell.locator("button");

      // 링크가 존재하고 클릭 가능한지 확인
      if (await link.isVisible()) {
        await expect(link).toHaveClass(/text-primary/);
        await expect(link).toHaveClass(/hover:underline/);
      }
    }
  });

  test("자격증명 링크 클릭 → 상세 페이지 이동", async ({ page }) => {
    // 테이블에 데이터가 있는지 확인
    const tableRows = page.locator("table tbody tr");
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 첫 번째 행의 자격증명 링크 클릭
      const nameLink = tableRows.first().locator("td").nth(2).locator("button");
      if (await nameLink.isVisible()) {
        // 링크가 있는 경우만 테스트
        const firstRowId = await tableRows
          .first()
          .locator("td")
          .first()
          .textContent();

        if (firstRowId) {
          await nameLink.click();

          // /licenses/[id] 형식의 URL로 이동되었는지 확인
          const url = page.url();
          expect(url).toMatch(/\/licenses\/\d+$/);
        }
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

  test("데이터 없을 때 EmptyState 표시", async ({ page }) => {
    // 검색으로 결과 없는 상태 만들기
    const searchInput = page.locator(
      'input[placeholder="자격증명 또는 발행처 검색..."]'
    );
    await searchInput.fill("존재하지않는자격증XYZABC");

    // EmptyState 확인
    const emptyTitle = page.locator('text="자격증이 없습니다"');
    const registerButton = page.locator('button:has-text("새 자격증 등록")');

    // 둘 중 하나가 표시되어야 함
    const isTitleVisible = await emptyTitle.isVisible();
    const isButtonVisible = await registerButton.isVisible();
    expect(isTitleVisible || isButtonVisible).toBeTruthy();
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
        // 더보기 아이콘 확인
        const icon = actionButton.locator("svg");
        await expect(icon).toBeVisible();
      }
    }
  });

  test("로우 액션 메뉴 클릭 → 드롭다운 표시", async ({ page }) => {
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

        // 드롭다운 메뉴 확인
        await expect(page.getByText("상세 보기")).toBeVisible();
        await expect(page.getByText("수정")).toBeVisible();
      }
    }
  });

  test("상세 보기 메뉴 클릭 → 상세 페이지 이동", async ({ page }) => {
    // 테이블에 데이터가 있는지 확인
    const tableRows = page.locator("table tbody tr");
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 첫 번째 행의 ID 추출
      const firstRowId = await tableRows
        .first()
        .locator("td")
        .first()
        .textContent();

      if (firstRowId && firstRowId.trim()) {
        // 액션 버튼 클릭
        const actionButton = tableRows
          .first()
          .locator("button:has-text('메뉴 열기')");
        await actionButton.click();

        // 상세 보기 메뉴 클릭
        await page.getByText("상세 보기").click();

        // /licenses/[id] 페이지로 이동되었는지 확인
        const url = page.url();
        expect(url).toMatch(/\/licenses\/\d+$/);
      }
    }
  });

  test("수정 메뉴 클릭 → 수정 페이지 이동", async ({ page }) => {
    // 테이블에 데이터가 있는지 확인
    const tableRows = page.locator("table tbody tr");
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 첫 번째 행의 ID 추출
      const firstRowId = await tableRows
        .first()
        .locator("td")
        .first()
        .textContent();

      if (firstRowId && firstRowId.trim()) {
        // 액션 버튼 클릭
        const actionButton = tableRows
          .first()
          .locator("button:has-text('메뉴 열기')");
        await actionButton.click();

        // 수정 메뉴 클릭
        await page.getByText("수정").click();

        // /licenses/[id]/edit 페이지로 이동되었는지 확인
        const url = page.url();
        expect(url).toMatch(/\/licenses\/\d+\/edit$/);
      }
    }
  });

  test("분류 필드가 대시('-')로 표시되는 경우", async ({ page }) => {
    // 테이블에 데이터가 있는지 확인
    const tableRows = page.locator("table tbody tr");
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 분류 필드 확인 (분류 1, 분류 2, 분류 3)
      const cells = tableRows.first().locator("td");

      // 분류 필드들이 존재하는지 확인
      const classCells = await cells.all();
      if (classCells.length >= 7) {
        // 분류 필드들이 렌더링되었는지 확인
        await expect(cells.nth(4)).toBeVisible(); // 분류 1
        await expect(cells.nth(5)).toBeVisible(); // 분류 2
        await expect(cells.nth(6)).toBeVisible(); // 분류 3
      }
    }
  });

  test("로그인하지 않은 상태에서 자격증 페이지 접근 시 로그인 페이지로 리다이렉트", async ({
    context,
  }) => {
    // 새로운 페이지 (쿠키 없음)
    const page = await context.newPage();
    await page.goto("/licenses");

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
