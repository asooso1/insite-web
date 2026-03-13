import { type Page } from "@playwright/test";

/**
 * E2E 테스트용 인증 헬퍼
 * API 직접 호출로 인증 쿠키 설정 (UI 테스트 불필요)
 */

/**
 * 로그인 헬퍼 - 실제 API 호출로 인증 쿠키 설정
 * @param page Playwright Page 인스턴스
 * @param userId 테스트 사용자 ID (기본값: process.env.TEST_USER_ID 또는 "admin")
 * @param password 테스트 사용자 비밀번호 (기본값: process.env.TEST_PASSWORD 또는 "admin123")
 * @throws 로그인 실패 시 에러 메시지와 함께 예외 발생
 */
export async function login(
  page: Page,
  userId?: string,
  password?: string
): Promise<void> {
  const id = userId ?? process.env.TEST_USER_ID ?? "admin";
  const pw = password ?? process.env.TEST_PASSWORD ?? "admin123";

  const response = await page.request.post("/api/auth/login", {
    data: { userId: id, passwd: pw },
  });

  if (!response.ok()) {
    const errorText = await response.text();
    throw new Error(
      `로그인 실패: ${response.status()} - ${errorText || "Unknown error"}`
    );
  }

  // 응답 검증 (accessToken + user 정보 포함 확인)
  const responseData = await response.json();
  if (!responseData.accessToken || !responseData.user) {
    throw new Error("로그인 응답에 필수 정보가 없습니다.");
  }
}

/**
 * 로그아웃 헬퍼 - API 호출로 인증 쿠키 삭제
 * @param page Playwright Page 인스턴스
 */
export async function logout(page: Page): Promise<void> {
  await page.request.post("/api/auth/logout");
}

/**
 * 인증 상태 확인 헬퍼
 * @param page Playwright Page 인스턴스
 * @returns 인증 쿠키 존재 여부
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  const cookies = await page.context().cookies();
  return cookies.some((c) => c.name === "auth-token" && !!c.value);
}

/**
 * 인증 쿠키 수동 설정 (테스트용)
 * @param page Playwright Page 인스턴스
 * @param token JWT 토큰
 */
export async function setAuthToken(page: Page, token: string): Promise<void> {
  await page.context().addCookies([
    {
      name: "auth-token",
      value: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      expires: Math.floor(Date.now() / 1000) + 3600, // 1시간
    },
  ]);
}

/**
 * 인증 쿠키 삭제 (테스트 정리용)
 * @param page Playwright Page 인스턴스
 */
export async function clearAuthToken(page: Page): Promise<void> {
  await page.context().clearCookies({ name: "auth-token" });
}
