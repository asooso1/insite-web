import { NextRequest, NextResponse } from "next/server";
import type { MenuDTO } from "@/lib/types/menu";

/**
 * 메뉴 트리 조회 프록시
 * GET /api/services/menus?buildingId={buildingId}
 * -> csp-was /api/services/menus?buildingId={buildingId}
 *
 * csp-was가 menu_insite_mapping 테이블에서 insiteUrl을 직접 주입하여 반환
 * (이전: public/menu-mappings.json 파일 기반 병합 → 제거됨)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const buildingId = request.nextUrl.searchParams.get("buildingId");
    const authToken = request.cookies.get("auth-token")?.value;
    const backendUrl =
      process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8080";

    if (!authToken) {
      return NextResponse.json(
        { code: "E00401", message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // URLSearchParams로 인코딩하여 파라미터 주입 방지
    const params = new URLSearchParams();
    if (buildingId) params.set("buildingId", buildingId);
    const response = await fetch(
      `${backendUrl}/api/services/menus?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { code: "E00500", message: "메뉴 조회에 실패했습니다." },
        { status: response.status }
      );
    }

    const data = (await response.json()) as MenuDTO[];
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("메뉴 조회 오류:", error);
    }
    return NextResponse.json(
      { code: "E00500", message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
