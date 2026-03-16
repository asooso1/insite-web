import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/session";
import type { CommonListDTO } from "@/lib/api/building";

/**
 * csp-was 페이지네이션 응답 래퍼
 */
interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * 관리자 전용 전체 빌딩 목록 조회
 * GET /api/buildings/admin-list?keyword=...&size=500
 *
 * csp-was GET /open/common/searchCommonList 프록시
 * - ROLE_LABS_SYSTEM_ADMIN, ROLE_SYSTEM_ADMIN 권한 필요
 * - keyword 빈 문자열 시 전체 빌딩 반환
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const currentUser = await getAuthUser();

    if (!currentUser) {
      return NextResponse.json(
        { code: "E00401", message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const ADMIN_ROLES = ["ROLE_LABS_SYSTEM_ADMIN", "ROLE_SYSTEM_ADMIN"];
    const isAdmin = currentUser.userRoles?.some((r) => ADMIN_ROLES.includes(r)) ?? false;

    if (!isAdmin) {
      return NextResponse.json(
        { code: "E00403", message: "접근 권한이 없습니다." },
        { status: 403 }
      );
    }

    const { searchParams } = request.nextUrl;
    const keyword = searchParams.get("keyword") ?? "";
    const size = searchParams.get("size") ?? "500";

    const authToken = request.cookies.get("auth-token")?.value;

    if (!authToken) {
      return NextResponse.json(
        { code: "E00401", message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const backendUrl = process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8081";
    const params = new URLSearchParams({ keyword, page: "0", size });
    const backendResponse = await fetch(
      `${backendUrl}/open/common/searchCommonList?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!backendResponse.ok) {
      return NextResponse.json(
        { code: "E00500", message: "빌딩 목록 조회에 실패했습니다." },
        { status: backendResponse.status }
      );
    }

    const result = await backendResponse.json();
    const pagedData = result.data as PagedResponse<CommonListDTO>;
    const buildings: CommonListDTO[] = pagedData?.content ?? [];

    // apiClient가 .data를 추출하므로 data 필드에 배열 직접 반환
    return NextResponse.json({ code: "success", data: buildings });
  } catch {
    return NextResponse.json(
      { code: "E00500", message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
