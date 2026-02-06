import { NextRequest, NextResponse } from "next/server";
import { REFRESH_COOKIE_OPTIONS } from "@/lib/auth/cookie";

/**
 * 로그인 API Route
 * - csp-was 인증 API 프록시
 * - refresh token → httpOnly 쿠키
 * - access token → response body
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const backendUrl = process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8080";
    // csp-was 인증 API 호출
    const authResponse = await fetch(`${backendUrl}/api/account/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await authResponse.json();

    // 인증 실패
    if (!authResponse.ok) {
      return NextResponse.json(data, { status: authResponse.status });
    }

    const { accessToken, refreshToken, user } = data;

    // 응답 생성
    const response = NextResponse.json({
      accessToken,
      user,
    });

    // Refresh token을 httpOnly 쿠키로 설정
    if (refreshToken) {
      response.cookies.set("refresh-token", refreshToken, REFRESH_COOKIE_OPTIONS);
    }

    return response;
  } catch (error) {
    console.error("로그인 오류:", error);
    return NextResponse.json(
      { code: "E00500", message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
