import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/session";

/**
 * 캐시 제거 프록시
 * POST /api/admin/caches/evict
 * -> csp-was POST /api/admin/caches/evict
 *
 * 인증 필수 (로그인한 사용자만)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 인증 확인
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { code: "E00401", message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const authToken = request.cookies.get("auth-token")?.value;
    const backendUrl =
      process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8080";

    if (!authToken) {
      return NextResponse.json(
        { code: "E00401", message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${backendUrl}/api/admin/caches/evict`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { code: "E00500", message: "캐시 제거에 실패했습니다." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("캐시 제거 오류:", error);
    return NextResponse.json(
      { code: "E00500", message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
