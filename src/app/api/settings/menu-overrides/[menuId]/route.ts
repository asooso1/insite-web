import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface MenuOverride {
  menuId: number;
  name?: string;
  parentId?: number;
  sortNo?: number;
  isUse?: boolean;
  isShow?: boolean;
  roles?: string[];
  updatedAt: string;
}

interface MenuOverrideStore {
  overrides: MenuOverride[];
  lastUpdated: string;
}

const OVERRIDES_FILE = path.join(process.cwd(), "public", "menu-overrides.json");

/**
 * 메뉴 오버라이드 삭제
 * DELETE /api/settings/menu-overrides/[menuId]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ menuId: string }> }
): Promise<NextResponse> {
  try {
    const { menuId: menuIdStr } = await params;
    const menuId = Number(menuIdStr);
    if (isNaN(menuId) || menuId <= 0) {
      return NextResponse.json(
        { code: "E00400", message: "유효한 menuId가 아닙니다." },
        { status: 400 }
      );
    }

    // 파일 읽기
    let store: MenuOverrideStore;
    try {
      const fileContent = await fs.readFile(OVERRIDES_FILE, "utf-8");
      store = JSON.parse(fileContent);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("ENOENT")
      ) {
        return NextResponse.json(
          { code: "E00404", message: "메뉴 오버라이드를 찾을 수 없습니다." },
          { status: 404 }
        );
      }
      throw error;
    }

    // 해당 menuId 제거
    const originalLength = store.overrides.length;
    store.overrides = store.overrides.filter((o) => o.menuId !== menuId);

    // 삭제된 항목이 없는 경우
    if (store.overrides.length === originalLength) {
      return NextResponse.json(
        { code: "E00404", message: "메뉴 오버라이드를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    store.lastUpdated = new Date().toISOString();

    // 파일 쓰기
    await fs.mkdir(path.dirname(OVERRIDES_FILE), { recursive: true });
    await fs.writeFile(
      OVERRIDES_FILE,
      JSON.stringify(store, null, 2),
      "utf-8"
    );

    return NextResponse.json(
      {
        code: "S00200",
        message: "메뉴 오버라이드가 삭제되었습니다.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("메뉴 오버라이드 삭제 오류:", error);
    return NextResponse.json(
      { code: "E00500", message: "메뉴 오버라이드 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
