import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/session";

interface RouteParams {
  params: Promise<{
    pageInfoId: string;
  }>;
}

/**
 * FAQ 메뉴 페이지 상세 조회 프록시
 * GET /api/faq/menus/{pageInfoId}
 * -> csp-was GET /api/faq/getMenuPage/{pageInfoId}
 *
 * 인증 필수
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // 인증 확인
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { code: "E00401", message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const { pageInfoId } = await params;

    if (!pageInfoId || pageInfoId.trim() === "") {
      return NextResponse.json(
        {
          code: "E00400",
          message: "pageInfoId 파라미터가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("Authorization");
    const backendUrl =
      process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8080";

    const response = await fetch(
      `${backendUrl}/api/faq/getMenuPage/${encodeURIComponent(pageInfoId)}`,
      {
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          code: "E00500",
          message: "FAQ 메뉴 페이지 조회에 실패했습니다.",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("FAQ 메뉴 페이지 조회 오류:", error);
    return NextResponse.json(
      { code: "E00500", message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
