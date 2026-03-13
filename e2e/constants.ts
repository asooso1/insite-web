import path from "path";

/**
 * E2E 테스트 인증 상태 저장 경로
 * - global-setup.ts에서 저장
 * - playwright.config.ts에서 전역 storageState로 설정
 * - 각 테스트에서 재사용 (재로그인 불필요)
 */
export const AUTH_STORAGE_PATH = path.join(__dirname, ".auth/user.json");
