import { jwtVerify, decodeJwt } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";
import type { JWTPayload } from "./token-config";
import type { AuthUser } from "@/lib/stores/auth-store";

/**
 * JWT 페이로드 Zod 스키마 - 런타임 검증
 */
const JWTPayloadSchema = z.object({
  accountId: z.number(),
  userId: z.string(),
  accountName: z.string(),
  userRoles: z.array(z.string()).default([]),
  accountType: z.string().optional(),
  currentCompanyId: z.number().optional(),
  currentCompanyName: z.string().optional(),
  currentBuildingId: z.number().optional(),
  currentBuildingName: z.string().optional(),
  accountCompanyId: z.number().optional(),
  exp: z.number().optional(),
});

/**
 * JWT Secret 가져오기
 * - csp-was TokenProvider와 동일하게 Base64 디코딩 후 사용
 */
function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET 환경변수가 설정되지 않았습니다.");
  }
  const decoded = Buffer.from(secret, "base64");
  return new Uint8Array(decoded);
}

/**
 * JWT 토큰 검증 (서명 포함)
 * - JWT_SECRET이 설정된 경우에만 사용
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJWTSecret());
    const parsed = JWTPayloadSchema.safeParse(payload);
    if (!parsed.success) return null;
    return parsed.data as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * JWT 토큰 디코딩 (서명 검증 없음, 만료만 체크)
 * - JWT_SECRET 없이도 동작 (csp-was 토큰을 신뢰)
 */
function decodeJwtWithExpiry(token: string): JWTPayload | null {
  try {
    const raw = decodeJwt(token);
    const parsed = JWTPayloadSchema.safeParse(raw);
    if (!parsed.success) return null;
    const claims = parsed.data as JWTPayload;
    const now = Math.floor(Date.now() / 1000);
    if (claims.exp && claims.exp < now) {
      return null;
    }
    return claims;
  } catch {
    return null;
  }
}

/**
 * JWT 클레임에서 AuthUser 생성
 */
function claimsToAuthUser(claims: JWTPayload): AuthUser {
  return {
    accountId: String(claims.accountId),
    userId: claims.userId,
    userName: claims.accountName,
    userRoles: claims.userRoles ?? [],
    accountName: claims.accountName,
    accountType: claims.accountType as "LABS" | "FIELD" | "CLIENT",
    currentCompanyId: String(claims.currentCompanyId),
    currentCompanyName: claims.currentCompanyName,
    currentBuildingId: String(claims.currentBuildingId),
    currentBuildingName: claims.currentBuildingName,
    accountCompanyId: String(claims.accountCompanyId),
  };
}

/**
 * 서버 사이드에서 현재 사용자 정보 조회
 * - JWT_SECRET 설정 시 서명 검증 포함
 * - JWT_SECRET 미설정 시 만료 체크만 (csp-was 토큰 신뢰)
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  // JWT_SECRET이 설정된 경우 서명 검증, 없으면 만료 체크만
  const claims: JWTPayload | null = process.env.JWT_SECRET
    ? await verifyJWT(token)
    : decodeJwtWithExpiry(token);

  if (!claims) {
    return null;
  }

  return claimsToAuthUser(claims);
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
