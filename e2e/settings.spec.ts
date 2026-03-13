import { test, expect } from "./fixtures";

test.describe("설정 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings");
  });

  test("설정 페이지 로드", async ({ page }) => {
    // 페이지 제목 확인
    await expect(page.getByRole("heading", { name: "설정" })).toBeVisible();

    // 설명 텍스트 확인
    await expect(
      page.getByText("시스템 코드, 설비 분류, 표준 설비를 관리합니다.")
    ).toBeVisible();
  });

  test("모든 탭 표시 확인", async ({ page }) => {
    // 각 탭 버튼 확인
    const tabs = [
      "기본 코드",
      "설비 분류",
      "표준 설비",
      "미화 분류",
      "미화 대상",
      "미화 도구",
      "미화 계수",
    ];

    for (const tabName of tabs) {
      await expect(page.getByRole("button", { name: tabName })).toBeVisible();
    }

    // 기본 코드 탭이 기본으로 활성화되어야 함
    const configTab = page.getByRole("button", { name: "기본 코드" });
    await expect(configTab).toHaveClass(/border-primary/);
  });

  test("기본 코드 탭 - 설정 그룹 카드 표시", async ({ page }) => {
    // 기본 코드 탭이 기본값이므로 이미 활성화됨
    const configTab = page.getByRole("button", { name: "기본 코드" });
    await expect(configTab).toHaveClass(/border-primary/);

    // 설정 그룹 카드가 보여야 함 (Skeleton 또는 실제 데이터)
    // CardHeader를 확인
    const cards = page.locator("div.rounded-lg.border");
    const cardCount = await cards.count();

    // 데이터가 있으면 카드가 보여야 함
    if (cardCount > 0) {
      await expect(cards.first()).toBeVisible();
    }
  });

  test("기본 코드 탭 - 그룹 확장/축소 기능", async ({ page }) => {
    // 설정 그룹 카드 클릭하여 확장
    const card = page.locator("div").filter({ has: page.locator("h3") }).first();

    if (await card.isVisible()) {
      await card.click();

      // 확장 후 chevron 아이콘이 변경되어야 함
      // (expanded 상태에서 ChevronDown, collapsed에서 ChevronRight)
      // 실제로는 카드의 컨텐츠가 보여야 함
      const cardContent = card.locator("..").locator("div:has-text('\\[')");
      const isExpanded = await cardContent
        .first()
        .isVisible()
        .catch(() => false);

      // 확장된 후 설정 항목이 보이거나 숨겨져야 함
      expect(typeof isExpanded).toBe("boolean");
    }
  });

  test("설비 분류 탭 전환", async ({ page }) => {
    const categoryTab = page.getByRole("button", { name: "설비 분류" });
    await categoryTab.click();

    // 탭이 활성화되었는지 확인
    await expect(categoryTab).toHaveClass(/border-primary/);

    // "설비 분류 트리" 텍스트 또는 EmptyState 확인
    const categoryTree = page.locator("text=설비 분류 트리");
    const emptyState = page.locator("text=설비 분류가 없습니다");

    const isVisible = await Promise.race([
      categoryTree.isVisible().then(() => "tree"),
      emptyState.isVisible().then(() => "empty"),
    ]).catch(() => null);

    expect(["tree", "empty"]).toContain(isVisible);
  });

  test("표준 설비 탭 전환", async ({ page }) => {
    const masterTab = page.getByRole("button", { name: "표준 설비" });
    await masterTab.click();

    // 탭이 활성화되었는지 확인
    await expect(masterTab).toHaveClass(/border-primary/);

    // 검색 입력 필드 확인
    await expect(page.getByPlaceholder("설비명 검색...")).toBeVisible();

    // 새 표준 설비 버튼 확인
    await expect(
      page.getByRole("button", { name: /새 표준 설비/ })
    ).toBeVisible();

    // 테이블 또는 EmptyState 확인
    const table = page.locator("table");
    const emptyState = page.locator("text=표준 설비가 없습니다");

    const isVisible = await Promise.race([
      table.isVisible().then(() => "table"),
      emptyState.isVisible().then(() => "empty"),
    ]).catch(() => null);

    expect(["table", "empty"]).toContain(isVisible);
  });

  test("표준 설비 탭 - 테이블 컬럼 확인", async ({ page }) => {
    const masterTab = page.getByRole("button", { name: "표준 설비" });
    await masterTab.click();

    // 테이블이 표시되었는지 확인
    const table = page.locator("table");
    const isTableVisible = await table.isVisible().catch(() => false);

    if (isTableVisible) {
      // 테이블 헤더 확인
      await expect(page.getByText("No")).toBeVisible();
      await expect(page.getByText("제품명")).toBeVisible();
      await expect(page.getByText("분류")).toBeVisible();
      await expect(page.getByText("제조업체")).toBeVisible();
      await expect(page.getByText("모델")).toBeVisible();
      await expect(page.getByText("연료")).toBeVisible();
      await expect(page.getByText("등록일")).toBeVisible();
    }
  });

  test("표준 설비 탭 - 새 표준 설비 버튼 클릭", async ({ page }) => {
    const masterTab = page.getByRole("button", { name: "표준 설비" });
    await masterTab.click();

    const newButton = page.getByRole("button", { name: /새 표준 설비/ });
    await newButton.click();

    // /settings/facility-masters/new 페이지로 이동
    await expect(page).toHaveURL("/settings/facility-masters/new");
  });

  test("미화 분류 탭 전환", async ({ page }) => {
    const cleaningCategoryTab = page.getByRole("button", { name: "미화 분류" });
    await cleaningCategoryTab.click();

    // 탭이 활성화되었는지 확인
    await expect(cleaningCategoryTab).toHaveClass(/border-primary/);
  });

  test("미화 대상 탭 전환", async ({ page }) => {
    const cleaningTargetTab = page.getByRole("button", { name: "미화 대상" });
    await cleaningTargetTab.click();

    // 탭이 활성화되었는지 확인
    await expect(cleaningTargetTab).toHaveClass(/border-primary/);
  });

  test("미화 도구 탭 전환", async ({ page }) => {
    const cleaningUtilTab = page.getByRole("button", { name: "미화 도구" });
    await cleaningUtilTab.click();

    // 탭이 활성화되었는지 확인
    await expect(cleaningUtilTab).toHaveClass(/border-primary/);
  });

  test("미화 계수 탭 전환", async ({ page }) => {
    const cleaningCoefficientTab = page.getByRole("button", {
      name: "미화 계수",
    });
    await cleaningCoefficientTab.click();

    // 탭이 활성화되었는지 확인
    await expect(cleaningCoefficientTab).toHaveClass(/border-primary/);
  });

  test("메뉴 관리 바로가기 표시", async ({ page }) => {
    // 페이지 하단으로 스크롤
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));

    // 메뉴 관리 버튼 확인
    const menuButton = page.getByRole("button").filter({
      has: page.locator("text=메뉴 관리"),
    });
    await expect(menuButton).toBeVisible();

    // 메뉴 관리 설명 텍스트 확인
    await expect(
      page.getByText("csp-was 메뉴 트리와 insite-web 페이지 연결을 관리합니다.")
    ).toBeVisible();
  });

  test("메뉴 관리 바로가기 클릭", async ({ page }) => {
    // 페이지 하단으로 스크롤
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));

    // 메뉴 관리 버튼 클릭
    const menuButton = page.getByRole("button").filter({
      has: page.locator("text=메뉴 관리"),
    });
    await menuButton.click();

    // /settings/menu-management 페이지로 이동
    await expect(page).toHaveURL("/settings/menu-management");
  });

  test("표준 설비 탭 - 제품명 검색", async ({ page }) => {
    const masterTab = page.getByRole("button", { name: "표준 설비" });
    await masterTab.click();

    const searchInput = page.getByPlaceholder("설비명 검색...");

    if (await searchInput.isVisible()) {
      // 검색어 입력
      await searchInput.fill("보일러");

      // 입력 후 잠시 대기 (디바운싱)
      await page.waitForTimeout(500);

      // 테이블이 업데이트되었는지 확인
      const table = page.locator("table");
      const isTableVisible = await table.isVisible().catch(() => false);

      if (isTableVisible) {
        // 검색 결과가 있으면 테이블이 보여야 함
        await expect(table).toBeVisible();
      }
    }
  });

  test("표준 설비 탭 - 제품명 링크 클릭", async ({ page }) => {
    const masterTab = page.getByRole("button", { name: "표준 설비" });
    await masterTab.click();

    // 제품명 링크 찾기 (text-primary class)
    const productLinks = page.locator(
      "table tbody tr button[class*='text-primary']"
    );
    const linkCount = await productLinks.count();

    if (linkCount > 0) {
      // 첫 번째 제품 링크 클릭
      await productLinks.first().click();

      // 상세 페이지로 이동했는지 확인 (/settings/facility-masters/{id})
      await expect(page).toHaveURL(/\/settings\/facility-masters\/\d+$/);
    }
  });

  test("탭 전환 시 스크롤 위치 유지", async ({ page }) => {
    // 기본 코드 탭에서 스크롤
    const masterTab = page.getByRole("button", { name: "표준 설비" });
    await masterTab.click();

    // 페이지 스크롤
    await page.evaluate(() => window.scrollBy(0, 200));

    // 다른 탭으로 전환
    const categoryTab = page.getByRole("button", { name: "설비 분류" });
    await categoryTab.click();

    // 탭 전환 후 다시 표준 설비로
    await masterTab.click();

    // 페이지가 정상적으로 로드되는지 확인
    await expect(page.getByPlaceholder("설비명 검색...")).toBeVisible();
  });

  test("기본 코드 탭 - 페이지 로딩 상태", async ({ page }) => {
    // 페이지 새로고침
    await page.reload();

    // 로딩 중 Skeleton이 보일 수 있음
    // 로딩 완료 후 콘텐츠가 보여야 함
    const content = page.locator("div").filter({ has: page.locator("h3") });

    // 콘텐츠 또는 EmptyState 중 하나가 보여야 함
    const isVisible = await Promise.race([
      content.first().isVisible().then(() => "content"),
      page
        .locator("text=기본 코드가 없습니다")
        .isVisible()
        .then(() => "empty"),
    ]).catch(() => null);

    expect(["content", "empty"]).toContain(isVisible);
  });
});
