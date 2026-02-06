import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { TOKEN_CONFIG } from "./token-config";

/**
 * Refresh Token 쿠키 설정
 * - httpOnly: XSS 방지
 * - secure: HTTPS에서만 전송
 * - sameSite: Lax (top-level navigation GET에만 쿠키 전송)
 * - path: /api/auth (인증 API에서만 전송)
 */
export const REFRESH_COOKIE_OPTIONS: Partial<ResponseCookie> = {
  name: "refresh-token",
  maxAge: TOKEN_CONFIG.refreshTokenTTL,
  path: "/api/auth",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

/**
 * 쿠키 이름 상수
 */
export const COOKIE_NAMES = {
  REFRESH_TOKEN: "refresh-token",
} as const;
