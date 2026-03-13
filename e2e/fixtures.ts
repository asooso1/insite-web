import { test as base } from "@playwright/test";
import { AUTH_STORAGE_PATH } from "./constants";

/**
 * 인증된 테스트를 위한 Playwright 커스텀 fixture
 * 각 테스트 전에 저장된 인증 상태를 자동으로 로드
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // 저장된 인증 상태는 playwright.config.ts의 use.storageState로 자동 로드됨
    // 이 fixture는 추가 초기화가 필요한 경우에 대비한 확장점 제공
    await use(page);
  },
});

export { expect } from "@playwright/test";
