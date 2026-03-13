import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";
import { z } from "zod";
import { AUTH_COOKIE_OPTIONS } from "@/lib/auth/cookie";
import { getAuthUser } from "@/lib/auth/session";
import type { JWTPayload } from "@/lib/auth/token-config";
import type { AuthUser } from "@/lib/stores/auth-store";

/**
 * 빌딩 전환 시 토큰 갱신 요청 바디 타입
 */
interface TokenRefreshRequest {
  buildingId: number;
}

/**
 * 백엔드 토큰 갱신 응답 타입
 * csp-was AccountController → PUT /api/account/token
 */
interface BackendTokenResponse {
  code: string;
  message: string;
  authToken: string | null;
}

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
 * 토큰 갱신 API Route
 * - csp-was PUT /api/account/token 프록시
 * - 빌딩 전환 시 새 토큰 발급 받아 쿠키 업데이트
 * - authToken → httpOnly 쿠키 (auth-token)
 * - accessToken + user 정보 → response body
 */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    // 현재 인증 사용자 조회 (쿠키에서 auth-token 읽음)
    const currentUser = await getAuthUser();

    if (!currentUser) {
      return NextResponse.json(
        { code: "E00401", message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 요청 바디 파싱
    const body: TokenRefreshRequest = await request.json();

    if (!body.buildingId || typeof body.buildingId !== "number") {
      return NextResponse.json(
        { code: "E00400", message: "buildingId는 필수입니다." },
        { status: 400 }
      );
    }

    // 백엔드 토큰 갱신 요청
    const backendUrl = process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8081";

    // 현재 auth-token 쿠키 값 추출
    const cookieStore = request.cookies;
    const authToken = cookieStore.get("auth-token")?.value;

    if (!authToken) {
      return NextResponse.json(
        { code: "E00401", message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const tokenResponse = await fetch(`${backendUrl}/api/account/token`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ buildingId: body.buildingId }),
    });

    const data: BackendTokenResponse = await tokenResponse.json();

    // 토큰 갱신 실패
    if (data.code !== "success" || !data.authToken) {
      return NextResponse.json(
        { code: data.code, message: data.message },
        { status: 401 }
      );
    }

    // JWT에서 사용자 정보 추출 (서명 검증 없음 - 백엔드에서 방금 발급된 토큰이므로 신뢰)
    // Zod 스키마로 런타임 검증
    const rawClaims = decodeJwt(data.authToken);
    const claimsResult = JWTPayloadSchema.safeParse(rawClaims);

    if (!claimsResult.success) {
      return NextResponse.json(
        { code: "E00500", message: "서버 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    const claims = claimsResult.data as JWTPayload;

    const user: AuthUser = {
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

    const response = NextResponse.json({
      accessToken: data.authToken,
      user,
    });

    // 새 authToken을 httpOnly 쿠키로 저장
    response.cookies.set("auth-token", data.authToken, AUTH_COOKIE_OPTIONS);

    return response;
  } catch {
    return NextResponse.json(
      { code: "E00500", message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
