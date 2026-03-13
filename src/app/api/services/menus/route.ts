import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { MenuDTO, MenuUrlMappingStore } from "@/lib/types/menu";

const MAPPINGS_FILE = path.join(process.cwd(), "public", "menu-mappings.json");

/**
 * menu-mappings.json에서 수동 매핑을 읽어 메뉴 트리의 각 항목에 insiteUrl 주입
 * - 백엔드 menu_insite_mapping DB 연동 전 임시 파일 기반 구현
 * - 향후 csp-was가 insiteUrl 필드를 응답에 포함하면 이 함수 제거 가능
 */
async function mergeManualMappings(menuTree: MenuDTO[]): Promise<MenuDTO[]> {
  const mappings = new Map<number, string>();
  try {
    const content = await fs.readFile(MAPPINGS_FILE, "utf-8");
    const store: MenuUrlMappingStore = JSON.parse(content) as MenuUrlMappingStore;
    for (const m of store.mappings) {
      mappings.set(m.menuId, m.insiteWebUrl);
    }
  } catch {
    // 파일 없거나 파싱 실패 시 빈 맵 유지 (수동 매핑 없는 상태)
  }

  function applyToTree(items: MenuDTO[]): MenuDTO[] {
    return items.map((item) => ({
      ...item,
      insiteUrl: mappings.get(item.id),
      children: applyToTree(item.children ?? []),
    }));
  }

  return applyToTree(menuTree);
}

/**
 * 메뉴 트리 조회 프록시
 * GET /api/services/menus?buildingId={buildingId}
 * -> csp-was /api/services/menus?buildingId={buildingId}
 * -> menu-mappings.json 수동 매핑 병합 후 반환
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const buildingId = request.nextUrl.searchParams.get("buildingId");
    const authHeader = request.headers.get("Authorization");
    const backendUrl =
      process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8080";

    // URLSearchParams로 인코딩하여 파라미터 주입 방지
    const params = new URLSearchParams();
    if (buildingId) params.set("buildingId", buildingId);
    const response = await fetch(
      `${backendUrl}/api/services/menus?${params.toString()}`,
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

    const data = await response.json() as MenuDTO[];
    // 수동 매핑(menu-mappings.json) 병합 → insiteUrl 필드 주입
    const merged = await mergeManualMappings(Array.isArray(data) ? data : []);
    return NextResponse.json(merged);
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
