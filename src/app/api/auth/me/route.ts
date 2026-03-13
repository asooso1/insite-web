import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAMES } from "@/lib/auth/cookie";
import { getAuthUser } from "@/lib/auth/session";

/**
 * 현재 사용자 정보 조회 API Route
 * - httpOnly 쿠키의 토큰을 검증하여 사용자 정보 반환
 * - 페이지 리로드 시 클라이언트 auth 상태 복원용
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get(COOKIE_NAMES.AUTH_TOKEN)?.value;

  if (!token) {
    return NextResponse.json(
      { code: "E00401", message: "인증이 필요합니다." },
      { status: 401 }
    );
  }

  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json(
      { code: "E00401", message: "유효하지 않은 토큰입니다." },
      { status: 401 }
    );
  }

  return NextResponse.json({ accessToken: token, user });
}
