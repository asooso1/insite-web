import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

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

// Zod 스키마
const MenuUrlMappingSchema = z.object({
  menuId: z.number().int().positive(),
  menuName: z.string().min(1),
  cspWasUrl: z.string().min(1),
  insiteWebUrl: z.string().regex(/^\//, "insiteWebUrl은 / 로 시작해야 합니다."),
});

type MenuUrlMappingInput = z.infer<typeof MenuUrlMappingSchema>;

/**
 * 메뉴 URL 매핑 조회
 * GET /api/settings/menu-mapping
 */
export async function GET(): Promise<NextResponse> {
  try {
    try {
      const fileContent = await fs.readFile(MAPPINGS_FILE, "utf-8");
      const data: MenuUrlMappingStore = JSON.parse(fileContent);
      return NextResponse.json(data);
    } catch (error) {
      // 파일 없거나 읽기 실패 시 기본값 반환
      if (
        error instanceof Error &&
        error.message.includes("ENOENT")
      ) {
        const defaultStore: MenuUrlMappingStore = {
          mappings: [],
          lastUpdated: new Date().toISOString(),
        };
        return NextResponse.json(defaultStore);
      }
      throw error;
    }
  } catch (error) {
    console.error("메뉴 URL 매핑 조회 오류:", error);
    return NextResponse.json(
      { code: "E00500", message: "메뉴 매핑 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 메뉴 URL 매핑 추가 또는 업데이트
 * POST /api/settings/menu-mapping
 *
 * Request body:
 * {
 *   menuId: number,
 *   menuName: string,
 *   cspWasUrl: string,
 *   insiteWebUrl: string (/ 로 시작)
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Zod 검증
    const validatedData = MenuUrlMappingSchema.parse(body);

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
        store = {
          mappings: [],
          lastUpdated: new Date().toISOString(),
        };
      } else {
        throw error;
      }
    }

    // 기존 menuId 찾기 (있으면 업데이트, 없으면 추가)
    const existingIndex = store.mappings.findIndex(
      (m) => m.menuId === validatedData.menuId
    );

    const newMapping: MenuUrlMapping = {
      ...validatedData,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      store.mappings[existingIndex] = newMapping;
    } else {
      store.mappings.push(newMapping);
    }

    store.lastUpdated = new Date().toISOString();

    // 파일 쓰기
    await fs.mkdir(path.dirname(MAPPINGS_FILE), { recursive: true });
    await fs.writeFile(
      MAPPINGS_FILE,
      JSON.stringify(store, null, 2),
      "utf-8"
    );

    return NextResponse.json(
      {
        code: "S00200",
        message: "메뉴 매핑이 저장되었습니다.",
        data: newMapping,
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

    console.error("메뉴 URL 매핑 저장 오류:", error);
    return NextResponse.json(
      { code: "E00500", message: "메뉴 매핑 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}
