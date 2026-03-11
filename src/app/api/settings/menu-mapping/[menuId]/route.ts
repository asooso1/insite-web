import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface MenuUrlMapping {
  menuId: number;
  menuName: string;
  cspWasUrl: string;
  insiteWebUrl: string;
  updatedAt: string;
}

interface MenuUrlMappingStore {
  mappings: MenuUrlMapping[];
  lastUpdated: string;
}

const MAPPINGS_FILE = path.join(process.cwd(), "public", "menu-mappings.json");

interface RouteParams {
  params: Promise<{
    menuId: string;
  }>;
}

/**
 * 메뉴 URL 매핑 삭제 (멱등성 보장)
 * DELETE /api/settings/menu-mapping/{menuId}
 *
 * 없는 menuId도 성공으로 처리
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { menuId } = await params;

    const menuIdNum = parseInt(menuId, 10);
    if (Number.isNaN(menuIdNum)) {
      return NextResponse.json(
        {
          code: "E00400",
          message: "유효한 menuId가 필요합니다.",
        },
        { status: 400 }
      );
    }

    // 파일 읽기
    let store: MenuUrlMappingStore;
    try {
      const fileContent = await fs.readFile(MAPPINGS_FILE, "utf-8");
      store = JSON.parse(fileContent);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("ENOENT")
      ) {
        // 파일이 없으면 성공으로 처리 (멱등성)
        return NextResponse.json(
          {
            code: "S00200",
            message: "메뉴 매핑이 삭제되었습니다.",
          },
          { status: 200 }
        );
      }
      throw error;
    }

    // menuId 제거
    const originalLength = store.mappings.length;
    store.mappings = store.mappings.filter((m) => m.menuId !== menuIdNum);

    // 변경 사항이 있으면 파일 저장
    if (store.mappings.length !== originalLength) {
      store.lastUpdated = new Date().toISOString();
      await fs.writeFile(
        MAPPINGS_FILE,
        JSON.stringify(store, null, 2),
        "utf-8"
      );
    }

    // 없는 menuId도 성공으로 처리 (멱등성)
    return NextResponse.json(
      {
        code: "S00200",
        message: "메뉴 매핑이 삭제되었습니다.",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("JSON 파싱 오류:", error);
      return NextResponse.json(
        { code: "E00400", message: "유효한 JSON이 아닙니다." },
        { status: 400 }
      );
    }

    console.error("메뉴 URL 매핑 삭제 오류:", error);
    return NextResponse.json(
      { code: "E00500", message: "메뉴 매핑 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
