import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/session";

/**
 * 전체 메뉴 트리 조회 프록시 (관리자용)
 * GET /api/faq/menus?keyword=
 * -> csp-was GET /api/common/menuList?keyword=
 *
 * 인증 필수 (로그인 사용자 역할 기반 필터링)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // 인증 확인
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { code: "E00401", message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const keyword = request.nextUrl.searchParams.get("keyword") ?? "";
    const authToken = request.cookies.get("auth-token")?.value;
    const backendUrl =
      process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8080";

    if (!authToken) {
      return NextResponse.json(
        { code: "E00401", message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const response = await fetch(`${backendUrl}/api/common/menuList?keyword=${encodeURIComponent(keyword)}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { code: "E00500", message: "메뉴 목록 조회에 실패했습니다." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("FAQ 메뉴 조회 오류:", error);
    return NextResponse.json(
      { code: "E00500", message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
