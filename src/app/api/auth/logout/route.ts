import { NextResponse } from "next/server";
import { COOKIE_NAMES } from "@/lib/auth/cookie";

/**
 * 로그아웃 API Route
 * - httpOnly 쿠키 삭제
 */
export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true });

  // Refresh token 쿠키 삭제
  response.cookies.delete(COOKIE_NAMES.REFRESH_TOKEN);

  return response;
}
