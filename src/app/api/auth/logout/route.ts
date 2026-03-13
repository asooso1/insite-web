import { NextResponse } from "next/server";
import { COOKIE_NAMES } from "@/lib/auth/cookie";

/**
 * 로그아웃 API Route
 * - auth-token httpOnly 쿠키 삭제
 */
export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAMES.AUTH_TOKEN);
  return response;
}
