import { http, HttpResponse } from "msw";

/**
 * MSW API 핸들러
 * - 개발/테스트 환경에서 API 모킹
 */
export const handlers = [
  // 로그인
  http.post("/api/auth/login", async ({ request }) => {
    const body = await request.json() as { userId: string; passwd: string };

    // 테스트 계정
    if (body.userId === "admin" && body.passwd === "admin123") {
      return HttpResponse.json({
        accessToken: "mock-access-token",
        user: {
          accountId: "1",
          userId: "admin",
          userName: "관리자",
          userRoles: ["ROLE_ADMIN"],
          accountName: "테스트 회사",
          accountType: "LABS",
          currentCompanyId: "1",
          currentCompanyName: "테스트 회사",
          currentBuildingId: "1",
          currentBuildingName: "테스트 빌딩",
          accountCompanyId: "1",
        },
      });
    }

    return HttpResponse.json(
      { code: "E00401", message: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }),

  // 로그아웃
  http.post("/api/auth/logout", () => {
    return HttpResponse.json({ success: true });
  }),

  // 토큰 갱신
  http.post("/api/auth/refresh", () => {
    return HttpResponse.json({
      accessToken: "mock-new-access-token",
    });
  }),

  // 사용자 정보
  http.get("/api/user/v1/me", () => {
    return HttpResponse.json({
      code: "success",
      message: "조회 성공",
      data: {
        userId: "admin",
        userName: "관리자",
        email: "admin@example.com",
        roles: ["ROLE_ADMIN"],
      },
    });
  }),

  // 메뉴 목록
  http.get("/api/menu/v1/list", () => {
    return HttpResponse.json({
      code: "success",
      message: "조회 성공",
      data: [
        { id: "1", name: "대시보드", path: "/dashboard", icon: "BarChart3" },
        { id: "2", name: "작업 관리", path: "/work-orders", icon: "Wrench" },
        { id: "3", name: "시설 관리", path: "/facilities", icon: "Building2" },
      ],
    });
  }),
];
