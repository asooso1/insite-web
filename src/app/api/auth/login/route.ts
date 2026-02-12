import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";
import { REFRESH_COOKIE_OPTIONS } from "@/lib/auth/cookie";
import type { AuthUser } from "@/lib/stores/auth-store";

/**
 * 백엔드 응답 타입
 */
interface BackendLoginResponse {
  code: string;
  message: string;
  data: {
    isInitPassword: boolean;
    currentBuildingId: number;
    userRoles: string[];
    isAgreePrivacy: boolean;
  } | null;
  authToken: string | null;
}

/**
 * JWT 클레임 타입 (csp-was TokenProvider 기반)
 */
interface JWTClaims {
  accountId: number;
  userId: string;
  accountName: string;
  accountType: string;
  accountCompanyId: number;
  accountCompanyName: string;
  currentCompanyId: number;
  currentCompanyName: string;
  currentBuildingId: number;
  currentBuildingName: string;
  userRoles: string[];
  userRoleNames: string[];
  userCompanyIds: number[];
  userBuildingIds: number[];
  viewAllBuildings: boolean;
  iat: number;
  exp: number;
}

/**
 * 로그인 API Route
 * - csp-was 인증 API 프록시
 * - authToken → httpOnly 쿠키 (refresh용)
 * - access token + user 정보 → response body
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const backendUrl = process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8080";

    console.log("[Login] Request body:", JSON.stringify(body));
    console.log("[Login] Backend URL:", `${backendUrl}/api/account/login`);

    // csp-was 인증 API 호출
    const authResponse = await fetch(`${backendUrl}/api/account/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data: BackendLoginResponse = await authResponse.json();
    console.log("[Login] Backend response:", JSON.stringify(data));

    // 인증 실패 (백엔드는 항상 200 반환, code로 성공/실패 구분)
    if (data.code !== "success" || !data.authToken) {
      return NextResponse.json(
        { code: data.code, message: data.message },
        { status: 401 }
      );
    }

    // JWT에서 사용자 정보 추출
    const claims = decodeJwt(data.authToken) as unknown as JWTClaims;

    const user: AuthUser = {
      accountId: String(claims.accountId),
      userId: claims.userId,
      userName: claims.accountName,
      userRoles: claims.userRoles,
      accountName: claims.accountName,
      accountType: claims.accountType as "LABS" | "FIELD" | "CLIENT",
      currentCompanyId: String(claims.currentCompanyId),
      currentCompanyName: claims.currentCompanyName,
      currentBuildingId: String(claims.currentBuildingId),
      currentBuildingName: claims.currentBuildingName,
      accountCompanyId: String(claims.accountCompanyId),
    };

    // 응답 생성
    const response = NextResponse.json({
      accessToken: data.authToken,
      user,
      isInitPassword: data.data?.isInitPassword ?? false,
      isAgreePrivacy: data.data?.isAgreePrivacy ?? true,
    });

    // authToken을 httpOnly 쿠키로 설정 (토큰 갱신용)
    response.cookies.set("refresh-token", data.authToken, REFRESH_COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error("로그인 오류:", error);
    return NextResponse.json(
      { code: "E00500", message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
