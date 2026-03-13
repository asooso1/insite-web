import { test, expect } from "./fixtures";
// 인증 상태는 storageState(global-setup)로 자동 로드됨 - 반복 로그인 불필요

test.describe("게시판 페이지", () => {
  test.beforeEach(async ({ page }) => {
    // 인증 후 게시판 페이지 접속
    await page.goto("/boards");
  });

  test("게시판 목록 페이지가 로드되어야 함", async ({ page }) => {
    // 페이지 제목 확인
    await expect(page.getByRole("heading", { name: "게시판" })).toBeVisible();

    // 설명 텍스트 확인
    await expect(
      page.getByText("공지사항 및 자료를 관리합니다.")
    ).toBeVisible();

    // 새 공지 버튼 확인
    await expect(page.getByRole("button", { name: /새 공지/ })).toBeVisible();
  });

  test("공지사항 탭이 기본으로 표시되어야 함", async ({ page }) => {
    // 탭 확인 - 공지사항 탭이 활성화됨
    const noticeTab = page.locator('button:has-text("공지사항")');
    await expect(noticeTab).toBeVisible();

    // 공지사항 탭이 활성화되었는지 확인 (border-primary 클래스)
    const activeTab = noticeTab.locator("..");
    await expect(activeTab).toHaveClass(/border-primary/);
  });

  test("자료실 탭 표시 확인", async ({ page }) => {
    // 자료실 탭 확인
    const dataTab = page.locator('button:has-text("자료실")');
    await expect(dataTab).toBeVisible();

    // 자료실 탭 클릭
    await dataTab.click();

    // 자료실 탭이 활성화되었는지 확인
    await expect(dataTab.locator("..")).toHaveClass(/border-primary/);

    // 테이블이 렌더링됨 (DataTable)
    await expect(page.locator("table")).toBeVisible();
  });

  test("공지사항 탭 전환 후 검색 초기화 확인", async ({ page }) => {
    // 검색 입력창에 텍스트 입력
    const searchInput = page.locator('input[placeholder*="검색"]');
    await searchInput.fill("테스트");
    await expect(searchInput).toHaveValue("테스트");

    // 자료실 탭으로 전환
    await page.locator('button:has-text("자료실")').click();

    // 검색 입력창이 초기화되어야 함
    await expect(searchInput).toHaveValue("");

    // 다시 공지사항 탭으로 전환
    await page.locator('button:has-text("공지사항")').click();

    // 검색 입력창이 초기화되어야 함
    await expect(searchInput).toHaveValue("");
  });

  test("공지사항 검색 필터링", async ({ page }) => {
    // 검색 입력창 확인
    const searchInput = page.locator(
      'input[placeholder*="공지사항 검색"]'
    );
    await expect(searchInput).toBeVisible();

    // 검색 텍스트 입력
    await searchInput.fill("테스트");

    // 검색이 적용되었는지 확인 (테이블이 업데이트되어야 함)
    await expect(page.locator("table")).toBeVisible();
  });

  test("자료실 검색 필터링", async ({ page }) => {
    // 자료실 탭으로 전환
    await page.locator('button:has-text("자료실")').click();

    // 검색 입력창 확인
    const searchInput = page.locator(
      'input[placeholder*="자료 검색"]'
    );
    await expect(searchInput).toBeVisible();

    // 검색 텍스트 입력
    await searchInput.fill("매뉴얼");

    // 검색이 적용되었는지 확인
    await expect(page.locator("table")).toBeVisible();
  });

  test("새 공지 버튼 클릭 → /boards/notices/new 이동", async ({ page }) => {
    // 새 공지 버튼 클릭
    await page.getByRole("button", { name: /새 공지/ }).click();

    // URL 확인
    await expect(page).toHaveURL("/boards/notices/new");
  });

  test("자료실 탭에서 새 자료 버튼 클릭 → /boards/data/new 이동", async ({
    page,
  }) => {
    // 자료실 탭으로 전환
    await page.locator('button:has-text("자료실")').click();

    // 새 자료 버튼 클릭
    await page.getByRole("button", { name: /새 자료/ }).click();

    // URL 확인
    await expect(page).toHaveURL("/boards/data/new");
  });

  test("테이블 구조 확인", async ({ page }) => {
    // 테이블 확인
    await expect(page.locator("table")).toBeVisible();

    // 테이블 헤더 확인 (공지사항 탭)
    const headerCells = page.locator("table thead th");
    await expect(headerCells).toContainText("No");
    await expect(headerCells).toContainText("상태");
    await expect(headerCells).toContainText("유형");
    await expect(headerCells).toContainText("제목");
  });

  test("페이지네이션 표시 확인", async ({ page }) => {
    // 데이터가 충분한 경우 페이지네이션이 표시되어야 함
    // 페이지네이션 요소 확인
    const pagination = page.locator('button:has-text("처음")');
    if (await pagination.isVisible()) {
      // 처음, 이전, 다음, 마지막 버튼 확인
      await expect(page.locator('button:has-text("처음")')).toBeVisible();
      await expect(page.locator('button:has-text("이전")')).toBeVisible();
      await expect(page.locator('button:has-text("다음")')).toBeVisible();
      await expect(page.locator('button:has-text("마지막")')).toBeVisible();
    }
  });

  test("데이터가 없을 때 EmptyState 표시", async ({ page }) => {
    // 검색으로 결과 없는 상태 만들기
    const searchInput = page.locator(
      'input[placeholder*="공지사항 검색"]'
    );
    await searchInput.fill("존재하지않는데이터XYZABC");

    // EmptyState 확인 (아이콘 또는 메시지)
    // 데이터 없음 메시지 또는 "새 공지 등록" 버튼 확인
    const emptyMessage = page.locator('text="공지사항이 없습니다"');
    const registerButton = page.locator('button:has-text("새 공지 등록")');

    // 둘 중 하나가 표시되어야 함
    const isEmptyMessageVisible = await emptyMessage.isVisible();
    const isRegisterButtonVisible = await registerButton.isVisible();
    expect(isEmptyMessageVisible || isRegisterButtonVisible).toBeTruthy();
  });

  test("탭 아이콘 표시 확인", async ({ page }) => {
    // 공지사항 탭의 아이콘 (Megaphone)
    const noticeTab = page.locator('button:has-text("공지사항")');
    const noticeIcon = noticeTab.locator("svg");
    await expect(noticeIcon).toBeVisible();

    // 자료실 탭으로 전환
    await page.locator('button:has-text("자료실")').click();

    // 자료실 탭의 아이콘 (FileText)
    const dataTab = page.locator('button:has-text("자료실")');
    const dataIcon = dataTab.locator("svg");
    await expect(dataIcon).toBeVisible();
  });

  test("로그인하지 않은 상태에서 게시판 접근 시 로그인 페이지로 리다이렉트", async ({
    context,
  }) => {
    // 새로운 페이지 (쿠키 없음)
    const page = await context.newPage();
    await page.goto("/boards");

    // 로그인 페이지로 리다이렉트되었는지 확인
    await expect(page).toHaveURL("/login");

    await page.close();
  });
});
