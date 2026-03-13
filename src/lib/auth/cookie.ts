import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { TOKEN_CONFIG } from "./token-config";

/**
 * 인증 토큰 쿠키 설정
 * - httpOnly: XSS 방지 (JS에서 접근 불가)
 * - sameSite: Lax
 * - path: / (미들웨어 인증 체크용)
 */
export const AUTH_COOKIE_OPTIONS: Partial<ResponseCookie> = {
  name: "auth-token",
  maxAge: TOKEN_CONFIG.authTokenTTL,
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

/**
 * 쿠키 이름 상수
 */
export const COOKIE_NAMES = {
  AUTH_TOKEN: "auth-token",
} as const;
