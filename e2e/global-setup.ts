import { chromium, type FullConfig } from "@playwright/test";
import { login } from "./helpers/auth";
import { AUTH_STORAGE_PATH } from "./constants";
import fs from "fs";
import path from "path";

/**
 * E2E 전역 설정
 * - 테스트 실행 전 한 번 실행
 * - 인증 상태를 파일에 저장 (AUTH_STORAGE_PATH)
 * - 각 테스트에서 storageState로 인증 상태 재사용
 */

export default async function globalSetup(config: FullConfig): Promise<void> {
  // .auth 디렉토리 생성
  const authDir = path.dirname(AUTH_STORAGE_PATH);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // 로그인 페이지로 이동
    await page.goto("http://localhost:3000/login");

    // 인증 헬퍼로 로그인
    await login(page);

    // 대시보드 또는 메인 페이지로 이동 (쿠키 설정 확인)
    await page.goto("http://localhost:3000/dashboard");

    // 인증 상태 저장 (쿠키 + 로컬스토리지)
    await page.context().storageState({ path: AUTH_STORAGE_PATH });

    console.log(`[E2E] 인증 상태 저장됨: ${AUTH_STORAGE_PATH}`);
  } catch (error) {
    console.warn(
      "[E2E] 전역 인증 설정 실패 - 인증 불필요 테스트만 실행됩니다:",
      error instanceof Error ? error.message : error
    );

    // 빈 상태 저장 (인증 없는 테스트는 여전히 실행 가능)
    fs.writeFileSync(
      AUTH_STORAGE_PATH,
      JSON.stringify({ cookies: [], origins: [] })
    );
  } finally {
    await browser.close();
  }
}
