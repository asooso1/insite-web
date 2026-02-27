import { NextRequest, NextResponse } from "next/server";

/**
 * 메뉴 트리 조회 프록시
 * GET /api/services/menus?buildingId={buildingId}
 * -> csp-was /api/services/menus?buildingId={buildingId}
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const buildingId = request.nextUrl.searchParams.get("buildingId");
    const authHeader = request.headers.get("Authorization");
    const backendUrl =
      process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8080";

    const response = await fetch(
      `${backendUrl}/api/services/menus?buildingId=${buildingId ?? ""}`,
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
        { code: "E00500", message: "메뉴 조회에 실패했습니다." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("메뉴 조회 오류:", error);
    return NextResponse.json(
      { code: "E00500", message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
