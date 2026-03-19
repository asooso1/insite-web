import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * 레거시 csp-web URL → insite-web 경로 리다이렉트 매핑
 */
const LEGACY_REDIRECTS: Record<string, string> = {
  "/workorder": "/work-orders",
  "/facility": "/facilities",
  "/user": "/users",
  "/client": "/clients",
  "/material": "/materials",
  "/board": "/boards",
  "/patrol": "/patrols",
  "/report": "/reports",
  "/setting": "/settings",
  "/license": "/licenses",
  "/main": "/dashboard",
};

/**
 * 레거시 경로를 새 경로로 리다이렉트
 */
function getLegacyRedirect(pathname: string): string | null {
  for (const [legacy, modern] of Object.entries(LEGACY_REDIRECTS)) {
    if (pathname === legacy || pathname.startsWith(`${legacy}/`) || pathname.startsWith(`${legacy}?`)) {
      return modern + pathname.slice(legacy.length);
    }
  }
  return null;
}

/**
 * 공개 경로 (인증 불필요)
 */
const PUBLIC_PATHS = [
  "/login",
  "/id-find",
  "/password-change",
  "/guest",
  "/m",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/me",
  ...(process.env.NODE_ENV === "development" ? ["/ui-preview"] : []),
];

/**
 * 관리자 전용 경로
 */
const ADMIN_PATHS = ["/admin"];

/**
 * 관리자 역할
 */
const ADMIN_ROLES = ["ROLE_SYSTEM_ADMIN", "ROLE_LABS_SYSTEM_ADMIN"];

/**
 * JWT 만료 여부 체크 (서명 미검증 - Edge Runtime 클라이언트사이드)
 * - 빠른 만료 리다이렉트용. 실제 보안 검증은 csp-was API에서 수행
 */
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const base64 = (parts[1] ?? "").replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as { exp?: number };
    if (typeof payload.exp !== "number") return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

/**
 * Base64 디코딩 (Edge Runtime 호환)
 */
function base64Decode(str: string): Uint8Array {
  // Base64 문자를 6비트 값으로 변환하는 테이블
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  // = 패딩 제거
  let len = str.length;
  while (len > 0 && str[len - 1] === "=") len--;

  const bytes = new Uint8Array(Math.floor((len * 6) / 8));
  let p = 0;
  let bits = 0;
  let value = 0;

  for (let i = 0; i < len; i++) {
    const charCode = str.charCodeAt(i);
    const lookupValue = lookup[charCode];
    value = (value << 6) | (lookupValue ?? 0);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes[p++] = (value >> bits) & 0xff;
    }
  }

  return bytes;
}

/**
 * JWT Secret 가져오기
 * - csp-was TokenProvider와 동일하게 Base64 디코딩 후 사용
 * - JWT_SECRET 미설정 시 null 반환 (검증 미사용)
 */
function getJWTSecret(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return base64Decode(secret);
}

/**
 * CORS Origin 검증 (Next.js API 라우트 전용)
 * - Origin 헤더가 없으면 허용 (서버사이드 호출 또는 같은 출처)
 * - 허용된 출처 목록: ALLOWED_ORIGINS 환경변수 (쉼표 구분) 또는 요청 호스트
 */
function isCorsAllowed(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // Origin 없음 = 서버사이드 또는 동일 출처

  const host = request.headers.get("host");
  const proto = request.nextUrl.protocol;
  const ownOrigin = `${proto}//${host}`;

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : [];

  return origin === ownOrigin || allowedOrigins.includes(origin);
}

/**
 * 경로가 공개 경로인지 확인
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

/**
 * 경로가 관리자 경로인지 확인
 */
function isAdminPath(pathname: string): boolean {
  return ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

/**
 * Next.js Proxy (구 Middleware)
 * - JWT 검증
 * - 공개/보호 경로 처리
 * - 관리자 권한 체크
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // 정적 파일 및 Next.js 내부 경로 스킵
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 레거시 csp-web URL 리다이렉트
  const legacyTarget = getLegacyRedirect(pathname);
  if (legacyTarget) {
    return NextResponse.redirect(new URL(legacyTarget, request.url));
  }

  // 공개 경로는 인증 불필요
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // API 라우트 CORS 검증 (외부 출처 요청 차단)
  if (pathname.startsWith("/api/") && !isCorsAllowed(request)) {
    return NextResponse.json({ code: "E00403", message: "허용되지 않은 출처입니다." }, { status: 403 });
  }

  // Authorization 헤더 또는 쿠키에서 토큰 추출
  // auth-token 쿠키에 csp-was authToken 저장 (단일 토큰, 1시간 유효)
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : request.cookies.get("auth-token")?.value;

  // 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // JWT 만료 체크 (서명 미검증 - 빠른 UX 리다이렉트용)
  // 실제 API 데이터 보안은 csp-was JWT Bearer 검증이 담당
  if (isTokenExpired(token)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/**
 * Middleware 적용 경로 설정
 */
export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 적용:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico (파비콘)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
