import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { JWTPayload } from "./token-config";
import type { AuthUser } from "@/lib/stores/auth-store";

/**
 * JWT Secret을 TextEncoder로 인코딩
 */
function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET 환경변수가 설정되지 않았습니다.");
  }
  return new TextEncoder().encode(secret);
}

/**
 * JWT 토큰 검증
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJWTSecret());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * 서버 사이드에서 현재 사용자 정보 조회
 * - 쿠키 또는 헤더에서 토큰 추출
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    return null;
  }

  return {
    accountId: payload.accountId,
    userId: payload.sub,
    userName: payload.userName,
    userRoles: payload.userRoles,
    accountName: payload.accountName,
    accountType: payload.accountType,
    currentCompanyId: payload.currentCompanyId,
    currentCompanyName: payload.currentCompanyName,
    currentBuildingId: payload.currentBuildingId,
    currentBuildingName: payload.currentBuildingName,
    accountCompanyId: payload.accountCompanyId,
  };
}

/**
 * 역할 기반 권한 체크
 */
export function hasRole(
  user: AuthUser | null,
  requiredRoles: string[]
): boolean {
  if (!user) return false;
  return requiredRoles.some((role) => user.userRoles.includes(role));
}

/**
 * 시스템 관리자 여부 체크
 */
export function isSystemAdmin(user: AuthUser | null): boolean {
  return hasRole(user, ["ROLE_SYSTEM_ADMIN", "ROLE_LABS_SYSTEM_ADMIN"]);
}
