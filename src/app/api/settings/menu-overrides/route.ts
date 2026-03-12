import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

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

// Zod 스키마
const MenuOverrideSchema = z.object({
  menuId: z.number().int().positive(),
  name: z.string().min(1).optional(),
  parentId: z.number().int().nonnegative().optional(),
  sortNo: z.number().int().nonnegative().optional(),
  isUse: z.boolean().optional(),
  isShow: z.boolean().optional(),
  roles: z.array(z.string()).optional(),
});

type MenuOverrideInput = z.infer<typeof MenuOverrideSchema>;

/**
 * 메뉴 오버라이드 조회
 * GET /api/settings/menu-overrides
 */
export async function GET(): Promise<NextResponse> {
  try {
    try {
      const fileContent = await fs.readFile(OVERRIDES_FILE, "utf-8");
      const data: MenuOverrideStore = JSON.parse(fileContent);
      return NextResponse.json(data);
    } catch (error) {
      // 파일 없거나 읽기 실패 시 기본값 반환
      if (
        error instanceof Error &&
        error.message.includes("ENOENT")
      ) {
        const defaultStore: MenuOverrideStore = {
          overrides: [],
          lastUpdated: new Date().toISOString(),
        };
        return NextResponse.json(defaultStore);
      }
      throw error;
    }
  } catch (error) {
    console.error("메뉴 오버라이드 조회 오류:", error);
    return NextResponse.json(
      { code: "E00500", message: "메뉴 오버라이드 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 메뉴 오버라이드 추가 또는 업데이트
 * POST /api/settings/menu-overrides
 *
 * Request body:
 * {
 *   menuId: number,
 *   name?: string,
 *   parentId?: number,
 *   sortNo?: number,
 *   isUse?: boolean,
 *   isShow?: boolean,
 *   roles?: string[]
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Zod 검증
    const validatedData = MenuOverrideSchema.parse(body);

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
        store = {
          overrides: [],
          lastUpdated: new Date().toISOString(),
        };
      } else {
        throw error;
      }
    }

    // 기존 menuId 찾기 (있으면 업데이트, 없으면 추가)
    const existingIndex = store.overrides.findIndex(
      (o) => o.menuId === validatedData.menuId
    );

    const newOverride: MenuOverride = {
      ...validatedData,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      store.overrides[existingIndex] = newOverride;
    } else {
      store.overrides.push(newOverride);
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
        message: "메뉴 오버라이드가 저장되었습니다.",
        data: newOverride,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          code: "E00400",
          message: "검증 실패",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      console.error("JSON 파싱 오류:", error);
      return NextResponse.json(
        { code: "E00400", message: "유효한 JSON이 아닙니다." },
        { status: 400 }
      );
    }

    console.error("메뉴 오버라이드 저장 오류:", error);
    return NextResponse.json(
      { code: "E00500", message: "메뉴 오버라이드 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}
