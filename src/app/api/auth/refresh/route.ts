import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAMES, REFRESH_COOKIE_OPTIONS } from "@/lib/auth/cookie";

/**
 * 토큰 갱신 API Route
 * - httpOnly 쿠키에서 refresh token 읽기
 * - csp-was refresh API 호출
 * - 새 access token 반환
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const refreshToken = request.cookies.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

    // Refresh token이 없으면 401
    if (!refreshToken) {
      return NextResponse.json(
        { code: "E00401", message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const backendUrl = process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8080";

    // csp-was refresh API 호출
    const authResponse = await fetch(`${backendUrl}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    // 갱신 실패
    if (!authResponse.ok) {
      const response = NextResponse.json(
        { code: "E00401", message: "토큰 갱신에 실패했습니다." },
        { status: 401 }
      );
      // 쿠키 삭제
      response.cookies.delete(COOKIE_NAMES.REFRESH_TOKEN);
      return response;
    }

    const data = await authResponse.json();
    const { accessToken, refreshToken: newRefreshToken } = data;

    // 응답 생성
    const response = NextResponse.json({ accessToken });

    // 새 refresh token이 있으면 쿠키 갱신
    if (newRefreshToken) {
      response.cookies.set("refresh-token", newRefreshToken, REFRESH_COOKIE_OPTIONS);
    }

    return response;
  } catch (error) {
    console.error("토큰 갱신 오류:", error);
    return NextResponse.json(
      { code: "E00500", message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
