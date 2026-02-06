import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

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
  "/api/auth/refresh",
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
 * JWT Secret 가져오기
 */
function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? "development-secret-key-32chars!!";
  return new TextEncoder().encode(secret);
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
 * Next.js Middleware
 * - JWT 검증
 * - 공개/보호 경로 처리
 * - 관리자 권한 체크
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // 정적 파일 및 Next.js 내부 경로 스킵
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 공개 경로는 인증 불필요
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Authorization 헤더 또는 쿠키에서 토큰 추출
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : request.cookies.get("access-token")?.value;

  // 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // JWT 검증
    const { payload } = await jwtVerify(token, getJWTSecret());
    const userRoles = (payload.userRoles as string[]) ?? [];

    // 관리자 경로 권한 체크
    if (isAdminPath(pathname)) {
      const isAdmin = ADMIN_ROLES.some((role) => userRoles.includes(role));
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // 요청 헤더에 사용자 정보 추가 (서버 컴포넌트에서 사용)
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.sub as string);
    requestHeaders.set("x-user-roles", userRoles.join(","));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    // 토큰 검증 실패 시 로그인 페이지로 리다이렉트
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
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
